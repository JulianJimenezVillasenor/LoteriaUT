// ============================================
// 🎴 Lotería Mexicana - Aplicación Principal
// ============================================

const barajaOriginal = [
    "El Gallo", "El Diablito", "La Dama", "El Catrín", "El Paraguas", 
    "La Sirena", "La Escalera", "La Botella", "El Barril", "El Árbol", 
    "El Melón", "El Valiente", "El Gorrito", "La Muerte", "La Pera", 
    "La Bandera", "El Bandolón", "El Violoncello", "La Garza", "El Pájaro", 
    "La Mano", "La Bota", "La Luna", "El Cotorro", "El Borracho", 
    "El Negrito", "El Corazón", "La Sandía", "El Tambor", "El Camarón", 
    "Las Jaras", "El Músico", "La Araña", "El Soldado", "La Estrella", 
    "El Cazo", "El Mundo", "El Apache", "El Nopal", "El Alacrán", 
    "La Rosa", "La Calavera", "La Campana", "El Cantarito", "El Venado", 
    "El Sol", "La Corona", "La Chalupa", "El Pino", "El Pescado", 
    "La Palma", "La Maceta", "El Arpa", "La Rana"
];

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
        let carta = barajaActual[indiceActual];
        let numero = barajaOriginal.indexOf(carta) + 1;

        // Animacion visual de la carta
        let cartaBox = document.getElementById("cartaBox");
        cartaBox.classList.remove("animar");
        void cartaBox.offsetWidth; 
        cartaBox.classList.add("animar");

        // Actualizar textos
        document.getElementById("numCarta").innerText = `# ${numero}`;
        document.getElementById("nombreCarta").innerText = carta;
        document.getElementById("contador").innerText = `Carta ${indiceActual + 1} de 54`;

        // Actualizar historial con etiquetas
        let historialDiv = document.getElementById("historial");
        if (indiceActual === 0) {
            historialDiv.innerHTML = "";
        } else {
            let cartasPasadas = barajaActual.slice(0, indiceActual);
            historialDiv.innerHTML = cartasPasadas.map(c => `<span class="badge-carta">${c}</span>`).join("");
            historialDiv.scrollTop = historialDiv.scrollHeight;
        }

        cantar(carta);
    } else {
        pausarJuego();
        document.getElementById("nombreCarta").innerText = "¡Se acabó!";
        document.getElementById("numCarta").innerText = "Fin";
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
