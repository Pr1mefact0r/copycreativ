import { useCallback } from 'react'
import usePointerDrag from './usePointerDrag'

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

export default function DraggableElement({ element, isSelected, onSelect, onUpdate, onDragEnd, containerRef }) {
  const handleDrag = useCallback(({ x, y }) => {
    onUpdate(element.id, { x, y })
  }, [element.id, onUpdate])

  const handleResize = useCallback(({ width }) => {
    onUpdate(element.id, { width })
  }, [element.id, onUpdate])

  const handleDragEndCb = useCallback(() => {
    onDragEnd?.()
  }, [onDragEnd])

  const { handlePointerDown } = usePointerDrag({
    onDrag: handleDrag,
    onResize: handleResize,
    onDragEnd: handleDragEndCb,
    containerRef,
  })

  const style = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    transform: 'translate(-50%, -50%)',
    cursor: isSelected ? 'move' : 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    zIndex: isSelected ? 10 : 1,
  }

  if (element.type === 'image') {
    style.width = `${element.width}%`
  }

  return (
    <div
      className={`draggable-el ${isSelected ? 'selected' : ''}`}
      style={style}
      onPointerDown={(e) => {
        onSelect(element.id)
        handlePointerDown(e, element, 'drag')
      }}
    >
      {element.type === 'text' && (
        <div
          className="drag-text-content"
          style={{
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            color: element.color,
            lineHeight: 1.2,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 4px rgba(0,0,0,0.25)',
            fontWeight: 700,
          }}
        >
          {element.content}
          {element.line2 && <><br />{element.line2}</>}
        </div>
      )}

      {element.type === 'image' && (
        <img
          src={element.content}
          alt="Design"
          className="drag-img-content"
          draggable={false}
        />
      )}

      {/* Resize handles for images */}
      {isSelected && element.type === 'image' && CORNERS.map(corner => (
        <div
          key={corner}
          className={`resize-handle rh-${corner}`}
          onPointerDown={(e) => {
            e.stopPropagation()
            handlePointerDown(e, element, 'resize', corner)
          }}
        />
      ))}

      {isSelected && <div className="selection-border" />}
    </div>
  )
}
