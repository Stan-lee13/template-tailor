import MarketingLayout from '../components/MarketingLayout';
import { SITE } from '../config/site';
import { useBooking } from '../hooks/useBooking';

export default function Contact() {
  const { open } = useBooking();
  return (
    <MarketingLayout
      path="/contact"
      eyebrow="Contact"
      title="Talk to us."
      description="Get in touch with the RetentionFirm team."
      intro="The fastest way to work with us is to book a free 30-minute growth audit. No pitch, no slide deck — we look at your retention setup and tell you what's leaking."
    >
      <div className="not-prose flex flex-col sm:flex-row gap-3 mb-8">
        <button onClick={() => open('contact_page')} className="font-inter font-medium text-white" style={{ background: '#00D4FF', padding: '13px 28px', borderRadius: '9999px', fontSize: '14px' }}>
          Book a free audit
        </button>
        <a href={`mailto:${SITE.email}`} className="font-inter font-medium inline-flex items-center justify-center" style={{ background: 'transparent', padding: '13px 28px', borderRadius: '9999px', fontSize: '14px', color: '#000000', border: '1px solid #D6D3CC' }}>
          Email us
        </a>
      </div>
      <h2>Other ways to reach us</h2>
      <p><strong>Email:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
      <p><strong>LinkedIn:</strong> <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">RetentionFirm on LinkedIn</a></p>
      <p>We respond within one business day. Usually faster.</p>
    </MarketingLayout>
  );
}
