import { createContext, useContext } from 'react'
import type { CookieConsentStatus } from '../services/cookieConsentService.ts'

export type CookieConsentContextValue = {
  consentStatus: CookieConsentStatus | 'unknown'
  isBannerVisible: boolean
  hasTrackingConsent: boolean
  acceptConsent: () => void
  rejectConsent: () => void
  dismissBanner: () => void
}

export const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }

  return context
}
