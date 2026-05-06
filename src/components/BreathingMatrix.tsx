import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const GRID_SIZE_X = 32;
const GRID_SIZE_Y = 32;
const SPACING = 0.8;
const TOTAL = GRID_SIZE_X * GRID_SIZE_Y;
const CYCLE_DURATION = 7;
const TRANSITION_DURATION = 2;
const BREATHING_AMPLITUDE = 0.01;
const BREATHING_SPEED = 2.5;

const vertexShader = `
  precision highp float;
  attribute vec3 instancePosition;
  attribute float instanceScale;
  attribute vec4 colorData;
  uniform float uTime;
  uniform sampler2D uCurrentPositions;
  uniform sampler2D uTargetPositions;
  uniform float uTransition;
  uniform vec3 uMouse;
  uniform vec2 uGridSize;
  uniform float uIdleStrength;
  varying vec4 vColorData;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  #define PI 3.141592653589793

  void main() {
    float row = float(gl_InstanceID) / uGridSize.x;
    float col = mod(float(gl_InstanceID), uGridSize.x);
    vec2 uv = vec2(col / uGridSize.x, row / uGridSize.y);

    vec3 currentPos = texture2D(uCurrentPositions, uv).xyz;
    vec3 targetPos = texture2D(uTargetPositions, uv).xyz;

    float t = -(cos(PI * uTransition) - 1.0) / 2.0;
    vec3 finalPos = mix(currentPos, targetPos, t);

    vec3 localPosition = position;
    localPosition.xy *= instanceScale;

    float idleNoise = sin(uTime * 0.7 + instancePosition.x * 0.3) * cos(uTime * 0.5 + instancePosition.z * 0.2);
    idleNoise += sin(uTime * 1.1 + instancePosition.z * 0.4) * 0.5 * uIdleStrength;
    finalPos += idleNoise;

    if (uMouse.z > 0.0) {
      vec2 mousePos = uMouse.xy;
      vec2 delta = mousePos - finalPos.xz;
      float dist = length(delta);
      if (dist < 10.0) {
        float falloff = pow(1.0 - dist / 10.0, 2.0);
        finalPos.y += falloff * 3.0;
      }
    }

    mat4 modelMatrix = mat4(1.0);
    modelMatrix[3].xyz = finalPos;

    vec4 mvPosition = modelViewMatrix * modelMatrix * vec4(localPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
    vColorData = colorData;
    vUv = uv;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uPalette;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uTime;
  uniform float uColorIntensity;
  uniform float uIdleStrength;
  varying vec4 vColorData;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    float mixFactor = vUv.x + sin(uTime * 0.2 + vColorData.r * 10.0) * 0.1;
    mixFactor = clamp(mixFactor, 0.0, 1.0);

    vec4 color1 = texture2D(uPalette, vec2(mixFactor, 0.5));
    vec4 color2 = texture2D(uPalette, vec2(1.0 - mixFactor, 0.5));
    vec4 finalColor = mix(color1, color2, vColorData.g);
    finalColor *= 1.0 + vColorData.b * uColorIntensity;

    float idleDim = 1.0 - uIdleStrength * 0.3;
    finalColor.rgb *= idleDim;

    float fogDepth = length(vViewPosition.xyz);
    float fogFactor = 1.0 - exp(-(uFogDensity * fogDepth) * (uFogDensity * fogDepth));
    finalColor.rgb = mix(finalColor.rgb, uFogColor, fogFactor);

    gl_FragColor = finalColor;
  }
`;

function createPaletteTexture(): THREE.DataTexture {
  const palette = [
    [0.0, 0.0, 0.0],
    [0.05, 0.05, 0.2],
    [0.1, 0.1, 0.8],
    [0.25, 0.41, 0.88],
    [0.02, 0.71, 0.83],
    [0.06, 0.73, 0.49],
    [0.96, 0.59, 0.04],
    [0.98, 0.45, 0.09],
    [0.94, 0.27, 0.27],
    [1.0, 1.0, 1.0],
  ];
  const data = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const idx = t * (palette.length - 1);
    const low = Math.floor(idx);
    const high = Math.min(low + 1, palette.length - 1);
    const frac = idx - low;
    const c1 = palette[low];
    const c2 = palette[high];
    data[i * 4] = Math.floor((c1[0] + (c2[0] - c1[0]) * frac) * 255);
    data[i * 4 + 1] = Math.floor((c1[1] + (c2[1] - c1[1]) * frac) * 255);
    data[i * 4 + 2] = Math.floor((c1[2] + (c2[2] - c1[2]) * frac) * 255);
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, 256, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const formations = [
  // Helix
  (i: number, total: number, time: number, _gx: number, _gy: number, _s: number) => {
    const angle = i * 0.1 + time * 0.5;
    const radius = 12;
    const y = (i - total * 0.5) * 0.05;
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  },
  // Spiral
  (i: number, total: number, _t: number, _gx: number, _gy: number, spacing: number) => {
    const angle = i * 0.2;
    const radius = 2 + i * 0.01;
    const y = (i - total * 0.5) * spacing * 0.5;
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  },
  // Sphere
  (i: number, total: number, time: number, _gx: number, _gy: number, _s: number) => {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 10 + Math.sin(time + i) * 2;
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  },
  // Wave
  (i: number, _total: number, time: number, gridSizeX: number, gridSizeY: number, spacing: number) => {
    const x = (i % gridSizeX - gridSizeX / 2) * spacing;
    const z = (Math.floor(i / gridSizeX) - gridSizeY / 2) * spacing;
    const y = Math.sin(x * 0.3 + time) * Math.cos(z * 0.3 + time) * 3;
    return new THREE.Vector3(x, y, z);
  },
  // Cylinder
  (i: number, _total: number, _t: number, _gx: number, gridSizeY: number, spacing: number) => {
    const angle = (i / gridSizeY) * Math.PI * 2;
    const radius = 8;
    const y = (i % gridSizeY - gridSizeY / 2) * spacing;
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  },
  // Ripple
  (i: number, _total: number, time: number, gridSizeX: number, gridSizeY: number, spacing: number) => {
    const x = (i % gridSizeX - gridSizeX / 2) * spacing;
    const z = (Math.floor(i / gridSizeX) - gridSizeY / 2) * spacing;
    const y = Math.sin(Math.sqrt(x * x + z * z) * 0.5 - time * 2) * 2;
    return new THREE.Vector3(x, y, z);
  },
  // Ring
  (i: number, total: number, time: number, _gx: number, _gy: number, _s: number) => {
    const angle = (i / total) * Math.PI * 2;
    const radius = 15 + Math.sin(time * 2 + i * 0.1) * 2;
    const y = Math.sin(i + time) * 0.5;
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  },
] as const;

function computeFormationPositions(formationIndex: number, time: number): Float32Array {
  const positions = new Float32Array(TOTAL * 3);
  const formationFn = formations[formationIndex % formations.length] as unknown as (
    i: number, total: number, time: number, gx: number, gy: number, s: number
  ) => THREE.Vector3;
  for (let i = 0; i < TOTAL; i++) {
    const pos = formationFn(i, TOTAL, time, GRID_SIZE_X, GRID_SIZE_Y, SPACING);
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;
  }
  return positions;
}

function createPositionTexture(positions: Float32Array): THREE.DataTexture {
  const texture = new THREE.DataTexture(positions, GRID_SIZE_X, GRID_SIZE_Y, THREE.RGBFormat, THREE.FloatType);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

function ParticleSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const mouseNDC = useMemo(() => new THREE.Vector2(), []);

  const currentFormation = useRef(0);
  const cycleTime = useRef(0);
  const isTransitioning = useRef(false);

  const { camera, pointer } = useThree();

  const paletteTexture = useMemo(() => createPaletteTexture(), []);

  const [currentPositionsTex, targetPositionsTex, basePositions] = useMemo(() => {
    const basePositions = new Float32Array(TOTAL * 3);
    for (let i = 0; i < TOTAL; i++) {
      const col = i % GRID_SIZE_X;
      const row = Math.floor(i / GRID_SIZE_X);
      basePositions[i * 3] = (col - GRID_SIZE_X / 2) * SPACING;
      basePositions[i * 3 + 1] = 0;
      basePositions[i * 3 + 2] = (row - GRID_SIZE_Y / 2) * SPACING;
    }
    const currentPos = computeFormationPositions(0, 0);
    const targetPos = computeFormationPositions(1, 0);
    return [
      createPositionTexture(currentPos),
      createPositionTexture(targetPos),
      basePositions,
    ];
  }, []);

  const [geometry] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.5, 0.5, 2, 2);
    const instancePositions = new Float32Array(TOTAL * 3);
    const instanceScales = new Float32Array(TOTAL);
    const colorData = new Float32Array(TOTAL * 4);

    for (let i = 0; i < TOTAL; i++) {
      instancePositions[i * 3] = basePositions[i * 3];
      instancePositions[i * 3 + 1] = basePositions[i * 3 + 1];
      instancePositions[i * 3 + 2] = basePositions[i * 3 + 2];
      instanceScales[i] = 0.6 + Math.random() * 0.4;
      colorData[i * 4] = Math.random();
      colorData[i * 4 + 1] = Math.random();
      colorData[i * 4 + 2] = Math.random();
      colorData[i * 4 + 3] = 1.0;
    }

    geo.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(instancePositions, 3));
    geo.setAttribute('instanceScale', new THREE.InstancedBufferAttribute(instanceScales, 1));
    geo.setAttribute('colorData', new THREE.InstancedBufferAttribute(colorData, 4));

    return [geo, { instancePositions, instanceScales, colorData }];
  }, [basePositions]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCurrentPositions: { value: currentPositionsTex },
    uTargetPositions: { value: targetPositionsTex },
    uTransition: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uRippleCenter: { value: new THREE.Vector2(0, 0) },
    uGridSize: { value: new THREE.Vector2(GRID_SIZE_X, GRID_SIZE_Y) },
    uIdleStrength: { value: 0 },
    uPalette: { value: paletteTexture },
    uFogColor: { value: new THREE.Vector3(0.04, 0.04, 0.04) },
    uFogDensity: { value: 0.035 },
    uColorIntensity: { value: 1.2 },
  }), [currentPositionsTex, targetPositionsTex, paletteTexture]);

  function cycleFormations(fromFormation: number) {
    const nextFormation = (fromFormation + 1) % formations.length;
    const newPositions = computeFormationPositions(nextFormation, 0);
    const newTexture = createPositionTexture(newPositions);

    if (materialRef.current) {
      const mat = materialRef.current;
      const oldCurrent = mat.uniforms.uCurrentPositions.value as THREE.DataTexture;
      mat.uniforms.uCurrentPositions.value = mat.uniforms.uTargetPositions.value;
      mat.uniforms.uTargetPositions.value = newTexture;
      mat.uniforms.uTransition.value = 0;
      if (oldCurrent) oldCurrent.dispose();
    }
  }

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const time = performance.now() * 0.001;
    const mat = materialRef.current;
    mat.uniforms.uTime.value = time;

    cycleTime.current += delta;

    if (cycleTime.current >= CYCLE_DURATION) {
      cycleTime.current = 0;
      isTransitioning.current = true;
      cycleFormations(currentFormation.current);
    }

    if (isTransitioning.current) {
      const t = Math.min(cycleTime.current / TRANSITION_DURATION, 1);
      mat.uniforms.uTransition.value = t;
      if (t >= 1.0) {
        isTransitioning.current = false;
        currentFormation.current = (currentFormation.current + 1) % formations.length;
      }
    }

    const breathingPhase = Math.sin(cycleTime.current * BREATHING_SPEED) * 0.5 + 0.5;
    const idleStrength = breathingPhase * BREATHING_AMPLITUDE;
    mat.uniforms.uIdleStrength.value = idleStrength;

    // Raycast mouse to ground plane
    mouseNDC.set(pointer.x, pointer.y);
    raycaster.setFromCamera(mouseNDC, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, target);
    if (target) {
      mouseRef.current.set(target.x, target.z, 1);
      mat.uniforms.uMouse.value.set(target.x, target.z, 1);
    }
  });

  useEffect(() => {
    const handlePointerLeave = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value.set(0, 0, 0);
      }
    };
    document.body.addEventListener('pointerleave', handlePointerLeave);
    return () => document.body.removeEventListener('pointerleave', handlePointerLeave);
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, TOTAL]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

export default function BreathingMatrix() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 45, position: [0, 30, 0], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
