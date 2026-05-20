'use client';

import { useRef, useState, useEffect } from 'react';

export default function useCounter(
  target: number,
  suffix: string = '',
  dur: number = 1800
): [React.RefObject<HTMLDivElement | null>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;
    let raf: number;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(target * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, dur]);

  const formatted = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
  return [ref, formatted + suffix];
}
