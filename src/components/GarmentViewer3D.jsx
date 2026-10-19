import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GarmentModel3D } from './GarmentModel3D'

// Camera Rig that smoothly animates camera position to the chosen view
function CameraRig({ view = 'front', autoRotate = false, zoomLevel = 1.0 }) {
  const controlsRef = useRef()
  const isAnimatingToView = useRef(false)
  const prevView = useRef(view)

  // Target coordinates for each view angle (optimized for prominent garment framing without clipping)
  const targetCamPos = useRef(new THREE.Vector3(0, 0.0, 7.0))
  const targetLookAt = useRef(new THREE.Vector3(0, 0.0, 0))

  useEffect(() => {
    isAnimatingToView.current = true
    prevView.current = view
    switch (view) {
      case 'front':
        targetCamPos.current.set(0, 0.0, 7.0)
        break
      case 'back':
        targetCamPos.current.set(0, 0.0, -7.0)
        break
      case 'left':
        // Inspect left sleeve graphics with comfortable framing
        targetCamPos.current.set(-5.8, 0.0, 0)
        break
      case 'right':
        // Inspect right sleeve graphics with comfortable framing
        targetCamPos.current.set(5.8, 0.0, 0)
        break
      default:
        targetCamPos.current.set(0, 0.0, 7.0)
    }
  }, [view])

  useFrame((state, delta) => {
    if (state.camera.zoom !== zoomLevel) {
      state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, zoomLevel, 1 - Math.exp(-delta * 8.0))
      state.camera.updateProjectionMatrix()
    }
    if (isAnimatingToView.current && !autoRotate) {
      state.camera.position.lerp(targetCamPos.current, 1 - Math.exp(-delta * 6.0))
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 1 - Math.exp(-delta * 6.0))
        controlsRef.current.update()
      }
      if (state.camera.position.distanceTo(targetCamPos.current) < 0.03) {
        state.camera.position.copy(targetCamPos.current)
        isAnimatingToView.current = false
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      onStart={() => {
        isAnimatingToView.current = false
      }}
      enablePan={false}
      enableZoom={true}
      minDistance={3.0}
      maxDistance={9.5}
      minPolarAngle={Math.PI / 2.6}
      maxPolarAngle={Math.PI / 1.7}
      autoRotate={autoRotate}
      autoRotateSpeed={1.8}
      rotateSpeed={0.7}
      dampingFactor={0.08}
      enableDamping
    />
  )
}

function SceneLights() {
  return (
    <>
      <color attach="background" args={['#0e1012']} />
      <fog attach="fog" args={['#0e1012', 12, 24]} />
      <ambientLight intensity={0.55} color="#e6e8eb" />
      <hemisphereLight args={['#f0eee9', '#24272c', 1.2]} />

      {/* Front Key Light */}
      <directionalLight position={[-4, 3.5, 6]} intensity={3.2} color="#f4efe8" castShadow />
      {/* Front Soft Fill */}
      <directionalLight position={[4.5, 2.0, 5]} intensity={2.1} color="#cdd4dc" />
      {/* Back Rim Light (essential for edge separation and back graphics) */}
      <directionalLight position={[0, 4.5, -5.5]} intensity={3.5} color="#edf0f5" />
      {/* Left Sleeve Light */}
      <directionalLight position={[-6, 1.5, 0]} intensity={2.8} color="#e5e2db" />
      {/* Right Sleeve Light */}
      <directionalLight position={[6, 1.5, 0]} intensity={2.8} color="#e5e2db" />
    </>
  )
}

export function GarmentViewer3D({
  garment,
  color,
  view = 'front',
  scale = 0.84,
  autoRotate = false,
  showWireframe = false,
  zoomLevel = 1.0,
}) {
  return (
    <div className="garment-viewer-3d">
      <Canvas
        fallback={
          <div className="webgl-fallback" role="status">
            <img
              src={garment?.image}
              alt={`${garment?.name} ${view} view`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        }
        camera={{ position: [0, 0.0, 7.0], fov: 38 }}
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneLights />
        <GarmentModel3D
          garment={garment}
          color={color}
          view={view}
          scale={scale}
          showWireframe={showWireframe}
        />
        <ContactShadows
          position={[0, -2.6, 0]}
          opacity={0.52}
          scale={7.5}
          blur={2.2}
          far={5.0}
          color="#000000"
        />
        <CameraRig view={view} autoRotate={autoRotate} zoomLevel={zoomLevel} />
      </Canvas>
    </div>
  )
}
export default GarmentViewer3D
