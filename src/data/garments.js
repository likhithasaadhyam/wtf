export const categoryFilters = [
  'ALL',
  'DARK LUXURY',
  'INDUSTRIAL',
  'MINIMAL',
  'UNDERGROUND',
]

export const productColors = [
  { name: 'Washed Black', value: '#222428', ring: '#ffffff' },
  { name: 'Charcoal', value: '#505359', ring: '#ffffff' },
  { name: 'Off-White', value: '#ece6da', ring: '#ffffff' },
]

export const sizes = ['XS', 'S', 'M', 'L', 'XL']


export const garmentGalleries = {
  'dark-luxury-01': {
    front: '/assets/fashion/products/dark-luxury-01/front.webp',
    back: '/assets/fashion/products/dark-luxury-01/back.webp',
    left: '/assets/fashion/products/dark-luxury-01/left.webp',
    right: '/assets/fashion/products/dark-luxury-01/right.webp',
    thumbnails: [
      '/assets/fashion/products/dark-luxury-01/front.webp',
      '/assets/fashion/products/dark-luxury-01/back.webp',
      '/assets/fashion/products/dark-luxury-01/left.webp',
      '/assets/fashion/products/dark-luxury-01/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'verified',
      left: 'verified',
      right: 'verified',
    },
  },
  'industrial-02': {
    front: '/assets/fashion/products/industrial-02/front.webp',
    back: '/assets/fashion/products/industrial-02/back.webp',
    left: '/assets/fashion/products/industrial-02/left.webp',
    right: '/assets/fashion/products/industrial-02/right.webp',
    thumbnails: [
      '/assets/fashion/products/industrial-02/front.webp',
      '/assets/fashion/products/industrial-02/back.webp',
      '/assets/fashion/products/industrial-02/left.webp',
      '/assets/fashion/products/industrial-02/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'verified',
      left: 'verified',
      right: 'verified',
    },
  },
  'minimal-03': {
    front: '/assets/fashion/products/minimal-03/front.webp',
    back: '/assets/fashion/products/minimal-03/back.webp',
    left: '/assets/fashion/products/minimal-03/left.webp',
    right: '/assets/fashion/products/minimal-03/right.webp',
    thumbnails: [
      '/assets/fashion/products/minimal-03/front.webp',
      '/assets/fashion/products/minimal-03/back.webp',
      '/assets/fashion/products/minimal-03/left.webp',
      '/assets/fashion/products/minimal-03/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'verified',
      left: 'verified',
      right: 'verified',
    },
  },
  'underground-04': {
    front: '/assets/fashion/products/underground-04/front.webp',
    back: '/assets/fashion/products/underground-04/back.webp',
    left: '/assets/fashion/products/underground-04/left.webp',
    right: '/assets/fashion/products/underground-04/right.webp',
    thumbnails: [
      '/assets/fashion/products/underground-04/front.webp',
      '/assets/fashion/products/underground-04/back.webp',
      '/assets/fashion/products/underground-04/left.webp',
      '/assets/fashion/products/underground-04/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'verified',
      left: 'verified',
      right: 'verified',
    },
  },
  'fracture-05': {
    front: '/assets/fashion/products/fracture-05/front.webp',
    back: '/assets/fashion/products/fracture-05/back.webp',
    left: '/assets/fashion/products/fracture-05/left.webp',
    right: '/assets/fashion/products/fracture-05/right.webp',
    thumbnails: [
      '/assets/fashion/products/fracture-05/front.webp',
      '/assets/fashion/products/fracture-05/back.webp',
      '/assets/fashion/products/fracture-05/left.webp',
      '/assets/fashion/products/fracture-05/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'schematic',
      left: 'schematic',
      right: 'schematic',
    },
  },
  'ritual-06': {
    front: '/assets/fashion/products/ritual-06/front.webp',
    back: '/assets/fashion/products/ritual-06/back.webp',
    left: '/assets/fashion/products/ritual-06/left.webp',
    right: '/assets/fashion/products/ritual-06/right.webp',
    thumbnails: [
      '/assets/fashion/products/ritual-06/front.webp',
      '/assets/fashion/products/ritual-06/back.webp',
      '/assets/fashion/products/ritual-06/left.webp',
      '/assets/fashion/products/ritual-06/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'schematic',
      left: 'schematic',
      right: 'schematic',
    },
  },
  'chaos-07': {
    front: '/assets/fashion/products/chaos-07/front.webp',
    back: '/assets/fashion/products/chaos-07/back.webp',
    left: '/assets/fashion/products/chaos-07/left.webp',
    right: '/assets/fashion/products/chaos-07/right.webp',
    thumbnails: [
      '/assets/fashion/products/chaos-07/front.webp',
      '/assets/fashion/products/chaos-07/back.webp',
      '/assets/fashion/products/chaos-07/left.webp',
      '/assets/fashion/products/chaos-07/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'verified',
      left: 'verified',
      right: 'verified',
    },
  },
  'ether-08': {
    front: '/assets/fashion/products/ether-08/front.webp',
    back: '/assets/fashion/products/ether-08/back.webp',
    left: '/assets/fashion/products/ether-08/left.webp',
    right: '/assets/fashion/products/ether-08/right.webp',
    thumbnails: [
      '/assets/fashion/products/ether-08/front.webp',
      '/assets/fashion/products/ether-08/back.webp',
      '/assets/fashion/products/ether-08/left.webp',
      '/assets/fashion/products/ether-08/right.webp',
    ],
    viewsStatus: {
      front: 'verified',
      back: 'schematic',
      left: 'schematic',
      right: 'schematic',
    },
  },
}

export function getProductGallery(garment) {
  if (garment && garment.gallery) return garment.gallery
  if (garment && garmentGalleries[garment.id]) return garmentGalleries[garment.id]
  const fallback = garment?.image || '/assets/fashion/collection/01_dark_luxury.webp'
  return {
    front: fallback,
    back: fallback,
    left: fallback,
    right: fallback,
    thumbnails: [fallback, fallback, fallback, fallback],
    viewsStatus: { front: 'verified', back: 'fallback', left: 'fallback', right: 'fallback' },
  }
}

export const garments = [
  {
    id: 'dark-luxury-01',
    gallery: garmentGalleries['dark-luxury-01'],
    number: '01',
    name: '01. DARK LUXURY',
    collection: 'DARK LUXURY',
    subtitle: 'WASHED BLACK / OFF-WHITE / SILVER',
    price: '₹3,499',
    fit: 'Oversized Fit',
    gsm: '240 GSM',
    isLongSleeve: false,
    colors: ['Washed Black', 'Charcoal', 'Off-White'],
    defaultColor: 'Washed Black',
    sizes,
    image: '/assets/fashion/collection/01_dark_luxury.webp',
    description:
      'An oversized tee crafted in washed cotton with distressed graphics and industrial detailing. Pressure is a privilege.',
    graphics: {
      front: '/assets/graphics/01_front.png',
      back: '/assets/graphics/01_back.png',
      sleeveLeft: '/assets/graphics/01_sleeve_left.png',
      sleeveRight: '/assets/graphics/01_sleeve_right.png',
    },

    features: [
      'Gothic four-point star cross front chest placement',
      'Large back typography: "PRESSURE IS A PRIVILEGE."',
      'Monolithic mountain rock distressed screenprint',
      'Left sleeve wireframe radar reticle and FBFY branding',
      'Right sleeve vertical hairline coordinate artwork',
      'Signature "by FBFY" on bottom hem welt',
      '1x1 ribbed crew collar with inner neck stamp',
    ],
  },
  {
    id: 'industrial-02',
    gallery: garmentGalleries['industrial-02'],
    number: '02',
    name: '02. INDUSTRIAL',
    collection: 'INDUSTRIAL',
    subtitle: 'CHARCOAL GREY',
    price: '₹3,499',
    fit: 'Boxy Oversized',
    gsm: '260 GSM',
    isLongSleeve: true,
    colors: ['Charcoal', 'Washed Black', 'Off-White'],
    defaultColor: 'Charcoal',
    sizes,
    image: '/assets/fashion/collection/02_industrial.webp',
    description:
      'Charcoal-grey washed oversized long-sleeve T-shirt featuring a technical and distressed graphic language. Large back typography and graphic composition, compass rose motif, and distinctive BUILT UNDER PRESSURE sleeve print.',
    graphics: {
      front: '/assets/graphics/02_front.png',
      back: '/assets/graphics/02_back.png',
      sleeveLeft: '/assets/graphics/02_sleeve_left.png',
      sleeveRight: '/assets/graphics/02_sleeve_right.png',
    },

    features: [
      'Center chest technical compass rose and star crosshair',
      'Back headline: "PRESSURE IS A PRIVILEGE."',
      'Halftone rock monolith screenprint with distressed bleed',
      'Distinctive boxed "BUILT UNDER PRESSURE" sleeve print',
      'Signature boxed "FBFY" atelier mark',
    ],
  },
  {
    id: 'minimal-03',
    gallery: garmentGalleries['minimal-03'],
    number: '03',
    name: '03. MINIMAL',
    collection: 'MINIMAL',
    subtitle: 'CREAM / STONE',
    price: '₹3,499',
    fit: 'Relaxed Oversized',
    gsm: '240 GSM',
    isLongSleeve: false,
    colors: ['Off-White', 'Washed Black', 'Charcoal'],
    defaultColor: 'Off-White',
    sizes,
    image: '/assets/fashion/collection/03_minimal.webp',
    description:
      'Cream and stone-colored oversized tee with asymmetric graphic placement. Dark charcoal print on raw washed cotton with relaxed dropped shoulders.',
    graphics: {
      front: '/assets/graphics/03_front.png',
      back: '/assets/graphics/03_back.png',
      sleeveLeft: '/assets/graphics/03_sleeve_left.png',
      sleeveRight: '/assets/graphics/03_sleeve_right.png',
    },

    features: [
      'Asymmetric ink splatter bursting from shoulder',
      'Architectural back typography: "PRESSURE IS A PRIVILEGE."',
      'Diagonal fractured monolith texture cutting across back',
      'Left sleeve target reticle and vertical typography',
    ],
  },
  {
    id: 'underground-04',
    gallery: garmentGalleries['underground-04'],
    number: '04',
    name: '04. UNDERGROUND',
    collection: 'UNDERGROUND',
    subtitle: 'FADED BLACK',
    price: '₹3,499',
    fit: 'Heavy Oversized',
    gsm: '260 GSM',
    isLongSleeve: true,
    colors: ['Washed Black', 'Charcoal', 'Off-White'],
    defaultColor: 'Washed Black',
    sizes,
    image: '/assets/fashion/collection/04_underground.webp',
    description:
      'Faded black oversized long-sleeve T-shirt with bold fragmented typography. Massive expressive front chest lettering, oversized back graphic with mountain silhouette figure.',
    graphics: {
      front: '/assets/graphics/04_front.png',
      back: '/assets/graphics/04_back.png',
      sleeveLeft: '/assets/graphics/04_sleeve_left.png',
      sleeveRight: '/assets/graphics/04_sleeve_right.png',
    },

    features: [
      'Expressive chest typography mark with star rays',
      'Arched back tagline: "SAME PRESSURE // HIGHER VISION"',
      'Raw fragmented typography: "PRESSURE IS A PRIVILEGE."',
      'Heavy boxed "BUILT UNDER PRESSURE" sleeve print',
    ],
  },
  {
    id: 'fracture-05',
    gallery: garmentGalleries['fracture-05'],
    number: '05',
    name: '05. FRACTURE',
    collection: 'DARK LUXURY',
    subtitle: 'WASHED BLACK',
    price: '₹3,499',
    fit: 'Oversized Fit',
    gsm: '240 GSM',
    isLongSleeve: false,
    colors: ['Washed Black', 'Charcoal', 'Off-White'],
    defaultColor: 'Washed Black',
    sizes,
    image: '/assets/fashion/collection/05_fracture.webp',
    description:
      'Washed black heavy slub cotton featuring intersecting grid fracture screenprint, star emblem, and raw edge construction.',
    graphics: {
      front: '/assets/graphics/05_front.png',
      back: '/assets/graphics/05_back.png',
      sleeveLeft: '/assets/graphics/05_sleeve_left.png',
      sleeveRight: '/assets/graphics/05_sleeve_right.png',
    },

    features: [
      'Front chest fracture grid linework and coordinates',
      'Discharge ink vintage washed cotton texture',
      'Double-needle hem stitch with WTFBY branding',
    ],
  },
  {
    id: 'ritual-06',
    gallery: garmentGalleries['ritual-06'],
    number: '06',
    name: '06. RITUAL',
    collection: 'INDUSTRIAL',
    subtitle: 'STONE GREY',
    price: '₹3,499',
    fit: 'Relaxed Oversized',
    gsm: '260 GSM',
    isLongSleeve: false,
    colors: ['Charcoal', 'Off-White', 'Washed Black'],
    defaultColor: 'Charcoal',
    sizes,
    image: '/assets/fashion/collection/06_ritual.webp',
    description:
      'Stone grey oversized tee featuring centered ritual apparatus iconography, symmetrical ink bloom, and distressed garment dye.',
    graphics: {
      front: '/assets/graphics/06_front.png',
      back: '/assets/graphics/06_back.png',
      sleeveLeft: '/assets/graphics/06_sleeve_left.png',
      sleeveRight: '/assets/graphics/06_sleeve_right.png',
    },

    features: [
      'Centered geometric ritual apparatus screenprint',
      'Mineral enzyme washed heavy slub cotton',
      'Articulated sleeve cuffs and dropped shoulders',
    ],
  },
  {
    id: 'chaos-07',
    gallery: garmentGalleries['chaos-07'],
    number: '07',
    name: '07. CHAOS',
    collection: 'UNDERGROUND',
    subtitle: 'CHARCOAL',
    price: '₹3,499',
    fit: 'Heavy Oversized',
    gsm: '260 GSM',
    isLongSleeve: false,
    colors: ['Charcoal', 'Washed Black', 'Off-White'],
    defaultColor: 'Charcoal',
    sizes,
    image: '/assets/fashion/collection/07_chaos.webp',
    description:
      'Charcoal mineral-washed tee with chaotic radial ink bloom, distressed typography, and heavy street posture.',
    graphics: {
      front: '/assets/graphics/07_front.png',
      back: '/assets/graphics/07_back.png',
      sleeveLeft: '/assets/graphics/07_sleeve_left.png',
      sleeveRight: '/assets/graphics/07_sleeve_right.png',
    },

    features: [
      'High-contrast radial distressed ink splatter',
      'Heavy 260 GSM combed cotton architecture',
      'Reinforced twin-needle construction',
    ],
  },
  {
    id: 'ether-08',
    gallery: garmentGalleries['ether-08'],
    number: '08',
    name: '08. ETHER',
    collection: 'MINIMAL',
    subtitle: 'OFF-WHITE',
    price: '₹3,499',
    fit: 'Boxy Oversized',
    gsm: '240 GSM',
    isLongSleeve: true,
    colors: ['Off-White', 'Charcoal', 'Washed Black'],
    defaultColor: 'Off-White',
    sizes,
    image: '/assets/fashion/collection/08_ether.webp',
    description:
      'Off-white raw stone cotton long-sleeve featuring vertical ether coordinate lines, subtle star reticle, and minimalist experimental layout.',
    graphics: {
      front: '/assets/graphics/08_front.png',
      back: '/assets/graphics/08_back.png',
      sleeveLeft: '/assets/graphics/08_sleeve_left.png',
      sleeveRight: '/assets/graphics/08_sleeve_right.png',
    },

    features: [
      'Delicate vertical coordinate linework in carbon ink',
      'Natural unbleached long-staple cotton texture',
      'Clean ribbed collar and wide hanging sleeves',
    ],
  },
]

export const studioCards = [
  {
    id: 'neck-branding',
    title: 'NECK BRANDING',
    subtitle: 'Inside Print',
    image: '/assets/fashion/studio/neck_branding.webp',
    highRes: '/assets/fashion/studio/neck_branding.jpg',
    specs: ['1x1 Heavy Rib Knit', 'Screenprinted Heat Transfer', 'Twin-Needle Topstitch', 'Non-Stretch Neck Binding'],
    description:
      'Close-up view of the inner neck label featuring clean WTFBY XL sizing print, laundry care icons, and "PREMIUM COTTON / MADE FOR HIGHER MINDS". Showcases 1x1 heavy cotton-spandex neck ribbing with twin-needle collar topstitching.',
  },
  {
    id: 'sleeve-left',
    title: 'SLEEVE CLOSEUP (LEFT)',
    subtitle: 'Graphic Print',
    image: '/assets/fashion/studio/sleeve_left.webp',
    highRes: '/assets/fashion/studio/sleeve_left.jpg',
    specs: ['Discharge Ink Screenprint', 'Tactile Texture Integration', 'Reinforced Underarm Seam', 'Distressed Mineral Finish'],
    description:
      'Macro close-up of the left sleeve graphic showcasing tactile screenprint ink penetration into the washed cotton weave. Displays intersecting coordinate grid, wireframe radar target, and clean distressed WTFBY branding near the cuff.',
  },
  {
    id: 'sleeve-right',
    title: 'SLEEVE CLOSEUP (RIGHT)',
    subtitle: 'Built Under Pressure',
    image: '/assets/fashion/studio/sleeve_right.webp',
    highRes: '/assets/fashion/studio/sleeve_right.jpg',
    specs: ['High-Density Plastisol / Discharge', 'Vertical Bounding Box Architecture', 'Twin-Needle Cuff Fold', 'Heavy Slub Drape'],
    description:
      'Close-up of the right sleeve featuring the bold boxed "BUILT UNDER PRESSURE" screenprint artwork. Preserves authentic vertical typography orientation, heavy distress texture, and double-needle cuff seam stitching.',
  },
  {
    id: 'stitching',
    title: 'STITCHING',
    subtitle: 'Seam Detail',
    image: '/assets/fashion/studio/stitching.webp',
    highRes: '/assets/fashion/studio/stitching.png',
    specs: ['6mm Parallel Twin-Needle', '4-Thread Overlock Reinforcement', 'Mercerized Poly-Core Thread', 'Anti-Fray Bindings'],
    description:
      'Macro view of structural seam reinforcement displaying parallel double-needle lockstitching along garment drop shoulders and body seams, ensuring lifetime durability.',
  },
  {
    id: 'hem-signature',
    title: 'HEM SIGNATURE',
    subtitle: 'by FBFY',
    image: '/assets/fashion/studio/hem_signature.webp',
    highRes: '/assets/fashion/studio/hem_signature.jpg',
    specs: ['Twin-Needle 6mm Spacing', '2.5cm Blind Folded Hem', 'Clean Script Screenprint', 'Washed Slub Border'],
    description:
      'Macro view of the bottom hem welt featuring the authentic "by FBFY" signature and four-point star emblem. Demonstrates heavy 2.5cm folded hem with parallel double-needle lockstitching.',
  },
  {
    id: 'print-texture',
    title: 'PRINT TEXTURE',
    subtitle: 'Distressed Graphic',
    image: '/assets/fashion/studio/print_texture.webp',
    highRes: '/assets/fashion/studio/print_texture.png',
    specs: ['Water-Based Discharge Ink', 'Raw Cotton Fiber Penetration', 'Crackle Patina Finish', 'Zero Surface Build'],
    description:
      'Ultra close-up of the radial ink bloom displaying zero-hand feel discharge printing that dyes the cotton fibers directly rather than leaving rubbery plastic atop the garment.',
  },
  {
    id: 'fabric-texture',
    title: 'FABRIC TEXTURE',
    subtitle: 'Washed Cotton',
    image: '/assets/fashion/studio/fabric_texture.webp',
    highRes: '/assets/fashion/studio/fabric_texture.jpg',
    specs: ['220–260 GSM Heavyweight Cotton', 'Natural Slub Yarn Texture', 'Enzyme & Mineral Wash', 'Breathable Combed Weave'],
    description:
      'Ultra macro view of the 220–260 GSM heavy cotton fabric. Highlights the uneven slub yarn texture, micro-fiber surface fuzz, natural shadowing across garment folds, and rich reactive-dye enzyme wash fading.',
  },
  {
    id: 'shape',
    title: 'SHAPE',
    subtitle: 'Oversized Silhouette',
    image: '/assets/fashion/studio/shape_oversized.webp',
    highRes: '/assets/fashion/studio/shape_oversized.jpg',
    specs: ['Oversized Drop Shoulder Fit', 'Wide Hanging Long Sleeves', '220–260 GSM Heavy Drape', 'Unisex Engineered Pattern'],
    description:
      'Flat garment architecture showing dropped shoulders, relaxed boxy torso width, wide hanging sleeves, and deep bottom hem welt.',
  },
]

export const detailGalleryItems = studioCards

