import express from "express";
import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const embeddings = new OllamaEmbeddings({ model: "mistral" });

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection" }
  );

  const retriever = vectorStore.asRetriever();
  const docs = await retriever.invoke(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new Ollama({ model: "mistral", temperature: 0 });

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
