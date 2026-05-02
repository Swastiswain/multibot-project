# Multi-Bot Chatbot

A clean, minimal multi-bot chatbot frontend built with React + Vite.

## Bots included

- 😄 **Joke Bot** — Tells random jokes and puns
- ✦ **Quote Bot** — Shares inspirational quotes
- 📖 **Dictionary Bot** — Defines words with examples
- 💱 **Currency Bot** — Converts between currencies (e.g. "100 USD to INR")

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx        # React entry point
  App.jsx         # Main app component
  App.module.css  # Component styles
  bots.js         # Bot definitions and response logic
  index.css       # Global styles
index.html
vite.config.js
package.json
```

## Adding a new bot

Open `src/bots.js` and add a new object to the `BOTS` array:

```js
{
  id: 'mybot',
  name: 'My Bot',
  desc: 'Short description',
  icon: '🤖',
  accentBg: '#E6F1FB',
  accentText: '#185FA5',
  greeting: 'Hello! I am your new bot.',
  chips: ['Try this', 'Or this'],
  respond: (msg) => {
    return 'Your response logic here'
  }
}
```
