import { useState } from 'react'
import { detailGalleryItems } from '../data/garments'

export function GarmentDetailGallery() {
  const [activeItem, setActiveItem] = useState(null)

  return (
    <section className="detail-gallery-section" id="details" aria-labelledby="detail-gallery-title">
      <div className="section-header">
        <span className="eyebrow">02 / ATELIER CRAFT</span>
        <h2 id="detail-gallery-title">GARMENT DETAIL GALLERY</h2>
        <p className="section-subtitle">
          Physical construction breakdown: heavy-gauge cotton slub, precision twin-needle stitching, and distressed screenprint textures.
        </p>
      </div>

      <div className="detail-gallery-grid" role="list">
        {detailGalleryItems.map((item) => (
          <article
            key={item.id}
            className="detail-gallery-card"
            role="listitem"
            tabIndex={0}
            onClick={() => setActiveItem(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveItem(item)
              }
            }}
          >
            <div className="detail-gallery-card__media">
              <img
                src={item.image}
                alt={`${item.title} — ${item.subtitle}`}
                loading="lazy"
              />
              <span className="detail-card__badge">{item.letter}</span>
              <span className="detail-card__zoom-hint">INSPECT MACRO ↗</span>
            </div>
            <div className="detail-gallery-card__content">
              <div className="detail-card__header">
                <span className="detail-card__index">{item.letter} // ATELIER</span>
                <h3 className="detail-card__title">{item.title}</h3>
                <span className="detail-card__subtitle">{item.subtitle}</span>
              </div>
              <p className="detail-card__desc">{item.description}</p>
              <div className="detail-card__specs">
                {item.specs.map((spec) => (
                  <span key={spec} className="spec-tag">{spec}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Macro Inspection Modal */}
      {activeItem && (
        <div
          className="overlay-backdrop detail-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveItem(null)
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} macro inspection`}
        >
          <div className="detail-modal-dialog">
            <div className="detail-modal__header">
              <div>
                <span className="eyebrow">{activeItem.letter} // MACRO INSPECTION</span>
                <h3>{activeItem.title}</h3>
                <p>{activeItem.subtitle}</p>
              </div>
              <button
                type="button"
                className="overlay-close"
                onClick={() => setActiveItem(null)}
                aria-label="Close macro inspection"
              >
                ×
              </button>
            </div>
            <div className="detail-modal__body">
              <div className="detail-modal__image-wrapper">
                <img
                  src={activeItem.image}
                  alt={`${activeItem.title} zoomed view`}
                />
              </div>
              <div className="detail-modal__info">
                <h4>Construction Notes</h4>
                <p>{activeItem.description}</p>
                <div className="detail-modal__specs-list">
                  <h5>Technical Specifications:</h5>
                  <ul>
                    {activeItem.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-modal__footer-note">
                  <span>VERIFIED ATELIER SPECIFICATION // WTFBY STREETWEAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
export default GarmentDetailGallery
