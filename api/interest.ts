import { createHash, randomBytes } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { isIP } from 'node:net'
import nodemailer from 'nodemailer'

type InterestRequest = IncomingMessage & { body?: unknown }

interface InterestResponse extends ServerResponse {
  status(code: number): this
  json(body: unknown): this
}

type InterestBody = {
  email?: unknown
  field_x9k2?: unknown
}

const rateLimitWindowMs = 15 * 60 * 1000
const rateLimitMaxPerEmail = 3
const rateLimitMaxPerIp = 10
const rateLimitSalt = randomBytes(16)
// Best-effort only: separate Vercel instances do not share this map or limits.
const attempts = new Map<string, { count: number; resetAt: number }>()

function respond(response: InterestResponse, status: number, payload: Record<string, boolean | string>) {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.status(status).json(payload)
}

function isRecord(value: unknown): value is InterestBody {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim()
  if (!email || email.length > 254) return null
  for (const character of email) {
    const code = character.charCodeAt(0)
    if (code < 32 || code === 127) return null
  }
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/u.test(email)) return null
  return email
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

function originMatchesHost(request: InterestRequest): boolean {
  const origin = request.headers.origin
  if (!origin) return true
  const host = request.headers.host
  if (typeof origin !== 'string' || !host) return false

  try {
    const url = new URL(origin)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}

function getClientIp(request: InterestRequest): string | null {
  // Prefer Vercel edge headers; fall back like Odimetry contact.
  const forwarded = process.env.VERCEL === '1'
    ? (request.headers['x-vercel-forwarded-for']
      ?? request.headers['x-real-ip']
      ?? request.headers['x-forwarded-for'])
    : undefined
  const candidate = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : null
  if (candidate && isIP(candidate)) return candidate
  const socketAddress = request.socket.remoteAddress
  return socketAddress && isIP(socketAddress) ? socketAddress : null
}

function isRateLimited(request: InterestRequest, email: string, now = Date.now()): boolean {
  const identifiers = [{ value: `email:${email.toLowerCase()}`, max: rateLimitMaxPerEmail }]
  const ip = getClientIp(request)
  if (ip) identifiers.push({ value: `ip:${ip}`, max: rateLimitMaxPerIp })

  const keys = identifiers.map(({ value, max }) => ({
    key: createHash('sha256').update(rateLimitSalt).update(value).digest('hex'),
    max,
  }))
  if (keys.some(({ key, max }) => {
    const current = attempts.get(key)
    return current && current.resetAt > now && current.count >= max
  })) return true

  for (const { key } of keys) {
    const current = attempts.get(key)
    if (current && current.resetAt > now) current.count += 1
    else attempts.set(key, { count: 1, resetAt: now + rateLimitWindowMs })
  }

  if (attempts.size > 500) {
    for (const [key, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(key)
    }
    while (attempts.size > 500) {
      const oldest = attempts.keys().next().value
      if (oldest) attempts.delete(oldest)
    }
  }
  return false
}

function getSentAt(): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date())
}

function createInterestEmailHtml(email: string): string {
  const safeEmail = escapeHtml(email)
  const sentAt = getSentAt()

  return `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:32px 12px;background:#f5f7f8;color:#17212b;font-family:Manrope,Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8dee3;border-radius:8px;overflow:hidden">
      <tr><td style="padding:24px 30px;background:#17212b;border-bottom:5px solid #087e8b">
        <p style="margin:0 0 9px;color:#f2b544;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase">Odimetry · Interés</p>
        <h1 style="margin:0;color:#ffffff;font-family:Sora,Arial,sans-serif;font-size:24px;line-height:1.3">Nueva solicitud para probar Odimetry</h1>
      </td></tr>
      <tr><td style="padding:24px 30px 8px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:11px 0;color:#64727c;font-size:13px;border-bottom:1px solid #e6eaed;width:145px;vertical-align:top">Correo electrónico</td>
            <td style="padding:11px 0;color:#17212b;font-size:14px;border-bottom:1px solid #e6eaed;overflow-wrap:anywhere">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding:11px 0;color:#64727c;font-size:13px;border-bottom:1px solid #e6eaed;width:145px;vertical-align:top">Interés</td>
            <td style="padding:11px 0;color:#17212b;font-size:14px;border-bottom:1px solid #e6eaed;overflow-wrap:anywhere">Probar Odimetry y recibir novedades</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 30px 26px">
        <div style="padding:16px;border-left:4px solid #087e8b;background:#f5f7f8;color:#17212b;font-size:14px;line-height:1.7;overflow-wrap:anywhere">
          La dirección <strong>${safeEmail}</strong> ha solicitado apuntarse a la lista de interesados en Odimetry desde la landing.
        </div>
        <p style="margin:20px 0 0;color:#64727c;font-size:12px">Recibido: ${sentAt} · odimetry.es</p>
        <p style="margin:12px 0 0;color:#64727c;font-size:12px;line-height:1.6">Esta solicitud no verifica que la dirección pertenezca a quien rellenó el formulario. Confirma la titularidad antes de enviar novedades.</p>
      </td></tr>
      <tr><td style="padding:16px 30px;background:#17212b;color:#d8dee3;font-size:12px;line-height:1.6">Este aviso se ha enviado desde el formulario de interés de Odimetry, un producto de Odimetry.</td></tr>
    </table>
  </body>
</html>`
}

function createInterestEmailText(email: string): string {
  return [
    'Nueva solicitud para probar Odimetry',
    '',
    `Correo electrónico: ${email}`,
    'Interés: Probar Odimetry y recibir novedades',
    '',
    `La dirección ${email} ha solicitado apuntarse a la lista de interesados en Odimetry desde la landing.`,
    '',
    `Recibido: ${getSentAt()} · odimetry.es`,
    '',
    'Esta solicitud no verifica que la dirección pertenezca a quien rellenó el formulario. Confirma la titularidad antes de enviar novedades.',
  ].join('\n')
}

export default async function handler(request: InterestRequest, response: InterestResponse): Promise<void> {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    respond(response, 405, { ok: false, error: 'method_not_allowed' })
    return
  }

  if (!originMatchesHost(request)) {
    respond(response, 403, { ok: false, error: 'origin_not_allowed' })
    return
  }

  const contentType = request.headers['content-type']
  if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|$)/iu.test(contentType)) {
    respond(response, 415, { ok: false, error: 'unsupported_media_type' })
    return
  }

  const contentLength = Number(request.headers['content-length'] ?? 0)
  if (!Number.isFinite(contentLength) || contentLength > 2_048) {
    respond(response, 413, { ok: false, error: 'payload_too_large' })
    return
  }

  if (!isRecord(request.body)) {
    respond(response, 400, { ok: false, error: 'invalid_request' })
    return
  }

  try {
    if (Buffer.byteLength(JSON.stringify(request.body), 'utf8') > 2_048) {
      respond(response, 413, { ok: false, error: 'payload_too_large' })
      return
    }
  } catch {
    respond(response, 400, { ok: false, error: 'invalid_request' })
    return
  }

  if (typeof request.body.field_x9k2 === 'string' && request.body.field_x9k2.trim()) {
    respond(response, 200, { ok: true })
    return
  }

  const email = getEmail(request.body.email)
  if (!email) {
    respond(response, 400, { ok: false, error: 'invalid_request' })
    return
  }

  if (isRateLimited(request, email)) {
    respond(response, 429, { ok: false, error: 'rate_limited' })
    return
  }

  const host = process.env.ZOHO_SMTP_HOST?.trim()
  const rawPort = process.env.ZOHO_SMTP_PORT?.trim()
  const user = process.env.ZOHO_SMTP_USER?.trim()
  const password = process.env.ZOHO_SMTP_PASS
  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || 'info+odimetry@odimetry.es'

  if (!host || !user || !password || !rawPort || (rawPort !== '465' && rawPort !== '587') || !getEmail(recipient)) {
    respond(response, 503, { ok: false, error: 'mail_service_unavailable' })
    return
  }

  const port = rawPort === '465' ? 465 : 587
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass: password },
    tls: { minVersion: 'TLSv1.2' },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })

  try {
    await transporter.sendMail({
      from: { name: 'Odimetry', address: user },
      to: recipient,
      replyTo: email,
      subject: `${email} está interesado en probar Odimetry`,
      text: createInterestEmailText(email),
      html: createInterestEmailHtml(email),
    })
    respond(response, 200, { ok: true })
  } catch {
    respond(response, 502, { ok: false, error: 'mail_delivery_failed' })
  } finally {
    transporter.close()
  }
}
