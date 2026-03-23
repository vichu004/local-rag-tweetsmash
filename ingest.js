import { readFileSync, readdirSync } from "fs";
import path from "path";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

const run = async () => {
  const dataDir = "./data";
  
  // Read all .txt files from the data directory
  const files = readdirSync(dataDir).filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log("❌ No .txt files found in ./data/");
    return;
  }

  const embeddings = new OllamaEmbeddings({ model: "mistral", baseUrl: OLLAMA_BASE_URL });
  
  const texts = [];
  const metadatas = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = readFileSync(filePath, "utf-8");
    texts.push(content);
    metadatas.push({ source: file });
    console.log(`📄 Read ${file}`);
  }

  console.log(`⏳ Ingesting ${files.length} documents into Chroma...`);

  await Chroma.fromTexts(
    texts,
    metadatas,
    embeddings,
    { collectionName: "rag-collection", url: CHROMA_URL }
  );

  console.log("✅ All data ingested successfully!");
};

run();
