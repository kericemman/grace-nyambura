import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'border-primary bg-primary text-white hover:border-[#29324f] hover:bg-[#29324f]',
  secondary: 'border-primary bg-transparent text-primary hover:bg-white',
  light: 'border-white bg-white text-primary hover:border-champagne hover:bg-champagne',
  text: 'min-h-11 border-x-0 border-t-0 border-b-primary px-0 text-primary hover:border-b-emerald hover:text-emerald max-sm:w-auto',
};

export function ButtonLink({ children, className = '', size = 'default', to, variant = 'primary' }) {
  const sizeClasses = size === 'compact' ? 'min-h-11 px-4 py-2.5 text-[0.82rem]' : 'min-h-12 px-5 py-3 text-[0.9rem]';
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2.5 border font-bold leading-[1.3] transition hover:-translate-y-px max-sm:w-full ${sizeClasses} ${variants[variant]} ${className}`;

  return (
    <Link className={classes} to={to}>
      {children}
      <ArrowRight aria-hidden="true" size={17} />
    </Link>
  );
}


