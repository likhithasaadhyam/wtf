import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

os.makedirs('public/assets/graphics', exist_ok=True)

# Helper to draw star cross
def draw_star_cross(draw, cx, cy, r_horiz, r_vert, color=(235, 232, 226, 255), width=2):
    # vertical diamond / ray
    draw.polygon([(cx, cy - r_vert), (cx + 4, cy), (cx, cy + r_vert), (cx - 4, cy)], fill=color)
    # horizontal diamond / ray
    draw.polygon([(cx - r_horiz, cy), (cx, cy + 4), (cx + r_horiz, cy), (cx - 4, cy)], fill=color)
    # thin cross lines extending further
    draw.line([(cx, cy - r_vert * 1.6), (cx, cy + r_vert * 1.6)], fill=color, width=width)
    draw.line([(cx - r_horiz * 1.4, cy), (cx + r_horiz * 1.4, cy)], fill=color, width=width)

# Helper for barcode
def draw_barcode(draw, x, y, w, h, color=(235, 232, 226, 255), seed=42):
    rng = random.Random(seed)
    cur_x = x
    while cur_x < x + w:
        bar_w = rng.choice([1, 2, 3, 5])
        gap = rng.choice([2, 3, 4])
        draw.rectangle([cur_x, y, cur_x + bar_w, y + h], fill=color)
        cur_x += bar_w + gap

# Helper for wireframe globe / target
def draw_globe_target(draw, cx, cy, radius, color=(235, 232, 226, 255)):
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=color, width=2)
    draw.ellipse([cx - radius * 0.5, cy - radius, cx + radius * 0.5, cy + radius], outline=color, width=1)
    draw.line([(cx - radius * 1.2, cy), (cx + radius * 1.2, cy)], fill=color, width=2)
    draw.line([(cx, cy - radius * 1.2), (cx, cy + radius * 1.2)], fill=color, width=2)
    draw.ellipse([cx - radius * 0.15, cy - radius * 0.15, cx + radius * 0.15, cy + radius * 0.15], fill=color)

# Fonts
try:
    font_bold_sm = ImageFont.truetype('arialbd.ttf', 20)
    font_bold_md = ImageFont.truetype('arialbd.ttf', 32)
    font_bold_lg = ImageFont.truetype('arialbd.ttf', 44)
    font_bold_xl = ImageFont.truetype('arialbd.ttf', 64)
    font_bold_huge = ImageFont.truetype('arialbd.ttf', 76)
    font_reg_md = ImageFont.truetype('arial.ttf', 24)
    font_reg_sm = ImageFont.truetype('arial.ttf', 16)
    font_mono = ImageFont.truetype('consola.ttf', 15)
    font_mono_lg = ImageFont.truetype('consola.ttf', 22)
except Exception:
    font_bold_sm = font_bold_md = font_bold_lg = font_bold_xl = font_bold_huge = font_reg_md = font_reg_sm = font_mono = font_mono_lg = ImageFont.load_default()

# Colors for light-ink (on dark garments) and dark-ink (on cream/off-white garments)
LIGHT_INK = (240, 238, 232, 255)
LIGHT_INK_SUB = (195, 192, 186, 220)
LIGHT_INK_FAINT = (165, 162, 156, 180)

DARK_INK = (24, 26, 28, 255)
DARK_INK_SUB = (50, 53, 58, 220)
DARK_INK_FAINT = (80, 84, 90, 180)

# Helper to save both light and dark versions
def save_dual(base_filename, make_func):
    # Light ink for dark garments (default)
    img_light = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    d_light = ImageDraw.Draw(img_light)
    make_func(img_light, d_light, LIGHT_INK, LIGHT_INK_SUB, LIGHT_INK_FAINT)
    img_light.save(f'public/assets/graphics/{base_filename}.png')

    # Dark ink for off-white garments
    img_dark = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    d_dark = ImageDraw.Draw(img_dark)
    make_func(img_dark, d_dark, DARK_INK, DARK_INK_SUB, DARK_INK_FAINT)
    img_dark.save(f'public/assets/graphics/{base_filename}_dark.png')

# -------------------------------------------------------------
# 01. DARK LUXURY (Star Cross, WTFBY wordmark, Monolith Back)
# -------------------------------------------------------------
def make_01_front(img, d, ink, sub, faint):
    draw_star_cross(d, 330, 360, 70, 160, color=ink, width=2)
    d.text((640, 290), 'WTFBY', fill=ink, font=font_bold_xl)
    d.text((260, 680), 'PRESSURE IS\nA PRIVILEGE.', fill=sub, font=font_reg_md)
    d.text((260, 760), 'WTFBY // APPARATUS // 01\nOVERSIZED SLUB 240 GSM\nPARIS / MILAN / TOKYO', fill=faint, font=font_mono)
    d.text((680, 840), 'by WTFBY', fill=sub, font=font_reg_md)
    d.text((680, 875), 'STUDIO', fill=sub, font=font_bold_lg)
    draw_star_cross(d, 850, 860, 18, 32, color=sub, width=1)

save_dual('01_front', make_01_front)

def make_01_back(img, d, ink, sub, faint):
    d.text((512, 160), 'PRESSURE', fill=ink, font=font_bold_huge, anchor='mt')
    d.text((512, 245), 'IS A', fill=ink, font=font_bold_huge, anchor='mt')
    d.text((512, 330), 'PRIVILEGE.', fill=ink, font=font_bold_huge, anchor='mt')
    try:
        mnt = Image.open('public/assets/graphics/mountain1_extracted.png').resize((560, 290), Image.Resampling.LANCZOS)
        if ink == DARK_INK:
            arr = np.array(mnt.convert('RGBA'))
            arr[:, :, :3] = 25
            mnt = Image.fromarray(arr)
        img.alpha_composite(mnt, (232, 450))
    except Exception:
        pass
    draw_star_cross(d, 680, 540, 45, 95, color=ink, width=2)
    draw_barcode(d, 220, 680, 140, 70, color=ink, seed=1)
    d.text((220, 765), '* 9 0 4 2 2 0 1 8 5 *', fill=sub, font=font_mono)
    d.text((220, 810), 'WTFBY & APPARATUS //\nNOT A CLOTHING BRAND\nA HIGHER SANCTUARY', fill=sub, font=font_mono)
    d.rectangle([710, 760, 840, 830], outline=ink, width=2)
    d.text((775, 795), 'FBFY', fill=ink, font=font_bold_md, anchor='mm')

save_dual('01_back', make_01_back)

# Sleeves 01
img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
draw_globe_target(d, 256, 320, 90, color=LIGHT_INK)
draw_star_cross(d, 256, 490, 35, 80, color=LIGHT_INK, width=2)
d.line([(256, 120), (256, 200)], fill=LIGHT_INK, width=2)
d.text((256, 740), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
d.text((256, 820), 'COORD: 48.8566 N / 2.3522 E', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/01_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(256, 100), (256, 880)], fill=LIGHT_INK, width=2)
draw_star_cross(d, 256, 360, 45, 110, color=LIGHT_INK, width=2)
d.text((256, 680), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
d.text((280, 520), 'SYS // 240 GSM', fill=LIGHT_INK_SUB, font=font_mono)
img.save('public/assets/graphics/01_sleeve_right.png')

print('01 Dark Luxury graphics created.')

# -------------------------------------------------------------
# 02. INDUSTRIAL (Compass Rose, Built Under Pressure, Charcoal)
# -------------------------------------------------------------
def make_02_front(img, d, ink, sub, faint):
    draw_star_cross(d, 512, 380, 55, 110, color=ink, width=2)
    d.ellipse([512 - 40, 380 - 40, 512 + 40, 380 + 40], outline=ink, width=1)
    d.text((680, 270), 'WTFBY', fill=ink, font=font_bold_xl)
    d.text((260, 690), 'SPECIFICATION // 02\nINDUSTRIAL STREETWEAR DIVISION\nHEAVY MINERAL WASH / CHARCOAL\nWTFBY / 2026 ARCHIVE', fill=sub, font=font_mono)
    d.text((680, 840), 'by WTFBY', fill=sub, font=font_reg_md)
    d.text((680, 875), 'APPARATUS', fill=sub, font=font_bold_lg)

save_dual('02_front', make_02_front)

def make_02_back(img, d, ink, sub, faint):
    draw_star_cross(d, 280, 160, 35, 75, color=ink, width=2)
    d.ellipse([280 - 25, 160 - 25, 280 + 25, 160 + 25], outline=ink, width=1)
    d.text((540, 200), 'PRESSURE', fill=ink, font=font_bold_huge, anchor='mm')
    d.text((540, 280), 'IS A', fill=ink, font=font_bold_huge, anchor='mm')
    d.text((540, 360), 'PRIVILEGE.', fill=ink, font=font_bold_huge, anchor='mm')
    try:
        mnt = Image.open('public/assets/graphics/mountain1_extracted.png').resize((520, 260), Image.Resampling.LANCZOS)
        if ink == DARK_INK:
            arr = np.array(mnt.convert('RGBA'))
            arr[:, :, :3] = 25
            mnt = Image.fromarray(arr)
        img.alpha_composite(mnt, (252, 450))
    except Exception:
        pass
    draw_barcode(d, 700, 680, 120, 60, color=ink, seed=2)
    d.rectangle([680, 760, 800, 825], outline=ink, width=2)
    d.text((740, 792), 'FBFY', fill=ink, font=font_bold_md, anchor='mm')
    d.text((250, 760), 'BUILT UNDER PRESSURE // SERIES II\nCHARCOAL TECHNICAL FINISH\nREACTIVE DYE WASHED 260 GSM', fill=sub, font=font_mono)

save_dual('02_back', make_02_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
draw_globe_target(d, 256, 320, 80, color=LIGHT_INK)
d.text((256, 680), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
d.text((256, 760), 'IND. SYSTEM // 02', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/02_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
txt_img = Image.new('RGBA', (840, 100), (0, 0, 0, 0))
td = ImageDraw.Draw(txt_img)
td.rectangle([10, 10, 820, 90], outline=LIGHT_INK, width=3)
td.text((415, 50), 'BUILT UNDER PRESSURE', fill=LIGHT_INK, font=font_bold_lg, anchor='mm')
rot_txt = txt_img.rotate(90, expand=True)
img.alpha_composite(rot_txt, (206, 100))
img.save('public/assets/graphics/02_sleeve_right.png')

print('02 Industrial Streetwear graphics created.')

# -------------------------------------------------------------
# 03. MINIMAL (Asymmetric Ink Slash, Off-White / Cream)
# -------------------------------------------------------------
def make_03_front(img, d, ink, sub, faint):
    # Asymmetric ink slash / splatter on left shoulder
    for i in range(28):
        rng = random.Random(i + 105)
        sx = rng.randint(220, 420)
        sy = rng.randint(200, 520)
        sr = rng.randint(5, 30)
        d.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=ink)
    d.text((680, 280), 'WTFBY', fill=ink, font=font_bold_xl)
    d.text((580, 680), 'PRESSURE IS\nA PRIVILEGE.', fill=ink, font=font_bold_lg)
    d.text((580, 770), 'EXP. 03 // STONE WASHED\nRAW COTTON SLUB // 240 GSM\nWTFBY EXPERIMENTAL LAB', fill=sub, font=font_mono)
    draw_star_cross(d, 820, 710, 20, 45, color=ink, width=2)
    d.text((260, 840), 'by WTFBY / STUDIO', fill=sub, font=font_reg_md)

save_dual('03_front', make_03_front)

def make_03_back(img, d, ink, sub, faint):
    d.text((250, 180), 'PRESSURE IS A PRIVILEGE.', fill=ink, font=font_bold_lg)
    d.line([(250, 230), (540, 230)], fill=ink, width=2)
    try:
        mnt = Image.open('public/assets/graphics/mountain1_extracted.png').resize((460, 360), Image.Resampling.LANCZOS).convert('RGBA')
        marr = np.array(mnt)
        if ink == DARK_INK:
            marr[:, :, :3] = 25
        img.alpha_composite(Image.fromarray(marr), (460, 320))
    except Exception:
        pass
    draw_star_cross(d, 320, 450, 25, 60, color=ink, width=2)
    d.rectangle([250, 740, 380, 805], outline=ink, width=2)
    d.text((315, 772), 'FBFY', fill=ink, font=font_bold_md, anchor='mm')
    d.text((250, 825), 'SERIES: MINIMAL EXPERIMENTAL\nFINISH: UNBLEACHED STONE WASH', fill=sub, font=font_mono)

save_dual('03_back', make_03_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 260), 'W T F B Y', fill=DARK_INK, font=font_bold_xl, anchor='mm')
draw_globe_target(d, 256, 450, 75, color=DARK_INK)
d.line([(256, 560), (256, 820)], fill=DARK_INK, width=2)
img.save('public/assets/graphics/03_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
draw_globe_target(d, 256, 260, 50, color=DARK_INK)
txt_img = Image.new('RGBA', (650, 80), (0, 0, 0, 0))
td = ImageDraw.Draw(txt_img)
td.text((325, 40), 'PRESSURE IS A PRIVILEGE', fill=DARK_INK, font=font_bold_lg, anchor='mm')
rot_txt = txt_img.rotate(90, expand=True)
img.alpha_composite(rot_txt, (216, 320))
img.save('public/assets/graphics/03_sleeve_right.png')

print('03 Minimal Experimental graphics created.')

# -------------------------------------------------------------
# 04. UNDERGROUND (Chaos System Urban Rebel, Bold Distressed)
# -------------------------------------------------------------
def make_04_front(img, d, ink, sub, faint):
    d.text((512, 280), 'CHAOS SYSTEM', fill=ink, font=font_bold_huge, anchor='mm')
    d.text((512, 380), 'URBAN REBEL', fill=ink, font=font_bold_huge, anchor='mm')
    d.text((512, 450), '— WTFBY ARCHIVE —', fill=sub, font=font_mono_lg, anchor='mm')
    draw_star_cross(d, 250, 330, 40, 80, color=ink, width=2)
    draw_star_cross(d, 774, 330, 40, 80, color=ink, width=2)
    d.text((640, 680), 'PRESSURE IS.\nIS. PRIVILEGE.', fill=sub, font=font_bold_lg)
    d.text((260, 840), 'by WTFBY / UNDERGROUND 04', fill=faint, font=font_mono)

save_dual('04_front', make_04_front)

def make_04_back(img, d, ink, sub, faint):
    d.text((512, 120), 'SAME PRESSURE // HIGHER VISION', fill=sub, font=font_bold_lg, anchor='mt')
    d.text((512, 200), 'PRESSURE', fill=ink, font=font_bold_huge, anchor='mt')
    d.text((512, 290), 'IS A', fill=ink, font=font_bold_huge, anchor='mt')
    d.text((512, 380), 'PRIVILEGE.', fill=ink, font=font_bold_huge, anchor='mt')
    try:
        mnt = Image.open('public/assets/graphics/mountain1_extracted.png').resize((580, 320), Image.Resampling.LANCZOS)
        if ink == DARK_INK:
            arr = np.array(mnt.convert('RGBA'))
            arr[:, :, :3] = 25
            mnt = Image.fromarray(arr)
        img.alpha_composite(mnt, (222, 480))
        d.rectangle([505, 540, 519, 595], fill=ink)
        d.ellipse([506, 524, 518, 540], fill=ink)
    except Exception:
        pass
    for idx, line in enumerate(['UNDERGROUND STREETWEAR // SERIES 04', 'WTFBY FADED BLACK HEAVY COTTON 260 GSM']):
        d.text((512, 840 + idx * 24), line, fill=sub, font=font_mono, anchor='mt')

save_dual('04_back', make_04_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 320), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
draw_globe_target(d, 256, 520, 85, color=LIGHT_INK)
d.text((256, 750), 'UNDERGROUND // 04', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/04_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
txt_img = Image.new('RGBA', (840, 110), (0, 0, 0, 0))
td = ImageDraw.Draw(txt_img)
td.rectangle([10, 10, 820, 100], outline=LIGHT_INK, width=4)
td.text((415, 55), 'BUILT UNDER PRESSURE', fill=LIGHT_INK, font=font_bold_lg, anchor='mm')
rot_txt = txt_img.rotate(90, expand=True)
img.alpha_composite(rot_txt, (201, 100))
img.save('public/assets/graphics/04_sleeve_right.png')

print('04 Underground Streetwear graphics created.')

# -------------------------------------------------------------
# 05. FRACTURE (Geometric Grid Fracture, Star Center, WTFBY)
# -------------------------------------------------------------
def make_05_front(img, d, ink, sub, faint):
    # Centered fracture grid linework
    cx, cy = 512, 400
    for step in range(20, 180, 20):
        d.rectangle([cx - step, cy - step, cx + step, cy + step], outline=ink, width=1)
    # Diagonal cross hatching
    d.line([(cx - 160, cy - 160), (cx + 160, cy + 160)], fill=ink, width=2)
    d.line([(cx - 160, cy + 160), (cx + 160, cy - 160)], fill=ink, width=2)
    # Center star
    draw_star_cross(d, cx, cy, 35, 75, color=ink, width=2)
    d.text((cx, 630), 'F R A C T U R E', fill=ink, font=font_bold_xl, anchor='mm')
    d.text((cx, 700), 'WTFBY // DARK LUXURY 05', fill=sub, font=font_mono_lg, anchor='mm')
    d.text((cx, 740), 'COORDINATE GRID DISPLACEMENT // 240 GSM', fill=faint, font=font_mono, anchor='mm')
    d.text((680, 850), 'by WTFBY', fill=sub, font=font_reg_md)

save_dual('05_front', make_05_front)

def make_05_back(img, d, ink, sub, faint):
    d.text((512, 180), 'WTFBY ARCHIVE', fill=ink, font=font_bold_lg, anchor='mt')
    d.text((512, 240), 'FRACTURE MATRIX', fill=ink, font=font_bold_xl, anchor='mt')
    d.line([(320, 310), (704, 310)], fill=ink, width=2)
    cx, cy = 512, 500
    for r in [60, 110, 160]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ink, width=1)
    draw_star_cross(d, cx, cy, 60, 140, color=ink, width=2)
    draw_barcode(d, 360, 740, 304, 50, color=ink, seed=5)
    d.text((512, 820), 'PRESSURE IS A PRIVILEGE // 05. FRACTURE', fill=sub, font=font_mono, anchor='mt')

save_dual('05_back', make_05_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 320), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
d.text((256, 420), 'FRACTURE // 05', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
d.line([(256, 480), (256, 800)], fill=LIGHT_INK, width=2)
img.save('public/assets/graphics/05_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(256, 200), (256, 800)], fill=LIGHT_INK, width=2)
draw_star_cross(d, 256, 450, 40, 90, color=LIGHT_INK, width=2)
img.save('public/assets/graphics/05_sleeve_right.png')

print('05 Fracture graphics created.')

# -------------------------------------------------------------
# 06. RITUAL (Geometric Ritual Apparatus Mandala, Stone Grey)
# -------------------------------------------------------------
def make_06_front(img, d, ink, sub, faint):
    cx, cy = 512, 420
    # Outer rectangular boundary
    d.rectangle([cx - 160, cy - 220, cx + 160, cy + 220], outline=ink, width=2)
    d.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], outline=ink, width=2)
    # Sacred geometric rhombus
    d.polygon([(cx, cy - 200), (cx + 140, cy), (cx, cy + 200), (cx - 140, cy)], outline=ink, width=2)
    # Ritual rune star
    draw_star_cross(d, cx, cy, 50, 110, color=ink, width=2)
    d.text((cx, 160), 'WTFBY // APPARATUS', fill=ink, font=font_bold_md, anchor='mm')
    d.text((cx, 710), 'R I T U A L', fill=ink, font=font_bold_xl, anchor='mm')
    d.text((cx, 780), 'MINERAL ENZYME SLUB // 260 GSM', fill=sub, font=font_mono, anchor='mm')

save_dual('06_front', make_06_front)

def make_06_back(img, d, ink, sub, faint):
    d.text((512, 180), 'RITUAL SHADOW', fill=ink, font=font_bold_xl, anchor='mt')
    d.text((512, 250), 'WTFBY INDUSTRIAL DIVISION', fill=sub, font=font_mono_lg, anchor='mt')
    cx, cy = 512, 480
    for r in range(40, 180, 35):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ink, width=1)
    draw_star_cross(d, cx, cy, 70, 150, color=ink, width=2)
    draw_barcode(d, 340, 740, 344, 50, color=ink, seed=6)
    d.text((512, 820), 'PRESSURE IS A PRIVILEGE // 06. RITUAL', fill=sub, font=font_mono, anchor='mt')

save_dual('06_back', make_06_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 320), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
draw_globe_target(d, 256, 500, 70, color=LIGHT_INK)
d.text((256, 680), 'RITUAL // 06', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/06_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
txt_img = Image.new('RGBA', (840, 100), (0, 0, 0, 0))
td = ImageDraw.Draw(txt_img)
td.rectangle([10, 10, 820, 90], outline=LIGHT_INK, width=3)
td.text((415, 50), 'RITUAL APPARATUS', fill=LIGHT_INK, font=font_bold_lg, anchor='mm')
rot_txt = txt_img.rotate(90, expand=True)
img.alpha_composite(rot_txt, (206, 100))
img.save('public/assets/graphics/06_sleeve_right.png')

print('06 Ritual graphics created.')

# -------------------------------------------------------------
# 07. CHAOS (Radial Ink Bloom, Order & Chaos Typography)
# -------------------------------------------------------------
def make_07_front(img, d, ink, sub, faint):
    cx, cy = 512, 420
    # Explosive radial splatter spikes
    for i in range(48):
        rng = random.Random(i + 200)
        angle = (i / 48) * 2 * np.pi
        length = rng.randint(90, 240)
        thick = rng.randint(2, 6)
        ex = cx + int(np.cos(angle) * length)
        ey = cy + int(np.sin(angle) * length)
        d.line([(cx, cy), (ex, ey)], fill=ink, width=thick)
        sr = rng.randint(4, 18)
        d.ellipse([ex - sr, ey - sr, ex + sr, ey + sr], fill=ink)
    # Center core
    d.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], fill=(12, 13, 15, 255) if ink == LIGHT_INK else (240, 238, 232, 255))
    draw_star_cross(d, cx, cy, 30, 60, color=ink, width=2)
    d.text((cx, 710), 'ORDER & CHAOS', fill=ink, font=font_bold_xl, anchor='mm')
    d.text((cx, 780), 'WTFBY // HEAVY COMBED COTTON 260 GSM', fill=sub, font=font_mono, anchor='mm')

save_dual('07_front', make_07_front)

def make_07_back(img, d, ink, sub, faint):
    d.text((512, 160), 'ORDER & CHAOS', fill=ink, font=font_bold_xl, anchor='mt')
    d.text((512, 240), 'PRESSURE IS A PRIVILEGE', fill=sub, font=font_bold_lg, anchor='mt')
    d.line([(280, 310), (744, 310)], fill=ink, width=2)
    cx, cy = 512, 500
    for i in range(24):
        rng = random.Random(i + 300)
        sx = rng.randint(cx - 200, cx + 200)
        sy = rng.randint(cy - 120, cy + 120)
        sr = rng.randint(6, 26)
        d.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=ink)
    draw_star_cross(d, cx, cy, 50, 110, color=ink, width=2)
    draw_barcode(d, 360, 730, 304, 50, color=ink, seed=7)
    d.text((512, 810), 'WTFBY // ARCHIVE SERIES 07 // 260 GSM', fill=sub, font=font_mono, anchor='mt')

save_dual('07_back', make_07_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 320), 'W T F B Y', fill=LIGHT_INK, font=font_bold_xl, anchor='mm')
d.text((256, 420), 'CHAOS // 07', fill=LIGHT_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/07_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(256, 160), (256, 840)], fill=LIGHT_INK, width=2)
draw_star_cross(d, 256, 480, 40, 90, color=LIGHT_INK, width=2)
img.save('public/assets/graphics/07_sleeve_right.png')

print('07 Chaos graphics created.')

# -------------------------------------------------------------
# 08. ETHER (Vertical Coordinate Grid Lines, Star Reticle, Off-White)
# -------------------------------------------------------------
def make_08_front(img, d, ink, sub, faint):
    cx, cy = 512, 420
    # Clean vertical hairline coordinate grid
    for x_offset in [-160, -120, -80, -40, 0, 40, 80, 120, 160]:
        d.line([(cx + x_offset, cy - 200), (cx + x_offset, cy + 200)], fill=ink, width=1)
        # Coordinate ticks
        for y_tick in range(cy - 180, cy + 180, 40):
            d.line([(cx + x_offset - 4, y_tick), (cx + x_offset + 4, y_tick)], fill=ink, width=1)
    # Center star reticle
    draw_star_cross(d, cx, cy, 35, 75, color=ink, width=2)
    d.ellipse([cx - 25, cy - 25, cx + 25, cy + 25], outline=ink, width=1)
    d.text((cx, 160), 'WTFBY // ETHER', fill=ink, font=font_bold_md, anchor='mm')
    d.text((cx, 710), 'M O N O L I T H', fill=ink, font=font_bold_xl, anchor='mm')
    d.text((cx, 780), 'RAW SLUB LONG-STAPLE COTTON // 240 GSM', fill=sub, font=font_mono, anchor='mm')

save_dual('08_front', make_08_front)

def make_08_back(img, d, ink, sub, faint):
    d.text((512, 180), 'WTFBY // 08 ETHER', fill=ink, font=font_bold_xl, anchor='mt')
    d.text((512, 250), 'RAW MONOLITH ARCHITECTURE', fill=sub, font=font_mono_lg, anchor='mt')
    d.line([(300, 310), (724, 310)], fill=ink, width=2)
    cx, cy = 512, 490
    for x in range(cx - 140, cx + 150, 35):
        d.line([(x, cy - 140), (x, cy + 140)], fill=ink, width=1)
    draw_star_cross(d, cx, cy, 60, 130, color=ink, width=2)
    draw_barcode(d, 350, 740, 324, 50, color=ink, seed=8)
    d.text((512, 820), 'PRESSURE IS A PRIVILEGE // SERIES 08', fill=sub, font=font_mono, anchor='mt')

save_dual('08_back', make_08_back)

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 320), 'W T F B Y', fill=DARK_INK, font=font_bold_xl, anchor='mm')
draw_globe_target(d, 256, 480, 60, color=DARK_INK)
d.text((256, 680), 'ETHER // 08', fill=DARK_INK_SUB, font=font_mono, anchor='mm')
img.save('public/assets/graphics/08_sleeve_left.png')

img = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(256, 180), (256, 840)], fill=DARK_INK, width=2)
draw_star_cross(d, 256, 460, 35, 80, color=DARK_INK, width=2)
img.save('public/assets/graphics/08_sleeve_right.png')

print('08 Ether graphics created.')

# -------------------------------------------------------------
# INNER NECK & HEM SIGNATURE LABELS
# -------------------------------------------------------------
img = Image.new('RGBA', (512, 256), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((256, 40), 'W T F B Y', fill=(210, 208, 202, 240), font=font_bold_lg, anchor='mm')
d.text((256, 90), 'X L', fill=(210, 208, 202, 240), font=font_bold_xl, anchor='mm')
d.line([(180, 130), (332, 130)], fill=(210, 208, 202, 200), width=1)
d.text((256, 160), 'PREMIUM COTTON // 240 GSM', fill=(180, 178, 172, 200), font=font_mono, anchor='mm')
d.text((256, 195), 'MADE FOR HIGHER MINDS', fill=(180, 178, 172, 200), font=font_mono, anchor='mm')
img.save('public/assets/graphics/inner_neck_label.png')

img = Image.new('RGBA', (512, 160), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.text((180, 60), 'by WTFBY', fill=(210, 208, 202, 240), font=font_reg_md)
d.text((180, 100), 'STUDIO', fill=(210, 208, 202, 240), font=font_bold_lg)
draw_star_cross(d, 360, 80, 20, 40, color=(210, 208, 202, 240), width=1)
img.save('public/assets/graphics/hem_signature.png')

print('ALL 8 PRODUCTS GRAPHICS GENERATED WITH WTFBY BRANDING!')
