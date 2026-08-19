import { Line } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';

type RetentionLoop3DProps = {
  fallbackSrc: string;
  alt: string;
};

const nodeColors = ['#c56a4a', '#d8a63d', '#f3ebdd', '#c56a4a', '#d8a63d', '#f3ebdd', '#c56a4a', '#d8a63d'];

function LoopScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const positions = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
    return new THREE.Vector3(Math.cos(angle) * 2.55, 0, Math.sin(angle) * 2.55);
  }), []);
  const loopPoints = useMemo(() => [...positions, positions[0]], [positions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.16;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.08, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, pointer.x * -0.06, 0.04);
  });

  return (
    <group ref={groupRef} rotation={[0.22, 0, 0]}>
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} color="#fff4df" />
      <pointLight position={[-4, 1, -3]} intensity={18} distance={12} color="#c56a4a" />
      <pointLight position={[4, 0, 2]} intensity={14} distance={10} color="#d8a63d" />

      <Line points={loopPoints} color="#c56a4a" transparent opacity={0.45} lineWidth={1.2} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.035, 10, 96]} />
        <meshBasicMaterial color="#f3ebdd" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color="#f3ebdd" roughness={0.35} metalness={0.08} />
      </mesh>
      <mesh scale={0.7}>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshBasicMaterial color="#c56a4a" transparent opacity={0.28} />
      </mesh>

      {positions.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <sphereGeometry args={[0.28, 20, 20]} />
            <meshStandardMaterial color={nodeColors[index]} emissive={nodeColors[index]} emissiveIntensity={0.16} roughness={0.32} metalness={0.14} />
          </mesh>
          <mesh position={[0, 0.03, 0]} scale={0.42}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color="#050505" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RetentionLoop3D({ fallbackSrc, alt }: RetentionLoop3DProps) {
  const [isReduced, setIsReduced] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMotion = () => setIsReduced(media.matches);
    const canvas = document.createElement('canvas');
    const webgl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setSupportsWebGL(Boolean(webgl));
    checkMotion();
    media.addEventListener?.('change', checkMotion);
    return () => media.removeEventListener?.('change', checkMotion);
  }, []);

  const live = supportsWebGL && !isReduced;
  const cssLive = !supportsWebGL && !isReduced;

  return (
    <div className={`retention-loop-visual ${live ? 'is-live' : 'is-static'}`} role="img" aria-label={alt}>
      <img className="retention-loop-poster" src={fallbackSrc} alt="" aria-hidden="true" />
      {cssLive && (
        <div className="retention-loop-css" aria-hidden="true">
          <div className="retention-loop-css__orbit">
            <span className="retention-loop-css__core" />
            {nodeColors.map((color, index) => (
              <span
                key={index}
                className="retention-loop-css__node"
                style={{ '--node-angle': `${index * 45}deg`, '--node-color': color, '--node-delay': `${index * 0.16}s` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
      {live && (
        <Canvas
          aria-hidden="true"
          camera={{ fov: 36, position: [0, 3.2, 6.8], near: 0.1, far: 30 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
        >
          <LoopScene />
        </Canvas>
      )}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
