'use client';

import { JSX } from 'react';

export default function MarqueeStrip(): JSX.Element {
  const items = [
    'Full-Stack Dev', 'DevOps', 'App Development', 'IoT Systems',
    'Agentic AI', 'Computer Vision', 'ML Engineering', 'MLOps',
    'Workflow Automation', 'Visual Search',
  ];

  return (
    <div className="marquee-strip">
      <div className="marquee">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="item">
            <span className={i % 3 === 1 ? 'it' : ''}>{t}</span>
            <span className="dot"></span>
          </span>
        ))}
      </div>
    </div>
  );
}
