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
    title: ['Full-Stack', { it: 'Web & DevOps' }],
    body: 'Robust web applications and the infrastructure to run them reliably. We build frontend interfaces in React and Next.js, pair them with scalable backends, and deliver the whole thing with CI/CD pipelines, containerized deployments, and zero-downtime releases.',
    bullets: ['React · Next.js · Node.js · Python', 'AWS · GCP · Vercel · Docker', 'CI/CD · Monitoring · Zero-downtime deploys'],
  },
  {
    num: '02',
    title: ['App', { it: 'Development.' }],
    body: 'Cross-platform mobile apps built for real users and real scale. We design and develop iOS and Android applications — native or Flutter — with offline capability, real-time sync, and clean App Store submissions.',
    bullets: ['Flutter · React Native · iOS · Android', 'Offline-first architecture · Real-time sync', 'App Store & Play Store deployment'],
  },
  {
    num: '03',
    title: ['IoT', { it: 'Systems.' }],
    body: 'Hardware and software, bridged. We design connected device systems — sensor networks, edge computation, real-time telemetry, and fleet management — from early prototype through to production scale.',
    bullets: ['Edge computing · MQTT · LoRaWAN', 'Real-time telemetry dashboards', 'OTA firmware updates · Fleet management'],
  },
  {
    num: '04',
    title: ['Agentic AI', { it: '& Automation.' }],
    body: 'Autonomous agents that observe, decide, and act — without constant human oversight. We build multi-agent systems, workflow automation, and intelligent pipelines that handle repetitive or complex tasks end-to-end. Like our MARG ERP automation: a CV-driven agent that navigates the UI, clicks the right controls, and auto-generates reports — zero manual effort.',
    bullets: ['Multi-agent architectures · LangChain · LangGraph', 'RPA · Workflow automation · n8n', 'RAG pipelines · Tool use · Memory systems'],
  },
  {
    num: '05',
    title: ['Computer', { it: 'Vision.' }],
    body: 'Systems that see what humans miss — and act on it instantly. We build computer vision pipelines for object detection, UI understanding, image-based search, and edge inference. Delivered as real-time APIs, embedded edge modules, or cloud-native services.',
    bullets: ['Object detection · OCR · Segmentation', 'Visual search · Image similarity engines', 'Edge inference · NVIDIA Jetson · Cloud CV APIs'],
  },
  {
    num: '06',
    title: ['ML Engineering', { it: '& MLOps.' }],
    body: "Machine learning that doesn't live in a notebook. We build training pipelines, deploy models to production, and keep them sharp with monitoring, versioning, and automated retraining — so your models stay accurate as the world changes around them.",
    bullets: ['Model training · Fine-tuning · REST deployment', 'MLflow · Feature stores · Experiment tracking', 'Drift detection · Auto-retraining · A/B evaluation'],
  },
];

export default function Capabilities(): JSX.Element {
  return (
    <section className="section" id="capabilities">
      <div className="wrap">
        <div className="section-head">
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Services</span>
            <h2 className="h-section reveal" data-d="1">
              Six disciplines. <span className="it">One team.</span>
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            We cover the full engineering surface — from intelligent automation and computer vision to mobile apps, IoT fleets, and production ML. Every engagement is built to last, not just to demo.
          </p>
        </div>

        <div className="cap-grid">
          {CAPS.map((c, i) => (
            <article key={i} className="cap-card reveal" data-d={String((i % 3) + 1)}
              onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
              }}>
              <div className="num">{c.num} ── Service</div>
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
