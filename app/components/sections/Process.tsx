'use client';

import { JSX } from 'react';

interface StepItem {
  n: string;
  title: string;
  body: string;
}

const STEPS: StepItem[] = [
  { n: '01', title: 'Observe', body: 'We sit beside your team for two weeks, mapping decisions, bottlenecks, and the data that already lives in your stack. No deck-first consulting.' },
  { n: '02', title: 'Compose', body: 'We design the agent graph — what reasons, what acts, what stays human. Built in your stack, deployable in days, not quarters.' },
  { n: '03', title: 'Compound', body: 'Once live, we tune relentlessly. Evals, dashboards, weekly improvement cycles. The system gets sharper every month.' },
];

export default function Process(): JSX.Element {
  return (
    <section className="section process" id="process">
      <div className="wrap">
        <div className="section-head">
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Process</span>
            <h2 className="h-section reveal" data-d="1">
              Observe. <span className="it">Compose.</span> Compound.
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            Three movements, repeated. A working agent in 4 weeks, evaluated in 6, compounding from week 8 onward.
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
