import {
  ClientWorkSection,
  ClientStoriesSection,
  CredentialsSection,

  HeroSection,
  InsightsSection,
  ProblemSection,
  ServiceSection,
  SolutionSection,
  TestimonialsSection,
  WhyGraceSection,
} from './components';
import Stats from './components/Stats';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <Stats/>
      <ClientStoriesSection />
      <ProblemSection />
      <SolutionSection />
      <ServiceSection />
      <WhyGraceSection />
      <CredentialsSection />
      <ClientWorkSection />
      
      <TestimonialsSection />
      <InsightsSection />
      {/* <FinalCtaSection /> */}
    </>
  );
}

