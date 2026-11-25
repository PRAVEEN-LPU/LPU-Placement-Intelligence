import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import MountainEnvironment from './MountainEnvironment';
import ZigZagRoad from './ZigZagRoad';
import WalkingCharacter from './WalkingCharacter';
import RoadMilestones from './RoadMilestones';
import CameraController from './CameraController';
import TaskDashboard from './TaskDashboard';
import { MILESTONES_DATA } from './roadCurve';

export default function RoadScene({
  completedStops = [],
  onToggleStop,
  onResetStops,
}) {
  const [activeMilestone, setActiveMilestone] = useState(MILESTONES_DATA[0]);
  const [characterT, setCharacterT] = useState(0.0);
  const [targetT, setTargetT] = useState(0.0);
  const [isWalking, setIsWalking] = useState(false);
  const [isPlayingJourney, setIsPlayingJourney] = useState(false);

  // Live character coordinates (from WalkingCharacter useFrame)
  const characterPosRef = useRef(new THREE.Vector3(-7.5, 0.4, 13.0));
  const characterTangentRef = useRef(new THREE.Vector3(0, 0, -1));

  // Journey sequence timer
  const journeyTimerRef = useRef(null);

  // When walking finishes (character reaches targetT)
  const handlePositionUpdate = useCallback((pos, tangent, currentT) => {
    characterPosRef.current.copy(pos);
    characterTangentRef.current.copy(tangent);

    // Check if reached destination
    if (isWalking && Math.abs(currentT - targetT) < 0.008) {
      setCharacterT(targetT);
      setIsWalking(false);

      // If in journey auto-play mode, queue next milestone after short pause
      if (isPlayingJourney) {
        const nextIdx = MILESTONES_DATA.findIndex((m) => m.id === activeMilestone.id) + 1;
        if (nextIdx < MILESTONES_DATA.length) {
          journeyTimerRef.current = setTimeout(() => {
            selectMilestone(MILESTONES_DATA[nextIdx]);
          }, 2400);
        } else {
          setIsPlayingJourney(false);
        }
      }
    }
  }, [isWalking, targetT, isPlayingJourney, activeMilestone]);

  // Select milestone handler
  const selectMilestone = useCallback((milestone) => {
    if (journeyTimerRef.current) clearTimeout(journeyTimerRef.current);
    setActiveMilestone(milestone);
    setTargetT(milestone.t);
    setIsWalking(true);
  }, []);

  // Play journey through all milestones
  const handlePlayJourney = useCallback(() => {
    setIsPlayingJourney(true);
    // If already at or near the end, reset to start first
    if (characterT >= 0.95) {
      setCharacterT(0.0);
      setTargetT(MILESTONES_DATA[0].t);
      setActiveMilestone(MILESTONES_DATA[0]);
      setIsWalking(true);
    } else {
      // Find current or next milestone
      const nextMilestone = MILESTONES_DATA.find((m) => m.t > characterT + 0.02) || MILESTONES_DATA[0];
      selectMilestone(nextMilestone);
    }
  }, [characterT, selectMilestone]);

  // Pause journey
  const handlePauseJourney = useCallback(() => {
    if (journeyTimerRef.current) clearTimeout(journeyTimerRef.current);
    setIsPlayingJourney(false);
    setIsWalking(false);
    setTargetT(characterT);
  }, [characterT]);

  // Reset journey to Start point
  const handleResetJourney = useCallback(() => {
    if (journeyTimerRef.current) clearTimeout(journeyTimerRef.current);
    setIsPlayingJourney(false);
    setIsWalking(true);
    setTargetT(0.0);
    setActiveMilestone(MILESTONES_DATA[0]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (journeyTimerRef.current) clearTimeout(journeyTimerRef.current);
    };
  }, []);

  const progressPercent = Math.round((completedStops.length / MILESTONES_DATA.length) * 100);

  return (
    <div className="roadmap-3d-viewport-container">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [-8.5, 4.2, 19.5], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#0f172a'); // Deep dusk twilight sky
          scene.fog = new THREE.FogExp2('#1e293b', 0.018); // Atmospheric mountain haze
        }}
      >
        {/* Dynamic Trailing Camera */}
        <CameraController
          characterPos={characterPosRef.current}
          characterTangent={characterTangentRef.current}
          isWalking={isWalking}
        />

        {/* 3D Floating Mountain Scene Environment */}
        <MountainEnvironment />

        {/* Zigzag Mountain Road Ribbon */}
        <ZigZagRoad />

        {/* 6 Interactive 3D Milestones */}
        <RoadMilestones
          activeMilestoneId={activeMilestone?.id}
          completedIds={completedStops}
          onSelectMilestone={selectMilestone}
        />

        {/* 3D Humanoid Walking Character */}
        <WalkingCharacter
          currentT={characterT}
          targetT={targetT}
          isWalking={isWalking}
          onPositionUpdate={handlePositionUpdate}
        />
      </Canvas>

      {/* Floating Interactive 2D HUD Dashboard Overlay */}
      <TaskDashboard
        activeMilestone={activeMilestone}
        completedIds={completedStops}
        isWalking={isWalking}
        isPlayingJourney={isPlayingJourney}
        onSelectMilestone={selectMilestone}
        onPlayJourney={handlePlayJourney}
        onPauseJourney={handlePauseJourney}
        onResetJourney={handleResetJourney}
        onToggleComplete={onToggleStop}
        progressPercent={progressPercent}
      />
    </div>
  );
}
