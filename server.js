import express from "express";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
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
  try {
    const { query } = req.body;

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

    const results = await collection.query({
      queryTexts: [query],
      nResults: 5
    });

    let uniqueDocs = [];
    let seenSources = new Set();

    if (results.documents && results.documents[0]) {
      results.documents[0].forEach((doc, i) => {
        const sourceId = results.metadatas[0][i]?.source_id;
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
Answer using context:
${context}

Question:
${query}
    `);

    // ✅ FIX: Extract only text
    const cleanAnswer =
      response?.content ||
      "Sorry, I couldn't generate a response.";

    console.log("AI Response:", cleanAnswer);

    // ✅ FIX: Send clean response
    res.json({
      content: cleanAnswer
    });

  } catch (err) {
    console.error("Error:", err);
    res.json({
      content: "Server error occurred"
    });
  }
});

app.listen(3500, () => {
  console.log("🚀 RAG server running on port 3500");
});