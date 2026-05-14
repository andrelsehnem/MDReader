import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  acceptCookieConsent,
  canLoadTrackingScripts,
  dismissCookieBanner,
  getCookieConsentRecord,
  initializeTrackingScripts,
  rejectCookieConsent,
  shouldShowCookieBanner,
  type CookieConsentRecord,
} from '../services/cookieConsentService.ts'
import { CookieConsentContext, type CookieConsentContextValue } from './useCookieConsent.ts'

function getInitialConsent() {
  return getCookieConsentRecord()
}

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const [consentRecord, setConsentRecord] = useState<CookieConsentRecord | null>(getInitialConsent)

  useEffect(() => {
    if (canLoadTrackingScripts(consentRecord)) {
      initializeTrackingScripts()
    }
  }, [consentRecord])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consentStatus: consentRecord?.cookieConsent ?? 'unknown',
      isBannerVisible: shouldShowCookieBanner(consentRecord),
      hasTrackingConsent: canLoadTrackingScripts(consentRecord),
      acceptConsent: () => {
        acceptCookieConsent()
        const nextRecord = getCookieConsentRecord()
        setConsentRecord(nextRecord)
      },
      rejectConsent: () => {
        rejectCookieConsent()
        const nextRecord = getCookieConsentRecord()
        setConsentRecord(nextRecord)
      },
      dismissBanner: () => {
        dismissCookieBanner()
        const nextRecord = getCookieConsentRecord()
        setConsentRecord(nextRecord)
      },
    }),
    [consentRecord],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}
