import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ROAD_POINTS } from './roadCurve';

export default function MountainEnvironment() {
  // Generate mountain rock formations following the road curves
  const rocks = useMemo(() => {
    const list = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const point = ROAD_POINTS[Math.min(i % ROAD_POINTS.length, ROAD_POINTS.length - 1)];
      const offsetX = (Math.random() - 0.5) * 4.5;
      const offsetZ = (Math.random() - 0.5) * 3.5;
      const scale = 0.4 + Math.random() * 0.9;
      list.push({
        position: [point.x + offsetX, point.y - 0.2 + (Math.random() * 0.3), point.z + offsetZ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: [scale * 1.2, scale * 0.8, scale * 1.1],
        color: Math.random() > 0.5 ? '#475569' : '#334155',
      });
    }
    return list;
  }, []);

  // Generate 3D cloud clusters floating in the valley
  const clouds = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const x = -18 + Math.random() * 36;
      const y = -2.5 + Math.random() * 7.5;
      const z = -25 + Math.random() * 40;
      const scale = 2.5 + Math.random() * 4.0;
      list.push({ position: [x, y, z], scale });
    }
    return list;
  }, []);

  // Start signpost position
  const startSignPos = [-8.8, 0.4, 13.8];

  // Goal peak position
  const goalPeakPos = [3.2, 10.8, -19.5];

  return (
    <group>
      {/* 1. Atmospheric Golden Hour Lighting */}
      <ambientLight color="#94a3b8" intensity={0.9} />
      
      {/* Warm Golden Key Sunlight */}
      <directionalLight
        position={[25, 35, 15]}
        intensity={2.2}
        color="#fed7aa"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Cool Horizon Rim Light (Backlight) */}
      <directionalLight position={[-20, 20, -30]} intensity={1.1} color="#60a5fa" />
      <pointLight position={[3.2, 12, -19.5]} intensity={3.0} color="#fbbf24" distance={15} />

      {/* 2. Floating Mountain Terrain Base */}
      <group position={[0, -1.0, -4]}>
        {/* Massive Cliff Body */}
        <mesh position={[-2, 1.5, 2]} receiveShadow>
          <cylinderGeometry args={[14, 22, 18, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Mid-Tier Mountain Outcrop */}
        <mesh position={[4, 5.0, -8]} receiveShadow>
          <cylinderGeometry args={[11, 16, 14, 10]} />
          <meshStandardMaterial color="#334155" roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Summit Pinnacle Ridge */}
        <mesh position={[3.2, 8.5, -19.5]} receiveShadow>
          <coneGeometry args={[7, 12, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>

        {/* Green Grass Ledges along the cliff */}
        <mesh position={[-2, 3.8, 3]} receiveShadow>
          <cylinderGeometry args={[12, 13, 0.6, 10]} />
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </mesh>
        <mesh position={[3, 7.8, -9]} receiveShadow>
          <cylinderGeometry args={[9, 10, 0.6, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Scattered Rocks & Boulders along road edges */}
      {rocks.map((rock, idx) => (
        <mesh
          key={idx}
          position={rock.position}
          rotation={rock.rotation}
          scale={rock.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={rock.color} roughness={0.85} />
        </mesh>
      ))}

      {/* 4. Dreamy 3D Clouds Floating in the Valley below the road */}
      {clouds.map((cloud, idx) => (
        <group key={idx} position={cloud.position} scale={cloud.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.0, 12, 12]} />
            <meshStandardMaterial
              color="#fed7aa"
              emissive="#ffedd5"
              emissiveIntensity={0.25}
              transparent
              opacity={0.7}
              roughness={1.0}
            />
          </mesh>
          <mesh position={[0.7, 0.2, 0.2]}>
            <sphereGeometry args={[0.8, 10, 10]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={1.0} />
          </mesh>
          <mesh position={[-0.6, -0.1, 0.3]}>
            <sphereGeometry args={[0.75, 10, 10]} />
            <meshStandardMaterial color="#fed7aa" transparent opacity={0.65} roughness={1.0} />
          </mesh>
        </group>
      ))}

      {/* 5. Start Wooden Signpost ("My Roadmap") */}
      <group position={startSignPos} rotation={[0, 0.4, 0]}>
        {/* Signpost Pole */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 2.0, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Wooden Board */}
        <mesh position={[0, 1.6, 0.05]} castShadow>
          <boxGeometry args={[1.5, 0.9, 0.12]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {/* HTML Label on Signboard */}
        <Html
          position={[0, 1.6, 0.15]}
          transform
          scale={0.4}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'transparent',
              color: '#fef3c7',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              width: '140px',
              userSelect: 'none',
              lineHeight: 1.2,
            }}
          >
            My<br />Roadmap
          </div>
        </Html>
      </group>

      {/* 6. Summit Pinnacle Beacon & Flag ("Goal") */}
      <group position={goalPeakPos}>
        {/* Glowing Golden Summit Ring */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.6, 32]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#eab308"
            emissiveIntensity={4.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Flag Pole */}
        <mesh position={[0.8, 1.6, -0.5]}>
          <cylinderGeometry args={[0.04, 0.05, 3.2, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Red Summit Flag */}
        <mesh position={[1.2, 2.8, -0.5]}>
          <boxGeometry args={[0.7, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}
