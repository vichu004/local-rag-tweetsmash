import { readFileSync, readdirSync } from "fs";
import path from "path";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CHROMA_AUTH_TOKEN = process.env.CHROMA_AUTH_TOKEN;

const run = async () => {
  const dataDir = "./data";
  
  // Read all .txt files from the data directory
  const files = readdirSync(dataDir).filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log("❌ No .txt files found in ./data/");
    return;
  }

  const embeddings = new OpenAIEmbeddings({
    modelName: process.env.OPENROUTER_EMBEDDING_MODEL || "nomic-ai/nomic-embed-text-v1.5",
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    }
  });
  
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

  const chromaConfig = { collectionName: "rag-collection", url: CHROMA_URL };
  if (CHROMA_AUTH_TOKEN) {
    chromaConfig.headers = { "Authorization": `Bearer ${CHROMA_AUTH_TOKEN}` };
  }

  await Chroma.fromTexts(texts, metadatas, embeddings, chromaConfig);

  console.log("✅ All data ingested successfully!");
};

run();
