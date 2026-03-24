import { readFileSync, readdirSync } from "fs";
import path from "path";
import { CloudClient } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHROMA_TENANT = process.env.CHROMA_TENANT;
const CHROMA_DATABASE = process.env.CHROMA_DATABASE;
const CHROMA_API_KEY = process.env.CHROMA_API_KEY;

const run = async () => {
  const dataDir = "./data";
  
  const files = readdirSync(dataDir).filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log("❌ No .txt files found in ./data/");
    return;
  }

  const client = new CloudClient({
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE,
    apiKey: CHROMA_API_KEY,
  });

  class OpenAIEmbeddingFunction {
    constructor() {
      this.embeddings = new OpenAIEmbeddings({
        modelName: process.env.OPENROUTER_EMBEDDING_MODEL || "text-embedding-3-small",
        openAIApiKey: OPENAI_API_KEY,
      });
    }
    async generate(texts) {
      if (!Array.isArray(texts)) texts = [texts];
      return await this.embeddings.embedDocuments(texts);
    }
  }

  const collectionName = "tweetsmash-user";

  console.log(`🧹 Resetting collection ${collectionName} to ensure correct dimensions...`);
  try {
    await client.deleteCollection({ name: collectionName });
  } catch (e) {
    console.log("ℹ️ Collection didn't exist or already deleted.");
  }

  const collection = await client.getOrCreateCollection({ 
    name: collectionName,
    embeddingFunction: new OpenAIEmbeddingFunction()
  });

  const texts = [];
  const ids = [];
  const metadatas = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = readFileSync(filePath, "utf-8");
    texts.push(content);
    ids.push(file);
    metadatas.push({ source: file });
    console.log(`📄 Prepared ${file}`);
  }

  console.log(`⏳ Ingesting ${files.length} documents into Chroma Cloud...`);

  await collection.add({
    ids: ids,
    documents: texts,
    metadatas: metadatas
  });

  console.log("✅ All data ingested successfully into the cloud!");
};

run().catch(console.error);
