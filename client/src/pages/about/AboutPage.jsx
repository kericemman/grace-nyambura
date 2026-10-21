import {
  AboutCtaSection,
  AboutHero,
  MilestonesSection,
  QuietAuthoritySection,
  StorySection,
} from './components';
import { useEffect } from 'react';

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <AboutHero />
      <StorySection />
      <QuietAuthoritySection />
      <MilestonesSection />
      <AboutCtaSection />
    </>
  );
}
