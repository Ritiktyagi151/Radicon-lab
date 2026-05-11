'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

type MessageRole = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: MessageRole
  content: string
}

interface ChatApiResponse {
  message?: string
  reply?: string
  error?: string
}

const STORAGE_KEY = 'radicon-chat-history'

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello, I am Radicon Laboratories AI assistant. How can I help with products, manufacturing, or export inquiries?',
}

const faqPrompts = [
  'What products do you manufacture?',
  'Do you offer third party manufacturing?',
  'Where is Radicon Laboratories located?',
]

function createMessage(role: MessageRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const hasLoadedHistoryRef = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedMessages = window.localStorage.getItem(STORAGE_KEY)

      if (!savedMessages) {
        hasLoadedHistoryRef.current = true
        return
      }

      try {
        const parsedMessages = JSON.parse(savedMessages) as ChatMessage[]

        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      } finally {
        hasLoadedHistoryRef.current = true
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasLoadedHistoryRef.current) {
      return
    }

    // Persist conversation locally so users can continue their inquiry.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage(messageText: string) {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isLoading) {
      return
    }

    const userMessage = createMessage('user', trimmedMessage)
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      // The API route calls Gemini on the server and returns a normalized JSON response.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      const contentType = response.headers.get('content-type')

      if (!contentType?.includes('application/json')) {
        throw new Error(
          'Chat API route is not returning JSON. Please restart the Next.js server and check /api/chat.',
        )
      }

      const data = (await response.json()) as ChatApiResponse
      const assistantReply = data.reply || data.message

      if (!response.ok || !assistantReply) {
        throw new Error(data.error || data.message || 'Unable to get a response.')
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('assistant', assistantReply),
      ])
    } catch (chatError) {
      const message =
        chatError instanceof Error
          ? chatError.message
          : 'Something went wrong. Please try again.'

      setError(message)
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          'assistant',
          'Sorry, I could not respond right now. Please try again or contact Radicon Laboratories directly.',
        ),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(input)
  }

  function clearChat() {
    setMessages([welcomeMessage])
    setError('')
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end sm:bottom-6 sm:right-6">
      <div
        className={`mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] origin-bottom-right overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl transition-all duration-300 sm:w-[390px] ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div className="bg-[#DF1F26] px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">
                Radicon AI
              </p>
              <h2 className="mt-1 text-lg font-bold">Pharma Support Assistant</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <span className="block text-xl leading-none">x</span>
            </button>
          </div>
        </div>

        <div className="h-[360px] overflow-y-auto bg-slate-50 px-4 py-4 sm:h-[410px]">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-[#DF1F26] text-white'
                      : 'rounded-bl-md border border-brand-100 bg-white text-slate-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-brand-100 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5" aria-label="AI is typing">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-700 [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-700 [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-700" />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          {error ? (
            <p className="mb-3 rounded-md bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
              {error}
            </p>
          ) : null}

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {faqPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                className="shrink-0 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 transition hover:border-brand-200 hover:bg-brand-100"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <label htmlFor="chat-message" className="sr-only">
              Message
            </label>
            <textarea
              id="chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void sendMessage(input)
                }
              }}
              rows={1}
              placeholder="Ask about products or manufacturing..."
              className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-11 rounded-xl bg-[#DF1F26] px-4 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Send
            </button>
          </form>

          <button
            type="button"
            onClick={clearChat}
            className="mt-3 text-xs font-semibold text-slate-500 transition hover:text-brand-700"
          >
            Clear chat history
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#DF1F26] text-white shadow-xl shadow-brand-950/20 transition hover:-translate-y-0.5 hover:bg-brand-800 focus:outline-none focus:ring-4 focus:ring-brand-200"
        aria-label={isOpen ? 'Close AI chatbot' : 'Open AI chatbot'}
      >
        {isOpen ? (
          <span className="text-3xl leading-none">x</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 transition group-hover:scale-105"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
          </svg>
        )}
      </button>
    </div>
  )
}
