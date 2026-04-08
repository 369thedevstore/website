import { EnquiryForm } from '@/components/enquiry-form';

const plans = [
  {
    name: 'Basic',
    price: 'From $299',
    text: 'A clean, fast one-page website with the essentials.',
  },
  {
    name: 'Standard',
    price: 'From $599',
    text: 'Landing page, enquiry setup, and a sharper brand presentation.',
  },
  {
    name: 'Premium',
    price: 'From $999',
    text: 'Custom design direction, stronger copy, and conversion-focused polish.',
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="page-frame">
        <header className="topbar">
          <img className="brand-logo" src="/images/finals-pakka.svg" alt="The Dev Store logo" />
          <a className="topbar-link" href="#enquiry">
            Start enquiry
          </a>
        </header>

        <div className="content-grid">
          <section className="hero-panel">
            <div className="hero-logo-wrap">
              <img className="hero-logo" src="/images/finals-pakka.svg" alt="The Dev Store logo" />
            </div>
            <p className="hero-copy">
              A focused landing page built for Vercel, with an enquiry form that stores leads in
              Supabase and emails them straight to 369thedevstore@gmail.com.
            </p>

            <div className="hero-points">
              <span>One page only</span>
              <span>No clutter</span>
              <span>Built to grow later</span>
            </div>

            <h1>One-page websites for small businesses that need to look ready now.</h1>

            <div className="pricing-row" aria-label="Pricing packages">
              {plans.map((plan) => (
                <article className="price-card" key={plan.name}>
                  <p className="price-name">{plan.name}</p>
                  <p className="price-value">{plan.price}</p>
                  <p className="price-text">{plan.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="enquiry-panel" id="enquiry">
            <div className="panel-heading">
              <p className="panel-kicker">Enquiry</p>
              <h2>Send a brief and get a response.</h2>
            </div>
            <EnquiryForm />
          </section>
        </div>
      </section>
    </main>
  );
}