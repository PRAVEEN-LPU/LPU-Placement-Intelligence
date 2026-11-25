import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { BookOpen, Code2, TrendingUp, Target, Briefcase, Trophy, Check } from 'lucide-react';
import { roadCurve, MILESTONES_DATA } from './roadCurve';

const ICON_MAP = {
  book: BookOpen,
  code: Code2,
  'trending-up': TrendingUp,
  target: Target,
  briefcase: Briefcase,
  trophy: Trophy,
};

export default function RoadMilestones({
  activeMilestoneId,
  completedIds = [],
  onSelectMilestone,
}) {
  return (
    <group>
      {MILESTONES_DATA.map((milestone) => {
        const point = roadCurve.getPointAt(milestone.t);
        const tangent = roadCurve.getTangentAt(milestone.t).normalize();
        
        // Offset signboard slightly to the side of the road
        const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
        const sideOffset = milestone.id % 2 === 0 ? -1.8 : 1.8;
        const signPos = new THREE.Vector3().copy(point).addScaledVector(normal, sideOffset);
        signPos.y += 1.8;

        const isSelected = activeMilestoneId === milestone.id;
        const isCompleted = completedIds.includes(milestone.id);
        const Icon = ICON_MAP[milestone.icon] || Target;

        return (
          <group key={milestone.id} position={[point.x, point.y, point.z]}>
            {/* Ground Checkpoint Pin Ring */}
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, 0.55, 24]} />
              <meshStandardMaterial
                color={isSelected ? '#ffffff' : milestone.badgeColor}
                emissive={milestone.badgeColor}
                emissiveIntensity={isSelected ? 3.5 : 1.5}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Ground Pointer Dot */}
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshStandardMaterial
                color={milestone.badgeColor}
                emissive={milestone.badgeColor}
                emissiveIntensity={2.5}
              />
            </mesh>

            {/* Connecting Neon Ground Beam */}
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
              <meshStandardMaterial
                color={milestone.badgeColor}
                emissive={milestone.badgeColor}
                emissiveIntensity={1.8}
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* Floating Neon Signboard / 3D HTML Card matching reference image */}
            <Html
              position={[sideOffset * 0.7, 1.8, 0]}
              center
              distanceFactor={18}
              zIndexRange={[100, 0]}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMilestone(milestone);
                }}
                className={`roadmap-3d-pin-card ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                style={{
                  '--card-accent': milestone.badgeColor,
                  '--card-glow': milestone.glowColor,
                }}
              >
                {/* Pin Top Notch */}
                <div className="card-inner">
                  <div className="card-icon-bubble">
                    {isCompleted ? (
                      <Check size={18} className="text-emerald-300" />
                    ) : (
                      <Icon size={18} style={{ color: milestone.badgeColor }} />
                    )}
                  </div>
                  <div className="card-text-block">
                    <div className="card-title-row">
                      <span className="card-milestone-title">{milestone.title}</span>
                      {isCompleted && <span className="card-cleared-pill">✓ Met</span>}
                    </div>
                    <span className="card-milestone-subtitle">{milestone.subtitle}</span>
                  </div>
                </div>
                {/* Pointer Arrow */}
                <div className="card-pointer-stem" />
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
