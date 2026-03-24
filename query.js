import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { CloudClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const run = async () => {
  const client = new CloudClient({
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE,
    apiKey: process.env.CHROMA_API_KEY,
  });

  class OpenAIEmbeddingFunction {
    constructor() {
      this.embeddings = new OpenAIEmbeddings({
        modelName: process.env.OPENROUTER_EMBEDDING_MODEL || "text-embedding-3-small",
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
    }
    async generate(texts) {
      if (!Array.isArray(texts)) texts = [texts];
      return await this.embeddings.embedDocuments(texts);
    }
  }

  const collection = await client.getCollection({ 
    name: "tweetsmash-user",
    embeddingFunction: new OpenAIEmbeddingFunction()
  });

  const query = "What is OpenClaw?";

  const results = await collection.query({
    queryTexts: [query],
    nResults: 5
  });

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

  const response = await model.invoke(`
Answer the question using the context below:

Context:
${context}

Question:
${query}
  `);

  console.log("🧠 Answer:", response);
};

run().catch(console.error);
