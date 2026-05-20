'use client';

import { JSX } from 'react';

interface WordItem {
  text: string;
  it?: boolean;
}

interface StaggerHeadlineProps {
  words: WordItem[];
  accentIdx: number;
  animate?: boolean;
}

export default function StaggerHeadline({ words, accentIdx, animate = true }: StaggerHeadlineProps): JSX.Element {
  return (
    <h1 className={`hero-headline ${animate ? 'animate' : ''}`}>
      {words.map((w, i) => (
        <span key={i} className={`word ${w.it ? 'it' : ''} ${i === accentIdx ? 'accent' : ''}`}
          style={{ animationDelay: `${0.6 + i * 0.14}s` }}>
          {w.text}
        </span>
      ))}
    </h1>
  );
}
