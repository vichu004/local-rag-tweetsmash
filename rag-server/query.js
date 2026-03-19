import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const embeddings = new OpenAIEmbeddings();

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "rag-collection" }
  );

  const retriever = vectorStore.asRetriever();

  const query = "What is OpenClaw?";

  const docs = await retriever.getRelevantDocuments(query);

  const context = docs.map(d => d.pageContent).join("\n");

  const model = new OpenAI({ temperature: 0 });

  const response = await model.call(`
Answer the question using the context below:

Context:
${context}

Question:
${query}
  `);

  console.log("🧠 Answer:", response);
};

run();
