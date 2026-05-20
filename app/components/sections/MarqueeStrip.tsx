'use client';

import { JSX } from 'react';

export default function MarqueeStrip(): JSX.Element {
  const items = [
    'Agentic AI', 'Workflow automation', 'RAG systems', 'Process orchestration',
    'Multi-agent design', 'LLM ops', 'Custom copilots', 'Autonomous research',
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
