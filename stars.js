const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
const numStars = 150; // Reduced number of stars
const maxDistance = 150; // Connection distance
const mouseRadius = 150; // Mouse interaction radius

let mouse = {
    x: undefined,
    y: undefined
};

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3; // Slower movement
        this.vy = (Math.random() - 0.5) * 0.3; // Slower movement
        this.radius = Math.random() * 1.5 + 0.5; // Slightly larger stars
    }

    update() {
        // Move stars
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouseRadius) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * 0.5;
                this.y -= Math.sin(angle) * 0.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
}

// Create stars
for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

function drawLines() {
    stars.forEach((star1, i) => {
        stars.slice(i + 1).forEach(star2 => {
            const dx = star1.x - star2.x;
            const dy = star1.y - star2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                // Calculate line opacity based on distance
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(117, 78, 249, ${opacity * 0.5})`; // Using your main color
                ctx.lineWidth = opacity * 2;
                ctx.beginPath();
                ctx.moveTo(star1.x, star1.y);
                ctx.lineTo(star2.x, star2.y);
                ctx.stroke();
            }
        });
    });
}

function animate() {
    ctx.fillStyle = 'rgba(13, 17, 23, 0.3)'; // More transparent background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
}

animate();
