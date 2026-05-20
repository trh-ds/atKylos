'use client';

import { JSX } from 'react';
import useCounter from '../../hooks/useCounter';

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

function Stat({ value, suffix, label }: StatProps): JSX.Element {
  const [ref, current] = useCounter(value, suffix);
  return (
    <div className="stat reveal" ref={ref}>
      <div className="num">{current}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function StatsSection(): JSX.Element {
  return (
    <section className="section" id="impact" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: 60 }}>
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Impact, measured</span>
            <h2 className="h-section reveal" data-d="1">
              Numbers <span className="it">that compound.</span>
            </h2>
          </div>
        </div>
        <div className="stats-grid">
          <Stat value={4.2} suffix="×" label="Avg throughput lift" />
          <Stat value={68} suffix="%" label="Reduction in manual ops" />
          <Stat value={12} suffix=" days" label="Time to first agent in prod" />
          <Stat value={97} suffix="%" label="Eval pass rate at launch" />
        </div>
      </div>
    </section>
  );
}
