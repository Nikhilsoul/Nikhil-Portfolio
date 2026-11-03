# AI Chatbot — setup

## What was added (nothing existing was modified except 1 import line in src/main.js)
- `src/chatbot/`   -> UI (Chatbot.jsx, styles.js), markdown.jsx, actions.js, localBrain.js, knowledge.js, index.jsx
- `api/chat.js`    -> Vercel serverless function that streams replies from Claude
- `.env.example`   -> environment variable template
- `src/main.js`    -> one line added: `import './chatbot/index.jsx'`

## Turn on the real AI (2 minutes)
1. Create an API key at https://console.anthropic.com
2. Vercel -> your project -> Settings -> Environment Variables -> add `ANTHROPIC_API_KEY`
3. Redeploy. The header badge changes to "Live AI · Claude".

Optional: `ANTHROPIC_MODEL` (default `claude-haiku-5-5`; use `claude-sonnet-5-5` for smarter answers).

## Local testing
- `npm run dev`  -> UI works; answers come from the offline "Smart mode" brain (no key needed).
- `npx vercel dev` (with `.env.local` containing your key) -> full live AI locally.

## Keep it accurate
All facts live in `src/chatbot/knowledge.js`. Update it when your portfolio changes.
