// ============================================
// 🎴 Lotería Mexicana - Aplicación Principal
// ============================================

// Mapeo de cartas: nombre -> archivo de imagen
const CARTAS = {
    1: { nombre: "El Gallo", archivo: "1" },
    2: { nombre: "El Diablito", archivo: "2" },
    3: { nombre: "La Dama", archivo: "3" },
    4: { nombre: "El Catrín", archivo: "4" },
    5: { nombre: "El Paraguas", archivo: "5" },
    6: { nombre: "La Sirena", archivo: "6" },
    7: { nombre: "La Escalera", archivo: "7" },
    8: { nombre: "La Botella", archivo: "8" },
    9: { nombre: "El Barril", archivo: "9" },
    10: { nombre: "El Árbol", archivo: "10" },
    11: { nombre: "El Melón", archivo: "11" },
    12: { nombre: "El Valiente", archivo: "12" },
    13: { nombre: "El Gorrito", archivo: "13" },
    14: { nombre: "La Muerte", archivo: "14" },
    15: { nombre: "La Pera", archivo: "15" },
    16: { nombre: "La Bandera", archivo: "16" },
    17: { nombre: "El Bandolón", archivo: "17" },
    18: { nombre: "El Violoncello", archivo: "18" },
    19: { nombre: "La Garza", archivo: "19" },
    20: { nombre: "El Pájaro", archivo: "20" },
    21: { nombre: "La Mano", archivo: "21" },
    22: { nombre: "La Bota", archivo: "22" },
    23: { nombre: "La Luna", archivo: "23" },
    24: { nombre: "El Cotorro", archivo: "24" },
    25: { nombre: "El Borracho", archivo: "25" },
    26: { nombre: "El Negrito", archivo: "26" },
    27: { nombre: "El Corazón", archivo: "27" },
    28: { nombre: "La Sandía", archivo: "28" },
    29: { nombre: "El Tambor", archivo: "29" },
    30: { nombre: "El Camarón", archivo: "30" },
    31: { nombre: "Las Jaras", archivo: "31" },
    32: { nombre: "El Músico", archivo: "32" },
    33: { nombre: "La Araña", archivo: "33" },
    34: { nombre: "El Soldado", archivo: "34" },
    35: { nombre: "La Estrella", archivo: "35" },
    36: { nombre: "El Cazo", archivo: "36" },
    37: { nombre: "El Mundo", archivo: "37" },
    38: { nombre: "El Apache", archivo: "38" },
    39: { nombre: "El Nopal", archivo: "39" },
    40: { nombre: "El Alacrán", archivo: "40" },
    41: { nombre: "La Rosa", archivo: "41" },
    42: { nombre: "La Calavera", archivo: "42" },
    43: { nombre: "La Campana", archivo: "43" },
    44: { nombre: "El Cantarito", archivo: "44" },
    45: { nombre: "El Venado", archivo: "45" },
    46: { nombre: "El Sol", archivo: "46" },
    47: { nombre: "La Corona", archivo: "47" },
    48: { nombre: "La Chalupa", archivo: "48" },
    49: { nombre: "El Pino", archivo: "49" },
    50: { nombre: "El Pescado", archivo: "50" },
    51: { nombre: "La Palma", archivo: "51" },
    52: { nombre: "La Maceta", archivo: "52" },
    53: { nombre: "El Arpa", archivo: "53" },
    54: { nombre: "La Rana", archivo: "54" }
};

// Array de números para la baraja
const barajaOriginal = Object.keys(CARTAS).map(Number);

let barajaActual = [];
let indiceActual = -1;
let intervalo = null;
let vozSeleccionada = null;
let enPausa = false;

// ============================================
// 🎤 Sistema de Voz (Text-to-Speech)
// ============================================

function cargarVoces() {
    const voces = window.speechSynthesis.getVoices();
    vozSeleccionada = voces.find(v => v.lang.includes('es-MX')) || voces.find(v => v.lang.includes('es'));
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
}

function cantar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-MX';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        if (vozSeleccionada) {
            utterance.voice = vozSeleccionada;
        }
        window.speechSynthesis.speak(utterance);
    }
}

// ============================================
// 🃏 Lógica del Juego
// ============================================

function barajar(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function cargarCarta(numeroCarta) {
    const carta = CARTAS[numeroCarta];
    const img = document.getElementById("cartaImagen");
    img.src = `assets/cards/${carta.archivo}.webp`;
    img.alt = carta.nombre;
}

function iniciarJuego() {
    barajaActual = barajar([...barajaOriginal]);
    indiceActual = -1;

    document.getElementById("btnSiguiente").disabled = false;
    document.getElementById("btnPausa").disabled = false;
    document.getElementById("btnIniciar").innerText = "Reiniciar";

    siguienteCarta();
    iniciarAutomatico();
}

function siguienteCarta() {
    indiceActual++;
    if (indiceActual < barajaActual.length) {
        let numeroCarta = barajaActual[indiceActual];
        let carta = CARTAS[numeroCarta];

        // Animacion visual de la carta
        let cartaBox = document.getElementById("cartaBox");
        cartaBox.classList.remove("animar");
        void cartaBox.offsetWidth; 
        cartaBox.classList.add("animar");

        // Cargar imagen de la carta
        cargarCarta(numeroCarta);

        // Actualizar contador
        document.getElementById("contador").innerText = `Carta ${indiceActual + 1} de 54 - ${carta.nombre}`;

        // Actualizar historial con etiquetas
        let historialDiv = document.getElementById("historial");
        if (indiceActual === 0) {
            historialDiv.innerHTML = "";
        } else {
            let cartasPasadas = barajaActual.slice(0, indiceActual);
            historialDiv.innerHTML = cartasPasadas.map(num => 
                `<span class="badge-carta">${CARTAS[num].nombre}</span>`
            ).join("");
            historialDiv.scrollTop = historialDiv.scrollHeight;
        }

        cantar(carta.nombre);
    } else {
        pausarJuego();
        document.getElementById("contador").innerText = "¡Se acabó la lotería!";
        document.getElementById("btnSiguiente").disabled = true;
        document.getElementById("btnPausa").disabled = true;
        cantar("¡Se acabó la lotería!");
    }
}

// ============================================
// ⏯️ Control de Velocidad y Pausa
// ============================================

function iniciarAutomatico() {
    if (intervalo) clearInterval(intervalo);
    enPausa = false;
    document.getElementById("btnPausa").innerText = "Pausar";
    
    let velocidadMs = parseInt(document.getElementById("velocidadSelect").value);
    
    intervalo = setInterval(() => {
        siguienteCarta();
    }, velocidadMs);
}

function pausarJuego() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
        enPausa = true;
        document.getElementById("btnPausa").innerText = "Reanudar";
    } else if (indiceActual < barajaActual.length - 1) {
        iniciarAutomatico();
    }
}

function cambiarVelocidad() {
    if (intervalo) {
        iniciarAutomatico();
    }
}

// ============================================
// 🚀 Inicialización
// ============================================

// Cargar primera carta al inicio
window.onload = function() {
    cargarCarta(1);
};
