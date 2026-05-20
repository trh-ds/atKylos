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
            <span className="eyebrow reveal"><span className="dot"></span>Early traction</span>
            <h2 className="h-section reveal" data-d="1">
              Two clients. <span className="it">Real systems.</span>
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            We're an emerging studio — and every number here is earned, not inflated.
          </p>
        </div>
        <div className="stats-grid">
          <Stat value={2} suffix="" label="Production systems built" />
          <Stat value={6} suffix="" label="Disciplines covered" />
          <Stat value={2} suffix=" wk" label="Avg time to working demo" />
          <Stat value={10} suffix="k+" label="Lines of code shipped" />
        </div>
      </div>
    </section>
  );
}
