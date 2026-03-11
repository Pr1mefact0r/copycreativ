import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATHS = {
  tshirt: '/models/tshirt_with_etecet.glb',
  hoodie: '/models/hoodie.glb',
}

useGLTF.preload(MODEL_PATHS.tshirt)
useGLTF.preload(MODEL_PATHS.hoodie)

// Exact overlay plane configs per model (measured from bbox analysis)
const PLANE_CONFIG = {
  tshirt: {
    // bbox after scale+center: X[-1.1,1.1] Y[-1.085,1.085] Z[-0.446,0.446]
    front:      { pos: [0, 0.05, 0.45],   size: [0.95, 1.05] },
    back:       { pos: [0, 0.05, -0.45],   size: [0.95, 1.05], rotY: Math.PI },
    leftSleeve: { pos: [-1.1, 0.35, 0],   size: [0.5, 0.4],  rotY: -Math.PI / 2 },
    rightSleeve:{ pos: [1.1, 0.35, 0],    size: [0.5, 0.4],  rotY: Math.PI / 2 },
  },
  hoodie: {
    // bbox after scale+center: X[-1.1,1.1] Y[-0.896,0.896] Z[-0.283,0.283]
    front:      { pos: [0, 0.0, 0.29],    size: [0.85, 0.85] },
    back:       { pos: [0, 0.0, -0.29],    size: [0.85, 0.85], rotY: Math.PI },
    leftSleeve: { pos: [-1.1, 0.15, 0],   size: [0.35, 0.35], rotY: -Math.PI / 2 },
    rightSleeve:{ pos: [1.1, 0.15, 0],    size: [0.35, 0.35], rotY: Math.PI / 2 },
    hood:       { pos: [0, 0.9, -0.1],    size: [0.55, 0.35], rotX: -Math.PI / 2.5 },
  },
}

// Transparent canvas — only design elements, no background
function useDesignTexture(elements, side, textDefault) {
  const canvasRef = useRef(document.createElement('canvas'))
  const textureRef = useRef(null)
  const { invalidate } = useThree()

  if (!textureRef.current) {
    const c = canvasRef.current
    c.width = 1024
    c.height = 1024
    textureRef.current = new THREE.CanvasTexture(c)
    textureRef.current.colorSpace = THREE.SRGBColorSpace
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1024, 1024)

    const sideEls = elements.filter(el => el.side === side)

    sideEls.filter(el => el.type === 'text').forEach(el => {
      const x = (el.x / 100) * 1024
      const y = (el.y / 100) * 1024
      ctx.save()
      ctx.font = `bold ${el.fontSize * 3}px ${el.fontFamily || 'sans-serif'}`
      ctx.fillStyle = el.color || textDefault
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 4
      ctx.fillText(el.content, x, y)
      if (el.line2) ctx.fillText(el.line2, x, y + el.fontSize * 3.5)
      ctx.restore()
    })

    textureRef.current.needsUpdate = true
    invalidate()

    const imageEls = sideEls.filter(el => el.type === 'image')
    if (imageEls.length > 0) {
      Promise.all(imageEls.map(el =>
        new Promise(resolve => {
          const img = new Image()
          img.onload = () => {
            const w = (el.width / 100) * 1024
            const h = w * (img.height / img.width)
            ctx.drawImage(img, (el.x / 100) * 1024 - w / 2, (el.y / 100) * 1024 - h / 2, w, h)
            resolve()
          }
          img.onerror = resolve
          img.src = el.content
        })
      )).then(() => {
        textureRef.current.needsUpdate = true
        invalidate()
      })
    }
  }, [elements, side, textDefault, invalidate])

  return textureRef.current
}

// A single design overlay plane
function DesignPlane({ config, texture }) {
  if (!config) return null
  const { pos, size, rotY = 0, rotX = 0 } = config

  return (
    <mesh position={pos} rotation={[rotX, rotY, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  )
}

function GarmentMesh({ modelPath, product, colorHex, textures }) {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef()

  const model = useMemo(() => {
    const m = scene.clone(true)

    m.traverse(child => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.roughness = 0.7
        child.material.metalness = 0.0
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Scale to 2.2 units
    const box = new THREE.Box3().setFromObject(m)
    const size = box.getSize(new THREE.Vector3())
    m.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z))

    // Center
    const sb = new THREE.Box3().setFromObject(m)
    m.position.sub(sb.getCenter(new THREE.Vector3()))

    return m
  }, [scene])

  // Garment color on all materials
  useEffect(() => {
    const color = new THREE.Color(colorHex)
    model.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.color.copy(color)
        child.material.map = null
        child.material.needsUpdate = true
      }
    })
  }, [colorHex, model])

  useFrame(state => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
    }
  })

  const cfg = PLANE_CONFIG[product] || PLANE_CONFIG.tshirt

  return (
    <group ref={groupRef}>
      <primitive object={model} />
      <DesignPlane config={cfg.front} texture={textures.front} />
      <DesignPlane config={cfg.back} texture={textures.back} />
      <DesignPlane config={cfg.leftSleeve} texture={textures.leftSleeve} />
      <DesignPlane config={cfg.rightSleeve} texture={textures.rightSleeve} />
      {product === 'hoodie' && <DesignPlane config={cfg.hood} texture={textures.hood} />}
    </group>
  )
}

function Garment({ product, colorHex, elements, textDefault }) {
  const modelPath = MODEL_PATHS[product] || MODEL_PATHS.tshirt

  const textures = {
    front: useDesignTexture(elements, 'front', textDefault),
    back: useDesignTexture(elements, 'back', textDefault),
    leftSleeve: useDesignTexture(elements, 'left-sleeve', textDefault),
    rightSleeve: useDesignTexture(elements, 'right-sleeve', textDefault),
    hood: useDesignTexture(elements, 'hood', textDefault),
  }

  return (
    <GarmentMesh
      key={product}
      modelPath={modelPath}
      product={product}
      colorHex={colorHex}
      textures={textures}
    />
  )
}

export default function GarmentModel({ product, colorHex, elements, textDefault }) {
  return (
    <div className="garment-3d-container">
      <Canvas
        camera={{ position: [0, 0.1, 3.2], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <hemisphereLight args={['#ffffff', '#b0b0b0', 0.8]} />
        <directionalLight position={[3, 4, 5]} intensity={1.0} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={0.5} />
        <pointLight position={[0, -2, 3]} intensity={0.3} />

        <Garment
          product={product}
          colorHex={colorHex}
          elements={elements}
          textDefault={textDefault}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>
      <div className="garment-3d-hint">Ziehen zum Drehen &bull; Scrollen zum Zoomen</div>
      <div className="garment-3d-credits">
        3D: &quot;Hoodie&quot; by vsese, &quot;Tshirt&quot; by am_render (Sketchfab, CC BY 4.0)
      </div>
    </div>
  )
}
