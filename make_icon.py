import os
from PIL import Image

def make_square_icon(input_path, output_path, size=512):
    try:
        # Open the original image
        img = Image.open(input_path)
        
        # Calculate aspect ratio
        aspect = img.width / img.height
        
        # Calculate new dimensions, leaving a 10% padding
        target_max = int(size * 0.8)
        
        if aspect > 1:
            # Wider than tall
            new_w = target_max
            new_h = int(target_max / aspect)
        else:
            # Taller than wide
            new_h = target_max
            new_w = int(target_max * aspect)
            
        # Resize image
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create a new white square image
        background = Image.new('RGBA', (size, size), (255, 255, 255, 255))
        
        # Calculate center position
        offset = ((size - new_w) // 2, (size - new_h) // 2)
        
        # Paste the resized image onto the center of the background
        # If original has alpha, use it as mask
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            background.paste(img, offset, img)
        else:
            background.paste(img, offset)
            
        # Save as PNG
        background.save(output_path, 'PNG')
        print(f"Successfully created {output_path}")
    except Exception as e:
        print(f"Error creating icon: {e}")

if __name__ == "__main__":
    make_square_icon('public/logo.png', 'public/app-icon.png')
