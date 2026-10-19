import { useEffect, useRef, useState } from 'react'
import { categoryFilters, garments } from './data/garments'
import { ProductCard } from './components/ProductCard'
import { ProductDetailPage } from './components/ProductDetailPage'
import { StudioPage } from './components/StudioPage'
import { AboutPage } from './components/AboutPage'
import './App.css'

const copyrightYear = 2024

const heroCampaigns = [
  {
    num: '01',
    titleLine1: 'DARK',
    titleLine2: 'LUXURY',
    subtitle: 'WASHED BLACK / OFF-WHITE / SILVER',
    image: '/assets/fashion/hero/hero-campaign-01.webp',
    thumb: '/assets/fashion/collection/01_dark_luxury.webp',
  },
  {
    num: '02',
    titleLine1: 'INDUS-',
    titleLine2: 'TRIAL',
    subtitle: 'CHARCOAL GREY // BUILT UNDER PRESSURE',
    image: '/assets/fashion/hero/hero-campaign-02.webp',
    thumb: '/assets/fashion/collection/02_industrial.webp',
  },
  {
    num: '03',
    titleLine1: 'MINI-',
    titleLine2: 'MAL',
    subtitle: 'CREAM / STONE // ASYMMETRIC SLUB',
    image: '/assets/fashion/hero/hero-campaign-03.webp',
    thumb: '/assets/fashion/collection/03_minimal.webp',
  },
  {
    num: '04',
    titleLine1: 'UNDER-',
    titleLine2: 'GROUND',
    subtitle: 'FADED BLACK // RAW DISTRESSED INK',
    image: '/assets/fashion/hero/hero-campaign-04.webp',
    thumb: '/assets/fashion/collection/04_underground.webp',
  },
]

const routeAliases = {
  'dark-luxury-05': 'fracture-05',
  'industrial-06': 'ritual-06',
  'minimal-08': 'ether-08',
  '01': 'dark-luxury-01',
  '02': 'industrial-02',
  '03': 'minimal-03',
  '04': 'underground-04',
  '05': 'fracture-05',
  '06': 'ritual-06',
  '07': 'chaos-07',
  '08': 'ether-08',
}

function readRoute() {
  const [, route = ''] = window.location.hash.split('#')
  const [type, rawValue] = route.split('/')
  const value = routeAliases[rawValue] || rawValue
  if (type === 'product' && garments.some((g) => g.id === value)) {
    return { type: 'product', value }
  }
  if (type === 'collection') {
    const formatted = value ? value.toUpperCase().replace('-', ' ') : null
    return { type: 'collection', value: formatted }
  }
  return { type: 'home', value: null }
}

function SearchOverlay({ onClose, onOpenProduct, returnFocusRef }) {
  const [query, setQuery] = useState('')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL')
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const normalizedQuery = query.trim().toLowerCase()

  const filteredByCategory =
    activeCategoryFilter === 'ALL'
      ? garments
      : garments.filter((g) => g.collection === activeCategoryFilter)

  const results = normalizedQuery
    ? filteredByCategory.filter((g) =>
        `${g.name} ${g.subtitle} ${g.collection} ${g.number || ''} ${g.colors.join(' ')}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : filteredByCategory

  useEffect(() => {
    inputRef.current?.focus()
    const returnFocusTarget = returnFocusRef.current
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusTarget?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div
      className="overlay-backdrop search-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        id="search-dialog"
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        <div className="overlay-heading">
          <div>
            <div className="eyebrow">WTFBY / ARCHIVE SEARCH</div>
            <h2 id="search-title">Search collection</h2>
          </div>
          <button className="overlay-close" type="button" onClick={onClose} aria-label="Close search">
            ×
          </button>
        </div>

        <div className="search-field">
          <label className="visually-hidden" htmlFor="product-search">
            Search garments or collections
          </label>
          <input
            ref={inputRef}
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search DARK LUXURY, 02, or CHARCOAL..."
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
            >
              Clear
            </button>
          )}
          <span aria-hidden="true" className="search-field-icon">⌕</span>
        </div>

        {/* Quick Filter Categories */}
        <div className="search-categories-pills">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`search-cat-pill${activeCategoryFilter === cat ? ' is-active' : ''}`}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-results" aria-live="polite" ref={resultsRef}>
          {results.length ? (
            results.map((garment) => (
              <a
                className="search-result"
                key={garment.id}
                href={`#product/${garment.id}`}
                onClick={() => onOpenProduct()}
              >
                <span className="search-result__visual">
                  <img
                    src={garment.image}
                    alt={garment.name}
                  />
                </span>
                <div className="search-result__info">
                  <span className="search-result__collection">{garment.collection}</span>
                  <span className="search-result__name">{garment.name}</span>
                  <span className="search-result__colors">{garment.subtitle}</span>
                </div>
                <span className="search-result__price">{garment.price}</span>
                <span className="search-result__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))
          ) : (
            <p className="search-empty">No pieces match “{query}”. Try a design number or collection name.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function MenuOverlay({ onClose, returnFocusRef }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const returnFocusTarget = returnFocusRef.current
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusTarget?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div
      className="overlay-backdrop menu-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <nav className="menu-overlay" id="site-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
        <div className="menu-overlay__top">
          <span className="eyebrow">WTFBY / NAVIGATION</span>
          <button
            ref={closeButtonRef}
            className="overlay-close"
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        {[
          ['HOME', '#top'],
          ['COLLECTION', '#collection'],
          ['STUDIO', '#studio'],
          ['ABOUT', '#about'],
        ].map(([label, href], index) => (
          <a key={label} href={href} onClick={onClose}>
            <span className="menu-overlay__index">{String(index + 1).padStart(2, '0')}</span>
            <span>{label}</span>
            <span aria-hidden="true">→</span>
          </a>
        ))}

        <div className="menu-overlay__footer">
          <p>WTFBY APPARATUS // ARCHIVE 2024</p>
          <div className="menu-socials">
            <span>INSTAGRAM</span>
            <span>X (TWITTER)</span>
            <span>YOUTUBE</span>
          </div>
        </div>
      </nav>
    </div>
  )
}

export function App() {
  const [route, setRoute] = useState(readRoute)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Collection category filter state
  const [activeCategory, setActiveCategory] = useState('ALL')

  // Hero campaign interactive state (switching fashion campaign photographs)
  const [heroCampaignIndex, setHeroCampaignIndex] = useState(0)

  const searchTriggerRef = useRef(null)
  const menuTriggerRef = useRef(null)

  const selectedGarment =
    route.type === 'product'
      ? garments.find((g) => g.id === route.value)
      : null

  const currentCampaign = heroCampaigns[heroCampaignIndex] || heroCampaigns[0]

  // Filter garments for collection page
  const visibleGarments =
    activeCategory === 'ALL'
      ? garments
      : garments.filter((g) => g.collection === activeCategory)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hashTarget = window.location.hash.slice(1)
    const targetId =
      route.type === 'product'
        ? 'detail'
        : hashTarget === 'collection' || hashTarget.startsWith('collection')
        ? 'collection'
        : ['about', 'studio', 'top'].includes(hashTarget)
        ? hashTarget
        : null
    if (!targetId) return

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    document.getElementById(targetId)?.scrollIntoView({ behavior, block: 'start' })
  }, [route])

  return (
    <div className="page-shell">
      {/* Top Navigation Bar */}
      <header className={`topbar${isScrolled ? ' is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="WTFBY home">
          WTFBY
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection" onClick={() => setMenuOpen(false)}>
            COLLECTION
          </a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>
            STUDIO
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </a>
        </nav>
        <div className="actions">
          <button
            ref={searchTriggerRef}
            type="button"
            aria-label="Search products"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-controls="search-dialog"
            className="icon-button"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen(true)
            }}
          >
            <span>⌕</span>
          </button>
          <button
            ref={menuTriggerRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            className={`icon-button menu-button${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Overlays */}
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onOpenProduct={() => setSearchOpen(false)}
          returnFocusRef={searchTriggerRef}
        />
      )}
      {menuOpen && (
        <MenuOverlay
          onClose={() => setMenuOpen(false)}
          returnFocusRef={menuTriggerRef}
        />
      )}

      {/* Main Content Area */}
      <main>
        {selectedGarment ? (
          <ProductDetailPage key={selectedGarment.id} garment={selectedGarment} />
        ) : (
          <>
            {/* HERO SECTION — REAL FASHION PHOTOGRAPHY */}
            <section className="hero" id="top">
              <h1 className="visually-hidden">WTFBY — Premium Luxury Streetwear Fashion</h1>

              {/* Central Fashion Hero Stage: Full-bleed campaign photography */}
              <div className="hero__stage">
                <div className="hero__editorial-image-container">
                  <img
                    src={currentCampaign.image}
                    alt={`WTFBY ${currentCampaign.titleLine1} ${currentCampaign.titleLine2} Campaign`}
                    className="hero__editorial-image"
                  />
                </div>
              </div>

              {/* Left Overlay: 01 / 04, DARK LUXURY headline, Subtitle, Explore button */}
              <div className="hero__left-editorial">
                <span className="hero__counter">
                  {currentCampaign.num} / 04
                </span>
                <div className="hero__large-title">
                  <h2>{currentCampaign.titleLine1}</h2>
                  <h2>{currentCampaign.titleLine2}</h2>
                </div>
                <p className="hero__palette-sub">
                  {currentCampaign.subtitle}
                </p>
                <div className="hero__cta-wrap">
                  <a href="#collection" className="hero__explore-btn">
                    EXPLORE COLLECTION →
                  </a>
                </div>
              </div>

              {/* Bottom Left Scroll Indicator */}
              <div className="hero__scroll-indicator">
                <a href="#collection" className="hero__scroll-link">
                  ↓ SCROLL
                </a>
              </div>

              {/* Right Vertical Thumbnail Rail: Clicking switches between real fashion photographs */}
              <div
                className="hero__right-rail"
                role="group"
                aria-label="Fashion Campaign Photographs"
              >
                {heroCampaigns.map((camp, idx) => (
                  <button
                    key={camp.num}
                    type="button"
                    className={`hero-rail-thumb${heroCampaignIndex === idx ? ' is-active' : ''}`}
                    onClick={() => setHeroCampaignIndex(idx)}
                    aria-label={`View ${camp.titleLine1} ${camp.titleLine2} Campaign Photograph`}
                  >
                    <div className="rail-thumb-img">
                      <img src={camp.thumb} alt={camp.subtitle} />
                    </div>
                    <span className="rail-thumb-num">{camp.num}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* COLLECTION SECTION — Matching Top-Middle Screen */}
            <section className="collection" id="collection" aria-labelledby="collection-heading">
              <div className="section-header">
                <span className="eyebrow">01 / ARCHIVE</span>
                <h2 id="collection-heading">COLLECTION</h2>
                <p className="section-subtitle">
                  Eight heavyweight oversized garments engineered across dark luxury, industrial, minimal, and underground disciplines.
                </p>
              </div>

              {/* Category Filter Pills: ALL, DARK LUXURY, INDUSTRIAL, MINIMAL, UNDERGROUND */}
              <nav className="collection-tabs" aria-label="Product categories">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`collection-tab-btn${activeCategory === cat ? ' is-selected' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              {/* 8 Product Cards Grid */}
              <div className="product-grid">
                {visibleGarments.map((garment, index) => (
                  <ProductCard key={garment.id} garment={garment} index={index} />
                ))}
              </div>

              {!visibleGarments.length && (
                <p className="collection-empty">No products found in this category.</p>
              )}
            </section>

            {/* STUDIO SECTION — Matching Middle-Left Screen */}
            <StudioPage />

            {/* ABOUT SECTION — Matching Middle-Right Screen */}
            <AboutPage />
          </>
        )}
      </main>

      {/* Site Footer Matching Reference */}
      <footer className="site-footer">
        <div className="footer-top">
          <a className="footer-brand" href="#top">
            WTFBY
          </a>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#collection">COLLECTION</a>
            <a href="#studio">STUDIO</a>
            <a href="#about">ABOUT</a>
          </nav>
        </div>

        <div className="footer-social-row">
          <span className="social-label">STREETWEAR ARCHIVE // CONNECT:</span>
          <div className="social-links-list">
            <span className="social-link-item" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>INSTAGRAM</span>
            </span>
            <span className="social-link-item" title="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </span>
            <span className="social-link-item" title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
              <span>YOUTUBE</span>
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <small>© {copyrightYear} WTFBY. ALL RIGHTS RESERVED.</small>
          <small>OVERSIZED STREETWEAR APPARATUS // ATELIER SPECIFICATION</small>
        </div>
      </footer>
    </div>
  )
}

export default App
