import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Helper for procedural dashed stitch lines
function StitchLine({ points, color = '#aaa59b', dashSize = 0.04, gapSize = 0.04 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    )
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))
  }, [points])

  return (
    <line geometry={geometry} onUpdate={(line) => line.computeLineDistances()}>
      <lineDashedMaterial
        color={color}
        dashSize={dashSize}
        gapSize={gapSize}
        opacity={0.55}
        transparent
        depthWrite={false}
      />
    </line>
  )
}

// Helper for 3D fabric seam bead / cord
function SeamCord({ points, color = '#3c3f44', radius = 0.016 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    )
    return new THREE.TubeGeometry(curve, 48, radius, 6, false)
  }, [points, radius])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

// 3D Sleeve Geometry generator: supports both Long Sleeves and Oversized Short Sleeves
function useSleeveGeometry(isLeft = true, isLongSleeve = true) {
  return useMemo(() => {
    const sign = isLeft ? -1 : 1
    const spinePoints = isLongSleeve
      ? [
          new THREE.Vector3(sign * 2.05, 2.16, 0.0),
          new THREE.Vector3(sign * 2.25, 1.45, 0.04),
          new THREE.Vector3(sign * 2.34, 0.45, 0.08),
          new THREE.Vector3(sign * 2.26, -0.65, 0.12),
          new THREE.Vector3(sign * 2.12, -1.68, 0.14),
          new THREE.Vector3(sign * 2.02, -1.82, 0.15), // Cuff edge
        ]
      : [
          new THREE.Vector3(sign * 2.05, 2.16, 0.0),
          new THREE.Vector3(sign * 2.24, 1.65, 0.03),
          new THREE.Vector3(sign * 2.36, 1.15, 0.06),
          new THREE.Vector3(sign * 2.38, 0.92, 0.07), // Short sleeve hem
        ]

    const segments = isLongSleeve ? 40 : 20
    const radialSegments = 24
    const curve = new THREE.CatmullRomCurve3(spinePoints)
    const curvePoints = curve.getPoints(segments)

    const radii = isLongSleeve
      ? [0.42, 0.41, 0.39, 0.37, 0.35, 0.33, 0.31, 0.29, 0.27, 0.26]
      : [0.42, 0.415, 0.41, 0.40]

    const positions = []
    const normals = []
    const uvs = []
    const indices = []

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const pt = curvePoints[i]
      const tangent = curve.getTangent(t)
      const normal = new THREE.Vector3(0, 0, 1)
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize()
      const normalCorrected = new THREE.Vector3().crossVectors(binormal, tangent).normalize()

      const rIndex = Math.min(Math.floor(t * (radii.length - 1)), radii.length - 2)
      const rFrac = t * (radii.length - 1) - rIndex
      const r = THREE.MathUtils.lerp(radii[rIndex], radii[rIndex + 1], rFrac)

      // Add fold noise to simulate cloth creases
      const foldNoise = Math.sin(t * (isLongSleeve ? 18.0 : 8.0)) * 0.018

      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)

        const effectiveRadius = r + foldNoise * Math.abs(cos)
        const offset = new THREE.Vector3()
          .addScaledVector(normalCorrected, cos * effectiveRadius)
          .addScaledVector(binormal, sin * effectiveRadius * 1.08)

        const vertex = new THREE.Vector3().addVectors(pt, offset)
        positions.push(vertex.x, vertex.y, vertex.z)

        const normVec = offset.clone().normalize()
        normals.push(normVec.x, normVec.y, normVec.z)

        uvs.push(j / radialSegments, t)
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j
        const b = (i + 1) * (radialSegments + 1) + j
        const c = (i + 1) * (radialSegments + 1) + (j + 1)
        const d = i * (radialSegments + 1) + (j + 1)

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [isLeft, isLongSleeve])
}

// 3D Torso Surface with anatomical sloped dropped shoulders and relaxed fabric curvature
function useTorsoGeometry(isBack = false) {
  return useMemo(() => {
    const cols = 56
    const rows = 88
    const bottom = -2.52
    const baseTop = 2.68
    const positions = []
    const normals = []
    const uvs = []
    const indices = []

    for (let c = 0; c <= cols; c++) {
      const u = c / cols
      const normX = u * 2 - 1

      // Sloped dropped shoulder
      const shoulderDrop = Math.max(0, (Math.abs(normX) - 0.34) / 0.66) * 0.52
      const topAtX = baseTop - shoulderDrop

      for (let r = 0; r <= rows; r++) {
        const v = r / rows
        const y = bottom + (topAtX - bottom) * v

        // Torso width profile
        const shoulderSpread = THREE.MathUtils.clamp((y - 1.2) / 1.48, 0, 1)
        const halfWidth = THREE.MathUtils.lerp(1.72, 2.05, Math.sin(shoulderSpread * Math.PI * 0.5))
        const x = normX * halfWidth



        // Natural garment 3D curvature and cloth drape
        const bodyFade = THREE.MathUtils.clamp(
          Math.min((y - bottom) / 0.45, (topAtX - y) / 0.55, 1),
          0,
          1,
        )

        // Chest / back dome curvature
        const domeDepth = (isBack ? -1 : 1) * 0.36 * (1 - normX * normX) * bodyFade

        // Longitudinal gravity cloth folds (slub cotton vertical drape)
        const fold1 = Math.sin(normX * 5.2 + Math.sin(y * 1.5)) * 0.038 * bodyFade
        const fold2 = Math.sin((normX - 0.3) * 8.5 + y * 0.8) * 0.022 * bodyFade
        const fold3 = Math.cos((normX + 0.4) * 6.2 - y * 1.1) * 0.025 * bodyFade

        const zBase = isBack ? -0.16 : 0.16
        const totalZ = zBase + domeDepth + fold1 + fold2 + fold3

        positions.push(x, y, totalZ)
        uvs.push(u, v)
        normals.push(0, 0, isBack ? -1 : 1)
      }
    }

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const current = c * (rows + 1) + r
        const nextCol = (c + 1) * (rows + 1) + r

        const centerU = (c + 0.5) / cols
        const centerNormX = centerU * 2 - 1
        const shoulderDrop = Math.max(0, (Math.abs(centerNormX) - 0.34) / 0.66) * 0.52
        const topAtX = baseTop - shoulderDrop
        const centerY = bottom + (topAtX - bottom) * (r + 0.5) / rows

        const shoulderSpread = THREE.MathUtils.clamp((centerY - 1.2) / 1.48, 0, 1)
        const halfWidth = THREE.MathUtils.lerp(1.72, 2.05, Math.sin(shoulderSpread * Math.PI * 0.5))
        const collarOpening = isBack
          ? 0.72 * Math.sqrt(Math.max(0, (centerY - 2.38) / 0.30))
          : 0.72 * Math.sqrt(Math.max(0, (centerY - 2.05) / 0.63))

        // Omit triangles inside the neck collar opening
        if (centerY > 2.05 && Math.abs(centerNormX * halfWidth) < collarOpening) {
          continue
        }

        if (isBack) {
          indices.push(current, nextCol, current + 1)
          indices.push(current + 1, nextCol, nextCol + 1)
        } else {
          indices.push(current, current + 1, nextCol)
          indices.push(current + 1, nextCol + 1, nextCol)
        }
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [isBack])
}

// Side Seam connecting front and back panels into a solid 3D garment
function useSideSeamGeometry(isLeft = true) {
  return useMemo(() => {
    const sign = isLeft ? -1 : 1
    const rows = 40
    const bottom = -2.52
    const top = 1.35

    const positions = []
    const normals = []
    const uvs = []
    const indices = []

    for (let r = 0; r <= rows; r++) {
      const v = r / rows
      const y = bottom + (top - bottom) * v
      const halfWidth = THREE.MathUtils.lerp(1.72, 1.82, v)
      const x = sign * halfWidth

      // Front edge
      positions.push(x, y, 0.16)
      normals.push(sign, 0, 0.4)
      uvs.push(0, v)

      // Back edge
      positions.push(x, y, -0.16)
      normals.push(sign, 0, -0.4)
      uvs.push(1, v)
    }

    for (let r = 0; r < rows; r++) {
      const a = r * 2
      const b = a + 1
      const c = a + 2
      const d = a + 3

      if (isLeft) {
        indices.push(a, b, c)
        indices.push(b, d, c)
      } else {
        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [isLeft])
}

export function GarmentModel3D({
  garment,
  color = '#24262a',
  _view = 'front',
  scale = 1,
  showWireframe = false,
}) {
  const groupRef = useRef()

  const isLongSleeve = garment?.isLongSleeve ?? true

  // Detect whether selected color is light (e.g. Off-White) to use dark carbon ink graphics
  const isLightGarment = useMemo(() => {
    const c = new THREE.Color(color)
    const hsl = c.getHSL({ h: 0, s: 0, l: 0 })
    return hsl.l > 0.6
  }, [color])

  // Dynamic texture state
  const [textures, setTextures] = useState({
    front: null,
    back: null,
    sleeveLeft: null,
    sleeveRight: null,
  })

  // Geometries
  const frontTorsoGeom = useTorsoGeometry(false)
  const backTorsoGeom = useTorsoGeometry(true)
  const leftSleeveGeom = useSleeveGeometry(true, isLongSleeve)
  const rightSleeveGeom = useSleeveGeometry(false, isLongSleeve)
  const leftSideGeom = useSideSeamGeometry(true)
  const rightSideGeom = useSideSeamGeometry(false)

  // Load and cache decal textures for this garment & colorway
  useEffect(() => {
    let mounted = true
    const loader = new THREE.TextureLoader()

    const resolveUrl = (rawUrl) => {
      if (!rawUrl) return null
      if (isLightGarment) {
        const darkCandidate = rawUrl.replace('.png', '_dark.png')
        return darkCandidate
      }
      return rawUrl
    }

    const loadTex = (url) =>
      new Promise((resolve) => {
        if (!url) return resolve(null)
        loader.load(
          url,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace
            t.generateMipmaps = true
            resolve(t)
          },
          undefined,
          () => {
            // Fallback to non-dark version if dark version fails
            if (url.includes('_dark.png')) {
              loader.load(
                url.replace('_dark.png', '.png'),
                (t2) => {
                  t2.colorSpace = THREE.SRGBColorSpace
                  resolve(t2)
                },
                undefined,
                () => resolve(null),
              )
            } else {
              resolve(null)
            }
          },
        )
      })

    Promise.all([
      loadTex(resolveUrl(garment?.graphics?.front)),
      loadTex(resolveUrl(garment?.graphics?.back)),
      loadTex(resolveUrl(garment?.graphics?.sleeveLeft)),
      loadTex(resolveUrl(garment?.graphics?.sleeveRight)),
    ]).then(([frontTex, backTex, leftTex, rightTex]) => {
      if (mounted) {
        setTextures({
          front: frontTex,
          back: backTex,
          sleeveLeft: leftTex,
          sleeveRight: rightTex,
        })
      }
    })

    return () => {
      mounted = false
    }
  }, [
    garment?.id,
    garment?.graphics?.front,
    garment?.graphics?.back,
    garment?.graphics?.sleeveLeft,
    garment?.graphics?.sleeveRight,
    isLightGarment,
  ])

  // Collar seam curve
  const collarFrontCurve = useMemo(
    () => [
      [-0.72, 2.68, 0.17],
      [-0.58, 2.40, 0.28],
      [-0.32, 2.16, 0.35],
      [0.0, 2.06, 0.38],
      [0.32, 2.16, 0.35],
      [0.58, 2.40, 0.28],
      [0.72, 2.68, 0.17],
    ],
    [],
  )

  const collarBackCurve = useMemo(
    () => [
      [-0.72, 2.68, 0.17],
      [-0.56, 2.58, -0.06],
      [-0.30, 2.48, -0.16],
      [0.0, 2.44, -0.19],
      [0.30, 2.48, -0.16],
      [0.56, 2.58, -0.06],
      [0.72, 2.68, 0.17],
    ],
    [],
  )

  // Dropped shoulder seams
  const leftDropShoulderSeam = useMemo(
    () => [
      [-0.72, 2.68, 0.17],
      [-1.38, 2.45, 0.12],
      [-2.05, 2.16, 0.02],
    ],
    [],
  )

  const rightDropShoulderSeam = useMemo(
    () => [
      [0.72, 2.68, 0.17],
      [1.38, 2.45, 0.12],
      [2.05, 2.16, 0.02],
    ],
    [],
  )

  // Bottom hem double stitching lines
  const hemFrontStitch1 = useMemo(
    () => [
      [-1.72, -2.42, 0.22],
      [-0.86, -2.45, 0.28],
      [0.0, -2.47, 0.30],
      [0.86, -2.45, 0.28],
      [1.72, -2.42, 0.22],
    ],
    [],
  )

  const hemFrontStitch2 = useMemo(
    () => [
      [-1.72, -2.48, 0.20],
      [-0.86, -2.51, 0.26],
      [0.0, -2.53, 0.28],
      [0.86, -2.51, 0.26],
      [1.72, -2.48, 0.20],
    ],
    [],
  )

  // Stitch color calculation
  const stitchColor = useMemo(() => {
    const col = new THREE.Color(color)
    const hsl = col.getHSL({ h: 0, s: 0, l: 0 })
    return hsl.l > 0.55 ? '#55514b' : '#9a958b'
  }, [color])

  // Collar rib color calculation
  const collarColor = useMemo(() => {
    const col = new THREE.Color(color)
    col.offsetHSL(0, 0, -0.06)
    return col
  }, [color])

  // Idle cloth breathing animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.02
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Front Torso Panel */}
      <mesh geometry={frontTorsoGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.88}
          metalness={0.02}
          clearcoat={0.04}
          clearcoatRoughness={0.9}
          wireframe={showWireframe}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back Torso Panel */}
      <mesh geometry={backTorsoGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.88}
          metalness={0.02}
          clearcoat={0.04}
          clearcoatRoughness={0.9}
          wireframe={showWireframe}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Side Seams */}
      <mesh geometry={leftSideGeom}>
        <meshPhysicalMaterial color={color} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rightSideGeom}>
        <meshPhysicalMaterial color={color} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* 3D Sleeves (Long or Short) */}
      <mesh geometry={leftSleeveGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.88}
          clearcoat={0.04}
          wireframe={showWireframe}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={rightSleeveGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.88}
          clearcoat={0.04}
          wireframe={showWireframe}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Ribbed Crew Collar Bead */}
      <SeamCord points={collarFrontCurve} color={collarColor} radius={0.038} />
      <SeamCord points={collarBackCurve} color={collarColor} radius={0.034} />

      {/* Dropped Shoulder Seam Piping */}
      <SeamCord points={leftDropShoulderSeam} color={collarColor} radius={0.022} />
      <SeamCord points={rightDropShoulderSeam} color={collarColor} radius={0.022} />

      {/* Armhole Seam Rings */}
      <SeamCord
        points={[
          [-2.05, 2.16, 0.02],
          [-2.15, 1.68, 0.16],
          [-2.05, 1.25, 0.0],
          [-1.88, 1.35, -0.15],
          [-2.05, 2.16, 0.02],
        ]}
        color={collarColor}
        radius={0.018}
      />
      <SeamCord
        points={[
          [2.05, 2.16, 0.02],
          [2.15, 1.68, 0.16],
          [2.05, 1.25, 0.0],
          [1.88, 1.35, -0.15],
          [2.05, 2.16, 0.02],
        ]}
        color={collarColor}
        radius={0.018}
      />

      {/* Wrist Cuffs for Long Sleeves */}
      {isLongSleeve ? (
        <>
          <mesh position={[-2.02, -1.82, 0.15]} rotation={[0.2, 0, -0.15]}>
            <cylinderGeometry args={[0.26, 0.27, 0.12, 24, 1, true]} />
            <meshStandardMaterial color={collarColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[2.02, -1.82, 0.15]} rotation={[0.2, 0, 0.15]}>
            <cylinderGeometry args={[0.26, 0.27, 0.12, 24, 1, true]} />
            <meshStandardMaterial color={collarColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
        </>
      ) : (
        /* Short Sleeve Cuffs / Locked Hems */
        <>
          <mesh position={[-2.38, 0.92, 0.07]} rotation={[0.15, 0, -0.12]}>
            <cylinderGeometry args={[0.395, 0.40, 0.08, 24, 1, true]} />
            <meshStandardMaterial color={collarColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[2.38, 0.92, 0.07]} rotation={[0.15, 0, 0.12]}>
            <cylinderGeometry args={[0.395, 0.40, 0.08, 24, 1, true]} />
            <meshStandardMaterial color={collarColor} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* Seam Stitching Details */}
      <StitchLine points={collarFrontCurve.map(([x, y, z]) => [x, y, z + 0.015])} color={stitchColor} />
      <StitchLine points={collarBackCurve.map(([x, y, z]) => [x, y, z - 0.015])} color={stitchColor} />
      <StitchLine points={leftDropShoulderSeam.map(([x, y, z]) => [x, y, z + 0.016])} color={stitchColor} />
      <StitchLine points={rightDropShoulderSeam.map(([x, y, z]) => [x, y, z + 0.016])} color={stitchColor} />
      <StitchLine points={hemFrontStitch1} color={stitchColor} />
      <StitchLine points={hemFrontStitch2} color={stitchColor} />

      {/* FRONT CHEST GRAPHIC DECAL */}
      {textures.front && (
        <mesh position={[0, 0.15, 0.54]} renderOrder={2}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial
            map={textures.front}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      )}

      {/* BACK GRAPHIC DECAL */}
      {textures.back && (
        <mesh position={[0, 0.15, -0.54]} rotation={[0, Math.PI, 0]} renderOrder={2}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial
            map={textures.back}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      )}

      {/* LEFT SLEEVE GRAPHIC DECAL */}
      {textures.sleeveLeft && (
        <mesh
          position={isLongSleeve ? [-2.34, -0.15, 0.1] : [-2.32, 1.45, 0.08]}
          rotation={[0, -Math.PI / 2, 0.08]}
          renderOrder={2}
        >
          <planeGeometry args={isLongSleeve ? [1.1, 2.3] : [0.9, 1.1]} />
          <meshBasicMaterial
            map={textures.sleeveLeft}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      )}

      {/* RIGHT SLEEVE GRAPHIC DECAL */}
      {textures.sleeveRight && (
        <mesh
          position={isLongSleeve ? [2.34, -0.15, 0.1] : [2.32, 1.45, 0.08]}
          rotation={[0, Math.PI / 2, -0.08]}
          renderOrder={2}
        >
          <planeGeometry args={isLongSleeve ? [1.1, 2.3] : [0.9, 1.1]} />
          <meshBasicMaterial
            map={textures.sleeveRight}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      )}
    </group>
  )
}
export default GarmentModel3D
