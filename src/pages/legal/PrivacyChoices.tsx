import LegalLayout from '../../components/LegalLayout';

export default function PrivacyChoices() {
  return (
    <LegalLayout title="Your Privacy Choices" updated="May 2026">
      <p>This page summarizes the privacy controls available to you when interacting with RetentionFirm.</p>
      <h2>Cookie preferences</h2>
      <p>You can update your cookie preferences at any time using the cookie banner that appears on your first visit. If you previously dismissed it, clear our cookies and reload the page to bring it back.</p>
      <h2>Marketing communications</h2>
      <p>Every marketing email we send includes an unsubscribe link in the footer. Unsubscribes are honored within 24 hours.</p>
      <h2>Data subject rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction or deletion</li>
        <li>Opt out of the sale or sharing of personal information</li>
        <li>Limit the use of sensitive personal information</li>
        <li>Withdraw consent at any time, where consent is the legal basis</li>
      </ul>
      <p>To exercise any of these rights, email us at the address listed on our <a href="/contact">contact page</a>.</p>
    </LegalLayout>
  );
}
