import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type CareerMailPayload = {
  name?: string
  email?: string
  phone?: string
  role?: string
  qualification?: string
  experience?: string
  message?: string
}

const hrEmail = process.env.SMTP_TO_HR || process.env.SMTP_USER || 'garima_hr@radiconlab.com'
const maxCvSize = 5 * 1024 * 1024

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function requiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_HR_USER || process.env.SMTP_USER
  const pass = process.env.SMTP_HR_PASS || process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user, pass },
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  })
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  let payload: CareerMailPayload | null = null
  let cvAttachment: { filename: string; content: Buffer; contentType: string } | null = null

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData().catch(() => null)

    if (formData) {
      payload = Object.fromEntries(
        ['name', 'email', 'phone', 'role', 'qualification', 'experience', 'message'].map((key) => [
          key,
          requiredString(formData.get(key)),
        ]),
      ) as CareerMailPayload

      const cv = formData.get('cv')

      if (cv instanceof File && cv.size > 0) {
        if (cv.type !== 'application/pdf') {
          return NextResponse.json({ message: 'Please upload your CV as a PDF file.' }, { status: 400 })
        }

        if (cv.size > maxCvSize) {
          return NextResponse.json({ message: 'CV PDF size should be 5 MB or less.' }, { status: 400 })
        }

        cvAttachment = {
          filename: cv.name || 'candidate-cv.pdf',
          content: Buffer.from(await cv.arrayBuffer()),
          contentType: cv.type,
        }
      }
    }
  } else {
    payload = (await request.json().catch(() => null)) as CareerMailPayload | null
  }

  const name = requiredString(payload?.name)
  const email = requiredString(payload?.email)
  const phone = requiredString(payload?.phone)
  const role = requiredString(payload?.role)
  const qualification = requiredString(payload?.qualification)
  const experience = requiredString(payload?.experience)
  const message = requiredString(payload?.message)

  if (!name || !email || !phone || !role || !message) {
    return NextResponse.json({ message: 'Career mail details are incomplete.' }, { status: 400 })
  }

  const transporter = createTransporter()

  if (!transporter) {
    return NextResponse.json({ message: 'Career mail SMTP is not configured.' }, { status: 500 })
  }

  const subject = `Radicon Career Application: ${role}`
  const adminText = [
    'New career application received from Radicon website.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Applying For: ${role}`,
    `Qualification: ${qualification || 'Not provided'}`,
    `Experience: ${experience || 'Not provided'}`,
    `CV: ${cvAttachment ? cvAttachment.filename : 'Not attached'}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin: 0 0 16px;">New Radicon career application</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        ${[
          ['Name', name],
          ['Email', email],
          ['Phone', phone],
          ['Applying For', role],
          ['Qualification', qualification || 'Not provided'],
          ['Experience', experience || 'Not provided'],
          ['CV', cvAttachment ? cvAttachment.filename : 'Not attached'],
        ]
          .map(
            ([label, value]) => `
              <tr>
                <td style="border: 1px solid #e5e7eb; padding: 8px 12px; font-weight: 700; width: 150px;">${escapeHtml(label)}</td>
                <td style="border: 1px solid #e5e7eb; padding: 8px 12px;">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join('')}
      </table>
      <h3 style="margin: 20px 0 8px;">Message</h3>
      <div style="white-space: pre-wrap; border: 1px solid #e5e7eb; padding: 12px; max-width: 640px;">${escapeHtml(message)}</div>
    </div>
  `

  const confirmationText = [
    `Dear ${name},`,
    '',
    `Thank you for applying to Radicon Laboratories. Our HR team has received your application for ${role}.`,
    `Please email your updated resume to ${hrEmail} if you have not already shared it.`,
    '',
    'Regards,',
    'Radicon Laboratories',
  ].join('\n')

  await transporter.sendMail({
    from: process.env.SMTP_HR_FROM || process.env.SMTP_HR_USER || process.env.SMTP_FROM || process.env.SMTP_USER,
    to: hrEmail,
    replyTo: email,
    subject,
    text: adminText,
    html: adminHtml,
    attachments: cvAttachment ? [cvAttachment] : undefined,
  })

  await transporter.sendMail({
    from: process.env.SMTP_HR_FROM || process.env.SMTP_HR_USER || process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Thank you for applying to Radicon Laboratories',
    text: confirmationText,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">Thank you, ${escapeHtml(name)}</h2>
        <p>Thank you for applying to Radicon Laboratories. Our HR team has received your application for <strong>${escapeHtml(role)}</strong>.</p>
        <p>Please email your updated resume to <a href="mailto:${escapeHtml(hrEmail)}">${escapeHtml(hrEmail)}</a> if you have not already shared it.</p>
        <p style="margin-top: 20px;">Regards,<br />Radicon Laboratories</p>
      </div>
    `,
  })

  return NextResponse.json({ message: 'Career emails sent successfully.' })
}
