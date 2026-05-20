'use client';

import { Fragment, JSX } from 'react';
import useReveal from '../hooks/useReveal';
import LoadingOverlay from './LoadingOverlay';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import TrustBar from './sections/TrustBar';
import Capabilities from './sections/Capabilities';
import MarqueeStrip from './sections/MarqueeStrip';
import Process from './sections/Process';
import StatsSection from './sections/StatsSection';
import Cases from './sections/Cases';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

export default function App(): JSX.Element {
  useReveal();
  return (
    <Fragment>
      <LoadingOverlay />
      <Nav />
      <Hero />
      <TrustBar />
      <Capabilities />
      <MarqueeStrip />
      <Process />
      <StatsSection />
      <Cases />
      <CTA />
      <Footer />
    </Fragment>
  );
}
