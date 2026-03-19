import { readFileSync } from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const text = readFileSync("./data/info.txt", "utf-8");

  const embeddings = new OpenAIEmbeddings();

  await Chroma.fromTexts(
    [text],
    [{ source: "info.txt" }],
    embeddings,
    { collectionName: "rag-collection" }
  );

  console.log("✅ Data ingested successfully");
};

run();
