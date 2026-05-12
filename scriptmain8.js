const weddingDate = new Date("Nov 14, 2026 12:00:00").getTime();

const timer = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText    = days    < 10 ? "0" + days    : days;
    document.getElementById("hours").innerText   = hours   < 10 ? "0" + hours   : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("timer").innerHTML = "¡LLEGÓ EL DÍA!";
    }
}, 1000);

window.addEventListener("DOMContentLoaded", () => {
    const audio     = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto     = document.getElementById("texto");

    if (!audio || !btnMusica || !texto) return;

    const debeReproducir = localStorage.getItem("reproducirMusica");
    let hasPlayedOnce = false;

    if (debeReproducir === "true") {
        audio.currentTime = 65;
        hasPlayedOnce = true;
        audio.play();
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
        localStorage.removeItem("reproducirMusica");
    }

    btnMusica.addEventListener("click", () => {
        if (audio.paused) {
            if (!hasPlayedOnce) {
                audio.currentTime = 65;
                hasPlayedOnce = true;
            }
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
    const audio     = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto     = document.getElementById("texto");
    if (!audio || !btnMusica || !texto) return;

    audio.currentTime = 65;
    audio.play().then(() => {
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
    }).catch(() => {
        texto.innerText = "Reproducir canción";
    });
}

window.iniciarMusicaDesdeIntro = iniciarSonidoMusicaDesdeIntro;

const overlay     = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');

function continuarIntro() {
    overlay.classList.add('ocultar-overlay');
    if (mainContent) mainContent.classList.remove('hidden');
    setTimeout(() => { overlay.style.display = 'none'; }, 750);
}

setTimeout(continuarIntro, 3000);

(function () {
    let musicStarted = false;

    function startMusicOnScroll() {
        if (musicStarted) return;
        musicStarted = true;

        const audio     = document.getElementById('miMusica');
        const btnMusica = document.getElementById('btnMusica');
        const texto     = document.getElementById('texto');
        if (!audio) return;

        audio.currentTime = 65;
        audio.play().then(() => {
            if (btnMusica) btnMusica.classList.add('sonando');
            if (texto)     texto.innerText = 'Pausar';
        }).catch(() => {});

        window.removeEventListener('scroll',    startMusicOnScroll);
        window.removeEventListener('touchmove', startMusicOnScroll);
    }

    window.addEventListener('scroll',    startMusicOnScroll, { passive: true });
    window.addEventListener('touchmove', startMusicOnScroll, { passive: true });
})();

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

document.querySelectorAll('.slideshow').forEach(show => {
    const imgs    = show.querySelectorAll('img');
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

(function () {
    emailjs.init("O9TA18-zps7iaEptM");
})();

const btn = document.getElementById('button-send');

document.getElementById('rsvp-form').addEventListener('submit', function (event) {
    event.preventDefault();

    btn.innerText    = 'ENVIANDO...';
    btn.style.opacity = '0.7';

    emailjs.sendForm('service_6m7prwn', 'template_41pvc6t', this)
        .then(() => {
            btn.innerText            = '¡ENVIADO CON ÉXITO!';
            btn.style.backgroundColor = '#27ae60';
            alert('¡Gracias! Tu confirmación ha sido recibida.');
            this.reset();
        }, (err) => {
            btn.innerText            = 'ERROR AL ENVIAR';
            btn.style.backgroundColor = '#e74c3c';
            alert('Hubo un error: ' + JSON.stringify(err));
        });
});
