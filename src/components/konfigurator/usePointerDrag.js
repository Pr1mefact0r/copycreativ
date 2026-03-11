import { useRef, useCallback, useEffect } from 'react'

export default function usePointerDrag({ onDrag, onDragEnd, onResize, containerRef }) {
  const stateRef = useRef({
    active: false,
    mode: null,
    startX: 0,
    startY: 0,
    startElX: 0,
    startElY: 0,
    startW: 0,
    startH: 0,
    corner: null,
  })

  // Store callbacks in refs so document listeners always see latest
  const onDragRef = useRef(onDrag)
  const onResizeRef = useRef(onResize)
  const onDragEndRef = useRef(onDragEnd)
  onDragRef.current = onDrag
  onResizeRef.current = onResize
  onDragEndRef.current = onDragEnd

  const onDocMove = useCallback((e) => {
    const s = stateRef.current
    if (!s.active) return
    e.preventDefault()

    const container = containerRef?.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    const dx = ((e.clientX - s.startX) / rect.width) * 100
    const dy = ((e.clientY - s.startY) / rect.height) * 100

    if (s.mode === 'drag') {
      const newX = Math.max(0, Math.min(100, s.startElX + dx))
      const newY = Math.max(0, Math.min(100, s.startElY + dy))
      onDragRef.current?.({ x: newX, y: newY })
    } else if (s.mode === 'resize') {
      let newW = s.startW
      if (s.corner?.includes('right')) newW = Math.max(8, s.startW + dx)
      if (s.corner?.includes('left')) newW = Math.max(8, s.startW - dx)
      // Keep aspect ratio — only use width
      onResizeRef.current?.({ width: newW })
    }
  }, [containerRef])

  const onDocUp = useCallback(() => {
    const s = stateRef.current
    if (!s.active) return
    s.active = false
    s.mode = null
    document.removeEventListener('pointermove', onDocMove)
    document.removeEventListener('pointerup', onDocUp)
    onDragEndRef.current?.()
  }, [onDocMove])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onDocMove)
      document.removeEventListener('pointerup', onDocUp)
    }
  }, [onDocMove, onDocUp])

  const handlePointerDown = useCallback((e, element, mode = 'drag', corner = null) => {
    e.stopPropagation()
    e.preventDefault()
    const s = stateRef.current
    s.active = true
    s.mode = mode
    s.corner = corner
    s.startX = e.clientX
    s.startY = e.clientY
    s.startElX = element.x
    s.startElY = element.y
    s.startW = element.width || 35
    s.startH = element.height || 35

    // Attach to document so re-renders don't break tracking
    document.addEventListener('pointermove', onDocMove)
    document.addEventListener('pointerup', onDocUp)
  }, [onDocMove, onDocUp])

  return { handlePointerDown }
}
