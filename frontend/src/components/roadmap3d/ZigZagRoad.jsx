import React, { useMemo } from 'react';
import * as THREE from 'three';
import { roadCurve } from './roadCurve';

export default function ZigZagRoad() {
  // Generate high-resolution 3D road ribbon geometry along CatmullRomCurve3
  const { roadGeometry, leftBorderGeo, rightBorderGeo, dashGeometries } = useMemo(() => {
    const segments = 240;
    const roadWidth = 2.4;
    const halfWidth = roadWidth / 2;

    const vertices = [];
    const uvs = [];
    const indices = [];

    const leftBorderPoints = [];
    const rightBorderPoints = [];
    const centerPoints = [];

    // Sample points along the curve
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = roadCurve.getPointAt(t);
      const tangent = roadCurve.getTangentAt(t).normalize();
      
      // Calculate perpendicular normal in horizontal XZ plane
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // Left and right road vertices
      const leftPt = new THREE.Vector3().copy(point).addScaledVector(normal, halfWidth);
      const rightPt = new THREE.Vector3().copy(point).addScaledVector(normal, -halfWidth);

      // Slightly lift above terrain
      leftPt.y += 0.05;
      rightPt.y += 0.05;
      point.y += 0.06;

      vertices.push(leftPt.x, leftPt.y, leftPt.z);
      vertices.push(rightPt.x, rightPt.y, rightPt.z);

      const v = (i / segments) * 45; // Repeat texture coordinates
      uvs.push(0, v);
      uvs.push(1, v);

      leftBorderPoints.push(leftPt);
      rightBorderPoints.push(rightPt);
      centerPoints.push(point);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    // Glowing border tubes (left and right)
    const leftCurve = new THREE.CatmullRomCurve3(leftBorderPoints);
    const rightCurve = new THREE.CatmullRomCurve3(rightBorderPoints);
    const leftGeo = new THREE.TubeGeometry(leftCurve, 200, 0.08, 8, false);
    const rightGeo = new THREE.TubeGeometry(rightCurve, 200, 0.08, 8, false);

    // Center dashes
    const dashes = [];
    const dashCount = 55;
    for (let d = 0; d < dashCount; d++) {
      const t1 = (d * 2) / (dashCount * 2);
      const t2 = (d * 2 + 1) / (dashCount * 2);
      if (t2 <= 0.98) {
        const p1 = roadCurve.getPointAt(t1);
        const p2 = roadCurve.getPointAt(t2);
        p1.y += 0.07;
        p2.y += 0.07;
        const lineCurve = new THREE.LineCurve3(p1, p2);
        dashes.push(new THREE.TubeGeometry(lineCurve, 2, 0.04, 4, false));
      }
    }

    return {
      roadGeometry: roadGeo,
      leftBorderGeo: leftGeo,
      rightBorderGeo: rightGeo,
      dashGeometries: dashes,
    };
  }, []);

  // Start point coordinates
  const startPos = roadCurve.getPointAt(0);

  return (
    <group>
      {/* 1. Main Asphalt Surface */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial
          color="#334155"
          roughness={0.7}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Left Glowing Border (Warm Gold / Neon Orange) */}
      <mesh geometry={leftBorderGeo}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* 3. Right Glowing Border */}
      <mesh geometry={rightBorderGeo}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* 4. White Center Dashed Lane Lines */}
      {dashGeometries.map((geo, idx) => (
        <mesh key={idx} geometry={geo}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* 5. Start Point Glowing Circle */}
      <group position={[startPos.x, startPos.y + 0.08, startPos.z]}>
        {/* Outer pulsating neon cyan ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 48]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={3.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Inner glow disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.85, 32]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
