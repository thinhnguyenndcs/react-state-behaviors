import { useRef } from 'react'

/**
 * Returns an incrementing render count for the calling component.
 * Uses a ref so incrementing does NOT trigger a re-render.
 */
export function useRenderCount(): number {
  const count = useRef(0)
  count.current += 1
  return count.current
}
