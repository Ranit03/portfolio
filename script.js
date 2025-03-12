// Toggle menu icon
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Scroll sections active link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Sticky navbar
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove toggle icon and navbar when clicking navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Dark light mode
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};

// Scroll reveal
ScrollReveal({ 
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .experience-container, .skills-box, .contact-container', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

// Typed JS
const typed = new Typed('.multiple-text', {
    strings: ['AI Training Specialist', 'Applied Sciences Expert', 'Technical Content Creator'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});
// Custom cursor effect
const cursor = document.querySelector('.cursor');
const cursorInner = document.querySelector('.cursor-inner');
let isStuck = false;
let mouseDown = false;

const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;

    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
        x: posx,
        y: posy
    };
};

// Mouse move animation
document.addEventListener('mousemove', (e) => {
    const mousePos = getMousePos(e);
    
    // Animate cursor
    cursor.style.transform = `translate3d(${mousePos.x - cursor.offsetWidth/2}px, ${mousePos.y - cursor.offsetHeight/2}px, 0)`;
    
    // Animate cursor inner
    cursorInner.style.transform = `translate3d(${mousePos.x - cursorInner.offsetWidth/2}px, ${mousePos.y - cursorInner.offsetHeight/2}px, 0)`;
});

// Add hover effect for interactive elements
document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate3d(${mousePos.x - cursor.offsetWidth/2}px, ${mousePos.y - cursor.offsetHeight/2}px, 0) scale(1.5)`;
        cursor.style.borderColor = 'rgba(117, 78, 249, 0.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate3d(${mousePos.x - cursor.offsetWidth/2}px, ${mousePos.y - cursor.offsetHeight/2}px, 0) scale(1)`;
        cursor.style.borderColor = 'var(--main-color)';
    });
});

// Mouse down effect
document.addEventListener('mousedown', () => {
    mouseDown = true;
    cursor.style.transform = `translate3d(${mousePos.x - cursor.offsetWidth/2}px, ${mousePos.y - cursor.offsetHeight/2}px, 0) scale(0.8)`;
    cursorInner.style.transform = `translate3d(${mousePos.x - cursorInner.offsetWidth/2}px, ${mousePos.y - cursorInner.offsetHeight/2}px, 0) scale(0.8)`;
});

document.addEventListener('mouseup', () => {
    mouseDown = false;
    cursor.style.transform = `translate3d(${mousePos.x - cursor.offsetWidth/2}px, ${mousePos.y - cursor.offsetHeight/2}px, 0) scale(1)`;
    cursorInner.style.transform = `translate3d(${mousePos.x - cursorInner.offsetWidth/2}px, ${mousePos.y - cursorInner.offsetHeight/2}px, 0) scale(1)`;
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
    cursorInner.style.display = 'none';
});

document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
    cursorInner.style.display = 'block';
});

// Disable cursor on touch devices
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorInner.style.display = 'none';
}
