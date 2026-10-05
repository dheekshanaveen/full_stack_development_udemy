// index.js - the server. It receives a sentence from the browser,
// asks Wit.ai to analyze it (using Axios), and renders the result with EJS.

import "dotenv/config";            // loads variables from .env into process.env
import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const WIT_URL = "https://api.wit.ai/message";

// --- Middleware (code that runs on every request) ---
app.set("view engine", "ejs");     // tells Express to render .ejs files from /views
app.use(express.static("public")); // serves CSS from the /public folder

// Turns Wit.ai's raw "entities" object into a simple list our page can loop over.
function flattenEntities(entities = {}) {
  const list = [];
  for (const [key, items] of Object.entries(entities)) {
    for (const item of items) {
      list.push({
        type: key.split(":")[0].replace("wit$", ""), // "wit$datetime:datetime" -> "datetime"
        text: item.body,                              // the words from your sentence
        value: item.value ?? item.values?.[0]?.value ?? "",
        confidence: Math.round((item.confidence ?? 0) * 100),
      });
    }
  }
  return list;
}

// --- Route 1: home page with the form ---
app.get("/", (req, res) => {
  res.render("index", { text: "", result: null, error: null });
});

// --- Route 2: GET /analyze?text=... calls the Wit.ai API ---
app.get("/analyze", async (req, res) => {
  const text = (req.query.text || "").trim();

  // Error handling #1: empty input
  if (!text) {
    return res.status(400).render("index", {
      text, result: null, error: "Type a sentence first, then press Analyze.",
    });
  }
  // Error handling #2: server is missing the token
  if (!process.env.WIT_TOKEN) {
    return res.status(500).render("index", {
      text, result: null, error: "Server setup problem: WIT_TOKEN is missing in the .env file.",
    });
  }

  try {
    // Axios sends the GET request. 'params' becomes ?v=...&q=... in the URL.
    const response = await axios.get(WIT_URL, {
      params: { v: "20240101", q: text },
      headers: { Authorization: `Bearer ${process.env.WIT_TOKEN}` },
      timeout: 8000,
    });

    const data = response.data;
    const top = data.intents?.[0]; // Wit.ai sorts intents by confidence, best first

    const result = {
      intent: top ? top.name : null,
      confidence: top ? Math.round(top.confidence * 100) : 0,
      otherIntents: (data.intents || []).slice(1).map((i) => ({
        name: i.name, confidence: Math.round(i.confidence * 100),
      })),
      entities: flattenEntities(data.entities),
    };
    res.render("index", { text, result, error: null });
  } catch (err) {
    // Error handling #3: the API call failed. Log details, show a friendly message.
    console.error("Wit.ai request failed:", err.response?.status, err.message);
    let message = "Could not reach Wit.ai. Please try again in a moment.";
    if (err.response?.status === 401) message = "Wit.ai rejected the token. Check WIT_TOKEN in your .env file.";
    else if (err.response?.status === 429) message = "Too many requests to Wit.ai. Wait a few seconds and retry.";
    res.status(502).render("index", { text, result: null, error: message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
