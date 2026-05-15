import MarketingLayout from '../components/MarketingLayout';

export default function CaseStudies() {
  return (
    <MarketingLayout
      path="/case-studies"
      eyebrow="Case studies"
      title="Real work, real outcomes"
      description="Anonymized retention case studies from RetentionFirm engagements."
      intro="We're early in our public case study library. Below is one anonymized example of the work we do. Full named case studies will be published as our partner brands clear them for release."
    >
      <h2>Anonymized case study — DTC apparel brand</h2>
      <p><strong>Situation.</strong> A growth-stage DTC apparel brand running ~$180K/month. Acquisition was healthy on Meta, but second-purchase rate was below 18% and email was contributing under 12% of revenue.</p>
      <p><strong>What we built.</strong> A full lifecycle rebuild in Klaviyo: welcome, browse, cart, post-purchase, replenishment, and win-back flows, plus weekly campaign cadence informed by RFM segmentation. SMS layered in via Postscript for time-sensitive moments.</p>
      <p><strong>Direction of impact.</strong> Within 90 days, email + SMS revenue contribution moved meaningfully toward 30%+, second-purchase rate climbed, and the brand stopped relying solely on paid traffic to hit its monthly numbers. Specifics under NDA.</p>
      <h2>More case studies, soon</h2>
      <p>If you're an existing partner and willing to be featured, we'd love to write yours up. <a href="/contact">Get in touch</a>.</p>
    </MarketingLayout>
  );
}
