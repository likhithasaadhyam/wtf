import { useState, useEffect } from 'react'
import { studioCards } from '../data/garments'

export function StudioPage() {
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCard(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="studio-section" id="studio" aria-labelledby="studio-title">
      <div className="section-header">
        <span className="eyebrow">02 / CRAFT & CONSTRUCTION</span>
        <h2 id="studio-title">STUDIO</h2>
        <p className="section-subtitle">
          Shape, construction, print, and material details.
        </p>
      </div>

      {/* 4x2 Studio Grid Matching Reference Design */}
      <div className="studio-cards-grid">
        {studioCards.map((card, index) => (
          <article
            key={card.id}
            className="studio-card"
            onClick={() => setActiveCard(card)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveCard(card)
              }
            }}
            aria-label={`Inspect ${card.title}`}
          >
            <div className="studio-card__media">
              <img
                src={card.image}
                alt={`${card.title} garment detail`}
                loading="lazy"
              />
              <span className="studio-card__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="studio-card__inspect-pill">INSPECT ⊕</span>
            </div>
            <div className="studio-card__body">
              <h3 className="studio-card__title">{card.title}</h3>
              <span className="studio-card__subtitle">{card.subtitle}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Modal for Macro Detail Inspection */}
      {activeCard && (
        <div
          className="overlay-backdrop studio-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveCard(null)
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-card-title"
        >
          <div className="studio-modal-dialog">
            <div className="studio-modal__header">
              <div>
                <span className="eyebrow">WTFBY STUDIO // SPECIFICATION</span>
                <h3 id="modal-card-title">{activeCard.title}</h3>
                <p>{activeCard.subtitle}</p>
              </div>
              <button
                type="button"
                className="overlay-close"
                onClick={() => setActiveCard(null)}
                aria-label="Close detail modal"
              >
                ×
              </button>
            </div>

            <div className="studio-modal__body">
              <div className="studio-modal__image-wrap">
                <img
                  src={activeCard.highRes || activeCard.image}
                  alt={activeCard.title}
                />
              </div>

              <div className="studio-modal__info">
                <h4>CONSTRUCTION BLUEPRINT</h4>
                <p>{activeCard.description}</p>

                {activeCard.specs && (
                  <div className="studio-modal__specs">
                    <h5>TECHNICAL STANDARDS</h5>
                    <ul>
                      {activeCard.specs.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="studio-modal__footer-tag">
                  WTFBY ATELIER SPECIFICATION // ARCHIVE QUALITY
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudioPage
