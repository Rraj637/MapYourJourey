/**
 * MayYourJourney | GIS Solutions
 * Core UI Logic & Spatial Simulation with Futuristic Effects
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY NAVIGATION
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
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealOnScroll.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => revealOnScroll.observe(el));


    // 3. GOOGLE EARTH/MAPS INTEGRATION
    const mapStatus = document.getElementById('map-status');
    const mapContainer = document.getElementById('google-earth-map');
    const mapOverlay = document.getElementById('map-overlay');
    let googleMap = null;
    let mapInitialized = false;

    const initializeGoogleEarth = () => {
        // Default location: San Francisco
        const defaultLocation = { lat: 37.7749, lng: -122.4194 };
        
        try {
            googleMap = new google.maps.Map(mapContainer, {
                zoom: 14,
                center: defaultLocation,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                tilt: 45,
                heading: 0,
                styles: [
                    {
                        "elementType": "geometry",
                        "stylers": [{ "color": "#1a1a1a" }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#1a1a1a" }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#00f2fe" }]
                    }
                ]
            });

            // Add marker at default location
            const marker = new google.maps.Marker({
                position: defaultLocation,
                map: googleMap,
                title: 'GIS Analysis Point',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#00f2fe',
                    fillOpacity: 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });

            mapInitialized = true;
            mapOverlay.classList.add('hidden');

            // Inject CSS for map controls
            const style = document.createElement('style');
            style.textContent = `
                .gm-ui-hover-effect { opacity: 0.7; }
                .gm-fullscreen-control, .gm-fullscreen-control + div { margin: 10px; }
            `;
            document.head.appendChild(style);

        } catch (error) {
            console.error('Google Maps initialization error:', error);
            if (mapStatus) {
                mapStatus.innerText = 'Google Maps API Key Required. Check console for details.';
            }
        }
    };

    const finalizeMapUI = () => {
        if (mapStatus) {
            mapStatus.innerText = 'Loading Google Earth...';
        }

        // Check if Google Maps API is loaded
        if (typeof google !== 'undefined' && google.maps) {
            setTimeout(() => {
                initializeGoogleEarth();
            }, 500);
        } else {
            if (mapStatus) {
                mapStatus.innerText = 'API Not Loaded - Please add your Google Maps API Key';
            }
        }
    };

    // Trigger map initialization when user scrolls to map section
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
        const mapObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !mapInitialized) {
                finalizeMapUI();
                mapObserver.unobserve(mapSection);
            }
        }, { threshold: 0.5 });

        mapObserver.observe(mapSection);
    }

    // Map Control Buttons
    const handleMapControls = () => {
        const btn2d = document.getElementById('2d-btn');
        const btn3d = document.getElementById('3d-btn');
        const btnSatellite = document.getElementById('satellite-btn');
        const btnZoomIn = document.getElementById('zoom-in-btn');
        const btnZoomOut = document.getElementById('zoom-out-btn');

        if (btn2d) btn2d.addEventListener('click', () => {
            if (googleMap) {
                googleMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                googleMap.setTilt(0);
                updateActiveButton(btn2d);
            }
        });

        if (btn3d) btn3d.addEventListener('click', () => {
            if (googleMap) {
                googleMap.setMapTypeId(google.maps.MapTypeId.HYBRID);
                googleMap.setTilt(45);
                googleMap.setHeading(45);
                updateActiveButton(btn3d);
            }
        });

        if (btnSatellite) btnSatellite.addEventListener('click', () => {
            if (googleMap) {
                googleMap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                googleMap.setTilt(0);
                updateActiveButton(btnSatellite);
            }
        });

        if (btnZoomIn) btnZoomIn.addEventListener('click', () => {
            if (googleMap) {
                googleMap.setZoom(googleMap.getZoom() + 1);
            }
        });

        if (btnZoomOut) btnZoomOut.addEventListener('click', () => {
            if (googleMap) {
                googleMap.setZoom(googleMap.getZoom() - 1);
            }
        });
    };

    const updateActiveButton = (activeBtn) => {
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    };

    // Wait for document to be ready for button interactions
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleMapControls);
    } else {
        handleMapControls();
    }


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

    // 6. FUTURISTIC CURSOR GLOW EFFECT
    const createGlowCursor = () => {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 25px;
            height: 25px;
            border: 2px solid rgba(0, 242, 254, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 25px rgba(0, 242, 254, 0.5), inset 0 0 15px rgba(0, 242, 254, 0.2);
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = (e.clientX - 12.5) + 'px';
            glow.style.top = (e.clientY - 12.5) + 'px';
        });
    };

    createGlowCursor();

    // 7. HOVER GLOW ON SERVICE CARDS
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});