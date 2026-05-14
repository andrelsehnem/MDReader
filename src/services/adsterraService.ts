const ADSTERRA_SCRIPT_SRC = 'https://pl29372616.profitablecpmratenetwork.com/fc/9d/c8/fc9dc8de59ab8e6bd62ad29f9b1fc89a.js'
const ADSTERRA_MIN_RELOAD_MS = 1500

type AdsterraRuntimeState = {
  inFlight: boolean
  lastPathname: string
  lastInjectedAt: number
}

declare global {
  interface Window {
    __mdreaderAdsterraState?: AdsterraRuntimeState
  }
}

function getRuntimeState() {
  if (!window.__mdreaderAdsterraState) {
    window.__mdreaderAdsterraState = {
      inFlight: false,
      lastPathname: '',
      lastInjectedAt: 0,
    }
  }

  return window.__mdreaderAdsterraState
}

function removeExistingAdsterraScripts() {
  const scripts = document.querySelectorAll<HTMLScriptElement>(`script[src="${ADSTERRA_SCRIPT_SRC}"]`)

  scripts.forEach((script) => {
    script.remove()
  })
}

function dispatchAdEvent(status: 'load' | 'error', pathname: string) {
  window.dispatchEvent(new CustomEvent('mdreader:adsterra', { detail: { status, pathname } }))
}

export function refreshAdsterraByRoute(pathname: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const state = getRuntimeState()
  const now = Date.now()
  const isSamePath = state.lastPathname === pathname
  const isWithinCooldown = now - state.lastInjectedAt < ADSTERRA_MIN_RELOAD_MS

  if (state.inFlight || isSamePath || isWithinCooldown) {
    return
  }

  state.inFlight = true
  state.lastPathname = pathname
  state.lastInjectedAt = now

  removeExistingAdsterraScripts()

  const script = document.createElement('script')
  script.src = ADSTERRA_SCRIPT_SRC
  script.async = true
  script.onload = () => {
    state.inFlight = false
    dispatchAdEvent('load', pathname)
  }
  script.onerror = () => {
    state.inFlight = false
    dispatchAdEvent('error', pathname)
  }

  document.body.appendChild(script)
}
