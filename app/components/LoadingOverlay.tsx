'use client';

import { useRef, useEffect, useCallback, JSX } from 'react';
import gsap from 'gsap';

interface LoadingOverlayProps {
  onComplete?: () => void;
}

// ═════════════════════════════════════════════════════════════
// LogoMark — exact paths from public/logo.svg, cleaned for animation
// ═════════════════════════════════════════════════════════════
function LogoMark({ size = 180 }: { size?: number }): JSX.Element {
  return (
    <svg
      viewBox="0 0 292 282"
      width={size}
      height={size}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* LEFT WING — exact path from logo.svg */}
      <path
        d="M0 0 C-2.28916223 18.57289352 -11.60609764 36.14799148 -24 50 C-24.71929687 50.83789062 -25.43859375 51.67578125 -26.1796875 52.5390625 C-43.33401938 72.18641147 -64.6127744 84.29891216 -90 90 C-91.06992188 90.2578125 -92.13984375 90.515625 -93.2421875 90.78125 C-97.4456514 89.59046703 -98.58405841 86.66440961 -100.6953125 82.98828125 C-101.20835937 82.04339844 -101.72140625 81.09851563 -102.25 80.125 C-103.29485365 78.27229608 -104.34163958 76.42068018 -105.390625 74.5703125 C-105.84469727 73.74289551 -106.29876953 72.91547852 -106.76660156 72.06298828 C-107.95863708 69.87865872 -107.95863708 69.87865872 -110 68 C-109.25217482 57.39023026 -93.04547473 43.86933786 -86 37 C-85.15695313 36.071875 -85.15695313 36.071875 -84.296875 35.125 C-63.04888664 12.41722618 -30.92277845 -0.89775808 0 0 Z"
        fill="white"
        fillOpacity="0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(264,45)"
      />

      {/* RIGHT WING — exact path from logo.svg */}
      <path
        d="M0 0 C21.29078062 -0.87363386 42.21180375 5.32280211 60 17 C60.8655249 17.56460938 60.8655249 17.56460938 61.74853516 18.140625 C70.41760216 23.87698034 78.12503416 30.40237313 85.58056641 37.63183594 C86.82129398 38.82774879 88.08647433 39.99818703 89.35546875 41.1640625 C94.45138236 45.97222871 98.8064203 51.31186532 103.125 56.8125 C104.01541992 57.92564575 104.01541992 57.92564575 104.92382812 59.0612793 C105.46716797 59.76937744 106.01050781 60.47747559 106.5703125 61.20703125 C107.06289551 61.8410083 107.55547852 62.47498535 108.06298828 63.12817383 C109 65 109 65 108.74047852 67.10009766 C107.77668054 69.57298782 106.39954042 71.4359359 104.8125 73.5625 C101.03697022 78.7967572 97.96962504 84.27830488 95 90 C88.87513487 90.28343055 84.13813267 89.46505881 78.375 87.4375 C77.59447266 87.1686499 76.81394531 86.8997998 76.00976562 86.62280273 C64.75603166 82.62772718 54.49703037 77.2753198 45 70 C44.14535156 69.34902344 43.29070312 68.69804688 42.41015625 68.02734375 C22.15644711 52.22031361 3.63661439 27.80146456 0.15625 1.73828125 C0.1046875 1.16464844 0.053125 0.59101562 0 0 Z"
        fill="white"
        fillOpacity="0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(32,45)"
      />

      {/* BODY — exact path from logo.svg */}
      <path
        d="M0 0 C8.26230345 3.31567492 12.10919413 14.98238833 15.75 22.5625 C16.12664795 23.34101318 16.5032959 24.11952637 16.89135742 24.92163086 C22.76260183 37.44966254 24.18708184 49.10420671 24.25 62.8125 C24.270625 63.92431641 24.29125 65.03613281 24.3125 66.18164062 C24.34728251 73.61205521 23.33226116 79.95540087 21 87 C20.62359375 88.20269531 20.2471875 89.40539062 19.859375 90.64453125 C15.5878361 102.84248212 10.56419448 114.16028719 2 124 C-12.02573851 111.67435101 -19.8567141 90.10260784 -21.23852539 71.84912109 C-21.82215331 57.08752649 -21.49143927 43.78961417 -16 30 C-15.6390625 28.9790625 -15.278125 27.958125 -14.90625 26.90625 C-11.69149447 18.36418531 -6.53826254 6.53826254 0 0 Z"
        fill="white"
        fillOpacity="0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(146,122)"
      />

      {/* HEAD — exact path from logo.svg */}
      <path
        d="M0 0 C4.39792738 2.00394856 7.80914543 4.70088592 11.0625 8.25 C13.02064063 13.99387919 12.88712779 19.76269467 10.375 25.3125 C8.12310729 29.15396403 5.9107281 31.72466729 2 34 C-3.22007313 34.89103967 -8.18494266 34.81168964 -12.9375 32.3125 C-17.43390561 28.91725495 -20.43783614 25.46757351 -22 20 C-22.6268438 14.35840577 -21.47006061 10.4433703 -18 6 C-12.40088915 0.45802293 -7.80188529 -1.17806245 0 0 Z"
        fill="white"
        fillOpacity="0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(152,57)"
      />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
// Split wordmark into per-character spans
// ═════════════════════════════════════════════════════════════
function SplitText({ text }: { text: string }): JSX.Element {
  return (
    <div style={{ display: 'inline-flex' }}>
      {text.split('').map((ch, i) => (
        <span key={i} className="char" style={{ display: 'inline-block' }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

export default function LoadingOverlay({ onComplete }: LoadingOverlayProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);

  const skipAnimation = useCallback(() => {
    if (skipRef.current) return;
    skipRef.current = true;
    gsap.killTweensOf(containerRef.current);
    gsap.killTweensOf(logoWrapRef.current?.querySelectorAll('*') || []);
    gsap.killTweensOf(textWrapRef.current?.querySelectorAll('.char') || []);
    gsap.set(containerRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      pointerEvents: 'none',
    });
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const logoWrap = logoWrapRef.current;
    const textWrap = textWrapRef.current;
    if (!container || !logoWrap || !textWrap) return;

    // ── Prepare strokes ──
    const paths = logoWrap.querySelectorAll<SVGGeometryElement>('path');
    paths.forEach((p) => {
      const length = p.getTotalLength();
      gsap.set(p, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
      });
    });

    // ── Prepare text ──
    const chars = textWrap.querySelectorAll<HTMLSpanElement>('.char');
    gsap.set(chars, { y: 50, opacity: 0 });

    // ── Master timeline ──
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        gsap.set(container, { pointerEvents: 'none' });
        onComplete?.();
      },
    });

    // 1) DRAW all strokes in parallel
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: 0,
    });

    // 2) FILL shapes with white
    tl.to(
      paths,
      {
        fillOpacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    // Subtle pop on the filled logo
    tl.to(
      logoWrap,
      {
        scale: 1.05,
        duration: 0.2,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      },
      '-=0.5'
    );

    // 3) Shift logo left to make room for wordmark
    tl.to(
      logoWrap,
      {
        x: -110,
        duration: 1.0,
        ease: 'power3.inOut',
      },
      '+=0.15'
    );

    // 4) Wordmark chars fly up with stagger + overshoot
    tl.to(
      chars,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
      },
      '-=0.5'
    );

    // 5) Hold so user sees the full lockup
    tl.to({}, { duration: 0.6 });

    // 6) Curtain reveal — overlay slides away bottom→top
    tl.to(container, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.4,
      ease: 'power4.inOut',
    });

    // Click to skip
    const onClick = () => skipAnimation();
    container.addEventListener('click', onClick);

    return () => {
      tl.kill();
      container.removeEventListener('click', onClick);
    };
  }, [onComplete, skipAnimation]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'inset(0)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateX(70px)',
        }}
      >
        {/* Logo */}
        <div ref={logoWrapRef} style={{ flexShrink: 0 }}>
          <LogoMark size={180} />
        </div>

        {/* Wordmark */}
        <div
          ref={textWrapRef}
          style={{
            marginLeft: 28,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            letterSpacing: '-0.035em',
            color: '#F5F1E8',
            lineHeight: 1,
            overflow: 'hidden',
          }}
        >
          <SplitText text="atKylos" />
        </div>
      </div>

      {/* Skip hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(245, 241, 232, 0.2)',
          pointerEvents: 'none',
        }}
      >
        Click to skip
      </div>
    </div>
  );
}
