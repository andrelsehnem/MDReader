export const COOKIE_CONSENT_STORAGE_KEY = 'mdreader-cookie-consent'
const COOKIE_BANNER_DISMISS_DAYS = 30

export type CookieConsentStatus = 'accepted' | 'rejected' | 'dismissed'

export type CookieConsentRecord = {
  cookieConsent: CookieConsentStatus
  date?: string
}

type GtagFunction = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFunction
    __mdreaderTrackingInitialized?: boolean
  }
}

function toIsoDate(date: Date) {
  return date.toISOString()
}

function parseConsent(rawValue: string | null): CookieConsentRecord | null {
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CookieConsentRecord>
    const status = parsed.cookieConsent

    if (status !== 'accepted' && status !== 'rejected' && status !== 'dismissed') {
      return null
    }

    return {
      cookieConsent: status,
      date: typeof parsed.date === 'string' ? parsed.date : undefined,
    }
  } catch {
    return null
  }
}

function persistConsent(record: CookieConsentRecord) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
}

function ensureDataLayer() {
  if (!window.dataLayer) {
    window.dataLayer = []
  }

  return window.dataLayer
}

function appendScript(id: string, src: string) {
  if (typeof document === 'undefined') {
    return
  }

  if (document.getElementById(id)) {
    return
  }

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function getCookieConsentRecord() {
  if (typeof window === 'undefined') {
    return null
  }

  return parseConsent(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))
}

export function acceptCookieConsent() {
  persistConsent({ cookieConsent: 'accepted', date: toIsoDate(new Date()) })
}

export function rejectCookieConsent() {
  persistConsent({ cookieConsent: 'rejected' })
}

export function dismissCookieBanner() {
  persistConsent({ cookieConsent: 'dismissed', date: toIsoDate(new Date()) })
}

export function hasCookieDecision(record = getCookieConsentRecord()) {
  return record?.cookieConsent === 'accepted' || record?.cookieConsent === 'rejected'
}

export function isDismissExpired(record = getCookieConsentRecord(), now = Date.now()) {
  if (!record || record.cookieConsent !== 'dismissed') {
    return false
  }

  if (!record.date) {
    return true
  }

  const dismissedAt = new Date(record.date).getTime()
  if (Number.isNaN(dismissedAt)) {
    return true
  }

  const expireAt = dismissedAt + COOKIE_BANNER_DISMISS_DAYS * 24 * 60 * 60 * 1000
  return now >= expireAt
}

export function shouldShowCookieBanner(record = getCookieConsentRecord()) {
  if (!record) {
    return true
  }

  if (hasCookieDecision(record)) {
    return false
  }

  return isDismissExpired(record)
}

export function canLoadTrackingScripts(record = getCookieConsentRecord()) {
  return record?.cookieConsent === 'accepted'
}

export function initializeTrackingScripts() {
  if (typeof window === 'undefined' || window.__mdreaderTrackingInitialized) {
    return
  }

  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  const gtmId = import.meta.env.VITE_GTM_ID

  if (typeof gaMeasurementId === 'string' && gaMeasurementId.trim()) {
    const id = gaMeasurementId.trim()
    appendScript('mdreader-ga-loader', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`)

    const dataLayer = ensureDataLayer()
    const gtag: GtagFunction = (...args) => {
      dataLayer.push(args)
    }

    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', id)
  }

  if (typeof gtmId === 'string' && gtmId.trim()) {
    const id = gtmId.trim()
    ensureDataLayer()
    appendScript('mdreader-gtm-loader', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`)
  }

  window.__mdreaderTrackingInitialized = true
}
