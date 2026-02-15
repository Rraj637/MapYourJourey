/**
 * MapMitra | GIS Futuristic UI Logic
 * Handles animations, spatial simulations, and interactive effects
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SMOOTH SCROLLING FOR INTERNAL LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. REVEAL ON SCROLL (Intersection Observer)
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => revealObserver.observe(el));

    // 3. DYNAMIC GRADIENT HERO TRACKING
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;
            hero.style.setProperty('--mouse-x', `${x}%`);
            hero.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // 4. GLOW CURSOR EFFECT
    const createGlowEffect = () => {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(0, 242, 254, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = (e.clientX - 10) + 'px';
            glow.style.top = (e.clientY - 10) + 'px';
        });
    };

    createGlowEffect();

    // 5. TEXT ANIMATION ON HOVER
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
});