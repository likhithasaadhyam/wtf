export function AboutPage() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-header">
        <span className="eyebrow">03 / ATELIER ETHOS</span>
        <h2 id="about-title">ABOUT WTFBY</h2>
        <p className="section-subtitle">
          An independent design apparatus dedicated to the study of oversized silhouettes, material weight, and industrial graphics.
        </p>
      </div>

      {/* 3-Column Editorial Layout Matching Mentor Reference Middle-Right Screen */}
      <div className="about-cinematic-grid">
        {/* Left Column: Seated Model Large Editorial Visual */}
        <div className="about-visual-lead">
          <div className="about-model-card">
            <img
              src="/assets/fashion/about/about-fashion-portrait.png"
              alt="WTFBY Model seated wearing oversized streetwear"
              className="about-model-image"
              loading="lazy"
            />
            <div className="about-visual-badge">
              <span>WTFBY // 01</span>
              <span>OVERSIZED SILHOUETTE</span>
            </div>
          </div>
        </div>

        {/* Center Column: Editorial Brand Story & Philosophy */}
        <div className="about-story-col">
          <div className="about-lead-header">
            <span className="about-tag-mono">A1 ABOUT</span>
            <h3 className="about-main-headline">
              STREETWEAR FOR A HIGHER MIND.
            </h3>
          </div>

          <p className="about-story-text">
            WTFBY operates at the intersection of brutalist architecture and heavy textile engineering. Every piece is developed as an armor—constructed with dropped shoulders, exaggerated sleeve lengths, and 220–260 GSM combed cotton slub.
          </p>

          <p className="about-story-text">
            We reject the disposable tempo of fast-fashion streetwear. Our graphics are screenprinted using discharge ink formulations that dye raw cotton fibers rather than coating them in plastic, yielding an authentic vintage hand-feel that patinas with time.
          </p>

          <div className="about-principles-compact">
            <div className="principle-item">
              <span className="principle-number">01</span>
              <div className="principle-content">
                <h4>FORM FOLLOWS WEIGHT</h4>
                <p>220–260 GSM combed slub creates structural volume that retains shape without synthetic interlinings.</p>
              </div>
            </div>

            <div className="principle-item">
              <span className="principle-number">02</span>
              <div className="principle-content">
                <h4>TACTILE GRAPHICS</h4>
                <p>Water-based discharge screenprints fuse permanently into the textile weave with zero hand feel.</p>
              </div>
            </div>

            <div className="principle-item">
              <span className="principle-number">03</span>
              <div className="principle-content">
                <h4>DISCIPLINED CRAFT</h4>
                <p>Parallel twin-needle 6mm lockstitching and 1x1 elastane neck ribbing built for durability.</p>
              </div>
            </div>
          </div>

          <div className="about-cta-row">
            <a href="#collection" className="about-explore-btn">
              EXPLORE COLLECTION →
            </a>
          </div>
        </div>

        {/* Right Column: 3 Stacked Editorial Visuals */}
        <div className="about-stack-col">
          <div className="about-stack-card">
            <img
              src="/assets/fashion/about/about-collar-detail.png"
              alt="FBFY ribbed neck and collar detail"
              loading="lazy"
            />
            <span className="stack-caption">1x1 RIBBED COLLAR</span>
          </div>
          <div className="about-stack-card">
            <img
              src="/assets/fashion/about/about-graphic-detail.png"
              alt="WTFBY distressed screenprint graphic detail"
              loading="lazy"
            />
            <span className="stack-caption">PRESSURE IS A PRIVILEGE</span>
          </div>
          <div className="about-stack-card">
            <img
              src="/assets/fashion/about/about-industrial-editorial.png"
              alt="WTFBY brutalist industrial environment editorial"
              loading="lazy"
            />
            <span className="stack-caption">INDUSTRIAL PERSPECTIVE</span>
          </div>
        </div>
      </div>

      {/* Atelier Colophon */}
      <div className="about-colophon">
        <div className="colophon-item">
          <span>ATELIER SPECIFICATION</span>
          <strong>WTFBY // ARCHIVE</strong>
        </div>
        <div className="colophon-item">
          <span>PATTERN ARCHITECTURE</span>
          <strong>OVERSIZED DROP SHOULDER UNISEX</strong>
        </div>
        <div className="colophon-item">
          <span>FABRIC ORIGIN</span>
          <strong>100% COMBED HEAVY SLUB COTTON</strong>
        </div>
        <div className="colophon-item">
          <span>CURATION</span>
          <strong>WTFBY STUDIO // APPARATUS</strong>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
