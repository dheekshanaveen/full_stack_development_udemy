import "dotenv/config";
import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const WIT_URL = "https://api.wit.ai/message";
app.set("view engine", "ejs");
app.use(express.static("public"));
function flattenEntities(entities = {}) {
  const list = [];
  for (const [key, items] of Object.entries(entities)) {
    for (const item of items) {
      list.push({
        type: key.split(":")[0].replace("wit$", ""),
        text: item.body,
        value: item.value ?? item.values?.[0]?.value ?? "",
        confidence: Math.round((item.confidence ?? 0) * 100),
      });
    }
  }
  return list;
}
app.get("/", (req, res) => {
  res.render("index", { text: "", result: null, error: null });
});
app.get("/analyze", async (req, res) => {
  const text = (req.query.text || "").trim();
  if (!text) {
    return res.status(400).render("index", {
      text,
      result: null,
      error: "Type a sentence first, then press Analyze.",
    });
  }
  if (!process.env.WIT_TOKEN) {
    return res.status(500).render("index", {
      text,
      result: null,
      error: "Server setup problem: WIT_TOKEN is missing in the .env file.",
    });
  }

  try {
    const response = await axios.get(WIT_URL, {
      params: { v: "20240101", q: text },
      headers: { Authorization: `Bearer ${process.env.WIT_TOKEN}` },
      timeout: 8000,
    });

    const data = response.data;
    const top = data.intents?.[0];

    const result = {
      intent: top ? top.name : null,
      confidence: top ? Math.round(top.confidence * 100) : 0,
      otherIntents: (data.intents || []).slice(1).map((i) => ({
        name: i.name,
        confidence: Math.round(i.confidence * 100),
      })),
      entities: flattenEntities(data.entities),
    };
    res.render("index", { text, result, error: null });
  } catch (err) {
    console.error("Wit.ai request failed:", err.response?.status, err.message);
    let message = "Could not reach Wit.ai. Please try again in a moment.";
    if (err.response?.status === 401)
      message = "Wit.ai rejected the token. Check WIT_TOKEN in your .env file.";
    else if (err.response?.status === 429)
      message = "Too many requests to Wit.ai. Wait a few seconds and retry.";
    res.status(502).render("index", { text, result: null, error: message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
