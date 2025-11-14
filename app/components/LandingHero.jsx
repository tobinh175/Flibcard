export default function LandingHero() {
  const heroImageUrl = 'https://via.placeholder.com/600x400?text=Landing+Hero';
  
  return (
    <section className="landing-hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to our special landing</h1>
          <p className="hero-sub">A fast, modern Hydrogen landingpage served on a subdomain.</p>
          <div className="hero-actions">
            <a className="btn primary" href="/collections">Shop Products</a>
            <a className="btn ghost" href="/">Back to Store</a>
          </div>
        </div>
        <div className="hero-media">
          <img src={heroImageUrl} alt="Hero" />
        </div>
      </div>
    </section>
  );
}
