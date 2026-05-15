/* ============================================================
   COUNTDOWN
   ============================================================ */
const weddingDate = new Date("Sep 26, 2026 16:00:00").getTime();

const timer = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("timer").innerHTML = "¡LLEGÓ EL DÍA!";
    }
}, 1000);

/* ============================================================
   MUSIC (for intro overlay — currently commented in HTML)
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto = document.getElementById("texto");

    if (!audio || !btnMusica || !texto) return;

    const debeReproducir = localStorage.getItem("reproducirMusica");

    if (debeReproducir === "true") {
        audio.play();
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
        localStorage.removeItem("reproducirMusica");
    }

    btnMusica.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            btnMusica.classList.add("sonando");
            texto.innerText = "Pausar";
        } else {
            audio.pause();
            btnMusica.classList.remove("sonando");
            texto.innerText = "Reproducir canción";
        }
    });
});

function iniciarSonidoMusicaDesdeIntro() {
    const audio = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto = document.getElementById("texto");
    if (!audio || !btnMusica || !texto) return;

    audio.play().then(() => {
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
    }).catch(() => {
        texto.innerText = "Reproducir canción";
    });
}

window.iniciarMusicaDesdeIntro = iniciarSonidoMusicaDesdeIntro;

/* ============================================================
   INTRO — animación sello → sobre → tarjeta → continuar
   ============================================================ */
const sello = document.getElementById('sello');
const botonContinuar = document.getElementById('btn-continuar');
const sobreCerrado = document.getElementById('sobre-cerrado');
const sobreAbierto = document.getElementById('sobre-abierto');
const tarjetaIntro = document.getElementById('tarjeta-intro');
const overlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');

function iniciarAnimacion() {
    sello.classList.add('girar-desvanecer');
    setTimeout(() => { sobreCerrado.style.opacity = '0'; sobreAbierto.style.opacity = '1'; }, 1000);
    setTimeout(() => { tarjetaIntro.classList.add('subir-tarjeta'); }, 1800);
    setTimeout(() => { botonContinuar.classList.add('mostrar-boton'); }, 2800);
}

function continuarIntro() {
    overlay.classList.add('ocultar-overlay');
    if (mainContent) mainContent.classList.remove('hidden');
    if (window.iniciarMusicaDesdeIntro) window.iniciarMusicaDesdeIntro();
    setTimeout(() => { overlay.style.display = 'none'; }, 750);
}

if (sello) sello.addEventListener('click', iniciarAnimacion);
if (botonContinuar) botonContinuar.addEventListener('click', continuarIntro);

/* ============================================================
   SLIDESHOW — navegación manual con flechas (fade transition)
   ============================================================ */
document.querySelectorAll('.slideshow').forEach(show => {
    const imgs = show.querySelectorAll('img');
    const counter = show.querySelector('.slide-counter');
    let idx = 0;

    function updateSlide(newIdx) {
        imgs[idx].classList.remove('active');
        idx = newIdx;
        imgs[idx].classList.add('active');
        if (counter) counter.textContent = (idx + 1) + ' / ' + imgs.length;
    }

    show.querySelector('.slide-next').addEventListener('click', () => {
        updateSlide((idx + 1) % imgs.length);
    });

    show.querySelector('.slide-prev').addEventListener('click', () => {
        updateSlide((idx - 1 + imgs.length) % imgs.length);
    });
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   EMAILJS — RSVP form
   ============================================================ */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwxEUNZHTgmMnBCYv2E3w_mxN6gNPhya2k_skRIhwxBIIsfSo0XCPc9gu4zG7yYKWcT/exec";

const btn = document.getElementById('button-send');

document.getElementById('rsvp-form').addEventListener('submit', function (event) {
    event.preventDefault();

    btn.innerText = 'ENVIANDO...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const payload = {
        from_name:  this.from_name.value.trim(),
        last_name:  this.last_name.value.trim(),
        age:        this.age.value.trim(),
        attendance: this.attendance.value,
        allergies:  this.allergies.value.trim() || 'Ninguna',
    };

    fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'ok') {
            btn.innerText = '¡ENVIADO CON ÉXITO!';
            btn.style.backgroundColor = '#27ae60';
            btn.style.opacity = '1';
            alert('¡Gracias! Tu confirmación ha sido recibida.');
            this.reset();
        } else {
            throw new Error(data.message || 'Error desconocido');
        }
    })
    .catch(err => {
        btn.innerText = 'ERROR AL ENVIAR';
        btn.style.backgroundColor = '#e74c3c';
        btn.style.opacity = '1';
        alert('Hubo un error: ' + err.message);
    })
    .finally(() => {
        btn.disabled = false;
    });
});
