import { ReactNode } from 'react';

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO
  readingTime: string;
  author: string;
  body: ReactNode;
};

const Author = 'Editorial Team — RetentionFirm';

export const articles: Article[] = [
  {
    slug: 'why-most-ecommerce-brands-leak-revenue-after-first-purchase',
    title: 'Why Most Ecommerce Brands Leak Revenue After the First Purchase',
    excerpt:
      'Acquisition gets the spotlight, but the real margin shows up after the first order. Here is where most brands lose it — and what a sound retention system actually fixes.',
    category: 'Retention Strategy',
    tags: ['LTV', 'Repeat Purchase', 'Lifecycle'],
    publishedAt: '2025-12-04',
    readingTime: '7 min read',
    author: Author,
    body: (
      <>
        <p>
          Most ecommerce founders we meet can quote their CAC, their ROAS, and last week's blended margin from
          memory. Ask them what percentage of customers come back within 90 days, and the room goes quiet. That
          gap is where the leak lives.
        </p>
        <p>
          A first purchase is the most expensive sale a brand will ever make. By the time someone has clicked
          through three ads, opened two emails, abandoned a cart, and finally converted, the unit economics are
          thin and the trust is fragile. Everything that happens after the order — the unboxing, the second email,
          the replenishment reminder, the silence — is either compounding that investment or quietly burning it.
        </p>

        <h2>The four leaks we see in every audit</h2>
        <p>
          Across audits with growth-stage brands, the same four leaks show up in roughly the same order. None of
          them are exotic. All of them are addressable inside a quarter.
        </p>

        <h3>1. The post-purchase window is empty</h3>
        <p>
          The 14 days after an order are the highest-intent window in the entire customer relationship. Most brands
          fill that window with a shipping confirmation and nothing else. No education, no usage tips, no
          cross-sell, no review request that lands at the right moment. The customer's enthusiasm decays in
          silence, and by the time the brand emails again, they are a stranger.
        </p>

        <h3>2. Segmentation is performative, not operational</h3>
        <blockquote>
          If your "VIP" segment and your "first-time buyers" segment receive the same Friday campaign, you do not
          have segmentation. You have a tag.
        </blockquote>
        <p>
          Segments only matter when they change the message, the offer, or the timing. Most Klaviyo accounts have
          dozens of segments and three or four campaigns that go to all of them.
        </p>

        <h3>3. Churn is invisible until it shows up in the dashboard</h3>
        <p>
          Subscription brands feel churn immediately. One-time purchase brands feel it months later, after the
          revenue is already gone. Without a working definition of "at risk" — and a flow that intercepts that
          customer before they slip — churn is something you measure, not something you manage.
        </p>

        <h3>4. Reporting answers the wrong question</h3>
        <p>
          "How did email perform last month?" is a vanity question. The questions that actually drive decisions are
          narrower: what is the repeat rate of customers acquired through this channel, what is the 90-day LTV of
          this cohort, what is the contribution margin per send. Reporting that does not answer those questions is
          decoration.
        </p>

        <h2>What a sealed system looks like</h2>
        <p>
          A retention system that holds water shares three properties: it triggers off behavior rather than
          calendar, it uses segmentation to actually change the message, and it reports on margin instead of
          opens. Brands that get this right typically see repeat-purchase rate move first, then AOV, then LTV — in
          that order, over roughly two quarters.
        </p>
        <p>
          None of this requires more ad spend. It requires deciding that the customer you already paid for is
          worth treating like one.
        </p>
      </>
    ),
  },
  {
    slug: 'retention-vs-acquisition-the-real-profit-equation',
    title: 'Retention vs Acquisition: The Real Profit Equation',
    excerpt:
      'You cannot out-spend a leaky bucket. A practical look at why retention compounds margin in a way acquisition mathematically cannot.',
    category: 'Economics',
    tags: ['Unit Economics', 'CAC', 'LTV'],
    publishedAt: '2025-11-19',
    readingTime: '6 min read',
    author: Author,
    body: (
      <>
        <p>
          The argument that "retention is cheaper than acquisition" has been repeated so often that it has become
          background noise. It is also, on inspection, the wrong frame. Retention is not cheaper acquisition.
          Retention is a different kind of revenue, with different economics, that compounds.
        </p>

        <h2>Why the math actually favors retention</h2>
        <p>
          A new customer carries the full weight of acquisition costs against their first order. A returning
          customer carries almost none. Every additional purchase is processed, picked, and shipped — but the
          marketing cost approaches zero, because the relationship is already paid for.
        </p>
        <p>
          The result is that a customer's third order is dramatically more profitable than their first, even
          before you account for higher AOV, higher conversion rates from owned channels, and lower discount
          dependence. Brands that grow LTV by 20% do not see a 20% lift in margin. They typically see two or
          three times that, because the lift compounds against a much smaller cost base.
        </p>

        <h2>Where the frame breaks down</h2>
        <blockquote>
          Retention does not replace acquisition. It decides what acquisition is worth.
        </blockquote>
        <p>
          A brand with a strong retention engine can pay more for a customer than a competitor and still come out
          ahead. That is the quiet leverage. It is also why brands that under-invest in retention end up trapped:
          they cannot raise their CAC ceiling, so they cannot outbid in auctions, so growth slows, so they cut
          retention budget to fund acquisition. The cycle is hard to escape from inside.
        </p>

        <h2>A more useful question</h2>
        <p>
          Instead of "should we spend on retention or acquisition," the more useful question is: what is our 90-day
          contribution margin per customer, and which lever moves it fastest right now? In nearly every audit we
          run on a brand doing $100K to $1M per month, the answer is retention — because it is the lever that has
          been ignored the longest.
        </p>
      </>
    ),
  },
  {
    slug: 'how-email-and-sms-retention-systems-increase-ltv',
    title: 'How Email + SMS Retention Systems Increase LTV',
    excerpt:
      'A working blueprint for the email and SMS architecture we deploy for repeat-purchase brands — what each channel does, and how they coordinate.',
    category: 'Lifecycle',
    tags: ['Email', 'SMS', 'Klaviyo', 'Attentive'],
    publishedAt: '2025-10-28',
    readingTime: '9 min read',
    author: Author,
    body: (
      <>
        <p>
          Email and SMS are often treated as two channels in competition for the same calendar slot. In a
          well-built retention system, they are not competing. They are doing different jobs at different points
          in the customer's life with the brand.
        </p>

        <h2>Email is the system of record</h2>
        <p>
          Email is where you teach, tell stories, build identity around the brand, deliver longer offers, and
          carry the bulk of automated lifecycle. It tolerates length, it tolerates frequency variance, and it
          gives you room to actually develop a voice. In our deployments, email handles roughly 70% of automated
          revenue and almost all of the brand-building work.
        </p>

        <h2>SMS is the interrupt channel</h2>
        <p>
          SMS is short, immediate, and uses up customer trust quickly if abused. We treat it as an interrupt
          channel — for moments where time matters and the message is genuinely worth a buzz. Back-in-stock,
          drop launches, replenishment timing, post-purchase shipping, abandoned checkout under two hours. Almost
          never a generic Friday promo.
        </p>

        <h2>The seven flows that do most of the work</h2>
        <p>
          Across most growth-stage stores, seven flows account for roughly 80% of automated revenue. Get these
          right before anything else.
        </p>
        <ul>
          <li><strong>Welcome series</strong> — sets the offer, sets the expectation, sets the voice. Three to five emails over ten days.</li>
          <li><strong>Browse abandonment</strong> — light touch, intent-based, not aggressive.</li>
          <li><strong>Cart and checkout abandonment</strong> — two emails plus one SMS within 24 hours.</li>
          <li><strong>Post-purchase education</strong> — usage, care, what to expect. The most under-built flow in ecommerce.</li>
          <li><strong>Review request</strong> — timed to actual delivery plus product use, not order date.</li>
          <li><strong>Replenishment / second purchase</strong> — the single most important LTV flow for consumables.</li>
          <li><strong>Winback</strong> — segmented by purchase value, not just recency.</li>
        </ul>

        <h2>Coordination is the unlock</h2>
        <blockquote>
          A flow that does not know what the campaign just sent is a flow that will eventually annoy the customer.
        </blockquote>
        <p>
          Most Klaviyo accounts run flows and campaigns in parallel without talking to each other. The customer
          who just got a 15% campaign yesterday should not get a 10% welcome offer today. Suppression rules
          between flows and campaigns — and between email and SMS — are unglamorous and the highest-leverage
          configuration most accounts are missing.
        </p>

        <h2>What changes when this is built correctly</h2>
        <p>
          Repeat-purchase rate is the first metric to move, usually within six to eight weeks. AOV moves next as
          segmentation lets you push higher-tier offers to the right customers. LTV is the lagging indicator —
          measurable around the four-month mark, meaningful at six.
        </p>
      </>
    ),
  },
  {
    slug: 'the-hidden-cost-of-customer-churn',
    title: 'The Hidden Cost of Customer Churn',
    excerpt:
      'Churn is more expensive than the lost revenue. It is also the cost of replacing it. Why most brands underestimate the bill.',
    category: 'Retention Strategy',
    tags: ['Churn', 'Cohorts', 'Margin'],
    publishedAt: '2025-09-30',
    readingTime: '5 min read',
    author: Author,
    body: (
      <>
        <p>
          When a customer churns, the obvious cost is the future revenue they will not generate. The less obvious
          cost — and the larger one — is the acquisition cost of the new customer the brand has to find to replace
          them. Counted properly, churn shows up twice on the P&L.
        </p>

        <h2>The double-count nobody runs</h2>
        <p>
          A returning customer with a $90 AOV at 60% gross margin contributes $54 of margin per order, against
          maybe a few dollars of marketing cost. A replacement customer at the same AOV and margin contributes
          the same $54 — minus the CAC needed to acquire them. For most brands, that single substitution erases
          half the margin or more.
        </p>
        <p>
          Multiply that by every churned customer in a quarter and the number stops being a rounding error. It
          becomes the single largest line item nobody is reporting.
        </p>

        <h2>Why churn is invisible</h2>
        <blockquote>
          Most stores cannot tell you what their 90-day churn rate is, because they have never agreed on a
          definition.
        </blockquote>
        <p>
          For one-time purchase brands, "churn" requires a working definition of expected next-purchase window. For
          subscription brands, it requires distinguishing involuntary churn (failed payments) from voluntary churn
          (active cancellation). Without that definitional clarity, there is nothing to measure and nothing to
          intervene on.
        </p>

        <h2>What works</h2>
        <p>
          The interventions that consistently reduce churn are not exotic. Fix payment retry logic. Build a
          genuine winback flow that is segmented by historical value. Identify the at-risk window for your
          category and trigger a flow before the customer crosses it. Every one of these is a finite engineering
          project, not a strategy.
        </p>
      </>
    ),
  },
  {
    slug: 'why-repeat-purchases-matter-more-than-roas',
    title: 'Why Repeat Purchases Matter More Than ROAS',
    excerpt:
      'ROAS describes one transaction. Repeat-purchase rate describes a business. A short argument for changing the metric you optimize against.',
    category: 'Measurement',
    tags: ['ROAS', 'Repeat Rate', 'Reporting'],
    publishedAt: '2025-09-08',
    readingTime: '4 min read',
    author: Author,
    body: (
      <>
        <p>
          ROAS is a comfortable metric. It updates daily, it has a clear formula, and it makes performance
          marketing feel like a tractable problem. The trouble is that it describes a single transaction, in
          isolation, with no information about whether the customer is worth keeping.
        </p>

        <h2>The metric that actually predicts the business</h2>
        <p>
          Repeat-purchase rate — the percentage of customers who buy a second time within a defined window — is
          the closest thing ecommerce has to a leading indicator of long-term profitability. It captures product
          quality, post-purchase experience, lifecycle execution, and customer fit in one number. If it is rising,
          the business is healthy. If it is flat while ad spend is rising, the business is treading water.
        </p>

        <h2>What changes when you optimize for it</h2>
        <blockquote>
          Brands that report on repeat rate weekly start making different decisions within a month.
        </blockquote>
        <p>
          The discount strategy changes. The first-purchase product mix changes. The post-purchase email gets
          built. The customer service team starts being treated as a retention asset instead of a cost center. None
          of this happens when ROAS is the only number on the dashboard.
        </p>

        <h2>You do not have to choose</h2>
        <p>
          ROAS is not wrong. It is incomplete. The brands we work with continue to track it — and they put repeat
          rate next to it on the same dashboard, with equal weight. That single change quietly reorganizes
          priorities across the entire team.
        </p>
      </>
    ),
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
