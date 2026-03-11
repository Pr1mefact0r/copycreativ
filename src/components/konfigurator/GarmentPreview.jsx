import { useState, useRef, useCallback } from 'react'
import { TShirtFront, TShirtBack, HoodieFront, HoodieBack } from './GarmentSVG'
import PrintCanvas from './PrintCanvas'

export default function GarmentPreview({
  product, colorHex, bgColor, side, setSide,
  elements, selectedId, onSelect, onUpdate
}) {
  const [isFlipping, setIsFlipping] = useState(false)
  const sceneRef = useRef(null)

  // Drag-to-rotate state
  const dragRotate = useRef({ active: false, startX: 0, startAngle: 0 })
  const [rotateAngle, setRotateAngle] = useState(0)

  const flip = useCallback((newSide) => {
    if (newSide === side) return
    setIsFlipping(true)
    setRotateAngle(newSide === 'back' ? 180 : 0)
    setTimeout(() => {
      setSide(newSide)
      setIsFlipping(false)
    }, 400)
  }, [side, setSide])

  // Manual rotation via drag on empty area
  const handleScenePointerDown = useCallback((e) => {
    if (e.target !== sceneRef.current && !e.target.classList.contains('product-svg') && !e.target.closest('.product-svg')) return
    onSelect(null) // deselect elements
    dragRotate.current = { active: true, startX: e.clientX, startAngle: rotateAngle }
    e.target.setPointerCapture?.(e.pointerId)
  }, [rotateAngle, onSelect])

  const handleScenePointerMove = useCallback((e) => {
    if (!dragRotate.current.active) return
    const dx = e.clientX - dragRotate.current.startX
    setRotateAngle(dragRotate.current.startAngle + dx * 0.5)
  }, [])

  const handleScenePointerUp = useCallback(() => {
    if (!dragRotate.current.active) return
    dragRotate.current.active = false
    // Snap to front or back
    const normalized = ((rotateAngle % 360) + 360) % 360
    if (normalized > 90 && normalized < 270) {
      setRotateAngle(180)
      setSide('back')
    } else {
      setRotateAngle(0)
      setSide('front')
    }
  }, [rotateAngle, setSide])

  const FrontSVG = product === 'hoodie' ? HoodieFront : TShirtFront
  const BackSVG = product === 'hoodie' ? HoodieBack : TShirtBack

  return (
    <div className="garment-preview-wrapper">
      {/* View Toggle */}
      <div className="view-toggle">
        <button className={`view-btn ${side === 'front' ? 'active' : ''}`} onClick={() => flip('front')}>
          Vorderseite
        </button>
        <button className={`view-btn ${side === 'back' ? 'active' : ''}`} onClick={() => flip('back')}>
          Rückseite
        </button>
      </div>

      {/* 3D Scene */}
      <div
        className="garment-scene"
        style={{ background: bgColor }}
        ref={sceneRef}
        onPointerDown={handleScenePointerDown}
        onPointerMove={handleScenePointerMove}
        onPointerUp={handleScenePointerUp}
      >
        <div
          className="garment-cube"
          style={{ transform: `rotateY(${rotateAngle}deg)` }}
        >
          {/* Front face */}
          <div className="garment-face garment-face-front">
            <div className="garment-svg-wrap">
              <FrontSVG color={colorHex} />
              <PrintCanvas
                product={product}
                side="front"
                elements={elements}
                selectedId={side === 'front' ? selectedId : null}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            </div>
          </div>

          {/* Back face */}
          <div className="garment-face garment-face-back">
            <div className="garment-svg-wrap">
              <BackSVG color={colorHex} />
              <PrintCanvas
                product={product}
                side="back"
                elements={elements}
                selectedId={side === 'back' ? selectedId : null}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        </div>

        <div className="garment-hint">Ziehen zum Drehen</div>
      </div>
    </div>
  )
}
