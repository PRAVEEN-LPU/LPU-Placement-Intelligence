import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function CameraController({
  characterPos,
  characterTangent,
  isWalking,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Smooth camera tracking targets
  const targetCamPos = useRef(new THREE.Vector3(-7.5, 4.0, 19.0));
  const targetLookAt = useRef(new THREE.Vector3(-7.5, 1.2, 13.0));

  useEffect(() => {
    // Initial camera position looking up the mountain road
    camera.position.set(-8.5, 4.2, 19.5);
    camera.lookAt(-7.5, 1.2, 13.0);
  }, [camera]);

  useFrame((state, delta) => {
    if (!characterPos) return;

    if (isWalking) {
      // Third-person trailing camera behind the character along tangent
      const tangent = characterTangent || new THREE.Vector3(0, 0, -1);
      const distBehind = 5.2;
      const heightAbove = 2.8;

      // Position camera behind character
      targetCamPos.current.set(
        characterPos.x - tangent.x * distBehind,
        characterPos.y + heightAbove,
        characterPos.z - tangent.z * distBehind
      );

      // Look slightly ahead of character
      targetLookAt.current.set(
        characterPos.x + tangent.x * 2.5,
        characterPos.y + 1.2,
        characterPos.z + tangent.z * 2.5
      );

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos.current, delta * 3.2);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, delta * 3.5);
        controlsRef.current.update();
      } else {
        camera.lookAt(targetLookAt.current);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below terrain
      minDistance={3.5}
      maxDistance={45}
      enabled={!isWalking} // Let user freely orbit/zoom when idle; follow during walking
    />
  );
}
