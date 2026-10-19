export function ProductCard({ garment, index }) {
  return (
    <article className="product-card" style={{ '--card-index': index }}>
      <a
        className="product-card__link"
        href={`#product/${garment.id}`}
        aria-label={`View ${garment.name}`}
      >
        <div className="product-card__visual">
          <img
            src={garment.image}
            alt={garment.name}
            className="product-card__image"
            loading="lazy"
          />

          <div className="product-card__badge-row">
            <span className="product-card__design-tag">{garment.number || `0${index + 1}`}</span>
            <span className="product-card__gsm-tag">{garment.gsm}</span>
          </div>
        </div>
      </a>

      <div className="product-card__meta">
        <div className="product-card__titles">
          <span className="product-card__collection">{garment.collection}</span>
          <h3 className="product-card__name">
            <a href={`#product/${garment.id}`}>{garment.name}</a>
          </h3>
          <span className="product-card__palette">{garment.subtitle}</span>
        </div>
        <div className="product-card__footer">
          <span className="product-card__price">{garment.price}</span>
          <a
            className="product-card__action"
            href={`#product/${garment.id}`}
            aria-label={`View 3D for ${garment.name}`}
          >
            VIEW 3D →
          </a>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
