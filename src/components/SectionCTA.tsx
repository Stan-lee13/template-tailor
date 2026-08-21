import { ArrowUpRight } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';

type SectionCTAProps = {
  location: string;
  label?: string;
};

export default function SectionCTA({ location, label = 'Book an Intro Call' }: SectionCTAProps) {
  const { open } = useBooking();

  const handleClick = () => {
    track('cta_click', { location, label });
    open(location);
  };

  return (
    <div className="section-cta-rail">
      <button type="button" className="section-cta-rail__button" onClick={handleClick}>
        <span>{label}</span>
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
