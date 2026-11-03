// Interactive Constellation & Starfield Background Canvas
const canvas = document.getElementById('starCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let stars = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }

    let mouse = {
        x: null,
        y: null,
        radius: 140
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 1.6 + 0.6;
            this.baseAlpha = Math.random() * 0.6 + 0.3;
            this.alpha = this.baseAlpha;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Twinkle
            this.alpha = this.baseAlpha + Math.sin(Date.now() * this.pulseSpeed) * 0.25;
            if (this.alpha < 0.1) this.alpha = 0.1;

            // Wrap around edges smoothly
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse proximity interaction (repulsion)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distanceSq = dx * dx + dy * dy;
                const maxDistSq = mouse.radius * mouse.radius;

                if (distanceSq < maxDistSq && distanceSq > 0) {
                    const distance = Math.sqrt(distanceSq);
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2.2;
                    this.y -= Math.sin(angle) * force * 2.2;
                }
            }
        }

        draw(isLightMode) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = isLightMode
                ? `rgba(117, 78, 249, ${this.alpha * 0.7})`
                : `rgba(220, 230, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    function initStars() {
        stars = [];
        // Calculate star density based on screen width
        const density = Math.min(110, Math.max(45, Math.floor(window.innerWidth / 16)));
        for (let i = 0; i < density; i++) {
            stars.push(new Star());
        }
    }

    function drawConnections(isLightMode) {
        const maxDist = 120;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const distance = Math.sqrt(distSq);
                    const opacity = (1 - distance / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);

                    if (isLightMode) {
                        ctx.strokeStyle = `rgba(121, 82, 245, ${opacity * 0.22})`;
                    } else {
                        ctx.strokeStyle = `rgba(125, 145, 255, ${opacity * 0.22})`;
                    }
                    ctx.lineWidth = opacity * 1.2;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        const isLightMode = document.body.classList.contains('light-mode');
        
        // Clear canvas with subtle trail
        if (isLightMode) {
            ctx.fillStyle = 'rgba(244, 246, 251, 0.4)';
        } else {
            ctx.fillStyle = 'rgba(9, 13, 22, 0.35)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.update();
            star.draw(isLightMode);
        });

        drawConnections(isLightMode);

        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}
