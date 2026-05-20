'use client';

import { JSX } from 'react';

interface StepItem {
  n: string;
  title: string;
  body: string;
}

const STEPS: StepItem[] = [
  { n: '01', title: 'Discover', body: "We start by understanding what you're actually trying to solve. Technical audit, workflow mapping, constraint analysis. This is where we figure out what to build and what to skip — before writing a single line of code." },
  { n: '02', title: 'Build', body: 'Tight iterations, working software. We build in short sprints and ship functional increments — not Figma decks. You see progress weekly, not quarterly.' },
  { n: '03', title: 'Ship', body: 'Production is the goal, not a staging environment. We deploy with monitoring, documentation, and handoff support so the system actually runs — and keeps running.' },
];

export default function Process(): JSX.Element {
  return (
    <section className="section process" id="process">
      <div className="wrap">
        <div className="section-head">
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Process</span>
            <h2 className="h-section reveal" data-d="1">
              Discover. <span className="it">Build.</span> Ship.
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            We don't do long scoping phases. We move fast — with precision. Every engagement starts with understanding your actual problem, not assumptions.
          </p>
        </div>
        <div className="process-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="process-step reveal" data-d={String(i + 1)}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
