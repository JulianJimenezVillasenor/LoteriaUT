#!/usr/bin/env python3
"""
Generador de cartas de Lotería estilo cartoon minimalista
Usa Google Gemini API (Nano Banana) para simplificar cartas de Don Clemente
"""

import os
import base64
import json
from pathlib import Path
from google import genai

# Configuración
SOURCE_DIR = Path("/home/karataso/Documents/loteria-assets")
OUTPUT_DIR = Path("/home/karataso/Documents/LoteriaUT/assets/cards/generated")
MODEL = "gemini-3.1-flash-image"

# Mapeo de cartas (número -> nombre)
CARTAS = {
    1: "gallo", 2: "diablito", 3: "dama", 4: "catrin", 5: "paraguas",
    6: "sirena", 7: "escalera", 8: "botella", 9: "barril", 10: "arbol",
    11: "melon", 12: "valiente", 13: "gorrito", 14: "muerte", 15: "pera",
    16: "bandera", 17: "bandolon", 18: "violoncello", 19: "garza", 20: "pajaro",
    21: "mano", 22: "bota", 23: "luna", 24: "cotorro", 25: "borracho",
    26: "negrito", 27: "corazon", 28: "sandia", 29: "tambor", 30: "camaron",
    31: "jaras", 32: "musico", 33: "arana", 34: "soldado", 35: "estrella",
    36: "cazo", 37: "mundo", 38: "apache", 39: "nopal", 40: "alacran",
    41: "rosa", 42: "calavera", 43: "campana", 44: "cantarito", 45: "venado",
    46: "sol", 47: "corona", 48: "chalupa", 49: "pino", 50: "pescado",
    51: "palma", 52: "maceta", 53: "arpa", 54: "rana"
}

# ============================================
# PROMPT CONSISTENTE - Estilo Cartoon Minimalista
# ============================================

PROMPT_STYLE = """
ESTILO VISUAL OBLIGATORIO (aplicar exactamente igual a TODAS las imágenes):

1. OUTLINE:
   - Todos los elementos deben tener outline negro sólido (#2b2b2b)
   - Grosor uniforme de 2-3px en elementos principales
   - Grosor de 1-2px en elementos secundarios
   - Sin variaciones de grosor ni efectos de presión

2. RELLENO (COLORES PLANOS):
   - Solo colores sólidos, SIN degradados, SIN sombras, SIN brillos
   - Paleta de colores específicas por categoría:
     * Rojos: #CC0000, #FF4444, #FF6B6B
     * Azules: #2196F3, #42A5F5, #64B5F6
     * Verdes: #4CAF50, #66BB6A, #81C784
     * Amarillos: #FFC107, #FFD54F, #FFE082
     * Naranjas: #FF9800, #FFB74D, #FFCC80
     * Morados: #9C27B0, #BA68C8, #CE93D8
     * Rosas: #E91E63, #F06292, #F48FB1
     * Cafés: #795548, #8D6E63, #A1887F
     * Grises: #757575, #9E9E9E, #BDBDBD

3. FORMAS:
   - Geométricas y simplificadas
   - Esquinas redondeadas suaves (border-radius: 8-12px en CSS)
   - Sin detalles intrincados ni texturas
   - Máximo 3-4 formas principales por imagen

4. COMPOSICIÓN:
   - Centrado en el canvas
   - Proporciones armónicas (regla de tercios)
   - Espacio negativo equilibrado
   - El sujeto ocupa 60-70% del espacio

5. FONDO:
   - Color sólido que complemente al sujeto
   - Sin patrones, sin texturas, sin elementos decorativos
   - Colores sugeridos: #E8F5E9 (verde claro), #E3F2FD (azul claro), #FFF3E4 (naranja claro), #F3E5F5 (morado claro)

6. PROHIBIDO:
   - ❌ Texto de ningún tipo
   - ❌ Números
   - ❌ Logotipos o marcas de agua
   - ❌ Degradados o sombras
   - ❌ Detalles realistas
   - ❌ Efectos de luz
   - ❌ Texturas

7. REFERENCIA VISUAL:
   - Piensa en stickers de WhatsApp
   - Piensa en ilustraciones de libros infantiles
   - Piensa en iconos de apps minimalistas
   - Piensa en dibujos de coloring books para adultos
"""

PROMPT_BASE = f"""{PROMPT_STYLE}

TAREA: Redibuja esta imagen de lotería mexicana aplicando EXACTAMENTE el estilo descrito arriba. 
Mantén la esencia y reconocibilidad del objeto/personaje, pero transforma completamente el estilo.
El resultado debe verse como un sticker o icono cartoon moderno."""


PROMPT_GALLO = f"""{PROMPT_STYLE}

TAREA IMPORTANTE: Esta imagen contiene logotipos, números y marcas de agua de Don Clemente.
ELIMINA COMPLETAMENTE todo texto, números, logotipos y marcas de agua.
SOLO mantén el dibujo del gallo y redibújalo aplicando EXACTAMENTE el estilo descrito arriba.
El resultado debe ser un gallo cartoon limpio, sin ningún elemento de branding."""


def init_client():
    """Inicializa el cliente de Gemini"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: Variable de entorno GEMINI_API_KEY no configurada")
        print("   Ejecuta: export GEMINI_API_KEY=tu_api_key")
        print("   Obtén tu API key en: https://aistudio.google.com/apikey")
        exit(1)
    
    return genai.Client(api_key=api_key)


def image_to_base64(image_path: Path) -> str:
    """Convierte imagen a base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_card(client, source_path: Path, output_path: Path, carta_num: int, carta_nombre: str) -> bool:
    """Genera una carta simplificada"""
    
    print(f"🃏 Procesando carta #{carta_num}: {carta_nombre}...", end=" ", flush=True)
    
    # Seleccionar prompt según la carta
    prompt = PROMPT_GALLO if carta_num == 1 else PROMPT_BASE
    
    # Leer imagen de referencia
    image_data = image_to_base64(source_path)
    
    try:
        # Llamar a Nano Banana
        interaction = client.interactions.create(
            model=MODEL,
            input=[
                {"type": "text", "text": prompt},
                {
                    "type": "image",
                    "data": image_data,
                    "mime_type": "image/jpeg"
                }
            ],
            response_format={
                "type": "image",
                "mime_type": "image/jpeg",
                "aspect_ratio": "1:1"
            }
        )
        
        # Guardar resultado
        if interaction.output_image:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, "wb") as f:
                f.write(base64.b64decode(interaction.output_image.data))
            
            print("✅")
            return True
        else:
            print("❌ No se generó imagen")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("🎰 Generador de Cartas de Lotería - Estilo Cartoon Minimalista")
    print("=" * 60)
    print()
    print("📋 Especificación del estilo:")
    print("   • Outline negro uniforme (2-3px)")
    print("   • Colores planos sin degradados")
    print("   • Formas geométricas simples")
    print("   • Fondo sólido complementario")
    print("   • Sin texto, números ni logos")
    print()
    
    # Verificar fuente
    if not SOURCE_DIR.exists():
        print(f"❌ Directorio de origen no encontrado: {SOURCE_DIR}")
        exit(1)
    
    # Inicializar cliente
    client = init_client()
    print(f"✅ Cliente Gemini inicializado")
    print(f"📁 Origen: {SOURCE_DIR}")
    print(f"📁 Destino: {OUTPUT_DIR}")
    print()
    
    # Estadísticas
    exito = 0
    fallos = 0
    total = 54
    
    # Procesar todas las cartas
    for num in range(1, total + 1):
        nombre = CARTAS[num]
        source = SOURCE_DIR / f"{num}.jpg"
        output = OUTPUT_DIR / f"{nombre}.jpg"
        
        if not source.exists():
            print(f"⚠️  #{num:02d} {nombre}: Fuente no encontrada")
            fallos += 1
            continue
        
        # Generar carta
        if generate_card(client, source, output, num, nombre):
            exito += 1
        else:
            fallos += 1
    
    # Resumen
    print()
    print("=" * 60)
    print(f"📊 RESUMEN FINAL:")
    print(f"   ✅ Generadas: {exito}/{total}")
    print(f"   ❌ Fallos: {fallos}/{total}")
    print(f"   📁 Resultados: {OUTPUT_DIR}")
    print()
    
    if exito > 0:
        print("💡 Siguiente paso: Revisar las imágenes generadas")
        print("   Si alguna no tiene el estilo correcto, se puede regenerar")


if __name__ == "__main__":
    main()
