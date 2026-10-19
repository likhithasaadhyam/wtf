import os
from PIL import Image, ImageDraw, ImageFont

out_base = r'public/assets/fashion/products'

# 1. Deploy verified front views for 05, 06, 08
front_sources = {
    'fracture-05': 'public/assets/fashion/collection/05_fracture.jpg',
    'ritual-06': 'public/assets/fashion/collection/06_ritual.jpg',
    'ether-08': 'public/assets/fashion/collection/08_ether.jpg',
}

for pid, src in front_sources.items():
    pdir = os.path.join(out_base, pid)
    os.makedirs(pdir, exist_ok=True)
    im = Image.open(src).convert('RGB')
    im.save(os.path.join(pdir, 'front.webp'), 'WEBP', quality=92)
    im.save(os.path.join(pdir, 'front.jpg'), 'JPEG', quality=92)
    print(f'[OK] Deployed front for {pid}')

# 2. Generate Atelier Blueprint Specification cards for back, left, right of 05, 06, 08
schematics = {
    'fracture-05': {
        'num': '05',
        'title': '05. FRACTURE',
        'subtitle': 'WASHED BLACK // 240 GSM',
        'bg': (16, 17, 20),
        'accent': (220, 222, 226),
    },
    'ritual-06': {
        'num': '06',
        'title': '06. RITUAL',
        'subtitle': 'STONE GREY // 260 GSM',
        'bg': (18, 19, 22),
        'accent': (200, 204, 210),
    },
    'ether-08': {
        'num': '08',
        'title': '08. ETHER',
        'subtitle': 'OFF-WHITE RAW COTTON // 240 GSM',
        'bg': (22, 23, 26),
        'accent': (236, 230, 218),
    },
}

try:
    font_lg = ImageFont.truetype('arialbd.ttf', 24)
    font_md = ImageFont.truetype('arialbd.ttf', 16)
    font_sm = ImageFont.truetype('consola.ttf', 13)
except Exception:
    font_lg = font_md = font_sm = ImageFont.load_default()

for pid, cfg in schematics.items():
    pdir = os.path.join(out_base, pid)
    num = cfg['num']
    for angle in ['back', 'left', 'right']:
        # Canvas 896 x 1200
        canvas = Image.new('RGB', (896, 1200), cfg['bg'])
        d = ImageDraw.Draw(canvas)
        
        # Grid lines (blueprint style)
        for y in range(0, 1200, 40):
            d.line([(0, y), (896, y)], fill=(28, 30, 35), width=1)
        for x in range(0, 896, 40):
            d.line([(x, 0), (x, 1200)], fill=(28, 30, 35), width=1)
            
        # Outer border
        d.rectangle([40, 40, 856, 1160], outline=(45, 48, 56), width=1)
        d.rectangle([48, 48, 848, 1152], outline=(35, 38, 44), width=1)
        
        # Header block
        d.text((80, 80), 'WTFBY // ATELIER ARCHIVE SCHEMATIC', fill=(140, 144, 154), font=font_sm)
        d.text((80, 110), f"{cfg['title']}  {angle.upper()} VIEW SPECIFICATION", fill=cfg['accent'], font=font_lg)
        d.text((80, 145), cfg['subtitle'], fill=(160, 164, 175), font=font_sm)
        
        # Decal placement in center
        decal_file = f"public/assets/graphics/{num}_{angle if angle == 'back' else f'sleeve_{angle}'}.png"
        if os.path.exists(decal_file):
            g_img = Image.open(decal_file).convert('RGBA')
            gw, gh = (420, 420) if angle == 'back' else (280, 560)
            g_img = g_img.resize((gw, gh), Image.Resampling.LANCZOS)
            gx = (896 - gw) // 2
            gy = 280
            # Decal backdrop box
            d.rectangle([gx - 20, gy - 20, gx + gw + 20, gy + gh + 20], fill=(22, 24, 29), outline=(50, 54, 64), width=1)
            canvas.paste(g_img, (gx, gy), g_img)
            
        # Technical specifications block at bottom
        d.line([(80, 920), (816, 920)], fill=(50, 54, 64), width=1)
        d.text((80, 940), 'STATUS: PHOTOSHOOT IN QUEUE // ATELIER SPECIFICATION VERIFIED', fill=(180, 184, 192), font=font_sm)
        d.text((80, 970), f'PLACEMENT: {angle.upper()} TORSO // WATER-BASED DISCHARGE INK', fill=(120, 124, 134), font=font_sm)
        d.text((80, 1000), 'AUTHENTIC BRANDING: WTFBY / FBFY ARCHIVE 2024', fill=(120, 124, 134), font=font_sm)
        d.text((80, 1030), 'ATELIER NOTICE: VERIFIED FRONT PHOTOGRAPHY ACTIVE IN MAIN VIEWER', fill=(150, 154, 165), font=font_sm)
        
        w_path = os.path.join(pdir, f'{angle}.webp')
        j_path = os.path.join(pdir, f'{angle}.jpg')
        canvas.save(w_path, 'WEBP', quality=90)
        canvas.save(j_path, 'JPEG', quality=90)
        print(f'[OK] Generated atelier schematic {pid} {angle} -> {w_path}')
