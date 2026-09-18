#!/usr/bin/env python3
"""
Convertir imágenes JPG a WebP optimizado para web
"""
from pathlib import Path
from PIL import Image
import os

# Configuración
INPUT_DIR = Path("/home/karataso/Documents/LoteriaUT/assets/cards")
OUTPUT_DIR = Path("/home/karataso/Documents/LoteriaUT/assets/cards/webp")
QUALITY = 85  # Buena relación calidad/tamaño

def convert_to_webp():
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    jpg_files = list(INPUT_DIR.glob("*.jpg"))
    total_original = 0
    total_webp = 0
    
    print("🔄 Convirtiendo JPGs a WebP...")
    print()
    
    for img_path in sorted(jpg_files):
        filename = img_path.stem
        output_path = OUTPUT_DIR / f"{filename}.webp"
        
        try:
            with Image.open(img_path) as img:
                # Guardar como WebP
                img.save(output_path, "WEBP", quality=QUALITY)
                
                # Calcular tamaños
                original_size = img_path.stat().st_size
                webp_size = output_path.stat().st_size
                savings = 100 - (webp_size * 100 // original_size)
                
                total_original += original_size
                total_webp += webp_size
                
                print(f"  ✅ {filename}.jpg → .webp  ({original_size//1024}KB → {webp_size//1024}KB, -{savings}%)")
                
        except Exception as e:
            print(f"  ❌ {filename}.jpg: Error - {e}")
    
    # Resumen
    print()
    print("=" * 50)
    print(f"📊 RESUMEN:")
    print(f"  Original: {total_original // 1024 // 1024}MB ({len(jpg_files)} archivos)")
    print(f"  WebP:     {total_webp // 1024 // 1024}MB")
    print(f"  Ahorro:   {100 - (total_webp * 100 // total_original)}%")
    print()
    print(f"✅ Listo en: {OUTPUT_DIR}")

if __name__ == "__main__":
    convert_to_webp()
