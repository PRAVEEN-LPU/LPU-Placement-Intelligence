import React, { useMemo } from 'react';

/**
 * Ambient floating bubbles background layer.
 * Generates subtle, very small (4px - 12px) bubbles that float smoothly
 * in the background without affecting text readability or user clicks.
 */
export default function BackgroundBubbles() {
  const bubbles = useMemo(() => {
    const items = [
      { id: 1, left: 3, size: 6, dur: 18, delay: 0, opacity: 0.35 },
      { id: 2, left: 8, size: 9, dur: 22, delay: 4, opacity: 0.4 },
      { id: 3, left: 14, size: 5, dur: 16, delay: 2, opacity: 0.3 },
      { id: 4, left: 19, size: 11, dur: 25, delay: 8, opacity: 0.35 },
      { id: 5, left: 24, size: 7, dur: 19, delay: 5, opacity: 0.45 },
      { id: 6, left: 29, size: 4, dur: 15, delay: 1, opacity: 0.25 },
      { id: 7, left: 35, size: 10, dur: 24, delay: 7, opacity: 0.38 },
      { id: 8, left: 41, size: 6, dur: 17, delay: 3, opacity: 0.32 },
      { id: 9, left: 47, size: 8, dur: 21, delay: 9, opacity: 0.4 },
      { id: 10, left: 52, size: 5, dur: 14, delay: 0.5, opacity: 0.3 },
      { id: 11, left: 57, size: 12, dur: 26, delay: 11, opacity: 0.36 },
      { id: 12, left: 63, size: 7, dur: 18, delay: 6, opacity: 0.42 },
      { id: 13, left: 68, size: 4, dur: 16, delay: 2.5, opacity: 0.28 },
      { id: 14, left: 74, size: 9, dur: 23, delay: 8.5, opacity: 0.38 },
      { id: 15, left: 79, size: 6, dur: 17, delay: 4.5, opacity: 0.35 },
      { id: 16, left: 84, size: 11, dur: 27, delay: 12, opacity: 0.34 },
      { id: 17, left: 89, size: 5, dur: 15, delay: 3, opacity: 0.3 },
      { id: 18, left: 93, size: 8, dur: 20, delay: 7, opacity: 0.4 },
      { id: 19, left: 97, size: 6, dur: 19, delay: 1.5, opacity: 0.32 },
      { id: 20, left: 16, size: 8, dur: 21, delay: 10, opacity: 0.36 },
      { id: 21, left: 44, size: 6, dur: 18, delay: 13, opacity: 0.3 },
      { id: 22, left: 61, size: 9, dur: 24, delay: 14, opacity: 0.35 },
      { id: 23, left: 81, size: 5, dur: 16, delay: 9.5, opacity: 0.32 },
      { id: 24, left: 91, size: 10, dur: 22, delay: 5.5, opacity: 0.38 },
    ];
    return items;
  }, []);

  return (
    <div className="ambient-bubbles-layer" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="ambient-small-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
