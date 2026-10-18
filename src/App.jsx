import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls, Text } from '@react-three/drei'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

const collections = [
  'SIGNATURE',
  'GRAPHIC',
  'WASHED',
  'LIMITED',
]

const productColors = [
  { name: 'Black', value: '#23262a' },
  { name: 'White', value: '#e9e6df' },
  { name: 'Charcoal', value: '#55585d' },
  { name: 'Washed Black', value: '#343632' },
  { name: 'Beige', value: '#b9aa94' },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL']
const copyrightYear = new Date().getFullYear()

const products = [
  { id: 'signature-01', name: 'SIGNATURE 01', collection: 'SIGNATURE', colors: ['Black', 'White', 'Charcoal'], sizes, fit: 'Oversized', visual: 'signature' },
  { id: 'signature-02', name: 'SIGNATURE 02', collection: 'SIGNATURE', colors: ['Black', 'Beige'], sizes, fit: 'Relaxed oversized', visual: 'signature' },
  { id: 'graphic-01', name: 'GRAPHIC 01', collection: 'GRAPHIC', colors: ['White', 'Black', 'Charcoal'], sizes, fit: 'Oversized', visual: 'graphic' },
  { id: 'graphic-02', name: 'GRAPHIC 02', collection: 'GRAPHIC', colors: ['Black', 'Beige'], sizes, fit: 'Oversized', visual: 'graphic' },
  { id: 'washed-01', name: 'WASHED 01', collection: 'WASHED', colors: ['Washed Black', 'Charcoal'], sizes, fit: 'Relaxed oversized', visual: 'washed' },
  { id: 'washed-02', name: 'WASHED 02', collection: 'WASHED', colors: ['Washed Black', 'Beige'], sizes, fit: 'Oversized', visual: 'washed' },
  { id: 'limited-01', name: 'LIMITED 01', collection: 'LIMITED', colors: ['Black', 'Beige'], sizes, fit: 'Oversized', visual: 'limited' },
  { id: 'limited-02', name: 'LIMITED 02', collection: 'LIMITED', colors: ['Charcoal', 'White'], sizes, fit: 'Relaxed oversized', visual: 'limited' },
]

const fabricBumpMap = (() => {
  const width = 128
  const height = 128
  const data = new Uint8Array(width * height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const weave = Math.sin(x * 0.82 + Math.sin(y * 0.13)) * 7
      const grain = Math.sin(y * 1.37 + x * 0.09) * 5
      const fleck = Math.sin(x * 12.7 + y * 4.3) * 3
      data[y * width + x] = 128 + weave + grain + fleck
    }
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RedFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 7)
  texture.needsUpdate = true
  return texture
})()

function readRoute() {
  const [, route = ''] = window.location.hash.split('#')
  const [type, value] = route.split('/')
  if (type === 'product' && products.some((product) => product.id === value)) {
    return { type: 'product', value }
  }
  if (type === 'collection' && collections.includes(value?.toUpperCase())) {
    return { type: 'collection', value: value.toUpperCase() }
  }
  return { type: 'collection', value: null }
}

const studioDetails = [
  { number: '01', title: 'Shape', kind: 'shape' },
  { number: '02', title: 'Neck rib', kind: 'neck' },
  { number: '03', title: 'Stitching', kind: 'stitch' },
  { number: '04', title: 'Hems', kind: 'hem' },
  { number: '05', title: 'Print', kind: 'print' },
  { number: '06', title: 'Material', kind: 'material' },
]

function StudioDetailArt({ kind, title }) {
  const id = useId().replaceAll(':', '')

  return (
    <svg className={`studio-tile-art studio-tile-art--${kind}`} viewBox="0 0 180 150" role="img" aria-label={`${title} garment detail illustration`}>
      <defs>
        <linearGradient id={`studio-cloth-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#36383a" />
          <stop offset=".6" stopColor="#1b1d1f" />
          <stop offset="1" stopColor="#0c0d0f" />
        </linearGradient>
        <filter id={`studio-grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="5" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 .16" /></feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
      </defs>
      <rect width="180" height="150" fill="#111315" />
      {kind === 'shape' ? (
        <>
          <path d="M68 24 45 34 28 68l18 8 9-13v55q35 10 70 0V63l9 13 18-8-17-34-23-10c-4 13-11 19-22 19s-18-6-22-19Z" fill={`url(#studio-cloth-${id})`} stroke="#737579" strokeWidth="1.2" />
          <path d="M28 68 46 76l9-13m70 0 9 13 18-8" fill="none" stroke="#c5b9a8" strokeWidth="1" />
          <path d="M68 24c4 11 11 17 22 17s18-6 22-17" fill="none" stroke="#a7a39a" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect width="180" height="150" fill={`url(#studio-cloth-${id})`} filter={`url(#studio-grain-${id})`} />
          <path d="M-15 54q80-34 210 4M-12 66q85-34 207 4M-8 125q80-28 204 1" fill="none" stroke="#77797a" strokeWidth=".8" opacity=".18" />
        </>
      )}
      {kind === 'neck' && (
        <>
          <path d="M-20-44h220v94Q90 142-20 50Z" fill="#090a0b" stroke="#77797a" strokeWidth="11" />
          <path d="M-10-31h200v78Q90 126-10 47Z" fill="none" stroke="#343638" strokeWidth="3" />
          <path d="M-8 50Q90 129 188 50" fill="none" stroke="#c2bbae" strokeWidth="1.3" strokeDasharray="2 4" opacity=".7" />
          <text x="90" y="82" textAnchor="middle" fill="#d8d1c7" fontFamily="Inter, sans-serif" fontSize="7" letterSpacing="2">WTF</text>
        </>
      )}
      {kind === 'stitch' && (
        <>
          <path d="M-10 18 188 112m-198-82 198 94" fill="none" stroke="#515456" strokeWidth="12" />
          <path d="M-10 18 188 112m-198-82 198 94" fill="none" stroke="#ccc5b8" strokeDasharray="2 4" strokeWidth="1.4" />
        </>
      )}
      {kind === 'hem' && (
        <>
          <path d="M-10 66q100-20 200 0v96H-10Z" fill="#16181a" stroke="#292b2d" strokeWidth="2" />
          <path d="M-10 82q100-20 200 0M-10 91q100-20 200 0" fill="none" stroke="#85817a" strokeWidth="1.4" />
          <path d="M-10 87q100-20 200 0" fill="none" stroke="#d0c9bd" strokeDasharray="2 5" strokeWidth="1.2" />
        </>
      )}
      {kind === 'print' && (
        <>
          <path d="M-15 24q95 20 210-4M-15 132q95-20 210 4" fill="none" stroke="#77797a" strokeWidth="1" opacity=".35" />
          <text x="90" y="82" textAnchor="middle" fill="#d8d1c7" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="3">WTF</text>
        </>
      )}
      {kind === 'material' && (
        <g fill="none" stroke="#c5b9a8" opacity=".54">
          <path d="M0 28 180 98M0 42l180 70M0 56l180 70M0 70l180 70M0 84l168 66" strokeWidth=".8" />
          <path d="m28 0 68 150M48 0l68 150M68 0l68 150M88 0l68 150M108 0l68 150" strokeWidth=".8" />
        </g>
      )}
    </svg>
  )
}

function GarmentMacroArt({ variant }) {
  const id = useId().replaceAll(':', '')
  const isNeck = variant === 'neck'

  return (
    <svg
      className={`garment-macro-art garment-macro-art--${variant}`}
      viewBox="0 0 900 380"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={isNeck ? 'Close-up illustration of ribbed T-shirt neckline and WTF mark' : 'Close-up illustration of the by WTFBY ABHI garment signature and hem'}
    >
      <defs>
        <linearGradient id={`macro-base-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#343638" />
          <stop offset=".48" stopColor="#151719" />
          <stop offset="1" stopColor="#292b2d" />
        </linearGradient>
        <linearGradient id={`macro-rib-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090a0b" />
          <stop offset=".45" stopColor="#282a2c" />
          <stop offset="1" stopColor="#08090a" />
        </linearGradient>
        <filter id={`macro-grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed={isNeck ? '7' : '11'} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 .14" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
        <filter id={`macro-shadow-${id}`} x="-20%" y="-20%" width="140%" height="150%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="900" height="380" fill="#0d0e10" />
      <path d="M0 0h900v380H0z" fill={`url(#macro-base-${id})`} filter={`url(#macro-grain-${id})`} />
      {isNeck ? (
        <>
          <ellipse cx="450" cy="52" rx="590" ry="290" fill="#050607" opacity=".7" filter={`url(#macro-shadow-${id})`} />
          <path d="M-80-150h1060v270c-160 104-310 158-530 158S80 224-80 120Z" fill={`url(#macro-rib-${id})`} stroke="#55585a" strokeWidth="3" />
          <path d="M-34-110h968v205c-150 88-283 131-484 131S116 183-34 95Z" fill="none" stroke="#777a7c" strokeWidth="2" />
          <path d="M-14-94h928v184c-145 80-271 119-464 119S131 170-14 90Z" fill="none" stroke="#a5a29b" strokeWidth="1.5" strokeDasharray="2 8" opacity=".65" />
          <path d="M46-67h808v130c-128 68-239 101-404 101S174 131 46 63Z" fill="#050607" stroke="#17191b" strokeWidth="10" />
          <path d="M46-67h808v130c-128 68-239 101-404 101S174 131 46 63Z" fill="none" stroke="#35383a" strokeWidth="2" />
          <text x="450" y="133" textAnchor="middle" fill="#d8d3ca" fontFamily="Inter, sans-serif" fontSize="43" fontWeight="500" letterSpacing="11">WTF</text>
          <text x="852" y="344" textAnchor="end" fill="#bcb7ad" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="4">02 / NECK RIB</text>
        </>
      ) : (
        <>
          <path d="M-40 0h980v282c-226-19-490-18-940 42Z" fill="#17191b" opacity=".42" />
          <path d="M-20 262c265-47 562-55 960-16v160H-20Z" fill="#111315" stroke="#505254" strokeWidth="2" />
          <path d="M-20 279c275-47 576-50 960-12" fill="none" stroke="#a09b91" strokeWidth="2" />
          <path d="M-20 289c275-47 576-50 960-12" fill="none" stroke="#d0c9bd" strokeWidth="1.5" strokeDasharray="2 9" opacity=".72" />
          <path d="M-20 306c280-44 580-47 960-9" fill="none" stroke="#070809" strokeWidth="5" opacity=".7" />
          <text x="630" y="163" fill="#d8d3ca" fontFamily="Inter, sans-serif" fontSize="30" letterSpacing="1.4">by WTFBY</text>
          <text x="632" y="207" fill="#d8d3ca" fontFamily="Inter, sans-serif" fontSize="25" letterSpacing="4">ABHI</text>
          <text x="852" y="344" textAnchor="end" fill="#bcb7ad" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="4">03 / SIGNATURE</text>
        </>
      )}
    </svg>
  )
}

function ScrollReveal({ children, className = '' }) {
  const revealRef = useRef(null)
  const [isVisible, setIsVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const target = revealRef.current
    if (!target) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.18 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      className={`${className}${isVisible ? ' is-visible' : ''}`}
      ref={revealRef}
    >
      {children}
    </article>
  )
}

function FabricLine({ points, color = '#34373a', radius = 0.018 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    )
    return new THREE.TubeGeometry(curve, 32, radius, 5, false)
  }, [points, radius])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  )
}

function StitchLine({ points, color }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    )
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(120))
  }, [points])

  return (
    <line geometry={geometry} onUpdate={(line) => line.computeLineDistances()}>
      <lineDashedMaterial
        color={color}
        dashSize={0.035}
        gapSize={0.035}
        opacity={0.48}
        transparent
        depthWrite={false}
      />
    </line>
  )
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  return reducedMotion
}

function FabricSurface({ color, back = false }) {
  const geometry = useMemo(() => {
    const columns = 44
    const rows = 84
    const bottom = -2.53
    const top = 2.7
    const positions = []
    const colors = []
    const uvs = []
    const indices = []

    for (let row = 0; row <= rows; row += 1) {
      const y = bottom + ((top - bottom) * row) / rows
      const halfWidth = Math.max(0.64, 1.49 - Math.max(0, y - 1.12) * 0.52)
      for (let column = 0; column <= columns; column += 1) {
        const normalizedX = (column / columns) * 2 - 1
        const x = normalizedX * halfWidth
        const bodyFade = THREE.MathUtils.clamp(
          Math.min((y - bottom) / 0.42, (top - y) / 0.56, 1),
          0,
          1,
        )
        const edgeFade = Math.min(
          1,
          (top - y) * 2.5,
          (y - bottom) * 2.5,
          (halfWidth - Math.abs(x)) * 5,
        )
        const ridges = [-0.58, 0.12, 0.61].reduce((sum, center, index) => {
          const wanderingCenter = center + Math.sin(y * 1.05 + index) * 0.035
          const distance = (normalizedX - wanderingCenter) / 0.105
          return sum + Math.sin(y * 2.8 + index * 1.8) * Math.exp(-distance * distance) * 0.052
        }, 0)
        const diagonalFold = Math.sin((normalizedX + y * 0.28) * 5.5) * 0.018
        const shoulderDrapeY = 1.12 + Math.abs(normalizedX) * 0.38
        const shoulderDrape = Math.sin((y - shoulderDrapeY) * 9)
          * Math.exp(-((y - shoulderDrapeY) ** 2) / 0.38) * 0.022
        const folds = edgeFade * bodyFade
          * THREE.MathUtils.clamp(ridges + diagonalFold + shoulderDrape, -0.085, 0.105)
        const chestDrape = Math.sin(y * 1.65 + normalizedX * 2.1) * 0.03
          * Math.exp(-((y - 0.55) ** 2) / 3.8)
        const clothDome = (back ? -1 : 1) * 0.16 * (1 - normalizedX * normalizedX) * bodyFade
        const fold = folds + chestDrape * bodyFade + clothDome
        const shade = THREE.MathUtils.clamp(0.97 + folds * 1.8 + clothDome * 0.24, 0.82, 1.04)
        positions.push(x, y, (back ? -0.035 : 0.405) + fold)
        colors.push(shade, shade, shade)
        uvs.push(column / columns, row / rows)
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const current = row * (columns + 1) + column
        const nextRow = current + columns + 1
        const centerNormalizedX = ((column + 0.5) / columns) * 2 - 1
        const centerY = bottom + ((top - bottom) * (row + 0.5)) / rows
        const collarOpening = back
          ? 0.62 * Math.sqrt(Math.max(0, (centerY - 2.48) / 0.22))
          : 0.62 * Math.sqrt(Math.max(0, (centerY - 2.16) / 0.57))
        const halfWidth = Math.max(0.64, 1.49 - Math.max(0, centerY - 1.12) * 0.52)
        if (centerY > 2.16 && Math.abs(centerNormalizedX * halfWidth) < collarOpening) continue
        indices.push(current, current + 1, nextRow, current + 1, nextRow + 1, nextRow)
      }
    }

    const surface = new THREE.BufferGeometry()
    surface.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    surface.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    surface.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    surface.setIndex(indices)
    surface.computeVertexNormals()
    return surface
  }, [back])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        roughness={0.88}
        clearcoat={0.04}
        bumpMap={fabricBumpMap}
        bumpScale={0.04}
        vertexColors
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function TShirtModel({ color = '#24272b', scale = 1, view = 'front' }) {
  const groupRef = useRef()
  const isBack = view === 'back'
  const reducedMotion = useReducedMotionPreference()
  const inkColor = useMemo(() => {
    const materialColor = new THREE.Color(color)
    return materialColor.getHSL({ h: 0, s: 0, l: 0 }).l > 0.55 ? '#353638' : '#d1cbc1'
  }, [color])
  const stitchColor = useMemo(() => {
    const materialColor = new THREE.Color(color)
    return materialColor.getHSL({ h: 0, s: 0, l: 0 }).l > 0.55 ? '#66615a' : '#aaa59b'
  }, [color])

  const torsoShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.49, -2.55)
    shape.quadraticCurveTo(0, -2.62, 1.49, -2.55)
    shape.lineTo(1.49, 1.12)
    shape.quadraticCurveTo(1.68, 1.29, 1.96, 1.42)
    shape.lineTo(2.3, 1.56)
    shape.quadraticCurveTo(2.55, 1.68, 2.64, 1.94)
    shape.lineTo(2.94, 2.64)
    shape.quadraticCurveTo(2.99, 2.79, 2.82, 2.86)
    shape.quadraticCurveTo(2.28, 3.12, 1.78, 3.3)
    shape.lineTo(0.62, 2.73)
    shape.quadraticCurveTo(0.5, 2.2, 0, 2.16)
    shape.quadraticCurveTo(-0.5, 2.2, -0.62, 2.73)
    shape.lineTo(-1.78, 3.3)
    shape.quadraticCurveTo(-2.28, 3.12, -2.82, 2.86)
    shape.quadraticCurveTo(-2.99, 2.79, -2.94, 2.64)
    shape.lineTo(-2.64, 1.94)
    shape.quadraticCurveTo(-2.55, 1.68, -2.3, 1.56)
    shape.lineTo(-1.96, 1.42)
    shape.quadraticCurveTo(-1.68, 1.29, -1.49, 1.12)
    shape.closePath()
    return shape
  }, [])

  const collarLine = useMemo(
    () => [
      [-0.68, 2.77, 0.41],
      [-0.57, 2.47, 0.43],
      [-0.31, 2.25, 0.44],
      [0, 2.17, 0.44],
      [0.31, 2.25, 0.44],
      [0.57, 2.47, 0.43],
      [0.68, 2.77, 0.41],
    ],
    [],
  )
  const backCollarLine = useMemo(
    () => [
      [-0.68, 2.77, -0.045],
      [-0.55, 2.66, -0.052],
      [-0.3, 2.59, -0.058],
      [0, 2.57, -0.06],
      [0.3, 2.59, -0.058],
      [0.55, 2.66, -0.052],
      [0.68, 2.77, -0.045],
    ],
    [],
  )
  const collarRibLines = useMemo(
    () =>
      [0.9, 1.08].map((factor) =>
        collarLine.map(([x, y]) => [x * factor, y + (1 - factor) * 0.45, 0.49]),
      ),
    [collarLine],
  )
  const backCollarRibLines = useMemo(
    () => [0.94, 1.04].map((factor) => backCollarLine.map(
      ([x, y, z]) => [x * factor, y + (1 - factor) * 0.5, z - 0.004],
    )),
    [backCollarLine],
  )
  const shoulderStitches = useMemo(
    () => [
      [[-1.7, 3.15, 0.49], [-1.34, 2.96, 0.49], [-1, 2.79, 0.49], [-0.68, 2.77, 0.49]],
      [[1.7, 3.15, 0.49], [1.34, 2.96, 0.49], [1, 2.79, 0.49], [0.68, 2.77, 0.49]],
    ],
    [],
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const ease = 1 - Math.exp(-delta * 6)
    const idleTurn = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.2) * 0.035
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (isBack ? Math.PI : 0) + state.pointer.x * 0.18 + idleTurn,
      ease,
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.1,
      ease,
    )
  }, [isBack])

  return (
    <group ref={groupRef} scale={scale}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            torsoShape,
            {
              depth: 0.34,
              bevelEnabled: true,
              bevelSegments: 3,
              bevelSize: 0.045,
              bevelThickness: 0.055,
              curveSegments: 16,
            },
          ]}
        />
        <meshPhysicalMaterial
          color={color}
          roughness={0.9}
          metalness={0}
          clearcoat={0.12}
          clearcoatRoughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <FabricSurface color={color} />
      <FabricSurface color={color} back />
      <FabricLine
        points={collarLine.map(([x, y]) => [x, y, 0.48])}
        color="#484b4f"
        radius={0.035}
      />
      {collarRibLines.map((points, index) => (
        <FabricLine key={index} points={points} color="#66696d" radius={0.012} />
      ))}
      <FabricLine
        points={[
          [-0.61, 2.76, 0.49],
          [-0.49, 2.5, 0.49],
          [-0.27, 2.32, 0.49],
          [0, 2.25, 0.49],
          [0.27, 2.32, 0.49],
          [0.49, 2.5, 0.49],
          [0.61, 2.76, 0.49],
        ]}
        color="#25272a"
        radius={0.018}
      />

      {!isBack && (
        <>
          <StitchLine points={collarLine.map(([x, y]) => [x, y, 0.5])} color={stitchColor} />
          {shoulderStitches.map((points, index) => (
            <StitchLine key={`shoulder-${index}`} points={points} color={stitchColor} />
          ))}
          <StitchLine
            points={[
              [-1.42, -2.37, 0.49],
              [-0.72, -2.42, 0.49],
              [0, -2.44, 0.49],
              [0.72, -2.42, 0.49],
              [1.42, -2.37, 0.49],
            ]}
            color={stitchColor}
          />
          <StitchLine
            points={[
              [-2.76, 2.08, 0.49],
              [-2.57, 2.57, 0.49],
              [-2.3, 2.76, 0.49],
              [-1.86, 2.96, 0.49],
            ]}
            color={stitchColor}
          />
          <StitchLine
            points={[
              [2.76, 2.08, 0.49],
              [2.57, 2.57, 0.49],
              [2.3, 2.76, 0.49],
              [1.86, 2.96, 0.49],
            ]}
            color={stitchColor}
          />
        </>
      )}

      <FabricLine
        points={[
          [-1.42, -2.37, 0.47],
          [-0.72, -2.42, 0.47],
          [0, -2.44, 0.47],
          [0.72, -2.42, 0.47],
          [1.42, -2.37, 0.47],
        ]}
        color="#77797b"
        radius={0.014}
      />
      <FabricLine
        points={[
          [-1.74, 3.25, 0.47],
          [-1.42, 2.98, 0.47],
          [-1.07, 2.79, 0.47],
          [-0.68, 2.77, 0.47],
        ]}
        color="#5e6063"
        radius={0.018}
      />
      <FabricLine
        points={[
          [1.74, 3.25, 0.47],
          [1.42, 2.98, 0.47],
          [1.07, 2.79, 0.47],
          [0.68, 2.77, 0.47],
        ]}
        color="#5e6063"
        radius={0.018}
      />

      <FabricLine
        points={[
          [-2.72, 2.03, 0.47],
          [-2.54, 2.65, 0.47],
          [-2.26, 2.83, 0.47],
          [-1.82, 3.01, 0.47],
        ]}
        color="#77797b"
        radius={0.015}
      />
      <FabricLine
        points={[
          [2.72, 2.03, 0.47],
          [2.54, 2.65, 0.47],
          [2.26, 2.83, 0.47],
          [1.82, 3.01, 0.47],
        ]}
        color="#77797b"
        radius={0.015}
      />

      <FabricLine
        points={[
          [-2.51, 2.68, 0.4],
          [-2.2, 2.55, 0.4],
          [-1.98, 2.42, 0.4],
        ]}
        color="#3b3e42"
        radius={0.035}
      />
      <FabricLine
        points={[
          [2.51, 2.68, 0.4],
          [2.2, 2.55, 0.4],
          [1.98, 2.42, 0.4],
        ]}
        color="#3b3e42"
        radius={0.035}
      />

      {!isBack && <Text
        position={[0, 1.9, 0.5]}
        fontSize={0.115}
        letterSpacing={0.06}
        color={inkColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.002}
        outlineColor={inkColor}
      >
        WTF
      </Text>}

      {!isBack && <group position={[0.92, -1.88, 0.5]}>
        <Text
          position={[0, 0.13, 0]}
          fontSize={0.12}
          letterSpacing={0.035}
          color={inkColor}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.0015}
          outlineColor={inkColor}
        >
          by WTFBY
        </Text>
        <Text
          position={[0, -0.035, 0]}
          fontSize={0.105}
          letterSpacing={0.055}
          color={inkColor}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.0015}
          outlineColor={inkColor}
        >
          ABHI
        </Text>
      </group>}

      {isBack && (
        <>
          <FabricLine
            points={backCollarLine}
            color="#484b4f"
            radius={0.035}
          />
          {backCollarRibLines.map((points, index) => (
            <FabricLine
              key={`back-collar-${index}`}
              points={points}
              color="#66696d"
              radius={0.012}
            />
          ))}
          <StitchLine
            points={backCollarLine.map(([x, y, z]) => [x, y, z - 0.008])}
            color={stitchColor}
          />
          <StitchLine
            points={[
              [-0.62, 2.49, -0.07],
              [-0.42, 2.45, -0.09],
              [0, 2.43, -0.11],
              [0.42, 2.45, -0.09],
              [0.62, 2.49, -0.07],
            ]}
            color={stitchColor}
          />
          {[
            [
              [-0.58, 2.62, -0.07],
              [-0.82, 2.72, -0.065],
              [-1.12, 2.83, -0.055],
              [-1.48, 2.94, -0.045],
            ],
            [
              [0.58, 2.62, -0.07],
              [0.82, 2.72, -0.065],
              [1.12, 2.83, -0.055],
              [1.48, 2.94, -0.045],
            ],
          ].map((points, index) => (
            <StitchLine key={`back-shoulder-${index}`} points={points} color={stitchColor} />
          ))}
          {[
            [
              [-1.5, 1.36, -0.06],
              [-1.68, 1.72, -0.06],
              [-1.96, 2.04, -0.06],
              [-2.4, 2.42, -0.055],
              [-2.68, 2.62, -0.05],
            ],
            [
              [1.5, 1.36, -0.06],
              [1.68, 1.72, -0.06],
              [1.96, 2.04, -0.06],
              [2.4, 2.42, -0.055],
              [2.68, 2.62, -0.05],
            ],
          ].map((points, index) => (
            <StitchLine key={`back-sleeve-${index}`} points={points} color={stitchColor} />
          ))}
          {[
            [
              [-1.48, 1.08, -0.06],
              [-1.47, 0.28, -0.07],
              [-1.47, -0.78, -0.07],
              [-1.45, -1.62, -0.065],
              [-1.42, -2.34, -0.06],
            ],
            [
              [1.48, 1.08, -0.06],
              [1.47, 0.28, -0.07],
              [1.47, -0.78, -0.07],
              [1.45, -1.62, -0.065],
              [1.42, -2.34, -0.06],
            ],
          ].map((points, index) => (
            <StitchLine key={`back-side-${index}`} points={points} color={stitchColor} />
          ))}
          <FabricLine
            points={[
              [-1.42, 2.63, -0.06],
              [-0.92, 2.48, -0.075],
              [0, 2.45, -0.11],
              [0.92, 2.48, -0.075],
              [1.42, 2.63, -0.06],
            ]}
            color="#55585c"
            radius={0.012}
          />
          <StitchLine
            points={[
              [-1.42, 2.61, -0.065],
              [-0.92, 2.46, -0.08],
              [0, 2.43, -0.115],
              [0.92, 2.46, -0.08],
              [1.42, 2.61, -0.065],
            ]}
            color={stitchColor}
          />
          <FabricLine
            points={[
              [-1.36, -2.37, -0.065],
              [-0.68, -2.42, -0.09],
              [0, -2.44, -0.11],
              [0.68, -2.42, -0.09],
              [1.36, -2.37, -0.065],
            ]}
            color="#55585c"
            radius={0.012}
          />
          <StitchLine
            points={[
              [-1.36, -2.4, -0.07],
              [-0.68, -2.45, -0.095],
              [0, -2.47, -0.115],
              [0.68, -2.45, -0.095],
              [1.36, -2.4, -0.07],
            ]}
            color={stitchColor}
          />
        </>
      )}
    </group>
  )
}

function HeroScene({ view }) {
  useFrame(({ camera, size }, delta) => {
    const aspect = size.width / size.height
    const targetDistance = Math.max(8.8, 7.75 / aspect)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetDistance, 3, delta)
  })

  return (
    <>
      <color attach="background" args={['#101112']} />
      <fog attach="fog" args={['#101112', 12, 22]} />
      <hemisphereLight args={['#e2e3e5', '#34363a', 1.3]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[-4, 2.5, 5]} intensity={3.7} color="#f0eeeb" />
      <directionalLight position={[4.5, 1.5, 1]} intensity={2.9} color="#c7d0d9" />
      <directionalLight position={[0, 5, -3]} intensity={3.7} color="#e0e3e8" />
      <spotLight
        position={[0, 1.5, 7]}
        intensity={15}
        angle={0.55}
        penumbra={0.8}
        distance={18}
        color="#f1eee8"
      />
      <TShirtModel color="#2b2d31" scale={0.88} view={view} />
      <ContactShadows position={[0, -2.65, -0.2]} opacity={0.42} scale={7} blur={2.2} far={4.5} />
      <OrbitControls
        target={[0, 0.3, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.15}
        maxPolarAngle={Math.PI / 1.85}
        minAzimuthAngle={-Math.PI / 3.5}
        maxAzimuthAngle={Math.PI / 3.5}
        rotateSpeed={0.55}
      />
    </>
  )
}

function HeroLandscape() {
  return (
    <svg className="hero-landscape" viewBox="0 0 1600 430" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="landscape-stone" x1="0" y1="0" x2=".3" y2="1">
          <stop offset="0" stopColor="#797b7b" />
          <stop offset=".25" stopColor="#454748" />
          <stop offset="1" stopColor="#17191b" />
        </linearGradient>
        <linearGradient id="landscape-shadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d5f60" />
          <stop offset="1" stopColor="#101112" />
        </linearGradient>
      </defs>
      <path d="M0 258 68 236l36-56 40 18 58-116 30 18 42-74 46 55 55 31 44 92 44 49 28 177H0Z" fill="url(#landscape-stone)" />
      <path d="m0 267 69-31 35-56 38 20 57-114 30 20 43-75 43 58-24 13-28 67-48 48-27 97-64 32-45-18-49 63H0Z" fill="url(#landscape-shadow)" opacity=".84" />
      <path d="M1600 248 1517 229l-48-82-35 22-69-105-43 16-34-66-55 55-54 18-46 92-43 39-26 205h536Z" fill="url(#landscape-stone)" />
      <path d="m1600 262-83-33-48-82-35 24-68-107-42 17-35-67-49 59 25 14 32 67 51 50 26 98 65 28 46-20 48 63h67Z" fill="url(#landscape-shadow)" opacity=".86" />
      <path d="M0 364q190-50 394-32m815-3q202-44 391 35" fill="none" stroke="#a4a4a0" strokeWidth="2" opacity=".2" />
    </svg>
  )
}

function ProductArtwork({ product, color, view = 'front' }) {
  const id = useId().replaceAll(':', '')
  const isBack = view === 'back'
  const selectedColor = productColors.find((item) => item.name === color)?.value ?? '#202226'
  const inkColor =
    new THREE.Color(selectedColor).getHSL({ h: 0, s: 0, l: 0 }).l > 0.55
      ? '#353638'
      : 'rgba(235,231,223,.78)'

  return (
    <svg
      className={`product-artwork product-artwork--${product.visual}${view === 'detail' ? ' product-artwork--detail' : ''}`}
      viewBox="0 0 140 170"
      role="img"
      aria-label={`${product.name} ${view} view, ${color}`}
    >
      <defs>
        <linearGradient id={`tee-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={selectedColor} />
          <stop offset="0.55" stopColor={selectedColor} />
          <stop offset="1" stopColor="#08090b" stopOpacity="0.6" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#000" floodOpacity="0.42" />
        </filter>
        <pattern id={`weave-${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(16)">
          <path d="M1 0v7M4 0v7M0 2h7" stroke="#d8d2c7" strokeWidth=".35" opacity=".5" />
        </pattern>
      </defs>
      <path
        d="M48 22 25 33 9 67l17 10 10-13v84q34 10 68 0V64l10 13 17-10-16-34-23-11c-3 13-11 20-22 20S51 35 48 22Z"
        fill={`url(#tee-${id})`}
        stroke="rgba(230,226,218,.24)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        filter={`url(#shadow-${id})`}
      />
      <path
        d="M48 22 25 33 9 67l17 10 10-13v84q34 10 68 0V64l10 13 17-10-16-34-23-11c-3 13-11 20-22 20S51 35 48 22Z"
        fill={`url(#weave-${id})`}
        opacity=".16"
      />
      <path
        d={isBack ? 'M49 23c4 6 11 9 21 9s17-3 21-9' : 'M49 23c3 13 10 19 21 19s18-6 21-19'}
        fill="none"
        stroke="rgba(220,216,208,.55)"
        strokeWidth="2.2"
      />
      <path
        d={isBack ? 'M48 24c4 4 11 7 22 7s18-3 22-7' : 'M48 24c4 10 11 15 22 15s18-5 22-15'}
        fill="none"
        stroke="rgba(5,6,8,.76)"
        strokeWidth="1.2"
      />
      {!isBack && <text x="70" y="33" textAnchor="middle" fill={inkColor} fontSize="4.2" fontWeight="600" letterSpacing="0.8">WTF</text>}
      <path d="M36 64v82m68-82v82M38 145q32 8 64 0" fill="none" stroke="rgba(225,221,213,.2)" strokeWidth="1" />
      {isBack
        ? <path d="M39 55q31 11 62 0m-57 3q26 9 52 0" fill="none" stroke="rgba(225,221,213,.18)" strokeWidth="1" />
        : <path d="M42 72c-2 18 3 24 1 39m20-35c4 17-2 29 2 43m12-38c-3 17 3 24 1 37" fill="none" stroke="rgba(240,236,229,.09)" strokeWidth="2" strokeLinecap="round" />}
      {!isBack && product.visual === 'graphic' && (
        <path d="M58 70h24m-17 5h10" fill="none" stroke="rgba(230,226,218,.62)" strokeWidth="1.5" />
      )}
      {!isBack && product.visual === 'limited' && (
        <path d="M87 124h10m-10 3h7" fill="none" stroke="rgba(230,226,218,.5)" strokeWidth="1.2" />
      )}
      {!isBack && (
        <>
          <text x="84" y="137" fill={inkColor} fontSize="3.2" letterSpacing="0.12">by WTFBY</text>
          <text x="84" y="141" fill={inkColor} fontSize="3.2" letterSpacing="0.24">ABHI</text>
        </>
      )}
    </svg>
  )
}

function ProductCard({ product, index }) {
  return (
    <article className="product-card" style={{ '--card-index': index }}>
      <a className="product-card__link" href={`#product/${product.id}`} aria-label={`View ${product.name}`}>
        <div className="product-card__visual">
          <ProductArtwork product={product} color={product.colors[0]} />
        </div>
      </a>
      <div className="product-card__meta">
        <div>
          <p>{product.name}</p>
          <span>{product.colors.join(' / ')}</span>
        </div>
        <a href={`#product/${product.id}`}>VIEW PRODUCT</a>
      </div>
    </article>
  )
}

function ProductScene({ color, view }) {
  const colorValue = productColors.find((item) => item.name === color)?.value ?? '#202226'

  useFrame(({ camera, size }, delta) => {
    const aspect = size.width / size.height
    const targetDistance = view === 'detail' ? 6.6 : Math.max(8.8, 7.75 / aspect)
    const targetHeight = view === 'detail' ? 2.05 : 0.3
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetDistance, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetHeight, 3, delta)
    camera.lookAt(0, targetHeight, 0)
  })

  return (
    <>
      <color attach="background" args={['#17191c']} />
      <hemisphereLight args={['#e2e3e5', '#34363a', 1.15]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 2.5, 5]} intensity={3.2} color="#f0eeeb" />
      <directionalLight position={[0, 1.6, 6]} intensity={1.15} color="#f4f1ea" />
      <directionalLight position={[4.5, 1.5, 1]} intensity={2.4} color="#c7d0d9" />
      <directionalLight position={[0, 5, -3]} intensity={3.1} color="#e0e3e8" />
      <directionalLight position={[-4, 1.5, -4]} intensity={2.1} color="#d3d8df" />
      <TShirtModel color={colorValue} scale={0.8} view={view} />
      <ContactShadows position={[0, -2.25, -0.2]} opacity={0.36} scale={6} blur={2.2} far={4.5} />
      <OrbitControls
        target={view === 'detail' ? [0, 2.05, 0] : [0, 0.3, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.15}
        maxPolarAngle={Math.PI / 1.85}
        rotateSpeed={0.55}
      />
    </>
  )
}

function ProductDetail({ product }) {
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(null)
  const [view, setView] = useState('front')
  const collectionHash = `#collection/${product.collection.toLowerCase()}`
  const relatedProducts = products.filter(
    (item) => item.collection === product.collection && item.id !== product.id,
  )

  return (
    <>
      <section className="detail-panel detail-panel--active" id="detail" aria-labelledby="detail-title">
        <a className="detail-back-link" href={collectionHash}>
          ← BACK TO COLLECTION
        </a>
        <div className="detail-panel__visual">
          <Canvas
            fallback={<div className="webgl-fallback" role="status">3D preview is unavailable on this device.</div>}
            camera={{ position: [0, 0.3, 8.8], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ width: '100%', height: '100%' }}
          >
            <ProductScene color={color} view={view} />
          </Canvas>
          <div className="detail-thumbnails" role="group" aria-label="Product views">
            {[
              ['front', 'Front view'],
              ['back', 'Back view'],
              ['detail', 'Neck detail'],
            ].map(([side, label]) => (
              <button
                className={`detail-thumbnail${view === side ? ' is-selected' : ''}`}
                type="button"
                key={side}
                aria-label={label}
                aria-pressed={view === side}
                onClick={() => setView(side)}
              >
                <ProductArtwork product={product} color={color} view={side} />
                <span>{side}</span>
              </button>
            ))}
          </div>
          <div className="detail-views" role="group" aria-label="Garment view">
            {['front', 'back'].map((side) => (
              <button
                key={side}
                className={`detail-view-button${(side === 'back' ? view === 'back' : view !== 'back') ? ' is-selected' : ''}`}
                type="button"
                aria-pressed={side === 'back' ? view === 'back' : view !== 'back'}
                onClick={() => setView(side)}
              >
                {side}
              </button>
            ))}
          </div>
        </div>
        <div className="detail-panel__content">
          <div className="eyebrow">{product.collection}</div>
          <h2 id="detail-title">WTFBY / {product.name}</h2>
          <div className="meta-row">
            <span>Fit</span>
            <strong>{product.fit}</strong>
          </div>
          <div className="product-option">
            <span className="option-label">Color — {color}</span>
            <div className="swatches" role="group" aria-label="Available colors">
              {product.colors.map((name) => {
                const swatch = productColors.find((item) => item.name === name)
                return (
                  <button
                    key={name}
                    className={`swatch${color === name ? ' is-selected' : ''}`}
                    type="button"
                    style={{ '--swatch-color': swatch.value }}
                    aria-label={name}
                    aria-pressed={color === name}
                    title={name}
                    onClick={() => setColor(name)}
                  />
                )
              })}
            </div>
          </div>
          <div className="product-option">
            <span className="option-label">Size{size ? ` — ${size}` : ''}</span>
            <div className="size-row" role="group" aria-label="Available sizes">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`size-pill${size === item ? ' is-selected' : ''}`}
                  aria-pressed={size === item}
                  onClick={() => {
                    setSize(item)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <details className="size-guide">
              <summary>SIZE GUIDE</summary>
              <p>Sizes XS–XL are available. Select your usual size for the listed fit. Measurements have not been provided.</p>
            </details>
          </div>
          <p className="product-detail-note">Options are for visual selection only.</p>
        </div>
      </section>
      {!!relatedProducts.length && (
        <section className="related-products" aria-labelledby="related-title">
          <div className="section-header">
            <span id="related-title">MORE FROM {product.collection}</span>
          </div>
          <div className="related-products__grid">
            {relatedProducts.map((related, index) => (
              <ProductCard key={related.id} product={related} index={index} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function SearchOverlay({ onClose, onOpenProduct, returnFocusRef }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const normalizedQuery = query.trim().toLowerCase()
  const results = normalizedQuery
    ? products.filter((product) =>
      `${product.name} ${product.collection} ${product.colors.join(' ')}`.toLowerCase().includes(normalizedQuery),
    )
    : products

  useEffect(() => {
    inputRef.current?.focus()
    const returnFocusTarget = returnFocusRef.current
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll(
          '.search-dialog button:not([disabled]), .search-dialog input, .search-dialog a[href]',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
      if (event.target === inputRef.current && event.key === 'ArrowDown') {
        event.preventDefault()
        resultsRef.current?.querySelector('a')?.focus()
      } else if (event.target instanceof HTMLAnchorElement && event.target.closest('.search-results')) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          const resultLinks = [...(resultsRef.current?.querySelectorAll('a') ?? [])]
          const currentIndex = resultLinks.indexOf(event.target)
          const nextIndex = event.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, resultLinks.length - 1)
            : Math.max(currentIndex - 1, -1)
          if (nextIndex < 0) inputRef.current?.focus()
          else resultLinks[nextIndex]?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusTarget?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div
      className="overlay-backdrop search-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        id="search-dialog"
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        <div className="overlay-heading">
          <div>
            <div className="eyebrow">WTFBY / SEARCH</div>
            <h2 id="search-title">Search collection</h2>
          </div>
          <button className="overlay-close" type="button" onClick={onClose} aria-label="Close search">×</button>
        </div>
        <div className="search-field">
          <label className="visually-hidden" htmlFor="product-search">Search products or collections</label>
          <input
            ref={inputRef}
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try SIGNATURE or WASHED"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}>
              Clear
            </button>
          )}
          <span aria-hidden="true">⌕</span>
        </div>
        <div className="search-results" aria-live="polite" ref={resultsRef}>
          {results.length ? results.map((product) => (
            <a
              className="search-result"
              key={product.id}
              href={`#product/${product.id}`}
              onClick={() => onOpenProduct()}
            >
              <span className="search-result__visual">
                <ProductArtwork product={product} color={product.colors[0]} />
              </span>
              <span className="search-result__collection">{product.collection}</span>
              <span className="search-result__name">{product.name}</span>
              <span className="search-result__colors">{product.colors.join(' / ')}</span>
              <span className="search-result__arrow" aria-hidden="true">↗</span>
            </a>
          )) : (
            <p className="search-empty">No pieces match “{query}”. Try a product name or collection.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function MenuOverlay({ onClose, returnFocusRef }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const returnFocusTarget = returnFocusRef.current
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll(
          '.menu-overlay button:not([disabled]), .menu-overlay a[href]',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusTarget?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div className="overlay-backdrop menu-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <nav className="menu-overlay" id="site-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
        <div className="menu-overlay__top">
          <span className="eyebrow">WTFBY / NAVIGATION</span>
          <button ref={closeButtonRef} className="overlay-close" type="button" onClick={onClose} aria-label="Close navigation">×</button>
        </div>
        {[
          ['COLLECTION', '#collection'],
          ...collections.map((collection) => [collection, `#collection/${collection.toLowerCase()}`]),
          ['STUDIO', '#studio'],
          ['ABOUT', '#about'],
        ].map(([label, href], index) => (
          <a key={label} href={href} onClick={onClose}>
            <span className="menu-overlay__index">{String(index + 1).padStart(2, '0')}</span>
            <span>{label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState(readRoute)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [heroView, setHeroView] = useState('front')
  const searchTriggerRef = useRef(null)
  const menuTriggerRef = useRef(null)
  const selectedProduct = route.type === 'product'
    ? products.find((product) => product.id === route.value)
    : null
  const activeCollection = route.type === 'collection'
    ? route.value
    : selectedProduct?.collection ?? null
  const visibleProducts = products.filter(
    (product) => !activeCollection || product.collection === activeCollection,
  )

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hashTarget = window.location.hash.slice(1)
    const targetId = route.type === 'product'
      ? 'detail'
      : route.value || hashTarget === 'collection'
        ? 'collection'
        : ['about', 'detail-reveal', 'studio', 'top'].includes(hashTarget)
          ? hashTarget
          : null
    if (!targetId) return

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.getElementById(targetId)?.scrollIntoView({ behavior, block: 'start' })
  }, [route])

  return (
    <div className="page-shell">
      <header className={`topbar${isScrolled ? ' is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="WTFBY home">WTFBY</a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection" onClick={() => setMenuOpen(false)}>COLLECTION</a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>STUDIO</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
        </nav>
        <div className="actions">
          <button
            ref={searchTriggerRef}
            type="button"
            aria-label="Search products"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-controls="search-dialog"
            className="icon-button"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen(true)
            }}
          >
            <span>⌕</span>
          </button>
          <button
            ref={menuTriggerRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            className={`icon-button menu-button${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onOpenProduct={() => setSearchOpen(false)}
          returnFocusRef={searchTriggerRef}
        />
      )}
      {menuOpen && (
        <MenuOverlay
          onClose={() => setMenuOpen(false)}
          returnFocusRef={menuTriggerRef}
        />
      )}
      <main>
        {selectedProduct ? (
          <div className="product-page">
            <ProductDetail key={selectedProduct.id} product={selectedProduct} />
          </div>
        ) : (
          <>
        <section className="hero" id="top">
          <h1 className="visually-hidden">WTFBY streetwear collection</h1>
          <div className="hero__stage">
            <Canvas
              fallback={<div className="webgl-fallback" role="status">3D preview is unavailable on this device.</div>}
              camera={{ position: [0, 0.3, 8.8], fov: 38 }}
              shadows
              dpr={[1, 1.5]}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
              style={{ width: '100%', height: '100%' }}
            >
              <HeroScene view={heroView} />
            </Canvas>
          </div>
          <HeroLandscape />
          <div className="hero-view-rail" role="group" aria-label="Hero garment views">
            {['front', 'back'].map((view) => (
              <button
                className={`hero-view-thumb${heroView === view ? ' is-selected' : ''}`}
                type="button"
                key={view}
                aria-label={`Show ${view} of the garment`}
                aria-pressed={heroView === view}
                onClick={() => setHeroView(view)}
              >
                <ProductArtwork product={products[0]} color="Black" view={view} />
                <span>{view}</span>
              </button>
            ))}
          </div>
          <div className="hero__hud">
            <a href="#detail-reveal"><span aria-hidden="true">↓</span> SCROLL</a>
            <span>01</span>
          </div>
        </section>

        <section className="detail-reveal" id="detail-reveal" aria-label="Garment detail reveals">
          <ScrollReveal className="detail-reveal__frame detail-reveal__frame--neck">
            <GarmentMacroArt variant="neck" />
          </ScrollReveal>
          <ScrollReveal className="detail-reveal__frame detail-reveal__frame--signature">
            <GarmentMacroArt variant="signature" />
          </ScrollReveal>
        </section>

        <section className="collection" id="collection">
          <div className="section-header">
            <span>COLLECTION</span>
          </div>
          <nav className="collection-tabs" aria-label="Product collections">
            <a className={!route.value ? 'is-selected' : ''} href="#collection" aria-current={!route.value ? 'page' : undefined}>
              ALL
            </a>
            {collections.map((collection) => (
              <a
                key={collection}
                className={route.value === collection ? 'is-selected' : ''}
                href={`#collection/${collection.toLowerCase()}`}
                aria-current={route.value === collection ? 'page' : undefined}
              >
                {collection}
              </a>
            ))}
          </nav>
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          {!visibleProducts.length && <p className="collection-empty">No products in this collection yet.</p>}
        </section>

        <section className="feature-block studio-section" id="studio">
          <div className="studio-intro">
            <div className="feature-block__visual studio-collar-visual">
              <GarmentMacroArt variant="neck" />
            </div>
            <div className="feature-block__info">
              <div className="eyebrow">STUDIO</div>
              <h2 className="studio-heading">Construction<br />details</h2>
            </div>
          </div>
          <div className="material-grid studio-detail-grid">
            {studioDetails.map((detail) => (
              <article key={detail.kind} className="material-card">
                <StudioDetailArt kind={detail.kind} title={detail.title} />
                <span><small>{detail.number}</small>{detail.title}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-section__heading">
            <span className="eyebrow">04 / ABOUT</span>
            <h2>ABOUT</h2>
          </div>
          <div className="about-collage">
            <div className="about-collage__hero">
              <div className="about-rock about-rock--left" />
              <div className="about-rock about-rock--right" />
              <ProductArtwork product={products[0]} color="Black" />
              <span>WTFBY / 01</span>
            </div>
            <div className="about-collage__detail about-collage__detail--neck">
              <GarmentMacroArt variant="neck" />
            </div>
            <div className="about-collage__detail about-collage__detail--signature">
              <GarmentMacroArt variant="signature" />
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">WTFBY</a>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#collection">COLLECTION</a>
          <a href="#studio">STUDIO</a>
          <a href="#about">ABOUT</a>
        </nav>
        <small>© {copyrightYear} WTFBY. ALL RIGHTS RESERVED.</small>
      </footer>
    </div>
  )
}

export default App
