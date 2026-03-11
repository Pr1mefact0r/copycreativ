import { useState, useRef, useCallback, useMemo } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import { TShirtFront, TShirtBack, HoodieFront, HoodieBack } from '../components/konfigurator/GarmentSVG'
import PrintCanvas from '../components/konfigurator/PrintCanvas'

const PRODUCTS = [
  { id: 'tshirt', label: 'T-Shirt', basePrice: 19.90 },
  { id: 'hoodie', label: 'Pullover / Hoodie', basePrice: 34.90 },
]

const COLORS = [
  { id: 'white', label: 'Weiss', hex: '#ffffff', textDefault: '#222222' },
  { id: 'black', label: 'Schwarz', hex: '#1a1a1a', textDefault: '#ffffff' },
  { id: 'navy', label: 'Navy', hex: '#1b2a4a', textDefault: '#ffffff' },
  { id: 'grey', label: 'Grau', hex: '#6b7280', textDefault: '#ffffff' },
  { id: 'red', label: 'Rot', hex: '#dc2626', textDefault: '#ffffff' },
  { id: 'green', label: 'Forest', hex: '#166534', textDefault: '#ffffff' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const FONTS = [
  { id: 'sans', label: 'Modern', family: "'Work Sans', sans-serif" },
  { id: 'serif', label: 'Klassisch', family: "Georgia, serif" },
  { id: 'mono', label: 'Mono', family: "'Courier New', monospace" },
  { id: 'cursive', label: 'Script', family: "'Segoe Script', 'Comic Sans MS', cursive" },
  { id: 'impact', label: 'Impact', family: "'Impact', 'Arial Black', sans-serif" },
]

const TEXT_COLORS = [
  { id: 'auto', label: 'Auto', hex: null },
  { id: 'white', label: 'Weiss', hex: '#ffffff' },
  { id: 'black', label: 'Schwarz', hex: '#1a1a1a' },
  { id: 'gold', label: 'Gold', hex: '#d4af37' },
  { id: 'red', label: 'Rot', hex: '#dc2626' },
  { id: 'teal', label: 'Teal', hex: '#3d8080' },
]

// Pricing per print
const PRINT_PRICES = {
  text: { small: 3.00, medium: 5.00, large: 8.00 },
  image: { small: 8.00, medium: 12.00, large: 18.00 },
}

function getPrintSize(el) {
  if (el.type === 'text') {
    if (el.fontSize <= 18) return 'small'
    if (el.fontSize <= 32) return 'medium'
    return 'large'
  }
  if (el.type === 'image') {
    if ((el.width || 25) <= 25) return 'small'
    if ((el.width || 25) <= 45) return 'medium'
    return 'large'
  }
  return 'small'
}

function getPrintPrice(el) {
  const size = getPrintSize(el)
  return PRINT_PRICES[el.type]?.[size] || 0
}

function getSizeLabel(s) {
  return { small: 'Klein', medium: 'Mittel', large: 'Gross' }[s] || s
}

const SIDE_LABELS = { front: 'Vorderseite', back: 'Rückseite', 'left-sleeve': 'L. Ärmel', 'right-sleeve': 'R. Ärmel', hood: 'Kapuze' }

let nextId = 1

export default function Konfigurator() {
  const [product, setProduct] = useState('tshirt')
  const [color, setColor] = useState('white')
  const [size, setSize] = useState('M')
  const [side, setSide] = useState('front')

  const [textInput, setTextInput] = useState('')
  const [textLine2, setTextLine2] = useState('')
  const [font, setFont] = useState('sans')
  const [textColor, setTextColor] = useState('auto')
  const [textSize, setTextSize] = useState(24)

  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const fileRef = useRef()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentColor = COLORS.find(c => c.id === color)
  const currentFont = FONTS.find(f => f.id === font)
  const currentProduct = PRODUCTS.find(p => p.id === product)

  const resolvedTextColor = textColor === 'auto'
    ? currentColor.textDefault
    : TEXT_COLORS.find(c => c.id === textColor)?.hex || currentColor.textDefault

  // Pricing
  const printTotal = useMemo(() =>
    elements.reduce((sum, el) => sum + getPrintPrice(el), 0),
    [elements]
  )
  const unitPrice = currentProduct.basePrice + printTotal
  const totalPrice = (unitPrice * quantity).toFixed(2)

  const addText = () => {
    if (!textInput.trim()) return
    const el = {
      id: `el-${nextId++}`,
      type: 'text',
      side,
      x: 50, y: 50,
      content: textInput,
      line2: textLine2 || null,
      fontFamily: currentFont.family,
      fontSize: textSize,
      color: resolvedTextColor,
    }
    setElements(prev => [...prev, el])
    setSelectedId(el.id)
    setTextInput('')
    setTextLine2('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const el = {
        id: `el-${nextId++}`,
        type: 'image',
        side,
        x: 50, y: 50,
        width: 35, height: 35,
        content: ev.target.result,
        fileName: file.name,
      }
      setElements(prev => [...prev, el])
      setSelectedId(el.id)
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const updateElement = useCallback((id, updates) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el))
  }, [])

  const deleteSelected = () => {
    if (!selectedId) return
    setElements(prev => prev.filter(el => el.id !== selectedId))
    setSelectedId(null)
  }

  const updateSelectedStyle = (updates) => {
    if (!selectedId) return
    updateElement(selectedId, updates)
  }

  const selectedElement = elements.find(el => el.id === selectedId)
  const bgColor = currentColor.hex === '#ffffff' ? '#e8e8e8' : '#2a2a2a'
  const FrontSVG = product === 'hoodie' ? HoodieFront : TShirtFront
  const BackSVG = product === 'hoodie' ? HoodieBack : TShirtBack

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-label">Textildruck</span>
          <h1 className="page-hero-title">T-Shirt & Hoodie<br />Konfigurator</h1>
          <p className="page-hero-subtitle">Gestalten Sie Ihr individuelles Textil – platzieren Sie Designs frei per Drag & Drop.</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="konfig-layout">
            {/* LEFT: Preview */}
            <div className="konfig-preview">
                <ScrollReveal>
                  <div className="editor-2d">
                    {/* Side toggle */}
                    <div className="view-toggle">
                      <button className={`view-btn ${side === 'front' ? 'active' : ''}`} onClick={() => setSide('front')}>Vorne</button>
                      <button className={`view-btn ${side === 'back' ? 'active' : ''}`} onClick={() => setSide('back')}>Hinten</button>
                      <button className={`view-btn ${side === 'left-sleeve' ? 'active' : ''}`} onClick={() => setSide('left-sleeve')}>L. Ärmel</button>
                      <button className={`view-btn ${side === 'right-sleeve' ? 'active' : ''}`} onClick={() => setSide('right-sleeve')}>R. Ärmel</button>
                      {product === 'hoodie' && (
                        <button className={`view-btn ${side === 'hood' ? 'active' : ''}`} onClick={() => setSide('hood')}>Kapuze</button>
                      )}
                    </div>
                    {/* 2D garment with print canvas */}
                    <div className="editor-2d-scene" style={{ background: bgColor }}>
                      <div className="editor-2d-garment">
                        {side === 'front' && <FrontSVG color={currentColor.hex} />}
                        {side === 'back' && <BackSVG color={currentColor.hex} />}
                        {(side === 'left-sleeve' || side === 'right-sleeve') && (
                          <div className={`sleeve-editor-area ${product === 'hoodie' ? 'sleeve-long' : ''}`} style={{ background: currentColor.hex, border: currentColor.hex === '#ffffff' ? '2px solid rgba(0,0,0,0.1)' : 'none' }}>
                            <span className="sleeve-editor-label">{SIDE_LABELS[side]}</span>
                            <span className="sleeve-orient sleeve-orient-top">Schulter ↑</span>
                            <span className="sleeve-orient sleeve-orient-bottom">↓ Bündchen</span>
                            <span className="sleeve-orient sleeve-orient-left">{side === 'left-sleeve' ? 'Vorne' : 'Hinten'}</span>
                            <span className="sleeve-orient sleeve-orient-right">{side === 'left-sleeve' ? 'Hinten' : 'Vorne'}</span>
                          </div>
                        )}
                        {side === 'hood' && (
                          <div className="sleeve-editor-area" style={{ background: currentColor.hex, border: currentColor.hex === '#ffffff' ? '2px solid rgba(0,0,0,0.1)' : 'none' }}>
                            <span className="sleeve-editor-label">{SIDE_LABELS[side]}</span>
                            <span className="sleeve-orient sleeve-orient-top">Oben ↑</span>
                            <span className="sleeve-orient sleeve-orient-bottom">↓ Nacken</span>
                          </div>
                        )}
                        <PrintCanvas
                          elements={elements}
                          selectedId={selectedId}
                          onSelect={setSelectedId}
                          onUpdate={updateElement}
                          side={side}
                        />
                      </div>
                      <div className="editor-2d-label">{
                        { front: 'Vorderseite', back: 'Rückseite', 'left-sleeve': 'Linker Ärmel', 'right-sleeve': 'Rechter Ärmel' }[side]
                      } – Elemente frei verschieben</div>
                    </div>
                  </div>
                </ScrollReveal>

              {/* Element list */}
              {elements.length > 0 && (
                <div className="element-list">
                  <h4>Platzierte Elemente ({elements.length})</h4>
                  {elements.map(el => (
                    <div
                      key={el.id}
                      className={`element-list-item ${selectedId === el.id ? 'active' : ''}`}
                      onClick={() => { setSelectedId(el.id); setSide(el.side) }}
                    >
                      <span className="element-list-type">{el.type === 'text' ? '✏️' : '🖼️'}</span>
                      <span className="element-list-name">
                        {el.type === 'text' ? el.content : el.fileName}
                      </span>
                      <span className="element-list-meta">
                        {getSizeLabel(getPrintSize(el))} &bull; CHF {getPrintPrice(el).toFixed(2)}
                      </span>
                      <span className="element-list-side">{{ front: 'V', back: 'H', 'left-sleeve': 'LA', 'right-sleeve': 'RA', hood: 'K' }[el.side]}</span>
                      <button
                        className="element-list-delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          setElements(prev => prev.filter(x => x.id !== el.id))
                          if (selectedId === el.id) setSelectedId(null)
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Controls */}
            <div className="konfig-controls">
              {/* Step 1: Product */}
              <ScrollReveal delay={50}>
                <div className="konfig-step">
                  <div className="konfig-step-header">
                    <span className="konfig-step-num">1</span>
                    <h3>Produkt & Farbe</h3>
                  </div>
                  <div className="konfig-options">
                    {PRODUCTS.map(p => (
                      <button key={p.id} className={`konfig-option-btn ${product === p.id ? 'active' : ''}`} onClick={() => setProduct(p.id)}>
                        <span>{p.label}</span>
                        <span className="konfig-option-price">ab CHF {p.basePrice.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="konfig-color-grid" style={{ marginTop: '1rem' }}>
                    {COLORS.map(c => (
                      <button key={c.id} className={`konfig-color-btn ${color === c.id ? 'active' : ''}`} onClick={() => setColor(c.id)} title={c.label}>
                        <span className="konfig-color-swatch" style={{ background: c.hex, border: c.hex === '#ffffff' ? '2px solid rgba(0,0,0,0.15)' : '2px solid transparent' }} />
                        <span className="konfig-color-label">{c.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="konfig-size-grid" style={{ marginTop: '1rem' }}>
                    {SIZES.map(s => (
                      <button key={s} className={`konfig-size-btn ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 2: Add Text */}
              <ScrollReveal delay={100}>
                <div className="konfig-step">
                  <div className="konfig-step-header">
                    <span className="konfig-step-num">2</span>
                    <h3>Text hinzufügen</h3>
                  </div>
                  <div className="konfig-price-info">
                    <span>Klein (&lt;18px): CHF 3.00</span>
                    <span>Mittel: CHF 5.00</span>
                    <span>Gross (&gt;32px): CHF 8.00</span>
                  </div>
                  <div className="konfig-text-inputs">
                    <input type="text" placeholder="Zeile 1 (z.B. Firmenname)" value={textInput} onChange={e => setTextInput(e.target.value)} maxLength={30} />
                    <input type="text" placeholder="Zeile 2 (optional)" value={textLine2} onChange={e => setTextLine2(e.target.value)} maxLength={30} />
                  </div>
                  <div className="konfig-text-options">
                    <div className="konfig-option-group">
                      <label>Schriftart</label>
                      <div className="konfig-font-grid">
                        {FONTS.map(f => (
                          <button key={f.id} className={`konfig-font-btn ${font === f.id ? 'active' : ''}`}
                            onClick={() => { setFont(f.id); if (selectedElement?.type === 'text') updateSelectedStyle({ fontFamily: f.family }) }}
                            style={{ fontFamily: f.family }}
                          >{f.label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="konfig-row-group">
                      <div className="konfig-option-group">
                        <label>Textfarbe</label>
                        <div className="konfig-textcolor-grid">
                          {TEXT_COLORS.map(c => (
                            <button key={c.id} className={`konfig-textcolor-btn ${textColor === c.id ? 'active' : ''}`}
                              onClick={() => { setTextColor(c.id); const nc = c.hex || currentColor.textDefault; if (selectedElement?.type === 'text') updateSelectedStyle({ color: nc }) }}
                              title={c.label}
                            >
                              {c.hex
                                ? <span style={{ background: c.hex, width: 20, height: 20, borderRadius: '50%', display: 'block', border: c.hex === '#ffffff' ? '2px solid rgba(0,0,0,0.15)' : '2px solid transparent' }} />
                                : <span className="konfig-auto-label">A</span>
                              }
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="konfig-option-group">
                        <label>Grösse: {textSize}px → {getSizeLabel(textSize <= 18 ? 'small' : textSize <= 32 ? 'medium' : 'large')}</label>
                        <input type="range" min="12" max="48" value={textSize}
                          onChange={e => { const v = Number(e.target.value); setTextSize(v); if (selectedElement?.type === 'text') updateSelectedStyle({ fontSize: v }) }}
                          className="konfig-slider" />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary konfig-add-btn" onClick={addText} disabled={!textInput.trim()}>
                    + Text auf {SIDE_LABELS[side]}
                  </button>
                </div>
              </ScrollReveal>

              {/* Step 3: Add Image */}
              <ScrollReveal delay={150}>
                <div className="konfig-step">
                  <div className="konfig-step-header">
                    <span className="konfig-step-num">3</span>
                    <h3>Bild / Logo hochladen</h3>
                  </div>
                  <div className="konfig-price-info">
                    <span>Klein (&lt;25%): CHF 8.00</span>
                    <span>Mittel: CHF 12.00</span>
                    <span>Gross (&gt;45%): CHF 18.00</span>
                  </div>
                  <label className="konfig-upload-label">
                    <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileRef} style={{ display: 'none' }} />
                    <span className="konfig-upload-icon">📁</span>
                    <span>+ Bild auf {SIDE_LABELS[side]} laden</span>
                    <span className="konfig-upload-hint">PNG, JPG oder SVG – Ecken ziehen zum Skalieren</span>
                  </label>
                </div>
              </ScrollReveal>

              {/* Selected element editor */}
              {selectedElement && (
                <div className="konfig-step konfig-step-selected">
                  <div className="konfig-step-header">
                    <span className="konfig-step-num">✎</span>
                    <h3>{selectedElement.type === 'text' ? `"${selectedElement.content}"` : selectedElement.fileName}</h3>
                  </div>
                  <div className="konfig-selected-info">
                    <span>Typ: {selectedElement.type === 'text' ? 'Text' : 'Bild'}</span>
                    <span>Grösse: {getSizeLabel(getPrintSize(selectedElement))}</span>
                    <span>Preis: CHF {getPrintPrice(selectedElement).toFixed(2)}</span>
                    <span>Seite: {SIDE_LABELS[selectedElement.side]}</span>
                  </div>
                  <p className="konfig-selected-hint">
                    Verschieben: Element in der Vorschau ziehen. Hilfslinien zeigen Mitte und Ausrichtung.
                  </p>

                  {/* Image size slider */}
                  {selectedElement.type === 'image' && (
                    <div className="konfig-option-group" style={{ marginBottom: '1rem' }}>
                      <label>Bildgrösse: {Math.round(selectedElement.width || 35)}% → {getSizeLabel(getPrintSize(selectedElement))}</label>
                      <input
                        type="range" min="10" max="80"
                        value={selectedElement.width || 35}
                        onChange={e => updateSelectedStyle({ width: Number(e.target.value) })}
                        className="konfig-slider"
                      />
                    </div>
                  )}

                  {/* Text size slider (when text is selected) */}
                  {selectedElement.type === 'text' && (
                    <div className="konfig-option-group" style={{ marginBottom: '1rem' }}>
                      <label>Textgrösse: {selectedElement.fontSize}px → {getSizeLabel(getPrintSize(selectedElement))}</label>
                      <input
                        type="range" min="12" max="48"
                        value={selectedElement.fontSize}
                        onChange={e => updateSelectedStyle({ fontSize: Number(e.target.value) })}
                        className="konfig-slider"
                      />
                    </div>
                  )}

                  <button className="btn-delete-element" onClick={deleteSelected}>Element löschen</button>
                </div>
              )}

              {/* Summary & Pricing */}
              <ScrollReveal delay={200}>
                <div className="konfig-step konfig-summary">
                  <div className="konfig-step-header">
                    <span className="konfig-step-num">✓</span>
                    <h3>Kalkulation</h3>
                  </div>
                  <div className="konfig-pricing-table">
                    <div className="pricing-row">
                      <span>{currentProduct.label} ({size}, {currentColor.label})</span>
                      <span>CHF {currentProduct.basePrice.toFixed(2)}</span>
                    </div>
                    {elements.map(el => (
                      <div className="pricing-row pricing-row-sub" key={el.id}>
                        <span>
                          {el.type === 'text' ? '✏️' : '🖼️'} {el.type === 'text' ? el.content : el.fileName}
                          <small> ({getSizeLabel(getPrintSize(el))}, {{ front: 'Vorne', back: 'Hinten', 'left-sleeve': 'L.Ärmel', 'right-sleeve': 'R.Ärmel', hood: 'Kapuze' }[el.side]})</small>
                        </span>
                        <span>CHF {getPrintPrice(el).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pricing-row pricing-row-unit">
                      <span>Stückpreis</span>
                      <span>CHF {unitPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="konfig-qty-price">
                    <div className="konfig-qty">
                      <label>Anzahl</label>
                      <div className="qty-selector">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                      </div>
                    </div>
                    <div className="konfig-total">
                      <span>Total</span>
                      <span className="konfig-total-price">CHF {totalPrice}</span>
                    </div>
                  </div>

                  {quantity >= 10 && <div className="konfig-discount-hint">Ab 10 Stück: Mengenrabatt auf Anfrage!</div>}
                  {quantity >= 50 && <div className="konfig-discount-hint" style={{ borderColor: 'rgba(61,128,128,0.3)', color: 'var(--primary-light)', background: 'rgba(61,128,128,0.08)' }}>Ab 50 Stück: Siebdruck möglich – günstiger bei grossen Mengen!</div>}

                  <div className="konfig-option-group">
                    <label>Weitere Wünsche / Anweisungen</label>
                    <textarea
                      className="konfig-notes"
                      placeholder="z.B. spezielle Farbanpassungen, Liefertermin, Veredelungswünsche, Fragen..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {submitted && <div className="form-success">Anfrage gesendet! Wir erstellen Ihnen gerne eine Offerte.</div>}
                  <button className="btn btn-primary konfig-submit" onClick={handleSubmit}>Unverbindlich anfragen →</button>
                  <p className="konfig-hint">Wir erstellen Ihnen innert 24h eine individuelle Offerte.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
