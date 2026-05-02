export const BOTS = [
  {
    id: 'joke',
    name: 'Joke Bot',
    desc: 'Tell me a joke',
    icon: '😄',
    accentBg: '#FAEEDA',
    accentText: '#854F0B',
    greeting: "Hey! Ready to laugh? Ask me for a joke anytime 😄",
    chips: ['Tell me a joke', 'Give me a pun', 'Something dark humor'],
    respond: (msg) => {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😂",
        "I told my wife she was drawing her eyebrows too high. She looked surprised. 🤨",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "I'm reading a book about anti-gravity. It's impossible to put down! 📚",
        "Why do cows wear bells? Because their horns don't work! 🐄",
        "What do you call a fake noodle? An impasta! 🍝",
        "Why did the bicycle fall over? Because it was two-tired! 🚲",
        "I used to hate facial hair... but then it grew on me. 🧔",
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
  },
  {
    id: 'quote',
    name: 'Quote Bot',
    desc: 'Daily inspiration',
    icon: '✦',
    accentBg: '#E6F1FB',
    accentText: '#185FA5',
    greeting: "Welcome! I'll inspire you with meaningful quotes. What kind of quote are you looking for?",
    chips: ['Motivational quote', 'Quote about life', 'Famous wisdom'],
    respond: (msg) => {
      const quotes = [
        '"The only way to do great work is to love what you do." — Steve Jobs',
        '"In the middle of every difficulty lies opportunity." — Albert Einstein',
        '"It does not matter how slowly you go as long as you do not stop." — Confucius',
        '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
        '"Strive not to be a success, but rather to be of value." — Albert Einstein',
        '"You miss 100% of the shots you don\'t take." — Wayne Gretzky',
        '"Whether you think you can or you think you can\'t, you\'re right." — Henry Ford',
        '"The only impossible journey is the one you never begin." — Tony Robbins',
      ]
      return quotes[Math.floor(Math.random() * quotes.length)]
    }
  },
  {
    id: 'dict',
    name: 'Dictionary Bot',
    desc: 'Word meanings',
    icon: '📖',
    accentBg: '#EAF3DE',
    accentText: '#3B6D11',
    greeting: "Hello! I can define words for you. Just type any word and I'll explain it.",
    chips: ['Define "ephemeral"', 'What is serendipity?', 'Meaning of resilience'],
    respond: (msg) => {
      const definitions = {
        ephemeral: "**ephemeral** (adj.)\nLasting for a very short time.\n\n📝 Example: \"The ephemeral beauty of cherry blossoms reminds us to cherish the moment.\"",
        serendipity: "**serendipity** (n.)\nThe occurrence of events by chance in a happy or beneficial way.\n\n📝 Example: \"Finding her dream job through a chance meeting was pure serendipity.\"",
        resilience: "**resilience** (n.)\nThe capacity to recover quickly from difficulties; toughness.\n\n📝 Example: \"Her resilience through hardship inspired everyone around her.\"",
        melancholy: "**melancholy** (n./adj.)\nA feeling of pensive sadness, typically with no obvious cause.\n\n📝 Example: \"A melancholy mood hung over the empty streets after the festival ended.\"",
        ubiquitous: "**ubiquitous** (adj.)\nPresent, appearing, or found everywhere.\n\n📝 Example: \"Smartphones have become ubiquitous in modern society.\"",
        eloquent: "**eloquent** (adj.)\nFluent or persuasive in speaking or writing.\n\n📝 Example: \"She gave an eloquent speech that moved the entire audience.\"",
        tenacious: "**tenacious** (adj.)\nTending to keep a firm hold; persistent.\n\n📝 Example: \"His tenacious pursuit of excellence set him apart from his peers.\"",
        benevolent: "**benevolent** (adj.)\nWell meaning and kindly; generous.\n\n📝 Example: \"The benevolent donor funded scholarships for hundreds of students.\"",
      }
      const clean = msg.toLowerCase()
        .replace(/^(define|what is|what's|meaning of|tell me about)\s*/i, '')
        .replace(/[^a-z]/g, '')
        .trim()
      return definitions[clean]
        || `I don't have a definition stored for **"${clean}"** yet.\n\nTry one of these: ephemeral, serendipity, resilience, melancholy, ubiquitous, eloquent, tenacious, or benevolent.`
    }
  },
  {
    id: 'currency',
    name: 'Currency Bot',
    desc: 'FX conversions',
    icon: '💱',
    accentBg: '#EEEDFE',
    accentText: '#534AB7',
    greeting: "Hi! I can help with currency conversions. Try something like \"100 USD to INR\".",
    chips: ['100 USD to INR', '50 EUR to GBP', '1000 INR to USD'],
    respond: (msg) => {
      const rates = {
        USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79,
        JPY: 149.5, AUD: 1.53, CAD: 1.36, SGD: 1.34,
        AED: 3.67, CHF: 0.88
      }
      const match = msg.match(/(\d+(\.\d+)?)\s*([a-z]{3})\s*(to|in)\s*([a-z]{3})/i)
      if (match) {
        const amount = parseFloat(match[1])
        const from = match[3].toUpperCase()
        const to = match[5].toUpperCase()
        if (!rates[from]) return `❌ Unknown currency: **${from}**\n\nSupported: ${Object.keys(rates).join(', ')}`
        if (!rates[to]) return `❌ Unknown currency: **${to}**\n\nSupported: ${Object.keys(rates).join(', ')}`
        const result = ((amount / rates[from]) * rates[to]).toFixed(2)
        const rate = (rates[to] / rates[from]).toFixed(4)
        return `💱 **${amount} ${from} = ${result} ${to}**\n\nExchange rate: 1 ${from} ≈ ${rate} ${to}\n\n_Rates are approximate and for demo purposes._`
      }
      return "Please use the format: **[amount] [FROM] to [TO]**\n\nExample: `100 USD to INR`\n\nSupported currencies: " + Object.keys(rates).join(', ')
    }
  }
]
