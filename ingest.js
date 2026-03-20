import { readFileSync, readdirSync } from "fs";
import path from "path";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const dataDir = "./data";
  
  // Read all .txt files from the data directory
  const files = readdirSync(dataDir).filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log("❌ No .txt files found in ./data/");
    return;
  }

  const embeddings = new OllamaEmbeddings({ model: "mistral" });
  
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
    { collectionName: "rag-collection" }
  );

  console.log("✅ All data ingested successfully!");
};

run();
