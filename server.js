import express from "express";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const embeddings = new OpenAIEmbeddings();

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection" }
  );

  const retriever = vectorStore.asRetriever();
  const docs = await retriever.getRelevantDocuments(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new OpenAI({ temperature: 0 });

  const answer = await model.call(`
Answer using context:
${context}

Question:
${query}
  `);

  res.json({ answer });
});

app.listen(3000, () => {
  console.log("🚀 RAG server running on port 3000");
});
