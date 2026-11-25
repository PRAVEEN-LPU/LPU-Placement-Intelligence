import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { roadCurve } from './roadCurve';

export default function WalkingCharacter({
  currentT = 0,
  targetT = 0,
  isWalking = false,
  onPositionUpdate,
}) {
  const characterGroupRef = useRef();

  // Articulated joint refs for smooth walking animation
  const torsoRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();

  // Internal animation state
  const animState = useRef({
    t: currentT,
    walkPhase: 0,
    idlePhase: 0,
  });

  // Keep animState.t updated when props change or external teleport
  useEffect(() => {
    animState.current.t = currentT;
  }, [currentT]);

  useFrame((state, delta) => {
    if (!characterGroupRef.current) return;

    const anim = animState.current;

    // 1. Move character along the CatmullRomCurve3
    if (isWalking) {
      const speed = 0.12; // curve progression per second
      const dist = targetT - anim.t;
      const step = Math.sign(dist) * Math.min(Math.abs(dist), speed * delta);
      anim.t += step;

      // Update walk cycle phase
      anim.walkPhase += delta * 9.5;
    } else {
      anim.idlePhase += delta * 2.2;
    }

    const tClamped = Math.max(0, Math.min(1.0, anim.t));
    const position = roadCurve.getPointAt(tClamped);
    const tangent = roadCurve.getTangentAt(tClamped).normalize();

    // Position character on the road surface
    characterGroupRef.current.position.set(position.x, position.y + 0.08, position.z);

    // Rotate character to align with the tangent of the curve
    if (tangent.lengthSq() > 0.001) {
      const lookTarget = new THREE.Vector3().copy(position).add(tangent);
      characterGroupRef.current.lookAt(lookTarget);
    }

    // Report live position to parent (for camera controller)
    if (onPositionUpdate) {
      onPositionUpdate(position, tangent, anim.t);
    }

    // 2. Animate articulated limbs
    const walkSwing = Math.sin(anim.walkPhase);
    const idleBreathe = Math.sin(anim.idlePhase);

    if (isWalking) {
      // Walking swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkSwing * 0.65;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkSwing * 0.65;

      if (leftArmRef.current) leftArmRef.current.rotation.x = -walkSwing * 0.55;
      if (rightArmRef.current) rightArmRef.current.rotation.x = walkSwing * 0.55;

      // Hip bobbing
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.65 + Math.abs(Math.sin(anim.walkPhase * 2)) * 0.04;
        torsoRef.current.rotation.x = 0.06; // slight forward stride lean
      }
    } else {
      // Idle breathing & relaxed pose
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(anim.idlePhase) * 0.04;
        leftArmRef.current.rotation.z = 0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(anim.idlePhase) * 0.04;
        rightArmRef.current.rotation.z = -0.08;
      }

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.65 + idleBreathe * 0.015;
        torsoRef.current.rotation.x = 0;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(anim.idlePhase * 0.5) * 0.05;
      }
    }
  });

  return (
    <group ref={characterGroupRef} scale={0.75}>
      {/* Dynamic Character Shadow Disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.45} />
      </mesh>

      {/* 3D Humanoid Body Hierarchy */}
      <group position={[0, 0, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.14, 0.62, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.55, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} /> {/* Dark Denim */}
          </mesh>
          {/* Shoe / Sneaker */}
          <mesh position={[0, -0.58, 0.05]} castShadow>
            <boxGeometry args={[0.11, 0.1, 0.24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} /> {/* White Sneaker */}
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.14, 0.62, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.55, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.58, 0.05]} castShadow>
            <boxGeometry args={[0.11, 0.1, 0.24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        </group>

        {/* Torso & Upper Body */}
        <group ref={torsoRef} position={[0, 0.65, 0]}>
          {/* Hoodie / Jacket */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.38, 0.55, 0.22]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} /> {/* Light Grey Hoodie */}
          </mesh>

          {/* BACKPACK WITH GLOWING CODE LOGO (from reference image) */}
          <group position={[0, 0.32, -0.16]}>
            {/* Backpack body */}
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.44, 0.18]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} /> {/* Black Tech Backpack */}
            </mesh>

            {/* Glowing cyan insignia badge */}
            <mesh position={[0, 0.02, -0.095]}>
              <planeGeometry args={[0.16, 0.12]} />
              <meshBasicMaterial color="#0ea5e9" />
            </mesh>

            {/* HTML Glowing </> Logo */}
            <Html
              position={[0, 0.02, -0.105]}
              transform
              scale={0.08}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '22px',
                  textShadow: '0 0 10px #38bdf8, 0 0 20px #0284c7',
                  userSelect: 'none',
                  textAlign: 'center',
                }}
              >
                &lt;/&gt;
              </div>
            </Html>
          </group>

          {/* Head & Hair */}
          <group ref={headRef} position={[0, 0.72, 0]}>
            {/* Head */}
            <mesh castShadow>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.6} /> {/* Skin Tone */}
            </mesh>
            {/* Dark Hair */}
            <mesh position={[0, 0.04, -0.02]}>
              <sphereGeometry args={[0.14, 14, 14]} />
              <meshStandardMaterial color="#18181b" roughness={0.9} />
            </mesh>
          </group>

          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.24, 0.52, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.48, 8]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.48, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#fbcfe8" />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.24, 0.52, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.48, 8]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.48, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#fbcfe8" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
