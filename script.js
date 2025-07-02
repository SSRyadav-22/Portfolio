document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- (existing code)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) { link.style.animation = ''; }
            else { link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`; }
        });
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(lnk => lnk.style.animation = '');
            }
        });
    });

    // --- Smooth Scrolling for Nav Links & Active Class --- (existing code)
    const sections = document.querySelectorAll("main section");
    const navLi = document.querySelectorAll("header nav ul li a");
    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
          current = section.getAttribute('id');
        }
      });
      navLi.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") == "#" + current) { a.classList.add("active"); }
      });
    });

    // --- Scroll Animations --- (existing code)
    const scrollElements = document.querySelectorAll(".animate-on-scroll");
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => { element.classList.add("is-visible"); };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) { displayScrollElement(el); }
        });
    };
    handleScrollAnimation();
    window.addEventListener("scroll", handleScrollAnimation);

    // --- Update Footer Year --- (existing code)
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Parallax for Hero Background --- (existing code - no changes needed for this effect)
    const heroSection = document.querySelector('.hero');
    // ... (parallax logic if any)

    // --- NEW: Sparks Effect for Hero Name ---
    const heroNameElement = document.querySelector('#home .hero-content h1.neon-text-effect');
    const heroContentElement = document.querySelector('#home .hero-content'); // Parent for sparks
    let sparksInterval;

    function createSpark() {
        if (!heroNameElement || !heroContentElement) return;

        const spark = document.createElement('div');
        spark.classList.add('spark');

        const nameRect = heroNameElement.getBoundingClientRect();
        const contentRect = heroContentElement.getBoundingClientRect(); // Use content for positioning context

        // Start spark somewhere along the width of the name, near its bottom edge
        const startX = Math.random() * nameRect.width;
        const startY = nameRect.height * (0.5 + Math.random() * 0.5) ; // Start within lower half of name

        // Position relative to heroContentElement
        spark.style.left = (nameRect.left - contentRect.left + startX) + 'px';
        spark.style.top = (nameRect.top - contentRect.top + startY) + 'px';

        // Randomize fall duration and horizontal drift
        const fallDuration = 0.5 + Math.random() * 1; // 0.5 to 1.5 seconds
        const driftX = (Math.random() - 0.5) * 60; // -30px to +30px horizontal drift
        const fallDistance = 100 + Math.random() * 150; // How far down they fall

        heroContentElement.appendChild(spark);

        // Animate the spark
        spark.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 0.8 },
            { transform: `translateY(${fallDistance}px) translateX(${driftX}px)`, opacity: 0 }
        ], {
            duration: fallDuration * 1000,
            easing: 'ease-out', // Fall faster initially
            fill: 'forwards'
        });

        // Remove spark after animation
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, fallDuration * 1000);
    }

    // Start/Stop sparks based on hero section visibility (optional, good for performance)
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (!sparksInterval && heroNameElement && heroContentElement) { // Check elements exist
                // Initial burst
                for(let i = 0; i < 5; i++) setTimeout(createSpark, Math.random() * 500);
                // Continuous sparks
                sparksInterval = setInterval(createSpark, 100 + Math.random() * 200); // Every 100-300ms
            }
        } else {
            clearInterval(sparksInterval);
            sparksInterval = null;
        }
    }, { threshold: 0.1 }); // Trigger when 10% of hero is visible

    if (heroSection) { // Only observe if hero section exists
        heroObserver.observe(heroSection);
    }


    // --- Typewriter and Neon Flow Effect for About Me Section ---
    const aboutParagraphs = document.querySelectorAll('#about .about-text p');
    const textsToType = [];

    if (aboutParagraphs.length > 0) {
        aboutParagraphs.forEach(p => {
            textsToType.push(p.textContent || "");
            p.innerHTML = '';
        });
    }

    const typingSpeed = 15;
    const neonFlowDelay = 8;
// ... (rest of your script.js) ...

    // --- Typewriter and Neon Flow Effect for About Me Section ---
    // ... (aboutParagraphs, textsToType, typingSpeed, neonFlowDelay definitions) ...

    async function typeAndNeonFlow(element, text, charNeonColorVar = '--neon-primary', activeFlowNeonColorVar = '--neon-secondary') {
        if (!text) return;

        // Split by spaces, but keep the spaces. This regex splits by one or more spaces.
        const wordsAndSpaces = text.split(/(\s+)/); // e.g., "Hello world" -> ["Hello", " ", "world"]

        for (const part of wordsAndSpaces) {
            if (part.match(/^\s+$/)) { // If the part is purely whitespace
                const spaceSpan = document.createElement('span');
                // Use innerHTML for spaces in case of &nbsp; or multiple spaces
                spaceSpan.innerHTML = part;
                spaceSpan.style.opacity = '1'; // Make spaces immediately visible
                element.appendChild(spaceSpan);
            } else if (part.length > 0) { // If the part is an actual word (not empty string from split)
                // Create a wrapper for the word that prevents internal line breaks
                const wordWrapper = document.createElement('span');
                wordWrapper.classList.add('word-wrapper');
                element.appendChild(wordWrapper); // Append word wrapper to the main paragraph element

                // Now, type characters within this word wrapper
                for (let i = 0; i < part.length; i++) {
                    const char = part[i];
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.classList.add('typed-char-neon');
                    charSpan.style.setProperty('--neon-primary-override', `var(${charNeonColorVar})`);
                    charSpan.style.setProperty('--neon-secondary-override', `var(${activeFlowNeonColorVar})`);
                    
                    wordWrapper.appendChild(charSpan); // Append char span to the wordWrapper

                    // Delay for typing speed
                    await new Promise(resolve => setTimeout(resolve, typingSpeed));
                    charSpan.style.opacity = '1'; // Make character visible

                    // Apply and remove active flow
                    charSpan.classList.add('active-flow');
                    await new Promise(resolve => setTimeout(resolve, neonFlowDelay));
                    charSpan.classList.remove('active-flow');
                }
            }
        }
    }

    // ... (IntersectionObserver logic for #about section calling typeAndNeonFlow) ...

// ... (rest of your script.js) ...
    const aboutSection = document.getElementById('about');
    let aboutAnimationStarted = false;

    if (aboutSection && aboutParagraphs.length > 0) {
        const aboutObserver = new IntersectionObserver(async (entries) => { // Renamed observer
            if (entries[0].isIntersecting && !aboutAnimationStarted) {
                aboutAnimationStarted = true;
                aboutObserver.unobserve(aboutSection);

                if (textsToType.length > 0 && textsToType[0]) {
                    await typeAndNeonFlow(aboutParagraphs[0], textsToType[0], '--neon-primary', '--neon-accent');
                }
                if (textsToType.length > 1 && textsToType[1] && aboutParagraphs.length > 1) {
                    // MODIFICATION FOR PARAGRAPH 2 COLOR:
                    // Make the base character neon blue (neon-primary) and active flow white or another blue.
                    // Let's use '--neon-primary' for the base characters, and white for the active flow.
                    await typeAndNeonFlow(aboutParagraphs[1], textsToType[1], '--neon-primary', '#FFFFFF');
                    // If you want the active flow to also be a blue (e.g., your accent blue):
                    // await typeAndNeonFlow(aboutParagraphs[1], textsToType[1], '--neon-primary', '--neon-accent');
                }
            }
        }, { threshold: 0.3 });
        aboutObserver.observe(aboutSection);
    }

}); // End DOMContentLoaded

// Keyframe for navLinkFade (existing code - ensure it's defined, ideally in CSS)
const styleSheet = document.styleSheets[0];
if (styleSheet) { /* ... (existing keyframe insertion logic) ... */ }
else { console.warn("Stylesheet not found..."); }