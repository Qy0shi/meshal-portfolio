'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from './ui/theme-provider'

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const themeState = useTheme()
  const dark = themeState.theme !== 'light'

  useEffect(() => {
    const loadVanta = async () => {
      const THREE = await import('three')
      const FOG = (await import('vanta/dist/vanta.fog.min')).default

      if (vantaEffect.current) vantaEffect.current.destroy()

      if (vantaRef.current) {
        vantaEffect.current = FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          // Dark mode: bright blue-cyan clouds over deep navy
          // Light mode: light wisps over soft steel-grey
          highlightColor: dark ? 0x3a7d9a : 0xfafbfd,
          midtoneColor:   dark ? 0x23546e : 0xe8ecf0,
          lowlightColor:  dark ? 0x0f2838 : 0xd0d8e0,
          baseColor:      dark ? 0x04080c : 0xc8d0d4,
          blurFactor: 0.5,
          speed: 1.2,
          zoom: 1.0,
        })
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy()
    }
  }, [dark])

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
