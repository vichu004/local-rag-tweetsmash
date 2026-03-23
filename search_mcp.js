const baseUrl = 'https://docs.trychroma.com/mcp';

async function searchDocs(query) {
  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: {
          name: "search_chroma_docs",
          arguments: { query }
        }
      })
    });
    
    if (!res.ok) {
       console.log("Failed to fetch. Status: " + res.status);
       const text = await res.text();
       console.log(text);
       return;
    }
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let text = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) text += decoder.decode(value);
    }
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}

searchDocs("Chroma Cloud Splade node js setup");
searchDocs("Chroma Cloud Qwen embedding function node js");
