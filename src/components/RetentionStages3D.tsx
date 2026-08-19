import { Line } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';

type Stage = { number: string; title: string };
type RetentionStages3DProps = { stages: Stage[] };

const stageColors = ['#c56a4a', '#d8a63d', '#f3ebdd', '#d8a63d'];

function StageScene({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const positions = useMemo(() => Array.from({ length: count }, (_, index) => {
    const x = (index - (count - 1) / 2) * 1.8;
    const z = Math.sin(index * 1.2) * 0.35;
    return new THREE.Vector3(x, 0, z);
  }), [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.04, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, pointer.x * -0.025, 0.04);
  });

  return (
    <group ref={groupRef} rotation={[0.18, -0.16, 0]}>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2, 4, 5]} intensity={2.2} color="#fff4df" />
      <pointLight position={[-3, 0, 2]} intensity={12} distance={10} color="#c56a4a" />
      <pointLight position={[3, 1, -2]} intensity={10} distance={10} color="#d8a63d" />
      <Line points={positions} color="#d8a63d" transparent opacity={0.5} lineWidth={1.3} />
      <Line points={positions.map((position) => new THREE.Vector3(position.x, -0.18, position.z))} color="#f3ebdd" transparent opacity={0.2} lineWidth={0.8} />
      {positions.map((position, index) => (
        <group key={index} position={position}>
          <mesh rotation={[0, index % 2 ? 0.45 : -0.35, 0]}>
            <boxGeometry args={[0.72, 0.72, 0.72]} />
            <meshStandardMaterial color={stageColors[index % stageColors.length]} roughness={0.3} metalness={0.2} emissive={stageColors[index % stageColors.length]} emissiveIntensity={0.12} />
          </mesh>
          <mesh position={[0, -0.5, 0]} scale={[1.3, 0.08, 1.3]}>
            <boxGeometry args={[0.72, 0.72, 0.72]} />
            <meshBasicMaterial color="#f3ebdd" transparent opacity={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.38]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RetentionStages3D({ stages }: RetentionStages3DProps) {
  const visibleStages = stages.slice(0, 4);
  const [isReduced, setIsReduced] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setIsReduced(media.matches);
    const canvas = document.createElement('canvas');
    setSupportsWebGL(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const live = supportsWebGL && !isReduced;
  const cssLive = !supportsWebGL || isReduced;
  const description = `${visibleStages.length} connected retention operating stages: ${visibleStages.map((stage) => `${stage.number} ${stage.title}`).join(', ')}.`;

  return (
    <div className={`retention-stages-visual ${live ? 'is-live' : 'is-static'}`} role="img" aria-label={description}>
      {cssLive && (
        <div className="retention-stages-css" aria-hidden="true">
          <div className="retention-stages-css__track">
            {visibleStages.map((stage, index) => (
              <span key={stage.number} className="retention-stages-css__node" style={{ '--stage-color': stageColors[index % stageColors.length] } as CSSProperties}>
                <b>{stage.number}</b>
                <i />
              </span>
            ))}
          </div>
        </div>
      )}
      {live && (
        <Canvas
          aria-hidden="true"
          camera={{ fov: 35, position: [0, 2.8, 7.4], near: 0.1, far: 30 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
        >
          <StageScene count={visibleStages.length} />
        </Canvas>
      )}
      <div className="retention-stages-legend">
        {visibleStages.map((stage, index) => (
          <div key={stage.number} className="retention-stages-legend__item">
            <span style={{ color: stageColors[index % stageColors.length] }}>{stage.number}</span>
            <strong>{stage.title}</strong>
          </div>
        ))}
      </div>
      <span className="sr-only">{description}</span>
    </div>
  );
}
