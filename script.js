/* ==========================================================================
   Ranit Nandi - Portfolio Interactive Scripts
   Awwwards & Obys Agency Inspired Interaction Engine
   Lenis Smooth Scroll & GSAP ScrollTrigger Kinetic Typography & 3D Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------- 1. Lenis Smooth Momentum Scroll Engine ----------------
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.8,
            infinite: false
        });

        // Sync Lenis with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    // ---------------- 2. Obys Architectural Grid Overlay Toggle ----------------
    const gridToggleBtn = document.getElementById('grid-toggle');
    const gridOverlay = document.getElementById('grid-overlay');

    if (gridToggleBtn && gridOverlay) {
        // Saved state or default to ON
        const savedGridState = localStorage.getItem('portfolio-grid-overlay');
        if (savedGridState === 'off') {
            gridOverlay.classList.add('grid-hidden');
            gridToggleBtn.classList.remove('active');
            const stateSpan = gridToggleBtn.querySelector('.grid-state');
            if (stateSpan) stateSpan.textContent = 'OFF';
        }

        gridToggleBtn.addEventListener('click', () => {
            gridOverlay.classList.toggle('grid-hidden');
            const isHidden = gridOverlay.classList.contains('grid-hidden');
            gridToggleBtn.classList.toggle('active', !isHidden);
            
            const stateSpan = gridToggleBtn.querySelector('.grid-state');
            if (stateSpan) {
                stateSpan.textContent = isHidden ? 'OFF' : 'ON';
            }

            localStorage.setItem('portfolio-grid-overlay', isHidden ? 'off' : 'on');
            showToast(isHidden ? 'Architectural Grid: OFF' : 'Architectural Grid: ON');
        });
    }

    // ---------------- 3. Theme Toggle (Dark / Light) ----------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.classList.replace('bx-moon', 'bx-sun');
    }

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            if (isLight) {
                themeIcon.classList.replace('bx-moon', 'bx-sun');
                localStorage.setItem('portfolio-theme', 'light');
                showToast('Switched to Light Editorial Theme');
            } else {
                themeIcon.classList.replace('bx-sun', 'bx-moon');
                localStorage.setItem('portfolio-theme', 'dark');
                showToast('Switched to Dark Editorial Theme');
            }

            // Refresh ScrollTrigger calculations
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    }

    // ---------------- 4. Mobile Menu Navigation ----------------
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');

                // Smooth scroll via Lenis if available
                const targetId = link.getAttribute('href');
                if (lenis && targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, { offset: -70 });
                    }
                }
            });
        });
    }

    // ---------------- 5. Sticky Header & Active Nav Tracking ----------------
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle('sticky', scrollY > 70);
        }

        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 180;
            const sectionHeight = sec.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ---------------- 6. Typed.js Subtitle Animation ----------------
    const typedTarget = document.querySelector('.typed-text');
    if (typedTarget && typeof Typed !== 'undefined') {
        new Typed('.typed-text', {
            strings: [
                'AGENTIC AI &amp; RAG WORKFLOWS',
                'LLM EVALUATION &amp; RLHF / SFT',
                'PADDLEOCR &amp; DOCUMENT AUTOMATION',
                'DISTRIBUTED BACKEND SYSTEMS',
                'COMPETITIVE PROGRAMMING (CF EXPERT)'
            ],
            typeSpeed: 55,
            backSpeed: 35,
            backDelay: 1700,
            loop: true,
            cursorChar: '|'
        });
    }

    // ---------------- 7. Hero Visual Switcher (Animation vs Terminal) ----------------
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const visualPanels = document.querySelectorAll('.visual-panel');

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switcherBtns.forEach(b => b.classList.remove('active'));
            visualPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ---------------- 8. GSAP ScrollTrigger Kinetic Typography (Words Pop-Out) ----------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Auto-wrap words in headings if not already wrapped
        document.querySelectorAll('.kinetic-title').forEach(heading => {
            const existingWraps = heading.querySelectorAll('.word-wrap');
            if (existingWraps.length === 0) {
                const words = heading.innerText.trim().split(/\s+/);
                heading.innerHTML = words.map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`).join(' ');
            }
        });

        // Animate each heading's words popping out
        document.querySelectorAll('.kinetic-title').forEach(heading => {
            const inners = heading.querySelectorAll('.word-inner');
            if (inners.length > 0) {
                gsap.fromTo(inners, 
                    {
                        yPercent: 120,
                        rotateZ: 6,
                        opacity: 0
                    },
                    {
                        yPercent: 0,
                        rotateZ: 0,
                        opacity: 1,
                        duration: 1.05,
                        ease: "power4.out",
                        stagger: 0.08,
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 88%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });

        // ---------------- 9. Cards "Pop-Out" on Scroll ----------------
        const popElements = [
            '.main-bio-card',
            '.pillar-card',
            '.timeline-content',
            '.project-card',
            '.skill-category-card',
            '.cp-card',
            '.achievement-card',
            '.edu-card',
            '.contact-card',
            '.contact-form-container'
        ];

        popElements.forEach(selector => {
            gsap.utils.toArray(selector).forEach((el, idx) => {
                gsap.fromTo(el,
                    {
                        scale: 0.90,
                        y: 75,
                        opacity: 0,
                        rotationX: 3
                    },
                    {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        duration: 1,
                        ease: "power3.out",
                        delay: (idx % 3) * 0.1,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });
        });

        // ---------------- 10. Watermark Parallax ----------------
        document.querySelectorAll('.section-watermark').forEach(wm => {
            gsap.to(wm, {
                y: 120,
                ease: "none",
                scrollTrigger: {
                    trigger: wm.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }
            });
        });

        // ---------------- 11. Subtle Parallax on Hero Visual ----------------
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            gsap.to(heroVisual, {
                y: 60,
                ease: "none",
                scrollTrigger: {
                    trigger: '#home',
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }
    }

    // ---------------- 12. 3D Tilt Card Interaction ([data-tilt]) ----------------
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6.5; // subtle tilt degrees
                const rotateY = ((x - centerX) / centerX) * 6.5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    // ---------------- 13. Obys Interactive Magnetic Cursor with Context Labels ----------------
    const cursor = document.querySelector('.cursor');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorLabel = document.querySelector('.cursor-label');

    if (cursor && cursorInner && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let innerX = mouseX;
        let innerY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.18;
            cursorY += (mouseY - cursorY) * 0.18;
            innerX += (mouseX - innerX) * 0.65;
            innerY += (mouseY - innerY) * 0.65;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Bind interactive elements with custom cursor labels
        document.querySelectorAll('[data-cursor]').forEach(el => {
            const labelText = el.getAttribute('data-cursor');
            el.addEventListener('mouseenter', () => {
                if (cursorLabel) cursorLabel.textContent = labelText;
                cursor.classList.add('has-label');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('has-label');
                if (cursorLabel) cursorLabel.textContent = '';
            });
        });

        // Hover effect for standard buttons/links without custom label
        document.querySelectorAll('a:not([data-cursor]), button:not([data-cursor]), input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '36px';
                cursor.style.height = '36px';
                cursor.style.borderColor = 'var(--accent-gold)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '24px';
                cursor.style.height = '24px';
                cursor.style.borderColor = 'var(--accent-gold)';
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorInner.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorInner.style.opacity = '1';
        });
    }

    // ---------------- 14. Skills Category Filter & Search ----------------
    const skillSearchInput = document.getElementById('skill-search');
    const clearSearchBtn = document.getElementById('clear-skill-search');
    const categoryTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-category-card');

    function filterSkills() {
        const searchTerm = (skillSearchInput ? skillSearchInput.value : '').trim().toLowerCase();
        const activeTab = document.querySelector('.skill-tab.active');
        const activeCategory = activeTab ? activeTab.dataset.category : 'all';

        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
        }

        skillCards.forEach(card => {
            const cardCategory = card.dataset.cat;
            const categoryMatches = (activeCategory === 'all' || cardCategory === activeCategory);

            if (!categoryMatches) {
                card.style.display = 'none';
                return;
            }

            if (!searchTerm) {
                card.style.display = 'block';
                card.querySelectorAll('.skill-chip').forEach(chip => {
                    chip.style.display = 'inline-block';
                });
                return;
            }

            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            let chipMatchCount = 0;

            card.querySelectorAll('.skill-chip').forEach(chip => {
                const text = chip.textContent.toLowerCase();
                if (text.includes(searchTerm) || cardTitle.includes(searchTerm)) {
                    chip.style.display = 'inline-block';
                    chipMatchCount++;
                } else {
                    chip.style.display = 'none';
                }
            });

            if (cardTitle.includes(searchTerm) || chipMatchCount > 0) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterSkills();
            });
        });
    }

    if (skillSearchInput) {
        skillSearchInput.addEventListener('input', filterSkills);
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            skillSearchInput.value = '';
            filterSkills();
            skillSearchInput.focus();
        });
    }

    // ---------------- 15. Copy to Clipboard Utility ----------------
    function copyText(text, label = 'Copied') {
        if (!navigator.clipboard) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(`${label} copied to clipboard!`);
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} copied to clipboard!`);
        }).catch(err => {
            console.error('Copy failed:', err);
            showToast('Failed to copy');
        });
    }

    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = el.getAttribute('data-copy');
            const label = el.textContent.trim().split(' ')[0] || 'Content';
            copyText(textToCopy, label);
        });
    });

    const copyTerminalBtn = document.getElementById('copy-terminal-btn');
    if (copyTerminalBtn) {
        copyTerminalBtn.addEventListener('click', () => {
            const codeBlock = document.querySelector('.terminal-card pre code');
            if (codeBlock) {
                copyText(codeBlock.innerText, 'Profile JSON');
            }
        });
    }

    // ---------------- 16. Toast Notifications ----------------
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // ---------------- 17. Contact Form Handling ----------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'form-status error';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>DISPATCHING...</span> <i class="bx bx-loader-alt bx-spin"></i>`;
            formStatus.textContent = '';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>MESSAGE DISPATCHED</span> <i class="bx bx-check"></i>`;
                formStatus.textContent = `Transmission confirmed, ${name}! Your inquiry has been dispatched to ranitnandi021@gmail.com.`;
                formStatus.className = 'form-status success';
                showToast('Inquiry dispatched successfully!');

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = `<span>DISPATCH MESSAGE</span> <i class="bx bx-send"></i>`;
                }, 4000);
            }, 1000);
        });
    }
});
