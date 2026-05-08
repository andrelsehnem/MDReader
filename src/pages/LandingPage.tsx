import { Link } from 'react-router-dom'
import './LandingPage.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Upload Facilitado',
    desc: 'Arraste arquivos .md, .zip ou .rar diretamente para o navegador. Sem instalações, sem configuração.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: 'Editor + Preview',
    desc: 'Edite ao lado do preview em tempo real. Syntax highlighting e suporte completo ao CommonMark.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    title: 'Temas Personalizados',
    desc: 'Escolha entre presets de cores ou personalize a aparência conforme seu gosto.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Privacidade em Primeiro Lugar',
    desc: 'Seus arquivos são processados no navegador e não são enviados por padrão. Serviços de terceiros podem ser usados para publicidade.',
  },
]

export function LandingPage() {
  return (
    <div className="landing">
      {/* ── Fundo decorativo ── */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-bg__orb landing-bg__orb--1" />
        <div className="landing-bg__orb landing-bg__orb--2" />
        <div className="landing-bg__grid" />
      </div>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero__icon">
          <img src="/favicon-mdreader.svg" alt="MDreader ícone" width={96} height={96} />
        </div>

        <h1 className="landing-hero__title">
          MD<em>reader</em>
        </h1>

        <p className="landing-hero__subtitle">
          Leia, edite e visualize arquivos Markdown<br />
          diretamente no navegador — sem fricção.
        </p>

        <div className="landing-hero__actions">
          <Link to="/upload" className="btn btn--primary">
            Começar agora
          </Link>
          <Link to="/editor" className="btn btn--ghost">
            Abrir editor
          </Link>
        </div>

        <p className="landing-hero__note">Gratuito · Open source · Sem conta</p>
      </section>

      {/* ── Features ── */}
      <section className="landing-features" aria-label="Funcionalidades">
        {features.map((f) => (
          <article key={f.title} className="feature-card">
            <div className="feature-card__icon" aria-hidden="true">{f.icon}</div>
            <h2 className="feature-card__title">{f.title}</h2>
            <p className="feature-card__desc">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} MDreader</span>
        <span className="landing-footer__sep">·</span>
        <a
          href="https://andre100.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-footer__link"
        >
          andre100.dev
        </a>
      </footer>
    </div>
  )
}
