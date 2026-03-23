import { readFileSync, readdirSync } from "fs";
import path from "path";
import { CloudClient } from "chromadb";
import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from "dotenv";

dotenv.config();

const MAX_BYTES_PER_CHUNK = 16 * 1024 - 500; // 16 KiB limit

async function run() {
  const client = new CloudClient({
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE,
    apiKey: process.env.CHROMA_API_KEY,
  });

  // Sharding conceptually by an organization or user. 
  const collectionName = "tweetsmash-user";
  
  class LocalOllamaEmbeddingFunction {
    constructor() {
      this.embeddings = new OllamaEmbeddings({ model: "mistral", baseUrl: "http://localhost:11434" });
    }
    async generate(texts) {
      if (!Array.isArray(texts)) texts = [texts];
      return await this.embeddings.embedDocuments(texts);
    }
  }

  const collection = await client.getOrCreateCollection({
    name: collectionName,
    embeddingFunction: new LocalOllamaEmbeddingFunction(),
  });

  const dataDir = "./data";
  const files = readdirSync(dataDir).filter(file => file.endsWith('.txt'));

  if (files.length === 0) {
    console.log("❌ No .txt files found in ./data/");
    return;
  }

  let totalChunks = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = readFileSync(filePath, "utf-8");
    
    // Line-based chunking strategy respecting the 16KiB limit
    const lines = content.split('\n');
    let currentChunk = "";
    let chunkIndex = 0;
    
    const chunks = [];
    
    for (const line of lines) {
      if (Buffer.byteLength(currentChunk + line + '\n', 'utf8') > MAX_BYTES_PER_CHUNK) {
        if (currentChunk) {
          chunks.push({ text: currentChunk, index: chunkIndex++ });
          currentChunk = "";
        }
      }
      currentChunk += line + '\n';
    }
    
    // Add the final remaining chunk
    if (currentChunk.trim().length > 0) {
      chunks.push({ text: currentChunk, index: chunkIndex });
    }

    const ids = [];
    const documents = [];
    const metadatas = [];

    chunks.forEach(chunk => {
      ids.push(`${file}_chunk_${chunk.index}`);
      documents.push(chunk.text);
      metadatas.push({
        source_id: file,
        chunk_index: chunk.index
      });
    });

    console.log(`📄 Ingesting ${chunks.length} chunk(s) from ${file}`);
    await collection.upsert({
      ids: ids,
      documents: documents,
      metadatas: metadatas
    });
    
    totalChunks += chunks.length;
  }

  console.log(`✅ Migration complete! Ingested ${totalChunks} chunks in total into collection: ${collectionName}`);
}

run().catch(console.error);
