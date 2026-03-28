# RAG Server (Chroma Cloud + OpenRouter)

This is a high-performance AI-powered RAG (Retrieval-Augmented Generation) application built using Node.js, Langchain, Express, Chroma Cloud, and OpenRouter.

It uses **Chroma Cloud** for vector storage and **OpenRouter** (Llama 3 / OpenAI) for embeddings and LLM responses.

---

## 🚀 Prerequisites

1. **Node.js & npm** installed (or Docker)
2. **OpenRouter API Key**
3. **Chroma Cloud Account** (Tenant, Database, and API Key)

## 📦 Getting Started

### 1. Environment Setup
Clone the repository and create a `.env` file from the template:

```bash
cp .env.example .env
```

Open `.env` and fill in your API keys and configuration:
- `OPENROUTER_API_KEY`: Get from [OpenRouter](https://openrouter.ai/)
- `OPENAI_API_KEY`: Required for LangChain embeddings.
- `CHROMA_TENANT`, `CHROMA_DATABASE`, `CHROMA_API_KEY`: Get from [Chroma Cloud](https://www.trychroma.com/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
You can run the server locally or using Docker.

**Local Development:**
```bash
npm start
```

**Docker Deployment:**
```bash
docker compose up --build -d
```
*Note: This will expose the API on port `3500`.*

### 4. Ingest your Data
Add your `.txt` files into the `./data` folder, then run the ingestion script:

**Local:**
```bash
node ingest.js
```

**Docker:**
```bash
docker exec -it server-rag node ingest.js
```

---

## 🧠 Usage
The RAG server API is available at `http://localhost:3500`. 
Send a POST request to query it:

```bash
curl -X POST http://localhost:3500/chat \
     -H "Content-Type: application/json" \
     -d '{"query": "What is OpenClaw?"}'
```

---

## 🛠️ Configuration
You can customize the models used by editing your `.env` file:
- `OPENROUTER_EMBEDDING_MODEL`: Default is `text-embedding-3-small`
- `OPENROUTER_LLM_MODEL`: Default is `meta-llama/llama-3-8b-instruct:free`
