/**
 * High-Performance Self-Contained Confetti & Particle Engine
 * Custom created for Pranjal's 18th Birthday Celebration
 * Supports bursts, cannons, continuous gentle rain, floating hearts, and stars
 * Zero external dependencies!
 */

class BirthdayConfetti {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'birthday-confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        // Cherry red, wine, burgundy, champagne gold, and warm white palette
        this.colors = [
            '#7a0c23', // Classic Cherry Red
            '#5a071a', // Deep Wine Red
            '#8b112d', // Rich Crimson Cherry
            '#9e1536', // Vibrant Cherry
            '#4c0515', // Deep Burgundy Velvet
            '#d4af37', // Champagne Gold
            '#f3e5ab', // Shimmering Gold
            '#fffdfa', // Warm White
            '#b82245'  // Ruby Cherry
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    randomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    // Single burst from a specific coordinate (e.g. poppers or cake cut)
    burst(x, y, count = 70, spread = 360, velocity = 14) {
        const angleRad = (spread * Math.PI) / 180;
        for (let i = 0; i < count; i++) {
            const angle = this.randomRange(-angleRad / 2, angleRad / 2) - Math.PI / 2;
            const speed = this.randomRange(velocity * 0.4, velocity);
            const shape = Math.random() > 0.3 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'heart');

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed + this.randomRange(-2, 2),
                vy: Math.sin(angle) * speed + this.randomRange(-2, 2),
                size: this.randomRange(6, 12),
                color: this.randomColor(),
                rotation: this.randomRange(0, 360),
                rotationSpeed: this.randomRange(-10, 10),
                gravity: 0.28,
                drag: 0.96,
                opacity: 1,
                decay: this.randomRange(0.007, 0.015),
                shape: shape,
                wobble: this.randomRange(0, 10),
                wobbleSpeed: this.randomRange(0.05, 0.1)
            });
        }

        if (!this.animationId) {
            this.loop();
        }
    }

    // Multi-cannon explosion (used at Grand Welcome & Cake Cutting)
    celebrateGrand() {
        const w = this.width;
        const h = this.height;
        // Left Cannon
        this.burst(w * 0.1, h * 0.8, 80, 70, 22);
        // Right Cannon
        this.burst(w * 0.9, h * 0.8, 80, 70, 22);
        // Center Cannon
        setTimeout(() => {
            this.burst(w * 0.5, h * 0.6, 120, 140, 20);
        }, 300);
        // Left & Right delayed sparkles
        setTimeout(() => {
            this.burst(w * 0.25, h * 0.4, 60, 180, 16);
            this.burst(w * 0.75, h * 0.4, 60, 180, 16);
        }, 700);
    }

    // Shower of floating hearts (used in Letter & Hugs)
    showerHearts(count = 45) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.randomRange(this.width * 0.2, this.width * 0.8),
                y: this.height + 20,
                vx: this.randomRange(-2, 2),
                vy: this.randomRange(-7, -13),
                size: this.randomRange(12, 24),
                color: Math.random() > 0.4 ? '#8b112d' : '#5a071a',
                rotation: this.randomRange(-25, 25),
                rotationSpeed: this.randomRange(-2, 2),
                gravity: -0.05, // Float upwards
                drag: 0.99,
                opacity: 1,
                decay: this.randomRange(0.004, 0.009),
                shape: 'heart',
                wobble: this.randomRange(0, 10),
                wobbleSpeed: 0.05
            });
        }
        if (!this.animationId) {
            this.loop();
        }
    }

    drawHeart(ctx, x, y, size, color, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 15, size / 15);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10);
        ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, opacity) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;

            p.x += p.vx + Math.sin(p.wobble) * 0.8;
            p.y += p.vy;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.y > this.height + 50 || p.y < -100) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            if (p.shape === 'heart') {
                this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity);
            } else if (p.shape === 'circle') {
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Rectangle streamer / confetti ribbon
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
            }
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.loop());
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.animationId = null;
        }
    }
}

// Global instance ready to be used anywhere
window.confetti = new BirthdayConfetti();
