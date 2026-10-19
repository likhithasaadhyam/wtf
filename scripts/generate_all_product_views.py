import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

os.makedirs('public/assets/products', exist_ok=True)

# Master specification image path
mentor_img_path = r'C:\Users\likhi\.gemini\antigravity-ide\brain\ee089bb0-0199-4972-ad01-179cac5441c6\.tempmediaStorage\media_1792384657553.jpg'
mentor_img = Image.open(mentor_img_path).convert('RGB')
mw, mh = mentor_img.size

# Fonts for branding
try:
    font_bold_sm = ImageFont.truetype('arialbd.ttf', 13)
    font_bold_md = ImageFont.truetype('arialbd.ttf', 16)
    font_bold_lg = ImageFont.truetype('arialbd.ttf', 22)
    font_mono = ImageFont.truetype('consola.ttf', 12)
except Exception:
    font_bold_sm = font_bold_md = font_bold_lg = font_mono = ImageFont.load_default()

# Helper to place a cropped figure centered onto a 600x700 dark canvas
def place_on_dark_canvas(cropped_fig, target_w=600, target_h=700, scale_factor=1.75):
    cw, ch = cropped_fig.size
    new_h = int(ch * scale_factor)
    new_w = int(cw * scale_factor)
    
    # Constrain to target_h * 0.92
    if new_h > int(target_h * 0.94):
        new_h = int(target_h * 0.94)
        new_w = int(cw * (new_h / ch))
        
    scaled_fig = cropped_fig.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 600x700 background matching dark luxury theme #0c0d10
    canvas = Image.new('RGB', (target_w, target_h), (12, 13, 16))
    d = ImageDraw.Draw(canvas)
    
    # Subtle studio spotlight
    for r in range(400, 0, -15):
        alpha = int(18 * (1 - r / 400))
        d.ellipse([300 - r, 350 - int(r*0.85), 300 + r, 350 + int(r*0.85)], fill=(12 + alpha, 13 + alpha, 16 + alpha))
        
    x = (target_w - new_w) // 2
    y = (target_h - new_h) // 2
    canvas.paste(scaled_fig, (x, y))
    return canvas

# -------------------------------------------------------------
# 1. PROCESS PRODUCTS 01, 02, 03, 04 FROM MASTER SPECIFICATION
# -------------------------------------------------------------
# Coordinates in media_1792384657553.jpg (1024 x 935)
quadrants = {
    'dark-luxury-01': {
        'back': (165, 45, 332, 365),
        'left': (332, 45, 414, 365),
        'right': (414, 45, 500, 365),
        'fbfy_box_back': (275, 305, 312, 330), # relative to crop
    },
    'industrial-02': {
        'back': (655, 45, 840, 365),
        'left': (840, 45, 922, 365),
        'right': (922, 45, 1005, 365),
        'fbfy_box_back': (765, 305, 805, 330),
    },
    'minimal-03': {
        'back': (165, 435, 330, 755),
        'left': (330, 435, 414, 755),
        'right': (414, 435, 500, 755),
        'fbfy_box_back': (275, 695, 312, 720),
    },
    'underground-04': {
        'back': (655, 435, 840, 755),
        'left': (840, 435, 922, 755),
        'right': (922, 435, 1005, 755),
        'fbfy_box_back': (765, 695, 805, 720),
    },
}

collection_files = {
    'dark-luxury-01': '01_dark_luxury.webp',
    'industrial-02': '02_industrial.webp',
    'minimal-03': '03_minimal.webp',
    'underground-04': '04_underground.webp',
    'fracture-05': '05_fracture.webp',
    'ritual-06': '06_ritual.webp',
    'chaos-07': '07_chaos.webp',
    'ether-08': '08_ether.webp',
}

print('Generating cleaned 4-angle views for products 01, 02, 03, 04...')
for prod_id, boxes in quadrants.items():
    prod_dir = f'public/assets/products/{prod_id}'
    os.makedirs(prod_dir, exist_ok=True)
    
    # 1. FRONT VIEW: framed from collection photo
    cf = collection_files[prod_id]
    c_img = Image.open(f'public/assets/fashion/collection/{cf}').convert('RGB')
    cw, ch = c_img.size
    crop_w = int(cw * 0.85)
    crop_h = int(crop_w * (700 / 600))
    x0 = (cw - crop_w) // 2
    y0 = int(ch * 0.05)
    front_img = c_img.crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((600, 700), Image.Resampling.LANCZOS)
    front_img.save(f'{prod_dir}/front.webp', 'WEBP', quality=92)
    front_img.save(f'{prod_dir}/front.jpg', 'JPEG', quality=92)
    
    # 2. BACK VIEW: crop from mentor image, remove labels and replace FBFY with WTFBY
    b_box = boxes['back']
    # Crop excluding bottom label (stop 20px before bottom)
    crop_b = mentor_img.crop((b_box[0], b_box[1], b_box[2], b_box[3] - 22))
    
    # Inpaint any FBFY box on the back
    d_b = ImageDraw.Draw(crop_b)
    # Search for FBFY region near bottom right of garment
    bw, bh = crop_b.size
    box_x0 = int(bw * 0.70)
    box_y0 = int(bh * 0.83)
    box_x1 = int(bw * 0.94)
    box_y1 = int(bh * 0.92)
    
    # Sample background color around box
    sample_col = crop_b.getpixel((box_x0 - 2, box_y0))
    d_b.rectangle([box_x0, box_y0, box_x1, box_y1], fill=sample_col)
    
    # Draw clean WTFBY branding in the box
    text_col = (235, 232, 226) if prod_id != 'minimal-03' else (25, 27, 30)
    d_b.rectangle([box_x0, box_y0, box_x1, box_y1], outline=text_col, width=1)
    d_b.text(((box_x0 + box_x1)//2, (box_y0 + box_y1)//2), 'WTFBY', fill=text_col, font=font_bold_sm, anchor='mm')
    
    back_canvas = place_on_dark_canvas(crop_b, target_w=600, target_h=700, scale_factor=1.95)
    back_canvas.save(f'{prod_dir}/back.webp', 'WEBP', quality=92)
    back_canvas.save(f'{prod_dir}/back.jpg', 'JPEG', quality=92)
    
    # 3. LEFT VIEW
    l_box = boxes['left']
    crop_l = mentor_img.crop((l_box[0], l_box[1], l_box[2], l_box[3] - 22))
    # Replace any FBFY text on sleeve with WTFBY
    lw, lh = crop_l.size
    d_l = ImageDraw.Draw(crop_l)
    s_col = crop_l.getpixel((int(lw * 0.5), int(lh * 0.70)))
    d_l.rectangle([int(lw * 0.1), int(lh * 0.68), int(lw * 0.9), int(lh * 0.76)], fill=s_col)
    d_l.text((int(lw * 0.5), int(lh * 0.72)), 'WTFBY', fill=text_col, font=font_bold_sm, anchor='mm')
    
    left_canvas = place_on_dark_canvas(crop_l, target_w=600, target_h=700, scale_factor=1.95)
    left_canvas.save(f'{prod_dir}/left.webp', 'WEBP', quality=92)
    left_canvas.save(f'{prod_dir}/left.jpg', 'JPEG', quality=92)
    
    # 4. RIGHT VIEW
    r_box = boxes['right']
    crop_r = mentor_img.crop((r_box[0], r_box[1], r_box[2], r_box[3] - 22))
    rw, rh = crop_r.size
    d_r = ImageDraw.Draw(crop_r)
    # Check bottom hem area for any Abhiram text and inpaint
    d_r.rectangle([int(rw * 0.05), int(rh * 0.88), int(rw * 0.95), int(rh * 0.98)], fill=sample_col)
    
    right_canvas = place_on_dark_canvas(crop_r, target_w=600, target_h=700, scale_factor=1.95)
    right_canvas.save(f'{prod_dir}/right.webp', 'WEBP', quality=92)
    right_canvas.save(f'{prod_dir}/right.jpg', 'JPEG', quality=92)
    
    print(f'  [OK] Product {prod_id} views generated.')

# -------------------------------------------------------------
# 2. PROCESS PRODUCTS 05, 06, 07, 08 WITH DEDICATED GRAPHICS
# -------------------------------------------------------------
products_expanded = {
    'fracture-05': {
        'num': '05',
        'coll': '05_fracture.webp',
        'base_col': (34, 36, 40),
        'template_back': 'dark-luxury-01',
    },
    'ritual-06': {
        'num': '06',
        'coll': '06_ritual.webp',
        'base_col': (120, 122, 125),
        'template_back': 'industrial-02',
    },
    'chaos-07': {
        'num': '07',
        'coll': '07_chaos.webp',
        'base_col': (72, 75, 80),
        'template_back': 'underground-04',
    },
    'ether-08': {
        'num': '08',
        'coll': '08_ether.webp',
        'base_col': (236, 230, 218),
        'template_back': 'minimal-03',
    },
}

print('Generating views for expanded products 05, 06, 07, 08...')
for prod_id, cfg in products_expanded.items():
    prod_dir = f'public/assets/products/{prod_id}'
    os.makedirs(prod_dir, exist_ok=True)
    num = cfg['num']
    
    # 1. FRONT VIEW: framed from collection photo
    c_img = Image.open(f'public/assets/fashion/collection/{cfg["coll"]}').convert('RGB')
    cw, ch = c_img.size
    crop_w = int(cw * 0.85)
    crop_h = int(crop_w * (700 / 600))
    x0 = (cw - crop_w) // 2
    y0 = int(ch * 0.05)
    front_img = c_img.crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((600, 700), Image.Resampling.LANCZOS)
    front_img.save(f'{prod_dir}/front.webp', 'WEBP', quality=92)
    front_img.save(f'{prod_dir}/front.jpg', 'JPEG', quality=92)
    
    # 2. BACK VIEW: use the template model pose, but overlay the product's OWN back graphic!
    # Load template back
    t_back = Image.open(f'public/assets/products/{cfg["template_back"]}/back.webp').convert('RGB')
    
    # Color adjust fabric if needed
    if prod_id in ['ritual-06', 'chaos-07', 'ether-08']:
        # Shift fabric tone to match garment color
        t_arr = np.array(t_back, dtype=np.float32)
        bg_m = (t_arr[:, :, 0] < 20) & (t_arr[:, :, 1] < 20) & (t_arr[:, :, 2] < 20)
        target_c = np.array(cfg['base_col'], dtype=np.float32)
        lum = (t_arr[:, :, 0] * 0.299 + t_arr[:, :, 1] * 0.587 + t_arr[:, :, 2] * 0.114) / 255.0
        shifted = np.stack([lum * target_c[0], lum * target_c[1], lum * target_c[2]], axis=2)
        blended = t_arr * 0.3 + shifted * 0.7
        blended[bg_m] = t_arr[bg_m]
        t_back = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
        
    # Inpaint center graphic of template and place the product's OWN graphic
    # Center area of garment back is approximately (180, 220, 420, 520)
    d_tb = ImageDraw.Draw(t_back)
    inpaint_col = cfg['base_col']
    d_tb.rectangle([180, 220, 420, 520], fill=inpaint_col)
    # Blur inpaint boundary
    
    # Paste the product's dedicated back graphic
    g_path = f'public/assets/graphics/{num}_back.png'
    if cfg['base_col'][0] > 180:
        g_path = f'public/assets/graphics/{num}_back_dark.png'
    if os.path.exists(g_path):
        g_img = Image.open(g_path).convert('RGBA').resize((240, 240), Image.Resampling.LANCZOS)
        t_back.paste(g_img, (180, 250), g_img)
        
    t_back.save(f'{prod_dir}/back.webp', 'WEBP', quality=92)
    t_back.save(f'{prod_dir}/back.jpg', 'JPEG', quality=92)
    
    # 3. LEFT VIEW: template with dedicated sleeve graphic
    t_left = Image.open(f'public/assets/products/{cfg["template_back"]}/left.webp').convert('RGB')
    if prod_id in ['ritual-06', 'chaos-07', 'ether-08']:
        t_arr = np.array(t_left, dtype=np.float32)
        bg_m = (t_arr[:, :, 0] < 20) & (t_arr[:, :, 1] < 20) & (t_arr[:, :, 2] < 20)
        target_c = np.array(cfg['base_col'], dtype=np.float32)
        lum = (t_arr[:, :, 0] * 0.299 + t_arr[:, :, 1] * 0.587 + t_arr[:, :, 2] * 0.114) / 255.0
        shifted = np.stack([lum * target_c[0], lum * target_c[1], lum * target_c[2]], axis=2)
        blended = t_arr * 0.3 + shifted * 0.7
        blended[bg_m] = t_arr[bg_m]
        t_left = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
        
    d_tl = ImageDraw.Draw(t_left)
    d_tl.rectangle([250, 280, 350, 480], fill=cfg['base_col'])
    sl_path = f'public/assets/graphics/{num}_sleeve_left.png'
    if os.path.exists(sl_path):
        sl_img = Image.open(sl_path).convert('RGBA').resize((90, 180), Image.Resampling.LANCZOS)
        t_left.paste(sl_img, (255, 300), sl_img)
    t_left.save(f'{prod_dir}/left.webp', 'WEBP', quality=92)
    t_left.save(f'{prod_dir}/left.jpg', 'JPEG', quality=92)
    
    # 4. RIGHT VIEW
    t_right = Image.open(f'public/assets/products/{cfg["template_back"]}/right.webp').convert('RGB')
    if prod_id in ['ritual-06', 'chaos-07', 'ether-08']:
        t_arr = np.array(t_right, dtype=np.float32)
        bg_m = (t_arr[:, :, 0] < 20) & (t_arr[:, :, 1] < 20) & (t_arr[:, :, 2] < 20)
        target_c = np.array(cfg['base_col'], dtype=np.float32)
        lum = (t_arr[:, :, 0] * 0.299 + t_arr[:, :, 1] * 0.587 + t_arr[:, :, 2] * 0.114) / 255.0
        shifted = np.stack([lum * target_c[0], lum * target_c[1], lum * target_c[2]], axis=2)
        blended = t_arr * 0.3 + shifted * 0.7
        blended[bg_m] = t_arr[bg_m]
        t_right = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
        
    sr_path = f'public/assets/graphics/{num}_sleeve_right.png'
    if os.path.exists(sr_path):
        sr_img = Image.open(sr_path).convert('RGBA').resize((90, 180), Image.Resampling.LANCZOS)
        t_right.paste(sr_img, (255, 300), sr_img)
    t_right.save(f'{prod_dir}/right.webp', 'WEBP', quality=92)
    t_right.save(f'{prod_dir}/right.jpg', 'JPEG', quality=92)
    
    print(f'  [OK] Product {prod_id} views generated.')

# -------------------------------------------------------------
# 3. COLORWAYS AND SYNC TO PUBLIC/ASSETS/FASHION/PRODUCTS
# -------------------------------------------------------------
color_map = {
    'washed-black': '#222428',
    'charcoal': '#505359',
    'off-white': '#ece6da',
}

def shift_color(img_rgb, target_hex):
    th = target_hex.lstrip('#')
    tr, tg, tb = tuple(int(th[i:i+2], 16) for i in (0, 2, 4))
    arr = np.array(img_rgb, dtype=np.float32)
    bg_m = (arr[:, :, 0] < 22) & (arr[:, :, 1] < 22) & (arr[:, :, 2] < 22)
    lum = (arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114) / 255.0
    target_lum = np.stack([lum * tr, lum * tg, lum * tb], axis=2)
    blended = arr * 0.35 + target_lum * 0.65
    blended[bg_m] = arr[bg_m]
    return Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))

print('Generating colorway variants and syncing to public/assets/fashion/products/...')
all_product_ids = list(quadrants.keys()) + list(products_expanded.keys())

for pid in all_product_ids:
    prod_dir = f'public/assets/products/{pid}'
    for angle in ['front', 'back', 'left', 'right']:
        src_webp = f'{prod_dir}/{angle}.webp'
        src_jpg = f'{prod_dir}/{angle}.jpg'
        
        # Copy to public/assets/fashion/products/{pid}-{angle}.webp as well
        # to ensure both URL conventions work seamlessly
        im = Image.open(src_webp).convert('RGB')
        im.save(f'public/assets/fashion/products/{pid}-{angle}.webp', 'WEBP', quality=92)
        im.save(f'public/assets/fashion/products/{pid}-{angle}.jpg', 'JPEG', quality=92)
        
        # Color variants
        for c_slug, c_hex in color_map.items():
            shifted = shift_color(im, c_hex)
            shifted.save(f'{prod_dir}/{c_slug}-{angle}.webp', 'WEBP', quality=88)
            shifted.save(f'{prod_dir}/{c_slug}-{angle}.jpg', 'JPEG', quality=88)
            shifted.save(f'public/assets/fashion/products/{pid}-{c_slug}-{angle}.webp', 'WEBP', quality=88)
            shifted.save(f'public/assets/fashion/products/{pid}-{c_slug}-{angle}.jpg', 'JPEG', quality=88)

print('ALL 8 PRODUCTS FULLY GENERATED IN PUBLIC/ASSETS/PRODUCTS/ AND SYNCED!')
