import { useRef, useState, useCallback } from 'react'
import DraggableElement from './DraggableElement'

const SNAP_THRESHOLD = 3 // percent

export default function PrintCanvas({ elements, selectedId, onSelect, onUpdate, side }) {
  const canvasRef = useRef(null)
  const [guides, setGuides] = useState({ x: null, y: null, alignX: [], alignY: [] })

  const sideElements = elements.filter(el => el.side === side)

  // Handle all element updates — only apply snap logic for position changes
  const handleElementUpdate = useCallback((id, updates) => {
    // Resize: just pass through, no snap logic
    if ('width' in updates && !('x' in updates)) {
      onUpdate(id, updates)
      return
    }

    // Drag: apply snap guidelines
    const others = sideElements.filter(el => el.id !== id)
    let { x, y } = updates
    const newGuides = { x: null, y: null, alignX: [], alignY: [] }

    // Snap to center
    if (Math.abs(x - 50) < SNAP_THRESHOLD) {
      x = 50
      newGuides.x = 50
    }
    if (Math.abs(y - 50) < SNAP_THRESHOLD) {
      y = 50
      newGuides.y = 50
    }

    // Snap to other elements
    others.forEach(other => {
      if (Math.abs(x - other.x) < SNAP_THRESHOLD) {
        x = other.x
        newGuides.alignX.push(other.x)
      }
      if (Math.abs(y - other.y) < SNAP_THRESHOLD) {
        y = other.y
        newGuides.alignY.push(other.y)
      }
    })

    // Snap to edges (10% and 90%)
    ;[10, 25, 75, 90].forEach(edge => {
      if (Math.abs(x - edge) < SNAP_THRESHOLD) { x = edge; newGuides.alignX.push(edge) }
      if (Math.abs(y - edge) < SNAP_THRESHOLD) { y = edge; newGuides.alignY.push(edge) }
    })

    setGuides(newGuides)
    onUpdate(id, { x, y })
  }, [sideElements, onUpdate])

  const clearGuides = useCallback(() => {
    setGuides({ x: null, y: null, alignX: [], alignY: [] })
  }, [])

  return (
    <div
      ref={canvasRef}
      className="print-canvas"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onSelect(null)
      }}
    >
      {/* Grid lines (always visible, subtle) */}
      <div className="print-grid" />

      {/* Snap guidelines */}
      {guides.x !== null && (
        <div className="snap-guide snap-guide-v" style={{ left: `${guides.x}%` }} />
      )}
      {guides.y !== null && (
        <div className="snap-guide snap-guide-h" style={{ top: `${guides.y}%` }} />
      )}
      {guides.alignX.map((x, i) => (
        <div key={`ax-${i}`} className="snap-guide snap-guide-v snap-guide-align" style={{ left: `${x}%` }} />
      ))}
      {guides.alignY.map((y, i) => (
        <div key={`ay-${i}`} className="snap-guide snap-guide-h snap-guide-align" style={{ top: `${y}%` }} />
      ))}

      {/* Center crosshair (subtle) */}
      <div className="print-center-h" />
      <div className="print-center-v" />

      {sideElements.map(el => (
        <DraggableElement
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          onSelect={onSelect}
          onUpdate={handleElementUpdate}
          onDragEnd={clearGuides}
          containerRef={canvasRef}
        />
      ))}
    </div>
  )
}
