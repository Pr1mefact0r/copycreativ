// Front T-Shirt
export function TShirtFront({ color }) {
  return (
    <svg viewBox="0 0 400 450" className="product-svg">
      <path
        d="M120,20 L100,20 Q60,20 40,60 L10,130 L60,160 L80,100 L80,430 L320,430 L320,100 L340,160 L390,130 L360,60 Q340,20 300,20 L280,20 Q270,40 240,50 L200,55 L160,50 Q130,40 120,20 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      <path
        d="M120,20 Q140,45 160,50 L200,55 L240,50 Q260,45 280,20 Q260,40 240,42 L200,45 L160,42 Q140,40 120,20 Z"
        fill="rgba(0,0,0,0.08)"
      />
    </svg>
  )
}

// Back T-Shirt
export function TShirtBack({ color }) {
  return (
    <svg viewBox="0 0 400 450" className="product-svg">
      <path
        d="M120,20 L100,20 Q60,20 40,60 L10,130 L60,160 L80,100 L80,430 L320,430 L320,100 L340,160 L390,130 L360,60 Q340,20 300,20 L280,20 Q265,30 240,35 L200,38 L160,35 Q135,30 120,20 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      {/* Back collar line */}
      <path d="M120,20 Q155,32 200,38 Q245,32 280,20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" />
      {/* Back seam */}
      <line x1="200" y1="38" x2="200" y2="430" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
    </svg>
  )
}

// Front Hoodie
export function HoodieFront({ color }) {
  return (
    <svg viewBox="0 0 400 470" className="product-svg">
      <path
        d="M110,60 L90,60 Q50,60 30,100 L0,170 L55,200 L75,135 L75,450 L325,450 L325,135 L345,200 L400,170 L370,100 Q350,60 310,60 L290,60 Q275,80 250,90 L200,95 L150,90 Q125,80 110,60 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      <path
        d="M110,60 Q100,10 140,0 L200,-5 L260,0 Q300,10 290,60 Q275,80 250,90 L200,95 L150,90 Q125,80 110,60 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      <path
        d="M110,60 Q115,30 150,20 L200,15 L250,20 Q285,30 290,60 Q275,80 250,90 L200,95 L150,90 Q125,80 110,60 Z"
        fill="rgba(0,0,0,0.05)"
      />
      <path
        d="M130,310 Q130,290 150,290 L250,290 Q270,290 270,310 L270,370 Q270,390 250,390 L150,390 Q130,390 130,370 Z"
        fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.08)" strokeWidth="1"
      />
      <line x1="185" y1="95" x2="180" y2="180" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      <line x1="215" y1="95" x2="220" y2="180" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
    </svg>
  )
}

// Back Hoodie
export function HoodieBack({ color }) {
  return (
    <svg viewBox="0 0 400 470" className="product-svg">
      <path
        d="M110,60 L90,60 Q50,60 30,100 L0,170 L55,200 L75,135 L75,450 L325,450 L325,135 L345,200 L400,170 L370,100 Q350,60 310,60 L290,60 Q275,80 250,90 L200,95 L150,90 Q125,80 110,60 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      <path
        d="M110,60 Q100,10 140,0 L200,-5 L260,0 Q300,10 290,60 Q275,80 250,90 L200,95 L150,90 Q125,80 110,60 Z"
        fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2"
      />
      <path
        d="M115,55 Q110,15 145,5 L200,0 L255,5 Q290,15 285,55"
        fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2"
      />
      <line x1="200" y1="95" x2="200" y2="450" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
    </svg>
  )
}
