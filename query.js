import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

const run = async () => {
  const embeddings = new OllamaEmbeddings({ model: "mistral", baseUrl: OLLAMA_BASE_URL });

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection", url: CHROMA_URL }
  );

  const retriever = vectorStore.asRetriever();

  const query = "What is OpenClaw?";

  const docs = await retriever.invoke(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new Ollama({ model: "mistral", temperature: 0, baseUrl: OLLAMA_BASE_URL });

  const response = await model.invoke(`
Answer the question using the context below:

Context:
${context}

Question:
${query}
  `);

  console.log("🧠 Answer:", response);
};

run();
