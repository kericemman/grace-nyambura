import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

const stats = [
  {
    value: 997,
    suffix: '',
    label: 'Campaign registrations',
    description:
      'Generated through a LinkedIn content and outreach campaign',
  },
  {
    value: 5,
    suffix: '/5',
    label: 'Client review rating',
    description: 'From a documented client review',
  },
  {
    value: 20,
    suffix: '+',
    label: 'Founders supported',
    description: 'Total founders and executives served',
  },
  {
    value: 9,
    suffix: '',
    label: 'Favikon ranking',
    description: 'Personal branding and thought leadership in Kenya',
  },
];

function Counter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
    });

    const unsubscribe = motionValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, motionValue, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section
      aria-label="Our impact in numbers"
      className="bg-ivory py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto w-[min(100%-2rem,80rem)]">

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col border-l-2 border-emerald/30 pl-4 sm:pl-6"
            >
              {/* Animated Number */}
              <h3 className="font-display text-4xl font-semibold leading-none tracking-tight text-primary sm:text-5xl lg:text-5xl xl:text-6xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                />
              </h3>

              {/* Stat Label */}
              <p className="mt-5 text-sm font-bold leading-6 text-primary sm:text-base">
                {stat.label}
              </p>

              {/* Description */}
              <p className="mt-2 max-w-[240px] text-xs leading-5 text-muted sm:text-sm sm:leading-6">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}