import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArchitecturalProject } from '../types';
import { useI18n } from '../lib/i18n';
import {
  Sun,
  Moon,
  Sunset,
  Layers,
  Eye,
  Maximize2,
  RotateCw,
  Box,
  Compass,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';

interface ThreeDStudioProps {
  project: ArchitecturalProject;
  onUpdateProject?: (updated: ArchitecturalProject) => void;
  externalGesture?: {
    type: 'point' | 'pinch' | 'swipe' | 'rotate' | 'twoHand';
    x: number;
    y: number;
    deltaX?: number;
    deltaY?: number;
    scaleDelta?: number;
  } | null;
}

export const ThreeDStudio: React.FC<ThreeDStudioProps> = ({
  project,
  onUpdateProject,
  externalGesture
}) => {
  const { t, isRTL } = useI18n();
  const mountRef = useRef<HTMLDivElement>(null);

  // Lighting & View states
  const [lightingMode, setLightingMode] = useState<'day' | 'golden' | 'night'>('day');
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'front' | 'iso'>('perspective');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('living_pavilion');
  const [showRoof, setShowRoof] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showLandscape, setShowLandscape] = useState(true);
  const [activeAISuggestion, setActiveAISuggestion] = useState<{
    id: string;
    text: string;
    impact: string;
  } | null>({
    id: 'sug-1',
    text: 'Consider extending the cantilevered solar canopy by 80cm to shade the south-facing family pavilion.',
    impact: 'Reduces solar thermal load by 18% during peak summer afternoons.'
  });

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);

  // Dragging / Orbit internal tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 35, theta: Math.PI / 4, phi: Math.PI / 3 });
  const targetLookAtRef = useRef(new THREE.Vector3(0, 2, 0));

  // Handle external hand tracking gestures
  useEffect(() => {
    if (!externalGesture || !cameraRef.current) return;

    if (externalGesture.type === 'swipe' && externalGesture.deltaX !== undefined) {
      cameraSphericalRef.current.theta += externalGesture.deltaX * 0.01;
      updateCameraPosition();
    } else if (externalGesture.type === 'twoHand' && externalGesture.scaleDelta) {
      cameraSphericalRef.current.radius = Math.max(12, Math.min(60, cameraSphericalRef.current.radius - externalGesture.scaleDelta * 5));
      updateCameraPosition();
    } else if (externalGesture.type === 'rotate') {
      cameraSphericalRef.current.theta += 0.03;
      updateCameraPosition();
    }
  }, [externalGesture]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(targetLookAtRef.current);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(lightingMode === 'night' ? '#181513' : lightingMode === 'golden' ? '#F4E9DD' : '#EFE7DC');
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.5, 300);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'night' ? 0.75 : lightingMode === 'golden' ? 1.15 : 1.0;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xfff5eb, 0x54483c, 0.6);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    sunLight.position.set(20, 28, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0005;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    // Architectural Ground Plane (Limestone & Lawn)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xE8DFD5,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Cad Grid On Ground
    const grid = new THREE.GridHelper(50, 50, 0x8A7A6A, 0xD8CEC2);
    grid.position.y = 0.01;
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Building Group
    const buildingGroup = new THREE.Group();
    buildingGroupRef.current = buildingGroup;
    scene.add(buildingGroup);

    // Build Realistic Architectural Geometry
    buildArchitecturalModel(buildingGroup);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Mouse Interaction for Camera Orbit
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraSphericalRef.current.theta -= deltaX * 0.008;
      cameraSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
      );

      updateCameraPosition();
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraSphericalRef.current.radius = Math.max(
        10,
        Math.min(75, cameraSphericalRef.current.radius + e.deltaY * 0.03)
      );
      updateCameraPosition();
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update lighting mode dynamically
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current || !rendererRef.current) return;

    if (lightingMode === 'day') {
      sceneRef.current.background = new THREE.Color('#EFE7DC');
      sceneRef.current.fog = new THREE.FogExp2(0xEFE7DC, 0.015);
      sunLightRef.current.color.setHex(0xFFF9F0);
      sunLightRef.current.intensity = 1.8;
      sunLightRef.current.position.set(20, 28, 18);
      hemiLightRef.current.color.setHex(0xFFF5EB);
      hemiLightRef.current.intensity = 0.6;
      rendererRef.current.toneMappingExposure = 1.0;
    } else if (lightingMode === 'golden') {
      sceneRef.current.background = new THREE.Color('#F2DEC9');
      sceneRef.current.fog = new THREE.FogExp2(0xF2DEC9, 0.015);
      sunLightRef.current.color.setHex(0xFFAA55);
      sunLightRef.current.intensity = 2.2;
      sunLightRef.current.position.set(28, 9, 20);
      hemiLightRef.current.color.setHex(0xFFD6AA);
      hemiLightRef.current.intensity = 0.5;
      rendererRef.current.toneMappingExposure = 1.15;
    } else {
      // Night Mode
      sceneRef.current.background = new THREE.Color('#161311');
      sceneRef.current.fog = new THREE.FogExp2(0x161311, 0.02);
      sunLightRef.current.color.setHex(0x556688);
      sunLightRef.current.intensity = 0.3;
      sunLightRef.current.position.set(-15, 20, -15);
      hemiLightRef.current.color.setHex(0x332a24);
      hemiLightRef.current.intensity = 0.25;
      rendererRef.current.toneMappingExposure = 0.8;
    }
  }, [lightingMode]);

  // Construct Realistic Architectural Building
  const buildArchitecturalModel = (group: THREE.Group) => {
    // Clear previous
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Material definitions
    const travertineMat = new THREE.MeshStandardMaterial({
      color: 0xE8DFD2,
      roughness: 0.85,
      metalness: 0.04
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xD3C9BD,
      roughness: 0.9,
      metalness: 0.02
    });

    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x54483C,
      roughness: 0.6,
      metalness: 0.1
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      reflectivity: 0.9
    });

    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x88B3BA,
      roughness: 0.1,
      metalness: 0.35,
      transparent: true,
      opacity: 0.85
    });

    // 1. Raised Foundation Podium / Terrace
    const podiumGeo = new THREE.BoxGeometry(22, 0.5, 18);
    const podium = new THREE.Mesh(podiumGeo, concreteMat);
    podium.position.set(0, 0.25, 0);
    podium.receiveShadow = true;
    podium.castShadow = true;
    group.add(podium);

    // 2. Main Ground Floor Living Pavilion (Left Volume)
    const livingVolumeGeo = new THREE.BoxGeometry(9.5, 3.8, 12);
    const livingVolume = new THREE.Mesh(livingVolumeGeo, travertineMat);
    livingVolume.position.set(-5, 2.4, 0);
    livingVolume.castShadow = true;
    livingVolume.receiveShadow = true;
    group.add(livingVolume);

    // 3. Glazed Glass Corner / Curtain Wall on Living Pavilion
    const glassCurtainGeo = new THREE.BoxGeometry(8.2, 3.4, 0.1);
    const glassCurtain = new THREE.Mesh(glassCurtainGeo, glassMat);
    glassCurtain.position.set(-5, 2.4, 6.05);
    group.add(glassCurtain);

    // Subtle dark mullions
    for (let i = -3.5; i <= 3.5; i += 1.8) {
      const mullionGeo = new THREE.BoxGeometry(0.08, 3.4, 0.15);
      const mullion = new THREE.Mesh(mullionGeo, darkWoodMat);
      mullion.position.set(-5 + i, 2.4, 6.05);
      group.add(mullion);
    }

    // 4. Upper Floor Floating Cantilever Volume (Right Volume)
    const upperVolumeGeo = new THREE.BoxGeometry(10.5, 3.5, 11);
    const upperVolume = new THREE.Mesh(upperVolumeGeo, travertineMat);
    upperVolume.position.set(3.5, 5.8, -1);
    upperVolume.castShadow = true;
    upperVolume.receiveShadow = true;
    group.add(upperVolume);

    // Cantilever Balcony Deck with Glass Balustrade
    const balconyGeo = new THREE.BoxGeometry(10.5, 0.3, 3);
    const balcony = new THREE.Mesh(balconyGeo, darkWoodMat);
    balcony.position.set(3.5, 4.2, 5.5);
    balcony.castShadow = true;
    group.add(balcony);

    const balustradeGeo = new THREE.BoxGeometry(10.5, 1.1, 0.08);
    const balustrade = new THREE.Mesh(balustradeGeo, glassMat);
    balustrade.position.set(3.5, 4.8, 6.95);
    group.add(balustrade);

    // 5. Cantilevered Roof Canopy (Cantilevered Eaves)
    if (showRoof) {
      const roofGeo = new THREE.BoxGeometry(22, 0.4, 18);
      const roof = new THREE.Mesh(roofGeo, concreteMat);
      roof.position.set(0, 7.8, 0);
      roof.castShadow = true;
      group.add(roof);

      // Deep cedar wood louvered soffit under the canopy
      const soffitGeo = new THREE.BoxGeometry(21.5, 0.08, 17.5);
      const soffit = new THREE.Mesh(soffitGeo, darkWoodMat);
      soffit.position.set(0, 7.56, 0);
      group.add(soffit);
    }

    // 6. Reflection Pool / Water Courtyard
    if (showLandscape) {
      const poolGeo = new THREE.BoxGeometry(6.5, 0.4, 8);
      const pool = new THREE.Mesh(poolGeo, poolWaterMat);
      pool.position.set(5.5, 0.35, 1.5);
      pool.receiveShadow = true;
      group.add(pool);

      // Pool Stone Coping Border
      const copingGeo = new THREE.BoxGeometry(7.2, 0.45, 8.7);
      const coping = new THREE.Mesh(copingGeo, concreteMat);
      coping.position.set(5.5, 0.25, 1.5);
      group.add(coping);

      // Olive Tree / Courtyard Foliage Representation
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 2.8, 8);
      const trunk = new THREE.Mesh(trunkGeo, darkWoodMat);
      trunk.position.set(4, 1.7, 7.5);
      trunk.castShadow = true;
      group.add(trunk);

      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x6E7B68, roughness: 0.8 });
      const foliageGeo = new THREE.DodecahedronGeometry(1.4, 1);
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.set(4, 3.4, 7.5);
      foliage.castShadow = true;
      group.add(foliage);
    }

    // 7. Interior Warm Lights (visible at night or golden hour)
    const warmLight1 = new THREE.PointLight(0xFFAA44, 2.5, 14);
    warmLight1.position.set(-4, 3, 2);
    group.add(warmLight1);

    const warmLight2 = new THREE.PointLight(0xFFCC77, 2.0, 12);
    warmLight2.position.set(4, 5.5, 0);
    group.add(warmLight2);
  };

  const handleCameraPreset = (preset: 'perspective' | 'top' | 'front' | 'iso') => {
    setCameraPreset(preset);
    if (!cameraRef.current) return;

    if (preset === 'top') {
      cameraSphericalRef.current = { radius: 38, theta: 0, phi: 0.01 };
    } else if (preset === 'front') {
      cameraSphericalRef.current = { radius: 35, theta: 0, phi: Math.PI / 2.1 };
    } else if (preset === 'iso') {
      cameraSphericalRef.current = { radius: 36, theta: Math.PI / 4, phi: Math.PI / 3 };
    } else {
      cameraSphericalRef.current = { radius: 32, theta: Math.PI / 5, phi: Math.PI / 2.8 };
    }
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#FAF7F2] select-none overflow-hidden">
      {/* Top Professional Toolbar */}
      <div className="h-13 bg-[#FAF7F2] border-b border-[#D8CEC2] px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="font-serif-arch text-base font-semibold tracking-wider text-[#3F3832]">
            {project.name}
          </span>
          <span className="text-xs text-[#756A60] hidden sm:inline">
            · {project.buildingType} · {project.location}
          </span>
        </div>

        {/* Viewport Presets & Lighting Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-[#EFE6DA] p-0.5 rounded border border-[#D8CEC2]">
            <button
              onClick={() => setLightingMode('day')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                lightingMode === 'day' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C] hover:bg-[#FAF7F2]'
              }`}
              title={t('viewDay')}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('viewDay')}</span>
            </button>
            <button
              onClick={() => setLightingMode('golden')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                lightingMode === 'golden' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C] hover:bg-[#FAF7F2]'
              }`}
              title={t('viewGolden')}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('viewGolden')}</span>
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                lightingMode === 'night' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C] hover:bg-[#FAF7F2]'
              }`}
              title={t('viewNight')}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('viewNight')}</span>
            </button>
          </div>

          {/* Camera Presets */}
          <div className="flex items-center bg-[#EFE6DA] p-0.5 rounded border border-[#D8CEC2]">
            <button
              onClick={() => handleCameraPreset('perspective')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                cameraPreset === 'perspective' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C]'
              }`}
            >
              3D Orbit
            </button>
            <button
              onClick={() => handleCameraPreset('top')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                cameraPreset === 'top' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C]'
              }`}
            >
              {t('viewTop')}
            </button>
            <button
              onClick={() => handleCameraPreset('front')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                cameraPreset === 'front' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C]'
              }`}
            >
              {t('viewFront')}
            </button>
            <button
              onClick={() => handleCameraPreset('iso')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                cameraPreset === 'iso' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#54483C]'
              }`}
            >
              {t('viewIso')}
            </button>
          </div>

          {/* Toggle Layers */}
          <button
            onClick={() => setShowRoof(!showRoof)}
            className={`px-2.5 py-1 text-xs border rounded transition-colors ${
              showRoof ? 'bg-[#FAF7F2] border-[#54483C] text-[#54483C]' : 'bg-[#EFE6DA] border-[#D8CEC2] text-[#756A60]'
            }`}
          >
            {showRoof ? 'Roof: ON' : 'Roof: OFF'}
          </button>
        </div>
      </div>

      {/* Main Workspace (Viewport Center + Properties Right) */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Large 3D Viewport */}
        <div ref={mountRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative" />

        {/* Viewport Overlay HUD (Scale, Orientation & Gestures) */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
          <div className="bg-[#FAF7F2]/90 backdrop-blur border border-[#D8CEC2] px-3 py-1.5 rounded text-xs text-[#3F3832] shadow-sm flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#54483C]" />
            <span className="font-medium">North: 32° Azimuth</span>
            <span className="text-[#8A7A6A]">·</span>
            <span>Solar Altitude: {lightingMode === 'golden' ? '18°' : lightingMode === 'night' ? '-45°' : '62°'}</span>
          </div>

          {externalGesture && (
            <div className="bg-[#54483C] text-[#FAF7F2] px-3 py-1 rounded text-xs shadow-md animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Vision Tracking: {externalGesture.type.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Contextual Properties Panel (Right side) */}
        <div className="w-72 bg-[#FAF7F2] border-l border-[#D8CEC2] flex flex-col z-10 overflow-y-auto">
          <div className="p-3.5 border-b border-[#D8CEC2] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#54483C]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3F3832]">
                {t('objectProperties')}
              </span>
            </div>
            <span className="text-[11px] text-[#756A60]">Living Pavilion</span>
          </div>

          <div className="p-4 space-y-5 text-xs text-[#3F3832]">
            {/* Dimensions */}
            <div>
              <label className="font-medium text-[#756A60] block mb-2">{t('dimensions')}</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#EFE6DA] p-2 rounded border border-[#D8CEC2]">
                  <span className="text-[10px] text-[#756A60] block">{t('width')}</span>
                  <span className="font-semibold text-xs">9.50 m</span>
                </div>
                <div className="bg-[#EFE6DA] p-2 rounded border border-[#D8CEC2]">
                  <span className="text-[10px] text-[#756A60] block">{t('length')}</span>
                  <span className="font-semibold text-xs">12.00 m</span>
                </div>
                <div className="bg-[#EFE6DA] p-2 rounded border border-[#D8CEC2]">
                  <span className="text-[10px] text-[#756A60] block">{t('height')}</span>
                  <span className="font-semibold text-xs">3.80 m</span>
                </div>
              </div>
            </div>

            {/* Facade & Material Selection */}
            <div>
              <label className="font-medium text-[#756A60] block mb-1.5">{t('facadeStyle')}</label>
              <select
                value={project.facadeStyle}
                onChange={(e) => onUpdateProject && onUpdateProject({ ...project, facadeStyle: e.target.value as any })}
                className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2.5 py-1.5 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
              >
                <option value="Travertine Stone">Travertine Stone (Riyadh Limestone)</option>
                <option value="Fair-Faced Concrete">Fair-Faced Architectural Concrete</option>
                <option value="Cedar Wood Louvers">Cedar Wood Louvers & Terracotta</option>
                <option value="Textured Stucco">Natural Warm Textured Stucco</option>
              </select>
            </div>

            {/* Flooring Material */}
            <div>
              <label className="font-medium text-[#756A60] block mb-1.5">{t('material')}</label>
              <select
                value={project.flooringMaterial}
                onChange={(e) => onUpdateProject && onUpdateProject({ ...project, flooringMaterial: e.target.value as any })}
                className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2.5 py-1.5 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
              >
                <option value="Natural Limestone">Natural Limestone Pavers</option>
                <option value="Italian White Marble">Italian White Calacatta Marble</option>
                <option value="Warm White Oak">Wide-Plank White Oak</option>
                <option value="Polished Terrazzo">Custom Aggregate Polished Terrazzo</option>
              </select>
            </div>

            {/* Roof Canopy Style */}
            <div>
              <label className="font-medium text-[#756A60] block mb-1.5">{t('roofType')}</label>
              <select
                value={project.roofStyle}
                onChange={(e) => onUpdateProject && onUpdateProject({ ...project, roofStyle: e.target.value as any })}
                className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2.5 py-1.5 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
              >
                <option value="Cantilevered Eaves">Cantilevered Eaves with Cedar Soffit</option>
                <option value="Flat Modern Parapet">Flat Modern Parapet Roof</option>
                <option value="Pergola Terrace">Slatted Pergola Rooftop Lounge</option>
                <option value="Sloped Zinc">Standing Seam Zinc Canopy</option>
              </select>
            </div>

            {/* Wall Thickness & Floor Height */}
            <div className="space-y-3 pt-2 border-t border-[#D8CEC2]">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#756A60]">{t('thickness')}</span>
                  <span className="font-medium">{project.wallThickness * 100} cm</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.45"
                  step="0.05"
                  value={project.wallThickness}
                  onChange={(e) => onUpdateProject && onUpdateProject({ ...project, wallThickness: parseFloat(e.target.value) })}
                  className="w-full accent-[#54483C]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#756A60]">{t('height')}</span>
                  <span className="font-medium">{project.wallHeight.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="2.8"
                  max="4.5"
                  step="0.1"
                  value={project.wallHeight}
                  onChange={(e) => onUpdateProject && onUpdateProject({ ...project, wallHeight: parseFloat(e.target.value) })}
                  className="w-full accent-[#54483C]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Suggestion Bar */}
      {activeAISuggestion && (
        <div className="bg-[#FAF7F2] border-t border-[#D8CEC2] px-4 py-2.5 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#54483C]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-[#54483C] mr-1.5">AI Suggestion:</span>
              <span className="text-[#3F3832]">{activeAISuggestion.text}</span>
              <span className="text-[#756A60] ml-2 hidden lg:inline">({activeAISuggestion.impact})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Applied canopy extension. Model updated.');
                setActiveAISuggestion(null);
              }}
              className="px-2.5 py-1 bg-[#54483C] text-[#FAF7F2] rounded hover:bg-[#3F3832] transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => setActiveAISuggestion(null)}
              className="px-2 py-1 text-[#756A60] hover:text-[#3F3832]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
