/**
 * MayYourJourney | GIS Solutions
 * Core UI Logic & Spatial Simulation
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY NAVIGATION
    // Changes navbar background and height when user scrolls down
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);


    // 2. SCROLL-REVEAL ANIMATIONS
    // Uses Intersection Observer to trigger the 'show' class when elements enter the screen
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Once shown, we stop observing to keep it visible
                revealOnScroll.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select all elements with the 'hidden' class from your HTML
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => revealOnScroll.observe(el));


    // 3. GIS MAP SIMULATION
    // Mimics the loading of spatial layers (Vector/Raster) into the map container
    const mapStatus = document.getElementById('map-status');
    const mapContainer = document.getElementById('mock-map');

    const simulateGisLoad = () => {
        const stages = [
            "Connecting to PostGIS Database...",
            "Fetching GeoJSON Vector Layers...",
            "Rendering WebGL Tiles...",
            "Map Ready."
        ];

        let stageIndex = 0;

        const interval = setInterval(() => {
            if (stageIndex < stages.length) {
                mapStatus.innerText = stages[stageIndex];
                stageIndex++;
            } else {
                clearInterval(interval);
                finalizeMapUI();
            }
        }, 800);
    };

    const finalizeMapUI = () => {
        // Replace loader with a "Live" visual indicator
        mapContainer.innerHTML = `
            <div class="map-live-view" style="
                width: 100%; height: 100%; 
                background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1200&q=80');
                background-size: cover;
                background-position: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                animation: fadeIn 1.5s ease-in;
            ">
                <div style="background: rgba(30, 41, 59, 0.9); padding: 20px; border-radius: 12px; border: 1px solid var(--primary); text-align: center;">
                    <i class="fa-solid fa-satellite-dish" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
                    <h3 style="margin: 0;">Spatial Engine Active</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 5px 0 0;">Lat: 34.0522° N | Lon: 118.2437° W</p>
                </div>
            </div>
        `;
    };

    // Trigger map simulation when user scrolls to map section
    const mapSection = document.querySelector('.map-section');
    const mapObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            simulateGisLoad();
            mapObserver.unobserve(mapSection);
        }
    }, { threshold: 0.5 });

    mapObserver.observe(mapSection);


    // 4. CONTACT FORM HANDLING
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerText;
            
            // UI Feedback
            submitBtn.innerText = "Analyzing Inquiry...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // Simulate Network Delay
            setTimeout(() => {
                submitBtn.innerText = "Data Transmitted!";
                submitBtn.style.background = "#22c55e"; // Green for success
                
                // Clear form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    submitBtn.style.background = "";
                }, 3000);
            }, 1500);
        });
    }

    // 5. MOBILE MENU TOGGLE (Optional logic for Hamburger)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            // If displayed, add a small mobile-friendly style
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-alt)';
                navLinks.style.padding = '20px';
            }
        });
    }
});