# Sentence Analyzer (Wit.ai capstone)

A small website built with **Node.js, Express, Axios and EJS**. You type a sentence, the server asks the
[Wit.ai](https://wit.ai) API to analyze it, and the page shows the **intent**, a **confidence bar**, and the **entities** (times, numbers, etc.).

## Run it

1. Create a free app at https://wit.ai and copy the **Server Access Token** (Management > Settings).
2. In the project folder:
   ```bash
   npm i
   cp .env.example .env     # then paste your token into .env
   nodemon index.js         # or: npm start
   ```
3. Open http://localhost:3000

## Train intents (so "intent" is not empty)
In your Wit.ai app, go to **Understanding**, add example sentences, and label each with an intent, e.g.
`set_reminder` ("Remind me to call mom at 5pm"), `get_weather` ("Will it rain tomorrow in Bengaluru?"), `greeting` ("Hello there").
Add 5+ examples per intent. Built-in entities like datetime and number work without training.

## Structure
- `index.js` - server, routes, Axios call, error handling
- `views/index.ejs` - page template
- `public/styles.css` - styling
- `.env` - your secret token (never committed)
