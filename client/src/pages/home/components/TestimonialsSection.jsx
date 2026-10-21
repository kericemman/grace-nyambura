import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';
import { Reveal } from '../../../components/ui/Reveal';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { apiRequest } from '../../../lib/api';

export function TestimonialsSection() {
  const query = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: () => apiRequest('/public/testimonials'),
  });
  const testimonials = query.data?.data ?? [];

  if (query.isLoading) return <TestimonialsSkeleton />;
  if (query.isError || testimonials.length === 0) return null;

  return (
    <section className="bg-ivory px-4 py-10 md:py-16">
      <div className="mx-auto w-[min(100%-1.5rem,78rem)] sm:w-[min(100%-2rem,78rem)]">
        <Reveal>
          <SectionHeading eyebrow="Client voices">
            What it feels like to work together.
          </SectionHeading>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal
              className="flex h-full flex-col border border-border bg-white p-6 sm:p-8"
              delay={index * 0.05}
              key={testimonial._id}
            >
              <Quote className="text-champagne" size={34} strokeWidth={1.5} />
              <blockquote className="mt-6 flex-1 text-sm leading-8 text-body">
                {testimonial.quote}
              </blockquote>
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                {testimonial.photo ? (
                  <img
                    className="h-14 w-14 rounded-full bg-white object-contain p-1"
                    src={testimonial.photo}
                    alt={`${testimonial.clientName} photo or company logo`}
                    loading="lazy"
                  />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-display text-xl text-white">
                    {testimonial.clientName.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-bold text-primary">{testimonial.clientName}</p>
                  <p className="mt-1 text-sm text-muted">
                    {[testimonial.clientRole, testimonial.company]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="bg-ivory px-4 py-10 md:py-16" aria-label="Loading testimonials">
      <div className="mx-auto grid w-[min(100%-1.5rem,78rem)] gap-5 lg:grid-cols-3 sm:w-[min(100%-2rem,78rem)]">
        {[0, 1, 2].map((item) => (
          <div className="h-72 animate-pulse bg-white" key={item} />
        ))}
      </div>
    </section>
  );
}
