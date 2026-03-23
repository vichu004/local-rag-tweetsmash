import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { CloudClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const client = new CloudClient({
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
  apiKey: process.env.CHROMA_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  class LocalOllamaEmbeddingFunction {
    constructor() {
      this.embeddings = new OllamaEmbeddings({ model: "mistral", baseUrl: "http://localhost:11434" });
    }
    async generate(texts) {
      if (!Array.isArray(texts)) texts = [texts];
      return await this.embeddings.embedDocuments(texts);
    }
  }

  const collection = await client.getCollection({ 
    name: "tweetsmash-user",
    embeddingFunction: new LocalOllamaEmbeddingFunction()
  });

  const results = await collection.query({
    queryTexts: [query],
    nResults: 5
  });

  // GroupBy is conceptually handled via the SDK or manual deduplication 
  // if you want to deduplicate by source_id. Let's extract unique contents directly.
  let uniqueDocs = [];
  let seenSources = new Set();
  
  if (results.documents && results.documents[0]) {
    results.documents[0].forEach((doc, i) => {
      const sourceId = results.metadatas[0][i].source_id;
      if (!seenSources.has(sourceId)) {
        seenSources.add(sourceId);
        uniqueDocs.push(doc);
      }
    });
  }

  const context = uniqueDocs.join("\n\n---\n\n");

  const model = new ChatOpenAI({
    modelName: process.env.OPENROUTER_LLM_MODEL || "meta-llama/llama-3-8b-instruct:free",
    temperature: 0,
    apiKey: OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    }
  });

  const answer = await model.invoke(`
Answer using context:
${context}

Question:
${query}
  `);

  res.json({ answer });
});

app.listen(3500, () => {
  console.log("🚀 RAG server running on port 3500");
});
