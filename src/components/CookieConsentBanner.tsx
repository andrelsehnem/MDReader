import { useCookieConsent } from '../state/useCookieConsent.ts'

const PRIVACY_POLICY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || '/privacidade'

export function CookieConsentBanner() {
  const { isBannerVisible, acceptConsent, rejectConsent, dismissBanner } = useCookieConsent()

  if (!isBannerVisible) {
    return null
  }

  return (
    <section className="cookie-banner" role="dialog" aria-live="polite" aria-label="Política de Cookies">
      <button
        type="button"
        className="cookie-banner-close"
        onClick={dismissBanner}
        aria-label="Fechar aviso de cookies"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="cookie-banner-content">
        <h3>Política de Cookies</h3>
        <p>
          Utilizamos cookies para melhorar sua experiência e medir o uso do site. Você pode aceitar ou rejeitar
          rastreamento opcional.
        </p>
        <a href={PRIVACY_POLICY_URL}>Leia nossa Política de Privacidade</a>
      </div>

      <div className="cookie-banner-actions" aria-label="Ações de consentimento">
        <button type="button" className="cookie-banner-reject" onClick={rejectConsent}>
          REJEITAR
        </button>
        <button type="button" className="cookie-banner-accept" onClick={acceptConsent}>
          ACEITAR
        </button>
      </div>
    </section>
  )
}
