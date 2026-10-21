import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { credentials } from '../homeContent';

export function CredentialsSection() {
  return (
    <section className="bg-ivory px-4 py-10 md:py-16">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal className="max-w-3xl">
          <SectionHeading eyebrow="My Expertise">A thoughtful practice shaped by writing, listening, and real client work.</SectionHeading>
          
        </Reveal>
        <Reveal className="mt-10 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-4" delay={0.05}>
          {credentials.map((credential, index) => (
            <div className="min-h-32 border-r border-b border-border bg-white p-6" key={credential}>
              <span className="text-xs font-bold tracking-[0.15em] text-emerald">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-4 font-display text-xl leading-7 text-primary">{credential}</p>
            </div>
          ))}
         
        </Reveal>
      </div>
    </section>
  );
}

