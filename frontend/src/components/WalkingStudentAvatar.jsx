import React from 'react';

export default function WalkingStudentAvatar({ isWalking = false }) {
  return (
    <svg
      viewBox="0 0 100 120"
      width="64"
      height="78"
      style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}
      aria-label="Student walking on highway"
    >
      <defs>
        {/* Glow filter for backpack code insignia */}
        <filter id="codeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="hoodieGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="jeansGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Dynamic Walking Shadow */}
      <ellipse cx="50" cy="114" rx="22" ry="6" fill="#020617" opacity="0.45" />

      {/* Main Character Body Group */}
      <g className={isWalking ? 'walking-stride' : 'idle-breathing'}>
        {/* LEFT LEG */}
        <g className={isWalking ? 'leg-left-anim' : ''}>
          <rect x="36" y="74" width="10" height="28" rx="5" fill="url(#jeansGrad)" />
          {/* Left White Sneaker */}
          <rect x="33" y="100" width="16" height="9" rx="3" fill="#f8fafc" />
          <rect x="33" y="106" width="16" height="3" fill="#0284c7" />
        </g>

        {/* RIGHT LEG */}
        <g className={isWalking ? 'leg-right-anim' : ''}>
          <rect x="54" y="74" width="10" height="28" rx="5" fill="url(#jeansGrad)" />
          {/* Right White Sneaker */}
          <rect x="51" y="100" width="16" height="9" rx="3" fill="#f8fafc" />
          <rect x="51" y="106" width="16" height="3" fill="#0284c7" />
        </g>

        {/* TORSO & HOODIE */}
        <rect x="32" y="36" width="36" height="42" rx="8" fill="url(#hoodieGrad)" />

        {/* TECH BACKPACK WITH GLOWING CODE INSIGNIA */}
        <g transform="translate(0, 0)">
          {/* Backpack Main Body */}
          <rect x="36" y="38" width="28" height="34" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          {/* Pocket */}
          <rect x="40" y="52" width="20" height="16" rx="4" fill="#1e293b" />
          {/* GLOWING CYAN </> LOGO */}
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="11"
            fontWeight="900"
            fontFamily="monospace"
            filter="url(#codeGlow)"
          >
            &lt;/&gt;
          </text>
        </g>

        {/* HEAD & HAIR */}
        <circle cx="50" cy="22" r="12" fill="#fed7aa" />
        {/* Hair */}
        <path d="M 38 22 Q 50 10 62 22 Q 50 14 38 22 Z" fill="#1e293b" />
        <ellipse cx="50" cy="14" rx="12" ry="6" fill="#1e293b" />

        {/* LEFT ARM */}
        <g className={isWalking ? 'arm-left-anim' : ''}>
          <rect x="24" y="38" width="8" height="28" rx="4" fill="url(#hoodieGrad)" />
          <circle cx="28" cy="67" r="4" fill="#fed7aa" />
        </g>

        {/* RIGHT ARM */}
        <g className={isWalking ? 'arm-right-anim' : ''}>
          <rect x="68" y="38" width="8" height="28" rx="4" fill="url(#hoodieGrad)" />
          <circle cx="72" cy="67" r="4" fill="#fed7aa" />
        </g>
      </g>

      <style>{`
        .walking-stride {
          transform-origin: 50% 110px;
        }
        .leg-left-anim {
          transform-origin: 41px 74px;
          animation: legSwingLeft 0.5s ease-in-out infinite alternate;
        }
        .leg-right-anim {
          transform-origin: 59px 74px;
          animation: legSwingRight 0.5s ease-in-out infinite alternate;
        }
        .arm-left-anim {
          transform-origin: 28px 38px;
          animation: armSwingLeft 0.5s ease-in-out infinite alternate;
        }
        .arm-right-anim {
          transform-origin: 72px 38px;
          animation: armSwingRight 0.5s ease-in-out infinite alternate;
        }
        @keyframes legSwingLeft {
          from { transform: rotate(-24deg); }
          to   { transform: rotate(24deg); }
        }
        @keyframes legSwingRight {
          from { transform: rotate(24deg); }
          to   { transform: rotate(-24deg); }
        }
        @keyframes armSwingLeft {
          from { transform: rotate(22deg); }
          to   { transform: rotate(-22deg); }
        }
        @keyframes armSwingRight {
          from { transform: rotate(-22deg); }
          to   { transform: rotate(22deg); }
        }
        .idle-breathing {
          animation: idleBreath 2s ease-in-out infinite alternate;
        }
        @keyframes idleBreath {
          from { transform: translateY(0); }
          to   { transform: translateY(-2px); }
        }
      `}</style>
    </svg>
  );
}
