import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const embeddings = new OllamaEmbeddings({ model: "mistral" });

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection" }
  );

  const retriever = vectorStore.asRetriever();

  const query = "What is OpenClaw?";

  const docs = await retriever.invoke(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new Ollama({ model: "mistral", temperature: 0 });

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
