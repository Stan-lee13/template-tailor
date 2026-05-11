import { Link } from 'react-router-dom';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SEO from '../components/SEO';

export default function ThankYou() {
  return (
    <div style={{ background: '#f1ece4', minHeight: '100vh' }}>
      <SEO title="Thanks — booking confirmed" description="Your call is on the calendar. Talk soon." path="/thank-you" />
      <Navigation />
      <main style={{ padding: '160px clamp(20px, 5vw, 80px) 100px' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '560px' }}>
          <div className="mx-auto mb-7 rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: '#0A0A0A' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>
            Confirmed
          </p>
          <h1 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#0A0A0A', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Your call is on the calendar.
          </h1>
          <p className="font-inter mb-8" style={{ fontSize: '17px', color: '#2D2D2D', lineHeight: 1.6 }}>
            You'll get a confirmation email shortly with the meeting link and a short prep doc. We'll spend the
            first ten minutes understanding your store, then walk you through the three highest-leverage retention
            fixes we'd start with.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/insights" className="font-inter font-medium" style={{ background: '#0A0A0A', color: '#f1ece4', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              Read while you wait
            </Link>
            <Link to="/" className="font-inter font-medium" style={{ background: 'transparent', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.18)', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
