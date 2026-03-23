# Local RAG Server

This is an AI-powered RAG (Retrieval-Augmented Generation) application built using Node.js, Langchain, Express, ChromaDB, and Ollama. 

It uses ChromaDB within Docker to store your vector embeddings and connects to your computer's local Ollama instance (running the `mistral` model) to handle processing.

---

## 🚀 Prerequisites

1. **Docker & Docker Compose** installed
2. **Ollama** installed and running on your physical machine

## 📦 Getting Started

### 1. Download the AI Model
Since the application relies on your local Ollama installation, make sure the `mistral` model is available:
```bash
ollama pull mistral
```

### 2. Start the Server & Database
Start the NodeJS API and the Chroma vector database in the background:
```bash
docker compose up --build -d
```
*Note: This will install dependencies, build the RAG server image (`local-rag`), and expose the API on port `3500`.*

### 3. Ingest your Data
Before your AI can answer questions about your data, you must turn your documents into vector embeddings.
Add your `.txt` files into the `./data` folder, then run the ingestion script through Docker:

```bash
docker exec -it local-rag node ingest.js
```
*If everything was successful, it will declare "✅ All data ingested successfully!".*

---

## 🧠 Usage
Your newly started RAG server API is available at `http://localhost:3500`. 
Send a POST request to query it:

```bash
curl -X POST http://localhost:3500/chat \
     -H "Content-Type: application/json" \
     -d '{"query": "What is OpenClaw?"}'
```

*(You can also use the local `node query.js` file if you have Node installed on your host machine to run quick tests).*
