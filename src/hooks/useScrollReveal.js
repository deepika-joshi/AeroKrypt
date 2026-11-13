import { useEffect, useRef } from 'react'

/**
 * useScrollReveal hook
 * Attaches an IntersectionObserver to elements matching the selector or a container ref,
 * adding the 'is-visible' class when they enter the viewport.
 */
export function useScrollReveal(options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Respect user's reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const elements = containerRef.current
        ? containerRef.current.querySelectorAll('.reveal-on-scroll')
        : document.querySelectorAll('.reveal-on-scroll')
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, options)

    const targetNodes = containerRef.current
      ? containerRef.current.querySelectorAll('.reveal-on-scroll')
      : document.querySelectorAll('.reveal-on-scroll')

    targetNodes.forEach((node) => observer.observe(node))

    return () => {
      observer.disconnect()
    }
  }, [options])

  return containerRef
}

export default useScrollReveal

