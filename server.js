import express from "express";
import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

const embeddings = new OllamaEmbeddings({ model: "mistral", baseUrl: OLLAMA_BASE_URL });

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection", url: CHROMA_URL }
  );

  const retriever = vectorStore.asRetriever();
  const docs = await retriever.invoke(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new Ollama({ model: "mistral", temperature: 0, baseUrl: OLLAMA_BASE_URL });

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
