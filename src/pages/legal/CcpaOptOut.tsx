import LegalLayout from '../../components/LegalLayout';

export default function CcpaOptOut() {
  return (
    <LegalLayout title="CCPA Opt-Out" updated="May 2026">
      <p>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to opt out of the sale or sharing of their personal information.</p>
      <h2>Do we sell or share personal information?</h2>
      <p>RetentionFirm does not sell personal information for monetary consideration. As part of running this website and our partner engagements, we may share limited identifiers (such as cookie IDs and device data) with analytics and advertising partners. Under CPRA, this can be considered "sharing for cross-context behavioral advertising."</p>
      <h2>How to opt out</h2>
      <p>You can opt out of cookie-based sharing by:</p>
      <ul>
        <li>Selecting "Reject" in our cookie banner</li>
        <li>Sending a Global Privacy Control (GPC) signal from your browser — we honor it automatically</li>
        <li>Emailing privacy at our contact address with the subject line "CCPA Opt-Out"</li>
      </ul>
      <h2>Authorized agents</h2>
      <p>You may designate an authorized agent to submit a request on your behalf. We will require reasonable verification of the agent's authority.</p>
    </LegalLayout>
  );
}
