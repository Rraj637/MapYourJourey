/**
 * MayYourJourney | GIS Subdivision Logic
 * Handles animations, spatial simulations, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SMOOTH SCROLLING FOR INTERNAL LINKS
    // Ensures that clicking "View Capabilities" slides down instead of jumping
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
    // Triggers the 'show' class when feature cards enter the viewport
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => revealObserver.observe(el));

    // 3. DYNAMIC GRADIENT HERO TRACKING (Optional Visual Flair)
    // Moves the glow effect based on mouse position for a "high-tech" feel
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

    // 4. DATA COUNTER ANIMATION (For GIS Accuracy Stats)
    // If you add stats like "99% Accuracy", this will animate the numbers
    const animateNumbers = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const speed = 200; 
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => animateNumbers(el), 1);
        } else {
            el.innerText = target;
        }
    };

    // Trigger counters when the features section is reached
    const featuresSection = document.querySelector('.features');
    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(num => animateNumbers(num));
            statsObserver.unobserve(featuresSection);
        }
    }, { threshold: 0.5 });

    if (featuresSection) statsObserver.observe(featuresSection);
});