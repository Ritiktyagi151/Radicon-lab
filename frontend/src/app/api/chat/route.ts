import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
  role: ChatRole
  content: string
}

interface ChatRequestBody {
  message?: string
  messages?: ChatMessage[]
}

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

const SYSTEM_PROMPT = `
You are Radicon Laboratories AI Assistant.

Company Information:
- Company Name: Radicon Laboratories
- Industry: Pharmaceutical Manufacturing
- Products: Tablets, Capsules, Syrups, Ointments, Injectables, Oral Strips
- Services: Contract Manufacturing, Third Party Manufacturing, Pharma Export
- Location: Greater Noida, India
- Certifications: WHO-GMP, ISO Certified

Instructions:
- Reply professionally.
- Keep responses short.
- Help users with pharma inquiries.
- Answer manufacturing questions.
- Share company information when useful.
- Support lead generation by asking for product type, quantity, timeline, and contact details when relevant.
- Do not invent pricing, minimum order quantities, medical advice, regulatory approvals, or delivery timelines.
`

function getErrorStatus(error: unknown) {
  if (!error || typeof error !== 'object') {
    return 500
  }

  const { status } = error as { status?: unknown }

  return typeof status === 'number' ? status : 500
}

function getRetryDelay(error: unknown) {
  if (!error || typeof error !== 'object') {
    return ''
  }

  const { errorDetails } = error as {
    errorDetails?: Array<Record<string, unknown>>
  }

  const retryInfo = errorDetails?.find(
    (detail) => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo',
  )
  const retryDelay = retryInfo?.retryDelay

  return typeof retryDelay === 'string' ? retryDelay : ''
}

function getGeminiErrorMessage(error: unknown) {
  const status = getErrorStatus(error)

  if (status === 429) {
    const retryDelay = getRetryDelay(error)
    const retryText = retryDelay ? ` Please retry after ${retryDelay}.` : ''

    return `Gemini API quota is exhausted for this key or project.${retryText} Please enable billing, wait for quota reset, or use a Gemini API key with available quota.`
  }

  if (status === 404) {
    return `Gemini model "${MODEL_NAME}" is not available for this API key. Set GEMINI_MODEL in frontend/.env to a supported model and restart the server.`
  }

  return 'Unable to generate a Gemini response right now. Please try again.'
}

function getLocalFallbackMessage(question: string) {
  const normalizedQuestion = question.toLowerCase()

  if (normalizedQuestion.includes('product')) {
    return 'Radicon Laboratories manufactures tablets, capsules, syrups, ointments, injectables, and oral strips. Please share the product type, quantity, and timeline so our team can guide you.'
  }

  if (
    normalizedQuestion.includes('third party') ||
    normalizedQuestion.includes('contract') ||
    normalizedQuestion.includes('manufacturing')
  ) {
    return 'Yes, Radicon Laboratories supports contract and third party pharmaceutical manufacturing. Please share your dosage form, required quantity, timeline, and contact details.'
  }

  if (
    normalizedQuestion.includes('location') ||
    normalizedQuestion.includes('where') ||
    normalizedQuestion.includes('address')
  ) {
    return 'Radicon Laboratories is located in Greater Noida, India. For detailed directions or business inquiries, please contact the team directly.'
  }

  if (
    normalizedQuestion.includes('export') ||
    normalizedQuestion.includes('international')
  ) {
    return 'Radicon Laboratories supports pharma export inquiries. Please share the target country, product category, quantity, and regulatory requirements so the team can assist.'
  }

  return 'Thank you for contacting Radicon Laboratories. Please share your product type, quantity, timeline, and contact details so our team can help you with the right manufacturing solution.'
}

function isChatMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== 'object') {
    return false
  }

  const candidate = message as Partial<ChatMessage>

  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string' &&
    candidate.content.trim().length > 0
  )
}

function buildPrompt(body: ChatRequestBody) {
  const directMessage = typeof body.message === 'string' ? body.message.trim() : ''
  const history = Array.isArray(body.messages)
    ? body.messages.filter(isChatMessage).slice(-10)
    : []

  const conversation = history
    .map((message) => {
      const speaker = message.role === 'user' ? 'User' : 'Assistant'
      return `${speaker}: ${message.content.trim()}`
    })
    .join('\n')

  const userQuestion = directMessage || history.at(-1)?.content.trim() || ''

  return {
    prompt: `${SYSTEM_PROMPT}\n\nConversation History:\n${conversation || 'No previous messages.'}\n\nUser Question:\n${userQuestion}\n\nAssistant:`,
    userQuestion,
  }
}

export async function POST(req: Request) {
  let userQuestion = ''

  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API key missing: GEMINI_API_KEY is not set.')

      return NextResponse.json(
        {
          message:
            'Gemini API key is not configured. Add GEMINI_API_KEY to frontend/.env and restart the server.',
        },
        { status: 500 },
      )
    }

    const body = (await req.json()) as ChatRequestBody
    const builtPrompt = buildPrompt(body)
    const { prompt } = builtPrompt
    userQuestion = builtPrompt.userQuestion

    if (!userQuestion) {
      return NextResponse.json(
        { message: 'Please send a message.' },
        { status: 400 },
      )
    }

    console.log('Gemini chat request:', {
      model: MODEL_NAME,
      questionLength: userQuestion.length,
    })

    // Keep the Gemini API key on the server. Never expose it to the browser.
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.4,
      },
    })

    const result = await model.generateContent(prompt)
    const response = result.response.text().trim()
    const message =
      response ||
      'Thank you for contacting Radicon Laboratories. Please share your product requirement for more details.'

    return NextResponse.json({
      message,
      reply: message,
    })
  } catch (error) {
    const status = getErrorStatus(error)

    if (status === 429) {
      const retryDelay = getRetryDelay(error)
      const retryText = retryDelay ? ` Retry suggested after ${retryDelay}.` : ''

      console.warn(`Gemini quota exhausted; using local fallback.${retryText}`)

      const message = getLocalFallbackMessage(userQuestion)

      return NextResponse.json({
        message,
        reply: message,
        fallback: true,
      })
    }

    console.error('Gemini chat API error:', error)

    return NextResponse.json(
      {
        message: getGeminiErrorMessage(error),
      },
      { status },
    )
  }
}
