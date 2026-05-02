import { useState, useRef, useEffect } from 'react'
import { BOTS } from './bots'
import styles from './App.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />')
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function App() {
  const [activeBot, setActiveBot] = useState(null)
  const [conversations, setConversations] = useState({})
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [conversations, isTyping, activeBot])

  const selectBot = (bot) => {
    setActiveBot(bot)
    if (!conversations[bot.id]) {
      setConversations(prev => ({
        ...prev,
        [bot.id]: [{ role: 'bot', text: bot.greeting, time: now() }]
      }))
    }
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const sendMessage = (text) => {
    if (!activeBot || !text.trim() || isTyping) return
    const userMsg = { role: 'user', text: text.trim(), time: now() }
    setConversations(prev => ({
      ...prev,
      [activeBot.id]: [...(prev[activeBot.id] || []), userMsg]
    }))
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const reply = activeBot.respond(text.trim())
      const botMsg = { role: 'bot', text: reply, time: now() }
      setConversations(prev => ({
        ...prev,
        [activeBot.id]: [...(prev[activeBot.id] || []), botMsg]
      }))
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const messages = activeBot ? (conversations[activeBot.id] || []) : []

  return (
    <div className={styles.shell}>
      <div className={styles.app}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>Chatbots</h1>
            <p className={styles.sidebarSub}>Select a bot to begin</p>
          </div>
          <nav className={styles.botList}>
            {BOTS.map(bot => (
              <button
                key={bot.id}
                className={`${styles.botItem} ${activeBot?.id === bot.id ? styles.botItemActive : ''}`}
                onClick={() => selectBot(bot)}
              >
                <span className={styles.botIcon} style={{ background: bot.accentBg }}>
                  {bot.icon}
                </span>
                <span className={styles.botInfo}>
                  <span className={styles.botName}>{bot.name}</span>
                  <span className={styles.botDesc}>{bot.desc}</span>
                </span>
                {activeBot?.id === bot.id && <span className={styles.activeDot} />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <header className={styles.chatHeader}>
            {activeBot ? (
              <>
                <span className={styles.headerIcon} style={{ background: activeBot.accentBg }}>
                  {activeBot.icon}
                </span>
                <div>
                  <p className={styles.headerName}>{activeBot.name}</p>
                  <p className={styles.headerStatus}>Online</p>
                </div>
              </>
            ) : (
              <p className={styles.headerName} style={{ color: 'var(--text-secondary)' }}>
                No bot selected
              </p>
            )}
          </header>

          <div className={styles.messages} ref={messagesRef}>
            {!activeBot && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>💬</span>
                <p>Choose a chatbot from the sidebar to start a conversation</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}>
                <div className={styles.msgAvatar}>
                  {msg.role === 'bot' ? activeBot.icon : 'U'}
                </div>
                <div>
                  <div
                    className={`${styles.msgBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                  <p className={`${styles.msgTime} ${msg.role === 'user' ? styles.timeRight : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.msgRow} ${styles.msgBot}`}>
                <div className={styles.msgAvatar}>{activeBot?.icon}</div>
                <div className={`${styles.msgBubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
          </div>

          {activeBot && (
            <div className={styles.inputArea}>
              <div className={styles.chipRow}>
                {activeBot.chips.map(chip => (
                  <button key={chip} className={styles.chip} onClick={() => sendMessage(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
              <div className={styles.inputRow}>
                <textarea
                  ref={inputRef}
                  className={styles.inputBox}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                />
                <button
                  className={styles.sendBtn}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
