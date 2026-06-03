// État global de lecture
let musicPlaying = false;
let audioPlayer;

document.addEventListener("DOMContentLoaded", () => {
    
    // Récupération de l'élément audio défini dans le HTML
    audioPlayer = document.getElementById('bgMusic');
    if (audioPlayer) {
        audioPlayer.volume = 0.25; // Volume d'ambiance doux
    }

    // ===== PARTICULES EN ARRIÈRE-PLAN =====
    const particlesContainer = document.getElementById('particles');
    
    function createParticle() {
        if (document.hidden) return; 
        
        const p = document.createElement('div');
        p.className = 'particle';
        
        const size = Math.random() * 8 + 3;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 8 + 8) + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        
        if (particlesContainer) particlesContainer.appendChild(p);
        setTimeout(() => p.remove(), 16000);
    }
    
    if (particlesContainer) setInterval(createParticle, 600);

    // ===== GESTION DE LA BARRE DE NAVIGATION (Throttled) =====
    const nav = document.getElementById('nav');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            window.requestAnimationFrame(() => {
                if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
                scrollTimeout = null;
            });
            scrollTimeout = true;
        }
    });

    // ===== APPARITION DES ÉLÉMENTS AU SCROLL =====
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// ===== ACTION DE L'ÉCRAN D'ACCUEIL (Joue la musique immédiatement) =====
window.startExperience = function() {
    const intro = document.getElementById('introOverlay');
    const musicBtn = document.getElementById('musicBtn');
    
    if (!audioPlayer) {
        audioPlayer = document.getElementById('bgMusic');
    }

    // Lancement immédiat forcé par l'interaction utilisateur
    if (audioPlayer) {
        audioPlayer.play()
            .then(() => {
                if (musicBtn) musicBtn.classList.add('active');
                musicPlaying = true;
            })
            .catch(err => {
                console.log("Erreur lors de la lecture audio automatique :", err);
            });
    }

    // Masquage fluide de l'écran d'introduction
    if (intro) {
        intro.classList.add('fade-out');
    }
};

// ===== BOUTON FLOTTANT (Play / Pause alternable) =====
window.toggleMusic = function() {
    const btn = document.getElementById('musicBtn');
    
    if (!audioPlayer) {
        audioPlayer = document.getElementById('bgMusic');
    }

    if (audioPlayer) {
        if (musicPlaying) {
            audioPlayer.pause();
            if (btn) btn.classList.remove('active');
            musicPlaying = false;
        } else {
            audioPlayer.play()
                .then(() => {
                    if (btn) btn.classList.add('active');
                    musicPlaying = true;
                })
                .catch(err => console.log("L'audio nécessite une interaction préalable."));
        }
    }
};

// ===== OUVERTURE DE L'ENVELOPPE =====
window.openEnvelope = function() {
    const envelope = document.getElementById('envelopeWrapper');
    if (envelope && !envelope.classList.contains('open')) {
        envelope.classList.add('open');
        setTimeout(launchConfetti, 600);
    }
};

// ===== GESTION DES CŒURS DE LA GALERIE =====
let heartTotal = 0;
const heartCountEl = document.getElementById('heartCount');

window.toggleHeart = function(btn) {
    btn.classList.toggle('liked');
    if (btn.classList.contains('liked')) {
        heartTotal++;
    } else {
        heartTotal--;
    }
    if (heartCountEl) heartCountEl.textContent = heartTotal;
};

// ===== EFFET DE CONFETTIS =====
window.launchConfetti = function() {
    const colors = ['#d4af37', '#f3e5ab', '#d88eb5', '#b8629b', '#ffffff'];
    const batchCount = 120;
    
    for (let i = 0; i < batchCount; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti-piece';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            c.style.width = (Math.random() * 8 + 4) + 'px';
            c.style.height = (Math.random() * 12 + 6) + 'px';
            c.style.borderRadius = Math.random() > 0.6 ? '50%' : '2px';
            
            c.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
            
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 4500);
        }, i * 12); 
    }
};