import { useState } from 'react'
import { productColors, garments, getProductGallery } from '../data/garments'
import { GarmentViewer3D } from './GarmentViewer3D'
import { ProductCard } from './ProductCard'

export function ProductDetailPage({ garment }) {
  const [selectedColor, setSelectedColor] = useState(garment.defaultColor || garment.colors[0])
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeAngle, setActiveAngle] = useState('front')
  const [mode, setMode] = useState('gallery') // Default to Lookbook Gallery on Product Detail Page
  const [autoRotate, setAutoRotate] = useState(false)
  const [zoom, setZoom] = useState(1.0)
  const [wireframe, setWireframe] = useState(false)



  const gallery = getProductGallery(garment)

  const activeColorHex =
    productColors.find((c) => c.name === selectedColor)?.value || '#24262a'

  const angles = [
    { id: 'front', label: 'FRONT', desc: 'Chest Emblem & Front View' },
    { id: 'back', label: 'BACK', desc: 'Distressed Back Typography & Art' },
    { id: 'left', label: 'LEFT', desc: 'Left Profile & Sleeve Artwork' },
    { id: 'right', label: 'RIGHT', desc: 'Right Profile & Construction Seams' },
  ]

  const angleKeys = angles.map((a) => a.id)

  const handlePrevAngle = () => {
    const currentIndex = angleKeys.indexOf(activeAngle)
    const prevIndex = (currentIndex - 1 + angleKeys.length) % angleKeys.length
    setActiveAngle(angleKeys[prevIndex])
  }

  const handleNextAngle = () => {
    const currentIndex = angleKeys.indexOf(activeAngle)
    const nextIndex = (currentIndex + 1) % angleKeys.length
    setActiveAngle(angleKeys[nextIndex])
  }

  const relatedGarments = garments
    .filter((item) => item.id !== garment.id)
    .sort((a, b) => {
      if (a.collection === garment.collection && b.collection !== garment.collection) return -1
      if (b.collection === garment.collection && a.collection !== garment.collection) return 1
      return 0
    })
    .slice(0, 4)

  // Current view image path & view status
  const currentViewImage = gallery[activeAngle] || gallery.front || garment.image
  const currentViewStatus = gallery.viewsStatus?.[activeAngle] || 'verified'
  const isSchematicView = currentViewStatus === 'schematic'

  return (
    <div className="product-page" id="detail">
      {/* Top Navigation Bar */}
      <div className="detail-top-bar">
        <a className="detail-back-link" href="#collection">
          ← BACK TO COLLECTION
        </a>
        <div className="detail-mode-toggle" role="group" aria-label="Viewer Mode">
          <button
            type="button"
            className={`mode-btn${mode === 'gallery' ? ' is-active' : ''}`}
            onClick={() => setMode('gallery')}
          >
            LOOKBOOK GALLERY
          </button>
          <button
            type="button"
            className={`mode-btn${mode === '3d' ? ' is-active' : ''}`}
            onClick={() => setMode('3d')}
          >
            INTERACTIVE 3D
          </button>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <section className="detail-showcase-grid">
        {/* Left Column: Product Stage with Arrows & Synchronized Thumbnails */}
        <div className="detail-visual-stage">
          <div className="detail-stage-wrapper">
            {/* Left Nav Arrow */}
            <button
              type="button"
              className="stage-nav-arrow stage-nav-arrow--left"
              onClick={handlePrevAngle}
              aria-label="Previous view angle"
            >
              ←
            </button>

            {/* Central Stage Display */}
            {mode === 'gallery' ? (
              <div className="detail-photo-container">
                <img
                  key={`${garment.id}-${activeAngle}`}
                  src={currentViewImage}
                  alt={`${garment.name} ${activeAngle.toUpperCase()} view`}
                  className="detail-photo-main"
                  onError={(e) => {
                    // Graceful fallback to verified primary image if specific view fails
                    if (e.target.src !== garment.image) {
                      e.target.src = garment.image
                    }
                  }}
                />

                {/* View Badge: Informs user if this angle is an Atelier Schematic */}
                {isSchematicView && (
                  <div className="detail-schematic-pill">
                    <span className="schematic-pill__indicator">●</span>
                    <span>ATELIER ARCHIVE SCHEMATIC // TECHNICAL BLUEPRINT</span>
                  </div>
                )}

                {/* Bottom Caption Overlay */}
                <div className="detail-photo-caption">
                  <span className="caption-garment">{garment.name}</span>
                  <span className="caption-angle">// {activeAngle.toUpperCase()} VIEW</span>
                  <span className="caption-color">// {selectedColor.toUpperCase()}</span>
                </div>
              </div>
            ) : (
              <div className="detail-canvas-container">
                <GarmentViewer3D
                  garment={garment}
                  color={activeColorHex}
                  view={activeAngle}
                  onViewChange={setActiveAngle}
                  scale={1.12}
                  autoRotate={autoRotate}
                  showWireframe={wireframe}
                  zoomLevel={zoom}
                />
                <div className="stage-utility-hud">
                  <button
                    type="button"
                    className={`hud-btn${autoRotate ? ' is-active' : ''}`}
                    onClick={() => setAutoRotate((prev) => !prev)}
                    title="Toggle 360 Auto-Rotation"
                  >
                    360° SPIN
                  </button>
                  <button
                    type="button"
                    className={`hud-btn${wireframe ? ' is-active' : ''}`}
                    onClick={() => setWireframe((prev) => !prev)}
                    title="Toggle Wireframe Mesh"
                  >
                    WIREFRAME
                  </button>
                  <button
                    type="button"
                    className="hud-btn"
                    onClick={() => setZoom((z) => Math.min(Number((z + 0.2).toFixed(2)), 1.8))}
                    title="Zoom in on garment details"
                  >
                    + ZOOM
                  </button>
                  <button
                    type="button"
                    className="hud-btn"
                    onClick={() => setZoom((z) => Math.max(Number((z - 0.2).toFixed(2)), 0.7))}
                    title="Zoom out"
                  >
                    − ZOOM
                  </button>
                  {zoom !== 1.0 && (
                    <button
                      type="button"
                      className="hud-btn"
                      onClick={() => setZoom(1.0)}
                      title="Reset default zoom"
                    >
                      RESET
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Right Nav Arrow */}
            <button
              type="button"
              className="stage-nav-arrow stage-nav-arrow--right"
              onClick={handleNextAngle}
              aria-label="Next view angle"
            >
              →
            </button>
          </div>

          {/* 4-Angle Synchronized Thumbnail Strip */}
          <div className="detail-angle-thumbnails" role="group" aria-label="Garment 4 Angles">
            {angles.map((angle) => {
              const thumbUrl = gallery[angle.id] || gallery.front || garment.image
              const isSelected = activeAngle === angle.id
              const isSchematic = gallery.viewsStatus?.[angle.id] === 'schematic'

              return (
                <button
                  key={angle.id}
                  type="button"
                  className={`detail-thumb-card${isSelected ? ' is-selected' : ''}`}
                  onClick={() => setActiveAngle(angle.id)}
                  aria-pressed={isSelected}
                  title={`View ${angle.label} — ${angle.desc}`}
                >
                  <div className="detail-thumb-img-wrap">
                    <img
                      src={thumbUrl}
                      alt={`${garment.name} ${angle.label} thumbnail`}
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== garment.image) {
                          e.target.src = garment.image
                        }
                      }}
                    />
                    {isSchematic && (
                      <span className="thumb-schematic-badge" title="Atelier Studio Specification">
                        SPEC
                      </span>
                    )}
                  </div>
                  <div className="thumb-label-row">
                    <span className="thumb-label">{angle.label}</span>
                    {isSelected && <span className="thumb-dot" aria-hidden="true">●</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Specification & Purchase Details */}
        <div className="detail-spec-panel">
          <div className="detail-spec-header">
            <div className="eyebrow-row">
              <span className="eyebrow">{garment.collection} // ARCHIVE</span>
              <span className="design-number-pill">DESIGN {garment.number || '01'}</span>
            </div>
            <h1 className="detail-title">{garment.name}</h1>
            <p className="detail-subtitle">{garment.subtitle}</p>
            <div className="detail-price-row">
              <span className="detail-price">{garment.price}</span>
              <span className="detail-vat">TAX INCL. // WORLDWIDE EXPRESS SHIPPING</span>
            </div>
          </div>

          <div className="detail-divider" />

          {/* Garment Description */}
          <div className="detail-description-block">
            <p>{garment.description}</p>
          </div>

          {/* Color Selector */}
          <div className="detail-option-group">
            <div className="option-label-row">
              <span className="option-label">COLOR</span>
              <strong className="option-val">{selectedColor}</strong>
            </div>
            <div className="swatches-grid" role="group" aria-label="Available Colorways">
              {garment.colors.map((colorName) => {
                const swatch = productColors.find((c) => c.name === colorName)
                const isSelected = selectedColor === colorName
                return (
                  <button
                    key={colorName}
                    type="button"
                    className={`color-swatch-btn${isSelected ? ' is-selected' : ''}`}
                    onClick={() => setSelectedColor(colorName)}
                    aria-label={`Select ${colorName}`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="color-dot"
                      style={{ backgroundColor: swatch?.value || '#24262a' }}
                    />
                    <span className="color-name">{colorName}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="detail-option-group">
            <div className="option-label-row">
              <span className="option-label">SIZE</span>
              <strong className="option-val">{selectedSize} (OVERSIZED FIT)</strong>
            </div>
            <div className="size-selector-row" role="group" aria-label="Available Sizes">
              {garment.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn${selectedSize === size ? ' is-selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW FRONT, BACK, LEFT, RIGHT Action Buttons (Synchronized with Gallery) */}
          <div className="detail-option-group">
            <div className="option-label-row">
              <span className="option-label">SELECT VIEW ANGLE</span>
              <strong className="option-val">{activeAngle.toUpperCase()} VIEW</strong>
            </div>
            <div className="detail-action-buttons-row">
              {angles.map((ang) => (
                <button
                  key={ang.id}
                  type="button"
                  className={`detail-action-btn${activeAngle === ang.id ? ' is-active' : ''}`}
                  onClick={() => setActiveAngle(ang.id)}
                >
                  {ang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="detail-specs-table">
            <h3>SPECIFICATIONS</h3>
            <div className="spec-table-row">
              <span>WEIGHT / FABRIC</span>
              <strong>{garment.gsm} Heavy Combed Cotton Slub</strong>
            </div>
            <div className="spec-table-row">
              <span>SILHOUETTE</span>
              <strong>{garment.fit} (Wide Sleeves, Dropped Seam)</strong>
            </div>
            <div className="spec-table-row">
              <span>PRINT TECHNOLOGY</span>
              <strong>Discharge & High-Density Plastisol</strong>
            </div>
            <div className="spec-table-row">
              <span>CONSTRUCTION</span>
              <strong>Twin-Needle 6mm Locked Hems & 1x1 Neck Rib</strong>
            </div>
            <div className="spec-table-row">
              <span>DYE TREATMENT</span>
              <strong>Reactive Mineral Wash / Vintage Hand Fade</strong>
            </div>
          </div>

          {/* Garment Key Features */}
          {garment.features && garment.features.length > 0 && (
            <div className="detail-features-block">
              <h3>DESIGN ATTRIBUTES</h3>
              <ul>
                {garment.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Related Garments */}
      {!!relatedGarments.length && (
        <section className="related-section" aria-labelledby="related-title">
          <div className="section-header">
            <span className="eyebrow">CURATED SELECTION // SAME & COMPLEMENTARY DROPS</span>
            <h2 id="related-title">EXPLORE RELATED PIECES</h2>
          </div>
          <div className="product-grid">
            {relatedGarments.map((related, index) => (
              <ProductCard key={related.id} garment={related} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
