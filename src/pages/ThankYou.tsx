import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SEO from '../components/SEO';
import { SITE } from '../config/site';
import { track } from '../lib/analytics';

export default function ThankYou() {
  useEffect(() => {
    track('booking_thankyou_view', {});
  }, []);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <SEO
        title="Thanks — your audit is booked"
        description="Your RetentionFirm growth audit is confirmed. Here's what happens next."
        path="/thank-you"
        noindex
      />
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 100px' }}>
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-7 rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: '#000000' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>
              Confirmed
            </p>
            <h1 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#000000', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Your audit is on the calendar.
            </h1>
            <p className="font-inter mx-auto" style={{ fontSize: '17px', color: '#2D2D2D', lineHeight: 1.6, maxWidth: '520px' }}>
              You'll get a confirmation email shortly with the meeting link and a short prep doc.
              Add it to your calendar so it doesn't slip.
            </p>
          </div>

          {/* What happens next */}
          <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
            <p className="font-inter uppercase mb-5" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>
              What happens next
            </p>
            <ol className="space-y-5">
              {[
                { t: 'Within 5 minutes', d: 'Confirmation email + calendar invite with the meeting link.' },
                { t: 'Within 24 hours', d: 'A short prep questionnaire so we can review your store before the call.' },
                { t: 'On the call (30 min)', d: 'We spend 10 min understanding your store, then walk you through the three highest-leverage retention fixes we\'d start with.' },
                { t: 'After the call', d: 'You get a written recap with the recommendations — no pitch, no pressure.' },
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 rounded-full flex items-center justify-center font-outfit font-medium" style={{ width: 28, height: 28, background: '#00D4FF', color: '#fff', fontSize: '13px' }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-outfit font-medium" style={{ fontSize: '15px', color: '#000000' }}>{s.t}</p>
                    <p className="font-inter mt-1" style={{ fontSize: '14px', color: '#555', lineHeight: 1.55 }}>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Contact + resources */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="rounded-2xl p-6" style={{ background: '#000000', color: '#FFFFFF' }}>
              <p className="font-inter uppercase mb-2" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>Need to reach us</p>
              <p className="font-outfit font-medium mb-3" style={{ fontSize: '18px' }}>Questions before the call?</p>
              <a href={`mailto:${SITE.email}`} className="font-inter inline-block" style={{ fontSize: '14px', color: '#00D4FF', textDecoration: 'underline' }}>
                {SITE.email}
              </a>
              <p className="font-inter mt-3" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                We reply within one business day.
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
              <p className="font-inter uppercase mb-2" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>While you wait</p>
              <p className="font-outfit font-medium mb-3" style={{ fontSize: '18px', color: '#000000' }}>Read our retention playbooks</p>
              <Link to="/insights" className="font-inter inline-block" style={{ fontSize: '14px', color: '#00D4FF', textDecoration: 'underline' }}>
                Browse insights →
              </Link>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/case-studies" className="font-inter font-medium text-center" style={{ background: '#000000', color: '#FFFFFF', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              See case studies
            </Link>
            <Link to="/" className="font-inter font-medium text-center" style={{ background: 'transparent', color: '#000000', border: '1px solid rgba(10,10,10,0.18)', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
