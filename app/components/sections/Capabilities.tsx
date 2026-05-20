'use client';

import { JSX } from 'react';

interface CapItem {
  num: string;
  title: (string | { it: string })[];
  body: string;
  bullets: string[];
}

const CAPS: CapItem[] = [
  {
    num: '01',
    title: ['Agentic systems', { it: 'that decide.' }],
    body: 'Multi-agent architectures that observe, reason, and act on your business processes. Production-grade, evaluated, and continuously improved.',
    bullets: ['LangGraph + custom orchestration', 'Tool-use agents · retrieval · memory', 'Eval suites + observability'],
  },
  {
    num: '02',
    title: ['Workflow', { it: 'orchestration.' }],
    body: 'End-to-end automation pipelines connecting your CRM, data warehouse, and human-in-the-loop touchpoints. Built to flex, fail safe, and scale.',
    bullets: ['Temporal · Inngest · n8n', 'Event-driven · idempotent · auditable', 'SLAs + runbooks included'],
  },
  {
    num: '03',
    title: ['Custom', { it: 'copilots.' }],
    body: 'Domain copilots that live inside your team\'s tools. RAG over your sources, fine-tuned tone, and guardrails tuned to your risk profile.',
    bullets: ['RAG + tool use + memory', 'Slack · Salesforce · Notion · Linear', 'Role-based access · PII safe'],
  },
  {
    num: '04',
    title: ['Optimization', { it: '& ops.' }],
    body: 'We don\'t just ship — we measure, tune, and compound. Cost, latency, accuracy, and adoption tracked from day one.',
    bullets: ['LLM cost & latency dashboards', 'A/B + offline evals', 'Quarterly optimization sprints'],
  },
];

export default function Capabilities(): JSX.Element {
  return (
    <section className="section" id="capabilities">
      <div className="wrap">
        <div className="section-head">
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Capabilities</span>
            <h2 className="h-section reveal" data-d="1">
              Four levers, <span className="it">infinitely</span> composed.
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            We work end-to-end across agentic strategy, build, and ops — so the systems we deliver keep getting smarter long after launch.
          </p>
        </div>

        <div className="cap-grid">
          {CAPS.map((c, i) => (
            <article key={i} className="cap-card reveal" data-d={String((i % 4) + 1)}
              onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
              }}>
              <div className="num">{c.num} ── Capability</div>
              <svg className="arr-corner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17 L17 7 M9 7 L17 7 L17 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>
                {c.title.map((part, j) => typeof part === 'string'
                  ? <span key={j}>{part} </span>
                  : <span key={j} className="it">{part.it}</span>)}
              </h3>
              <p>{c.body}</p>
              <ul>
                {c.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
