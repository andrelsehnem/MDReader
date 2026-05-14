import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { refreshAdsterraByRoute } from '../services/adsterraService.ts'

export function AdsterraRouteLoader() {
  const location = useLocation()

  useEffect(() => {
    const pathname = `${location.pathname}${location.search}${location.hash}`
    refreshAdsterraByRoute(pathname)
  }, [location.pathname, location.search, location.hash])

  return null
}
