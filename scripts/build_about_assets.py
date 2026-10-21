import os
from PIL import Image, ImageFilter, ImageEnhance

os.makedirs('public/assets/fashion/about', exist_ok=True)

# 1. Main Fashion Portrait (about-fashion-portrait.png)
src1 = r'public/assets/fashion/about/model_seated.jpg'
im1 = Image.open(src1).convert('RGB')
# Enhance clarity and micro-contrast subtly
enhancer = ImageEnhance.Sharpness(im1)
im1_sharp = enhancer.enhance(1.15)
contrast_enhancer = ImageEnhance.Contrast(im1_sharp)
im1_final = contrast_enhancer.enhance(1.03)

im1_final.save('public/assets/fashion/about/about-fashion-portrait.png', 'PNG', optimize=True)
im1_final.save('public/assets/fashion/about/about-fashion-portrait.webp', 'WEBP', quality=95)
# Also update model_seated.webp for backwards compatibility
im1_final.save('public/assets/fashion/about/model_seated.webp', 'WEBP', quality=92)
print(f'1. about-fashion-portrait.png saved: {im1_final.size}')

# 2. Neck and Collar Detail (about-collar-detail.png)
src2 = r'C:\Users\likhi\.gemini\antigravity-ide\brain\a92a6c5a-3f09-447e-8665-91cfb4ce8842\neck_branding_1792565467992.jpg'
im2 = Image.open(src2).convert('RGB')
# Crop to 16:10 (1264 x 790) centered on collar and FBFY label
w2, h2 = im2.size
target_h2 = int(w2 * 10 / 16)
y0_2 = (h2 - target_h2) // 2
crop2 = im2.crop((0, y0_2, w2, y0_2 + target_h2))

enhancer2 = ImageEnhance.Sharpness(crop2)
im2_final = enhancer2.enhance(1.1)

im2_final.save('public/assets/fashion/about/about-collar-detail.png', 'PNG', optimize=True)
im2_final.save('public/assets/fashion/about/about-collar-detail.webp', 'WEBP', quality=95)
# Backwards compatibility
im2_final.save('public/assets/fashion/about/stack_1_neck.png', 'PNG')
im2_final.save('public/assets/fashion/about/stack_1_neck.webp', 'WEBP', quality=90)
print(f'2. about-collar-detail.png saved: {im2_final.size}')

# 3. Distressed Graphic Detail (about-graphic-detail.png)
src3 = r'public/assets/fashion/products/dark-luxury-01/back.jpg'
im3 = Image.open(src3).convert('RGB')
# Frame the distressed "PRESSURE IS A PRIVILEGE" screen-print typography and mountain emblem
# 16:10 crop: w=640, h=400 centered around x=448, y=390
w3 = 640
h3 = 400
x0_3 = (im3.width - w3) // 2
y0_3 = 190
crop3 = im3.crop((x0_3, y0_3, x0_3 + w3, y0_3 + h3))
# Upscale cleanly to 1280x800 with Lanczos
crop3_up = crop3.resize((1280, 800), Image.Resampling.LANCZOS)
enhancer3 = ImageEnhance.Sharpness(crop3_up)
im3_final = enhancer3.enhance(1.2)

im3_final.save('public/assets/fashion/about/about-graphic-detail.png', 'PNG', optimize=True)
im3_final.save('public/assets/fashion/about/about-graphic-detail.webp', 'WEBP', quality=95)
# Backwards compatibility
im3_final.save('public/assets/fashion/about/stack_2_back.png', 'PNG')
im3_final.save('public/assets/fashion/about/stack_2_back.webp', 'WEBP', quality=90)
print(f'3. about-graphic-detail.png saved: {im3_final.size}')

# 4. Industrial Fashion Environment (about-industrial-editorial.png)
src4 = r'C:\Users\likhi\.gemini\antigravity-ide\brain\ee089bb0-0199-4972-ad01-179cac5441c6\hero_campaign_shot_1792391036997.jpg'
im4 = Image.open(src4).convert('RGB')
# 1376 x 768. 16:10 ratio with height 768 -> width = 1228
w4 = 1228
h4 = 768
x0_4 = (im4.width - w4) // 2
crop4 = im4.crop((x0_4, 0, x0_4 + w4, h4))
enhancer4 = ImageEnhance.Sharpness(crop4)
im4_final = enhancer4.enhance(1.1)

im4_final.save('public/assets/fashion/about/about-industrial-editorial.png', 'PNG', optimize=True)
im4_final.save('public/assets/fashion/about/about-industrial-editorial.webp', 'WEBP', quality=95)
# Backwards compatibility
im4_final.save('public/assets/fashion/about/stack_3_perspective.png', 'PNG')
im4_final.save('public/assets/fashion/about/stack_3_perspective.webp', 'WEBP', quality=90)
print(f'4. about-industrial-editorial.png saved: {im4_final.size}')

print('\nALL FOUR ABOUT PAGE IMAGES SUCCESSFULLY GENERATED AND SAVED!')
