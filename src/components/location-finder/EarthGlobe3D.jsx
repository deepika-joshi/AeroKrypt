import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getLocationCoordinates, latLngToVector3 } from '../../services/locationRegistryService.js'

// High-resolution NASA Blue Marble equirectangular texture CDN with fallback
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const EARTH_TOPOGRAPHY_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png'

/**
 * Creates an offline procedural Earth canvas texture so the 3D globe never renders black.
 */
function createProceduralEarthCanvas() {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 1. Deep Ocean Base Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  oceanGrad.addColorStop(0, '#091b33')
  oceanGrad.addColorStop(0.5, '#0e2a52')
  oceanGrad.addColorStop(1, '#091b33')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 2. Continental Landmass Silhouettes (Simplified equirectangular approximation)
  ctx.fillStyle = '#263b2c' // Sage-green land base

  // Eurasia & Africa
  ctx.beginPath()
  ctx.ellipse(550, 170, 200, 100, -0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(520, 280, 80, 110, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Americas
  ctx.beginPath()
  ctx.ellipse(250, 170, 120, 90, -0.2, 0, Math.PI * 2) // North America
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(320, 340, 70, 120, 0.3, 0, Math.PI * 2) // South America
  ctx.fill()

  // Australia
  ctx.beginPath()
  ctx.ellipse(780, 360, 60, 45, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Arid Deserts (Sahara, Atacama, Middle East, Australia interior in ochre)
  ctx.fillStyle = '#615339'
  ctx.beginPath()
  ctx.ellipse(510, 220, 70, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(310, 320, 30, 50, 0.2, 0, Math.PI * 2)
  ctx.fill()

  // 3. Polar Ice Caps (Greenland & Antarctica)
  ctx.fillStyle = '#eef6fc'
  ctx.fillRect(0, 0, canvas.width, 24) // Arctic
  ctx.fillRect(0, canvas.height - 35, canvas.width, 35) // Antarctica
  ctx.beginPath()
  ctx.ellipse(370, 55, 45, 30, 0, 0, Math.PI * 2) // Greenland
  ctx.fill()

  // 4. Subtle Geodetic Coordinate Graticules (30° intervals)
  ctx.strokeStyle = 'rgba(0, 210, 255, 0.08)'
  ctx.lineWidth = 1
  for (let x = 0; x < canvas.width; x += canvas.width / 12) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y < canvas.height; y += canvas.height / 6) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  // Equator highlight
  ctx.strokeStyle = 'rgba(0, 210, 255, 0.18)'
  ctx.beginPath()
  ctx.moveTo(0, canvas.height / 2)
  ctx.lineTo(canvas.width, canvas.height / 2)
  ctx.stroke()

  return canvas
}

export default function EarthGlobe3D({
  locations = [],
  activeLocationId = null,
  onSelectLocation = null,
  onEvaluateSite = null,
  onOpenAddModal = null,
  filterBody = 'ALL', // 'ALL' | 'MARS' | 'MOON' | 'DUAL' | 'FACILITY'
  onFilterChange = null,
}) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const markersGroupRef = useRef(null)
  const earthMeshRef = useRef(null)
  const cloudsMeshRef = useRef(null)
  const animFrameIdRef = useRef(null)
  const flyToTargetRef = useRef(null)

  const [isRotating, setIsRotating] = useState(true)
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [hudCardOpen, setHudCardOpen] = useState(true)

  // Enrich locations with verified lat/lng
  const parsedLocations = useMemo(() => {
    return locations.map((loc) => {
      const coords = getLocationCoordinates(loc)
      return {
        ...loc,
        lat: coords.lat,
        lng: coords.lng,
      }
    })
  }, [locations])

  // Filter locations according to target
  const visibleLocations = useMemo(() => {
    return parsedLocations.filter((loc) => {
      if (filterBody === 'MARS') {
        return (
          loc.targetBodies?.includes('Mars') ||
          loc.analogueRelevance === 'MARS' ||
          loc.primaryTarget === 'Mars'
        )
      }
      if (filterBody === 'MOON') {
        return (
          loc.targetBodies?.includes('Moon') ||
          loc.analogueRelevance === 'MOON' ||
          loc.primaryTarget === 'Moon'
        )
      }
      if (filterBody === 'DUAL') {
        return (
          (loc.targetBodies?.includes('Mars') && loc.targetBodies?.includes('Moon')) ||
          loc.analogueRelevance === 'BOTH'
        )
      }
      if (filterBody === 'FACILITY') {
        return loc.locationCategory === 'RESEARCH_FACILITY'
      }
      return true
    })
  }, [parsedLocations, filterBody])

  // Selected Location Object
  const selectedLocation = useMemo(() => {
    if (!activeLocationId) return parsedLocations[0] || null
    return parsedLocations.find((l) => l.id === activeLocationId) || parsedLocations[0] || null
  }, [parsedLocations, activeLocationId])

  // Search filtered results for quick dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return parsedLocations.filter((l) => {
      const matchName = l.name.toLowerCase().includes(q)
      const matchCountry = l.country?.toLowerCase().includes(q)
      const matchRegion = l.region?.toLowerCase().includes(q)
      const matchTerrain = l.terrainType?.toLowerCase().includes(q)
      return matchName || matchCountry || matchRegion || matchTerrain
    }).slice(0, 6)
  }, [parsedLocations, searchQuery])

  // Fly Camera to location
  const flyToLocation = useCallback((lat, lng, zoomDistance = 210) => {
    if (!cameraRef.current || !controlsRef.current) return

    const rawPos = latLngToVector3(lat, lng, zoomDistance)
    const targetPos = new THREE.Vector3(rawPos.x, rawPos.y, rawPos.z)
    flyToTargetRef.current = {
      targetPos,
      lookAt: new THREE.Vector3(0, 0, 0),
      progress: 0,
    }
  }, [])

  // Auto fly to selected location when activeLocationId changes
  useEffect(() => {
    if (selectedLocation) {
      flyToLocation(selectedLocation.lat, selectedLocation.lng, 220)
    }
  }, [selectedLocation, flyToLocation])

  // =========================================================================
  // Initialize Three.js Scene, Camera, Lights, Earth & Controls
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = container.clientHeight || 580

    // 1. Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050608)
    sceneRef.current = scene

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000)
    camera.position.set(0, 40, 280)
    cameraRef.current = camera

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.8
    controls.zoomSpeed = 1.1
    controls.minDistance = 135
    controls.maxDistance = 650
    controls.enablePan = false
    controlsRef.current = controls

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x8ba2c4, 1.2)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4)
    sunLight.position.set(300, 120, 200)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x163056, 0.8)
    fillLight.position.set(-250, -80, -180)
    scene.add(fillLight)

    // 6. Deep Cosmic Starfield Background
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1200
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = THREE.MathUtils.randFloat(700, 1400)
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2)
      const phi = THREE.MathUtils.randFloat(0, Math.PI)
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i + 2] = r * Math.cos(phi)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.4,
      transparent: true,
      opacity: 0.65,
    })
    const starPoints = new THREE.Points(starGeo, starMat)
    scene.add(starPoints)

    // 7. Earth Sphere Mesh
    const earthRadius = 100
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64)

    // Baseline canvas texture (instant rendering)
    const fallbackCanvas = createProceduralEarthCanvas()
    const canvasTexture = fallbackCanvas ? new THREE.CanvasTexture(fallbackCanvas) : null
    if (canvasTexture) {
      canvasTexture.colorSpace = THREE.SRGBColorSpace
    }

    const earthMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      roughness: 0.75,
      metalness: 0.1,
    })

    const earthMesh = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earthMesh)
    earthMeshRef.current = earthMesh

    // Asynchronously upgrade to high-res NASA Blue Marble texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      EARTH_TEXTURE_URL,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        earthMat.map = tex
        earthMat.needsUpdate = true
      },
      undefined,
      (err) => {
        console.warn('Remote NASA Blue Marble texture unavailable, retained procedural baseline:', err)
      }
    )

    // Optional topography bump map
    textureLoader.load(
      EARTH_TOPOGRAPHY_URL,
      (bumpTex) => {
        earthMat.bumpMap = bumpTex
        earthMat.bumpScale = 0.8
        earthMat.needsUpdate = true
      },
      undefined,
      () => {}
    )

    // 8. Atmospheric Rim Glow Sphere
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.018, 48, 48)
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat)
    scene.add(atmosMesh)

    // 9. Translucent Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.008, 48, 48)
    const cloudsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    })
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat)
    scene.add(cloudsMesh)
    cloudsMeshRef.current = cloudsMesh

    // 10. Markers Group
    const markersGroup = new THREE.Group()
    scene.add(markersGroup)
    markersGroupRef.current = markersGroup

    // 11. Raycaster for Interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const markerMeshes = markersGroup.children.filter((c) => c.userData?.location)
      const intersects = raycaster.intersectObjects(markerMeshes, true)

      if (intersects.length > 0) {
        let hitObj = intersects[0].object
        while (hitObj && !hitObj.userData?.location && hitObj.parent) {
          hitObj = hitObj.parent
        }
        if (hitObj?.userData?.location) {
          setHoveredLocation(hitObj.userData.location)
          renderer.domElement.style.cursor = 'pointer'
          return
        }
      }

      setHoveredLocation(null)
      renderer.domElement.style.cursor = 'grab'
    }

    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const markerMeshes = markersGroup.children.filter((c) => c.userData?.location)
      const intersects = raycaster.intersectObjects(markerMeshes, true)

      if (intersects.length > 0) {
        let hitObj = intersects[0].object
        while (hitObj && !hitObj.userData?.location && hitObj.parent) {
          hitObj = hitObj.parent
        }
        if (hitObj?.userData?.location) {
          const loc = hitObj.userData.location
          if (onSelectLocation) {
            onSelectLocation(loc.id)
          }
          setHudCardOpen(true)
          flyToLocation(loc.lat, loc.lng)
        }
      }
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('click', handleClick)

    // 12. Dynamic Container Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect
        if (w > 0 && h > 0) {
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
        }
      }
    })
    resizeObserver.observe(container)

    // 13. Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate)

      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      // Handle Smooth Camera Fly-To Interpolation
      if (flyToTargetRef.current) {
        const ft = flyToTargetRef.current
        ft.progress += delta * 1.8
        if (ft.progress >= 1.0) {
          camera.position.copy(ft.targetPos)
          flyToTargetRef.current = null
        } else {
          // Smooth easeInOut cubic interpolation
          const t = ft.progress < 0.5 ? 4 * ft.progress * ft.progress * ft.progress : 1 - Math.pow(-2 * ft.progress + 2, 3) / 2
          camera.position.lerp(ft.targetPos, t * 0.15)
        }
      }

      // Gentle auto-rotation when not interacting
      if (isRotating && !controls.state && !flyToTargetRef.current) {
        earthMesh.rotation.y += 0.0006
        if (cloudsMesh) cloudsMesh.rotation.y += 0.0009
        markersGroup.rotation.y = earthMesh.rotation.y
      } else {
        markersGroup.rotation.y = earthMesh.rotation.y
      }

      // Animate pulsing marker rings
      markersGroup.children.forEach((markerGroup) => {
        const ring = markerGroup.children.find((c) => c.name === 'pulseRing')
        if (ring) {
          const pulse = (Math.sin(elapsed * 4 + (markerGroup.userData.pulseOffset || 0)) + 1) / 2
          ring.scale.set(1 + pulse * 0.6, 1 + pulse * 0.6, 1)
          ring.material.opacity = 0.8 - pulse * 0.6
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Teardown
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('click', handleClick)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [flyToLocation, isRotating, onSelectLocation])

  // =========================================================================
  // Re-Plot Markers on the 3D Globe when visibleLocations or activeLocationId changes
  // =========================================================================
  useEffect(() => {
    const markersGroup = markersGroupRef.current
    if (!markersGroup) return

    // Clear existing markers
    while (markersGroup.children.length > 0) {
      const child = markersGroup.children[0]
      markersGroup.remove(child)
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose())
        else child.material.dispose()
      }
    }

    const earthRadius = 100

    visibleLocations.forEach((loc, idx) => {
      const isSelected = loc.id === activeLocationId
      const isMoon = loc.analogueRelevance === 'MOON' || (loc.targetBodies && !loc.targetBodies.includes('Mars') && loc.targetBodies.includes('Moon'))
      const isDual = loc.analogueRelevance === 'BOTH' || (loc.targetBodies && loc.targetBodies.includes('Mars') && loc.targetBodies.includes('Moon'))
      const isFacility = loc.locationCategory === 'RESEARCH_FACILITY'
      const isUnverified = loc.verificationStatus === 'UNVERIFIED'

      // Color coding
      let colorHex = isUnverified
        ? 0xfacc15 // Warning Yellow
        : isDual
        ? 0xeab308 // Solar Amber
        : isMoon
        ? 0xcbd5e1 // Lunar Silver
        : isFacility
        ? 0xc084fc // Orbital Violet
        : 0xf97316 // Martian Orange-Red

      if (isSelected) {
        colorHex = 0x00d2ff // Active Bright Cyan Reticle
      }

      // Calculate 3D position directly on sphere
      const markerGroup = new THREE.Group()
      markerGroup.userData = {
        location: loc,
        pulseOffset: idx * 0.4,
      }

      // 1. Surface Beacon Pin Base
      const pinHeight = isSelected ? 8 : 5
      const pinRadius = isSelected ? 0.9 : 0.6
      const pinGeo = new THREE.CylinderGeometry(pinRadius * 0.5, pinRadius, pinHeight, 8)
      pinGeo.translate(0, pinHeight / 2, 0)
      const pinMat = new THREE.MeshBasicMaterial({ color: colorHex })
      const pinMesh = new THREE.Mesh(pinGeo, pinMat)

      // 2. Glowing Head Node Sphere
      const headGeo = new THREE.SphereGeometry(isSelected ? 2.4 : 1.6, 12, 12)
      headGeo.translate(0, pinHeight, 0)
      const headMat = new THREE.MeshBasicMaterial({ color: colorHex })
      const headMesh = new THREE.Mesh(headGeo, headMat)

      // 3. Concentric Ground Wave Pulse Ring
      const ringGeo = new THREE.RingGeometry(pinRadius * 1.5, pinRadius * 4.5, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.name = 'pulseRing'
      ringMesh.rotation.x = -Math.PI / 2

      markerGroup.add(pinMesh)
      markerGroup.add(headMesh)
      markerGroup.add(ringMesh)

      // Position and orient marker perpendicularly to sphere surface
      const rawPos = latLngToVector3(loc.lat, loc.lng, earthRadius)
      const pos = new THREE.Vector3(rawPos.x, rawPos.y, rawPos.z)
      markerGroup.position.copy(pos)

      // Orient marker so local Y points outward from globe center
      const normal = pos.clone().normalize()
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)

      markersGroup.add(markerGroup)
    })
  }, [visibleLocations, activeLocationId])

  // Reset Camera View
  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      flyToTargetRef.current = {
        targetPos: new THREE.Vector3(0, 40, 280),
        lookAt: new THREE.Vector3(0, 0, 0),
        progress: 0,
      }
      controlsRef.current.reset()
    }
  }

  // Zoom Controls
  const handleZoom = (delta) => {
    if (!cameraRef.current) return
    const cam = cameraRef.current
    const dir = cam.position.clone().normalize()
    const currentDist = cam.position.length()
    const nextDist = Math.max(140, Math.min(600, currentDist + delta))
    cam.position.copy(dir.multiplyScalar(nextDist))
  }

  return (
    <div
      className="earth-globe-3d-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '580px',
        backgroundColor: '#050608',
        borderRadius: '2px',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
      }}
      aria-label="Interactive 3D Earth Globe"
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* =========================================================================
          HUD OVERLAY 1: TOP SCIENTIFIC STATUS STRIP
          ========================================================================= */}
      <div
        className="globe-hud-top-bar font-mono"
        style={{
          position: 'absolute',
          top: 12,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(5, 6, 8, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-subtle)',
            padding: '6px 14px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>
            // 3D PLANETARY GEODESY GLOBE
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {visibleLocations.length} / {parsedLocations.length} Sites Active
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '2px',
              backgroundColor: 'rgba(0, 210, 255, 0.15)',
              color: '#00d2ff',
              border: '1px solid rgba(0, 210, 255, 0.3)',
            }}
          >
            WGS 84 / WebGL
          </span>
        </div>

        {/* Search Bar with Auto-Fly to Location */}
        <div style={{ pointerEvents: 'auto', position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search globe sites..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px',
              fontSize: '11.5px',
              backgroundColor: 'rgba(5, 6, 8, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              borderRadius: '2px',
              fontFamily: 'monospace',
            }}
            aria-label="Search globe locations"
          />

          {isSearchFocused && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: 'rgba(8, 12, 20, 0.98)',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
                zIndex: 50,
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onMouseDown={() => {
                    if (onSelectLocation) onSelectLocation(res.id)
                    flyToLocation(res.lat, res.lng)
                    setSearchQuery('')
                    setHudCardOpen(true)
                  }}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#ffffff',
                  }}
                  className="dropdown-hover-item"
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{res.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{res.country}</div>
                  </div>
                  <span className="font-mono" style={{ fontSize: '9px', color: 'var(--accent-cyan)' }}>
                    {res.analogueRelevance || res.primaryTarget}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          HUD OVERLAY 2: CELESTIAL TARGET FILTER STRIP (Bottom Left)
          ========================================================================= */}
      <div
        className="globe-hud-filters font-mono"
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          zIndex: 10,
        }}
      >
        {[
          { id: 'ALL', label: 'All Sites', icon: '🌐' },
          { id: 'MARS', label: 'Mars Analogues', icon: '🔴' },
          { id: 'MOON', label: 'Moon Analogues', icon: '⚪' },
          { id: 'DUAL', label: 'Dual Sites', icon: '⚖️' },
          { id: 'FACILITY', label: 'Facilities', icon: '⌂' },
        ].map((tab) => {
          const isActive = filterBody === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange && onFilterChange(tab.id)}
              style={{
                background: isActive ? 'rgba(0, 210, 255, 0.25)' : 'rgba(5, 6, 8, 0.85)',
                color: isActive ? '#00d2ff' : '#cbd5e1',
                border: '1px solid',
                borderColor: isActive ? '#00d2ff' : 'rgba(255, 255, 255, 0.15)',
                padding: '5px 10px',
                fontSize: '11px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backdropFilter: 'blur(6px)',
                textTransform: 'uppercase',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}

        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="btn-aerospace font-mono"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              backgroundColor: 'rgba(0, 210, 255, 0.12)',
              borderColor: 'var(--accent-cyan)',
              color: '#ffffff',
            }}
          >
            + Add Location
          </button>
        )}
      </div>

      {/* =========================================================================
          HUD OVERLAY 3: NAVIGATION CONTROLS (Bottom Right)
          ========================================================================= */}
      <div
        className="globe-hud-controls font-mono"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          style={{
            background: 'rgba(5, 6, 8, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: isRotating ? 'var(--accent-cyan)' : 'var(--text-muted)',
            padding: '6px 10px',
            fontSize: '11px',
            borderRadius: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          {isRotating ? '⏸ Spin' : '▶ Spin'}
        </button>

        <button
          type="button"
          onClick={() => handleZoom(-35)}
          title="Zoom In"
          style={{
            background: 'rgba(5, 6, 8, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          +
        </button>

        <button
          type="button"
          onClick={() => handleZoom(35)}
          title="Zoom Out"
          style={{
            background: 'rgba(5, 6, 8, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          &minus;
        </button>

        <button
          type="button"
          onClick={handleResetView}
          title="Reset Globe View"
          style={{
            background: 'rgba(5, 6, 8, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '6px 10px',
            fontSize: '11px',
            borderRadius: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            textTransform: 'uppercase',
          }}
        >
          ↺ Reset
        </button>
      </div>

      {/* =========================================================================
          HUD OVERLAY 4: HOVER TOOLTIP BADGE
          ========================================================================= */}
      {hoveredLocation && (
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            top: 54,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8, 12, 20, 0.95)',
            border: '1px solid var(--accent-cyan)',
            padding: '6px 14px',
            borderRadius: '2px',
            fontSize: '11px',
            color: '#ffffff',
            pointerEvents: 'none',
            zIndex: 15,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 210, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#00d2ff' }}>⊕</span>
          <strong>{hoveredLocation.name}</strong>
          <span style={{ color: 'var(--text-muted)' }}>({hoveredLocation.country})</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 5px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
            }}
          >
            {hoveredLocation.analogueRelevance || hoveredLocation.primaryTarget}
          </span>
        </div>
      )}

      {/* =========================================================================
          HUD OVERLAY 5: ACTIVE LOCATION RETICLE CARD (Interactive Marker Dossier)
          ========================================================================= */}
      {hudCardOpen && selectedLocation && (
        <aside
          className="aerospace-card font-mono"
          style={{
            position: 'absolute',
            top: 56,
            right: 16,
            width: '320px',
            backgroundColor: 'rgba(5, 8, 14, 0.96)',
            border: '1px solid rgba(0, 210, 255, 0.35)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 210, 255, 0.15)',
            padding: '16px',
            borderRadius: '2px',
            zIndex: 20,
            backdropFilter: 'blur(12px)',
          }}
          aria-label={`Active site profile for ${selectedLocation.name}`}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(0, 210, 255, 0.15)',
                  color: '#00d2ff',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  fontWeight: 700,
                }}
              >
                {selectedLocation.analogueRelevance || selectedLocation.primaryTarget} ANALOGUE
              </span>
              <span
                style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  backgroundColor: selectedLocation.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                  color: selectedLocation.verificationStatus === 'VERIFIED' ? '#4ade80' : '#facc15',
                  border: `1px solid ${selectedLocation.verificationStatus === 'VERIFIED' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(250, 204, 21, 0.4)'}`,
                  fontWeight: 700,
                }}
              >
                {selectedLocation.verificationStatus || 'AUDITED'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setHudCardOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '18px',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '0 2px',
              }}
              title="Close HUD Card"
            >
              &times;
            </button>
          </div>

          <h3
            style={{
              fontSize: '14px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '2px 0',
              textTransform: 'uppercase',
              lineHeight: 1.25,
            }}
          >
            {selectedLocation.name}
          </h3>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {selectedLocation.region}, <strong>{selectedLocation.country}</strong>
          </div>

          {/* Quick Telemetry Specs */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '8px 10px',
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '12px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Coordinates: </span>
              <span style={{ color: 'var(--accent-cyan)' }}>
                {selectedLocation.coordinates || `${selectedLocation.lat.toFixed(4)}°, ${selectedLocation.lng.toFixed(4)}°`}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Terrain: </span>
              <span style={{ color: '#ffffff' }}>{selectedLocation.terrainType}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Lithology: </span>
              <span style={{ color: '#cbd5e1' }}>
                {selectedLocation.lithology ? selectedLocation.lithology.slice(0, 3).join(', ') : 'Cataloged'}
              </span>
            </div>
            {selectedLocation.elevation && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Elevation: </span>
                <span style={{ color: '#ffffff' }}>{selectedLocation.elevation.label}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {onEvaluateSite && (
              <button
                type="button"
                className="btn-aerospace btn-aerospace-cyan"
                onClick={() => onEvaluateSite(selectedLocation.id)}
                style={{ padding: '7px 12px', fontSize: '11px', textAlign: 'center' }}
              >
                <span>OPEN COMPLETE SITE EVALUATION</span>
                <span>&rarr;</span>
              </button>
            )}

            <button
              type="button"
              className="btn-aerospace"
              onClick={() => {
                if (onSelectLocation) onSelectLocation(selectedLocation.id)
              }}
              style={{ padding: '6px 12px', fontSize: '11px', textAlign: 'center' }}
            >
              <span>INSPECT FULL PROFILE DOSSIER</span>
              <span>❯</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
