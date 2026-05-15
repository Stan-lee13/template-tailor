import MarketingLayout from '../components/MarketingLayout';

export default function About() {
  return (
    <MarketingLayout
      path="/about"
      eyebrow="About"
      title="A retention partner, not a vendor."
      description="RetentionFirm is a retention marketing studio for growth-stage ecommerce brands."
      intro="We're operators. We've sat inside the brands we now build for — and we've seen first-hand how much revenue gets left on the table when retention is treated as an afterthought."
    >
      <h2>What we believe</h2>
      <p>The economics of ecommerce only work when the second, third, and fourth purchases happen. Acquisition gets the customer in the door. Retention is what makes the unit economics survive a Meta CPM increase, a Google policy change, or a slow quarter.</p>
      <h2>How we work</h2>
      <p>Small team. Senior operators. Direct accountability. We don't hand you off to a junior account manager after the sale. The person who diagnoses your retention problem is the person who builds the fix.</p>
      <h2>Who we work with</h2>
      <p>Growth-stage ecommerce brands that already have product-market fit, real customers, and a desire to stop renting their growth from ad platforms.</p>
    </MarketingLayout>
  );
}
