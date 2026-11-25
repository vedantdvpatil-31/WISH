/**
 * ============================================================
 * IMMERSIVE 3D BIRTHDAY EXPERIENCE ENGINE
 * Crafted with love for Pranjal's 18th Birthday Website
 * ============================================================
 * Features:
 * 1. 3D World Canvas: Real-time perspective 3D particles, floating hearts & stars
 * 2. Mouse/Touch 3D Parallax & Tilt Controller
 * 3. 3D Cake Drag & Orbit Interaction
 * 4. Interactive Floating Iridescent Bubbles (click to pop into hearts!)
 * 5. Animal Friends Live Animation (blinking eyes, ear wiggles)
 * 6. Grand 3D Celebration Fireworks Engine
 * 7. Performance & Reduced-Motion Accessibility Guard
 */

(function () {
    'use strict';

    // Global Check: Reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       1. 3D WORLD CANVAS & PARTICLE ENGINE
       ============================================================ */
    class ThreeDWorld {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'three-d-world-canvas';
            this.ctx = this.canvas.getContext('2d');
            document.body.prepend(this.canvas);

            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.fov = 400; // 3D Field of view
            this.particles = [];
            this.fireworks = [];
            this.maxParticles = window.innerWidth < 768 ? 40 : 80;

            this.mouseX = 0;
            this.mouseY = 0;
            this.targetMouseX = 0;
            this.targetMouseY = 0;

            this.activeSection = 'section-1';
            this.isRunning = true;

            this.initParticles();
            this.bindEvents();
            this.animate();
        }

        initParticles() {
            this.particles = [];
            const types = ['star', 'heart', 'sparkle', 'orb'];
            const colors = ['#d4af37', '#ffd700', '#bf1d42', '#e2879b', '#fffdfa', '#ff9eb5'];

            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: (Math.random() - 0.5) * this.width * 1.6,
                    y: (Math.random() - 0.5) * this.height * 1.6,
                    z: Math.random() * 800 - 200,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: types[Math.floor(Math.random() * types.length)],
                    speedZ: Math.random() * 0.8 + 0.3,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.04,
                    pulse: Math.random() * Math.PI,
                    pulseSpeed: Math.random() * 0.05 + 0.02
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            }, { passive: true });

            window.addEventListener('mousemove', (e) => {
                this.targetMouseX = (e.clientX / this.width - 0.5) * 60;
                this.targetMouseY = (e.clientY / this.height - 0.5) * 60;
            }, { passive: true });

            document.addEventListener('visibilitychange', () => {
                this.isRunning = !document.hidden;
                if (this.isRunning) this.animate();
            });

            // Track active section for background atmospheric shift
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                        this.activeSection = entry.target.id;
                    }
                });
            }, { threshold: 0.4 });

            document.querySelectorAll('section.birthday-section').forEach(sec => observer.observe(sec));
        }

        createExplosion(x, y, color = '#ffd700', count = 25) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.fireworks.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    decay: Math.random() * 0.025 + 0.015,
                    color: color,
                    size: Math.random() * 3 + 2,
                    gravity: 0.08
                });
            }
        }

        launchFirework(x = Math.random() * this.width, y = Math.random() * (this.height * 0.6) + 100) {
            const palette = ['#d4af37', '#ff4d6d', '#ffd166', '#ff758f', '#ffffff', '#c9184a'];
            const chosenColor = palette[Math.floor(Math.random() * palette.length)];
            this.createExplosion(x, y, chosenColor, 45);
        }

        animate() {
            if (!this.isRunning || prefersReducedMotion) return;

            this.ctx.clearRect(0, 0, this.width, this.height);

            // Smooth mouse interpolation
            this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
            this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

            const cx = this.width / 2 + this.mouseX;
            const cy = this.height / 2 + this.mouseY;

            // Render & Update 3D Particles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                p.z -= p.speedZ;
                p.rotation += p.rotSpeed;
                p.pulse += p.pulseSpeed;

                // Loop particles back to distance
                if (p.z <= -this.fov + 20) {
                    p.z = 600;
                    p.x = (Math.random() - 0.5) * this.width * 1.6;
                    p.y = (Math.random() - 0.5) * this.height * 1.6;
                }

                // 3D Perspective Projection formula
                const scale = this.fov / (this.fov + p.z);
                const projX = cx + p.x * scale;
                const projY = cy + p.y * scale;

                if (projX < -50 || projX > this.width + 50 || projY < -50 || projY > this.height + 50) {
                    continue;
                }

                const size = Math.max(1, p.size * scale * (1 + Math.sin(p.pulse) * 0.2));
                const alpha = Math.min(0.85, Math.max(0.1, (1 - p.z / 600) * 0.8));

                this.ctx.save();
                this.ctx.translate(projX, projY);
                this.ctx.rotate(p.rotation);
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = p.color;

                if (p.type === 'heart') {
                    this.drawHeart(0, 0, size);
                } else if (p.type === 'star') {
                    this.drawStar(0, 0, 4, size, size * 0.4);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            }

            // Render Fireworks
            for (let i = this.fireworks.length - 1; i >= 0; i--) {
                const f = this.fireworks[i];
                f.x += f.vx;
                f.y += f.vy;
                f.vy += f.gravity;
                f.vx *= 0.98;
                f.alpha -= f.decay;

                if (f.alpha <= 0) {
                    this.fireworks.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = f.alpha;
                this.ctx.fillStyle = f.color;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = f.color;
                this.ctx.beginPath();
                this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            requestAnimationFrame(() => this.animate());
        }

        drawHeart(x, y, size) {
            const r = size * 0.7;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + r * 0.3);
            this.ctx.bezierCurveTo(x, y, x - r, y, x - r, y - r * 0.7);
            this.ctx.bezierCurveTo(x - r, y - r * 1.3, x, y - r * 1.1, x, y - r * 0.5);
            this.ctx.bezierCurveTo(x, y - r * 1.1, x + r, y - r * 1.3, x + r, y - r * 0.7);
            this.ctx.bezierCurveTo(x + r, y, x, y, x, y + r * 0.3);
            this.ctx.fill();
        }

        drawStar(cx, cy, spikes, outerRadius, innerRadius) {
            let rot = (Math.PI / 2) * 3;
            let step = Math.PI / spikes;
            this.ctx.beginPath();
            this.ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                this.ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
                rot += step;
                this.ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
                rot += step;
            }
            this.ctx.lineTo(cx, cy - outerRadius);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    /* ============================================================
       2. INTERACTIVE 3D PARALLAX & TILT CONTROLLER
       ============================================================ */
    class ThreeDParallaxController {
        constructor() {
            if (prefersReducedMotion) return;
            this.tiltCards = [];
            this.init();
        }

        init() {
            // Target interactive 3D elements
            const selectors = [
                '.hero-title-container',
                '.invitation-card',
                '#cake-container',
                '#surprise-gift-box',
                '.last-surprise-card',
                '.letter-stationery'
            ];

            selectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) this.attachTilt(el, 14);
            });

            // Scrapbook polaroid cards tilt
            document.querySelectorAll('.scrapbook-card.polaroid').forEach(card => {
                this.attachTilt(card, 18);
            });

            // Re-apply tilt when scrapbook renders items
            const grid = document.getElementById('scrapbook-grid');
            if (grid) {
                const obs = new MutationObserver(() => {
                    grid.querySelectorAll('.scrapbook-card.polaroid').forEach(card => {
                        this.attachTilt(card, 18);
                    });
                });
                obs.observe(grid, { childList: true });
            }

            // Global subtle mouse parallax on decor elements
            window.addEventListener('mousemove', (e) => {
                const normX = (e.clientX / window.innerWidth - 0.5) * 2;
                const normY = (e.clientY / window.innerHeight - 0.5) * 2;

                document.querySelectorAll('.bday-decor-kit .decor-item').forEach((item, idx) => {
                    const depth = (idx % 3 + 1) * 6;
                    item.style.transform = `translate3d(${normX * depth}px, ${normY * depth}px, 0)`;
                });
            }, { passive: true });
        }

        attachTilt(element, maxTilt = 15) {
            let isHovered = false;

            element.addEventListener('mouseenter', () => {
                isHovered = true;
            });

            element.addEventListener('mousemove', (e) => {
                if (!isHovered) return;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const tiltX = ((y - centerY) / centerY) * -maxTilt;
                const tiltY = ((x - centerX) / centerX) * maxTilt;

                element.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(12px)`;
            });

            element.addEventListener('mouseleave', () => {
                isHovered = false;
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        }
    }

    /* ============================================================
       3. 3D CAKE ORBIT & DRAG-TO-SPIN INTERACTION
       ============================================================ */
    function init3DCakeDrag() {
        const cake = document.querySelector('.cake-assembly');
        if (!cake || prefersReducedMotion) return;

        let isDragging = false;
        let startX = 0;
        let currentRotY = 0;
        let targetRotY = 0;

        function updateRotation() {
            currentRotY += (targetRotY - currentRotY) * 0.1;
            cake.style.transform = `rotateY(${currentRotY.toFixed(2)}deg)`;
            requestAnimationFrame(updateRotation);
        }
        updateRotation();

        cake.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            startX = e.clientX;
            targetRotY += deltaX * 0.6;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        cake.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - startX;
            startX = e.touches[0].clientX;
            targetRotY += deltaX * 0.6;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    /* ============================================================
       4. INTERACTIVE 3D TRANSLUCENT RED HEART BUBBLES
       ============================================================ */
    function init3DBubbles(worldInstance) {
        if (prefersReducedMotion) return;

        const container = document.createElement('div');
        container.id = 'three-d-bubbles-container';
        document.body.appendChild(container);

        // Shades of red with high translucency so background remains completely visible
        const redShades = [
            {
                name: 'cherry',
                primary: '#c9184a',
                primaryOp: 0.28,
                secondary: '#7a0c23',
                secondaryOp: 0.38,
                highlight: '#ff758f',
                highlightOp: 0.48,
                stroke: 'rgba(255, 117, 143, 0.55)',
                burstColor: '#c9184a'
            },
            {
                name: 'ruby',
                primary: '#e63946',
                primaryOp: 0.25,
                secondary: '#9b111e',
                secondaryOp: 0.35,
                highlight: '#ff4d6d',
                highlightOp: 0.45,
                stroke: 'rgba(255, 77, 109, 0.5)',
                burstColor: '#e63946'
            },
            {
                name: 'crimsonRose',
                primary: '#bf1d42',
                primaryOp: 0.24,
                secondary: '#5c0619',
                secondaryOp: 0.36,
                highlight: '#ff8fa3',
                highlightOp: 0.5,
                stroke: 'rgba(255, 143, 163, 0.52)',
                burstColor: '#bf1d42'
            }
        ];

        let bubbleCount = 0;

        function spawnBubble() {
            if (document.hidden) return;
            const bubble = document.createElement('div');
            bubble.className = 'bday-3d-bubble';

            const theme = redShades[Math.floor(Math.random() * redShades.length)];
            const size = Math.random() * 26 + 36; // 36px to 62px
            const left = Math.random() * (window.innerWidth - size - 20) + 10;
            const duration = Math.random() * 5 + 11; // 11s to 16s
            const drift = (Math.random() - 0.5) * 70;
            const rot = (Math.random() - 0.5) * 20;
            const gradId = 'heartGrad_' + (bubbleCount++);

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size * 0.9}px`;
            bubble.style.left = `${left}px`;
            bubble.style.setProperty('--b-dur', `${duration}s`);
            bubble.style.setProperty('--b-drift', `${drift}px`);
            bubble.style.setProperty('--b-rot', `${rot}deg`);

            // Beautiful translucent 3D heart SVG in shades of red
            bubble.innerHTML = `
                <svg viewBox="0 0 100 90" fill="none" class="heart-bubble-svg" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="${gradId}" cx="35%" cy="30%" r="70%">
                            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7" />
                            <stop offset="25%" stop-color="${theme.highlight}" stop-opacity="${theme.highlightOp}" />
                            <stop offset="65%" stop-color="${theme.primary}" stop-opacity="${theme.primaryOp}" />
                            <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="${theme.secondaryOp}" />
                        </radialGradient>
                    </defs>
                    <!-- Translucent Glass Heart Body (Background clearly visible through it) -->
                    <path d="M50 84 C22 61 6 45 6 26 C6 12 16 4 29 4 C37 4 45 9 50 17 C55 9 63 4 71 4 C84 4 94 12 94 26 C94 45 78 61 50 84 Z" 
                          fill="url(#${gradId})" 
                          stroke="${theme.stroke}" 
                          stroke-width="1.3" />
                    <!-- Glossy 3D Glass Arc Highlight on Left Lobe -->
                    <path d="M22 11 C15 13 11 19 11 26 C11 33 15 41 23 49" 
                          stroke="rgba(255, 255, 255, 0.75)" 
                          stroke-width="2.2" 
                          stroke-linecap="round" 
                          fill="none" />
                    <!-- Shiny Specular Reflection Dot -->
                    <circle cx="28" cy="13" r="2.2" fill="rgba(255, 255, 255, 0.85)" />
                </svg>
            `;

            // Pop interaction
            bubble.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = bubble.getBoundingClientRect();
                bubble.classList.add('pop-burst');

                if (worldInstance) {
                    worldInstance.createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, theme.burstColor, 18);
                    worldInstance.createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffd700', 12);
                }

                setTimeout(() => {
                    bubble.remove();
                }, 350);
            });

            container.appendChild(bubble);

            // Auto cleanup after animation ends
            setTimeout(() => {
                if (bubble.parentNode) bubble.remove();
            }, duration * 1000);
        }

        // Spawn periodically
        setInterval(spawnBubble, 2400);
        for (let i = 0; i < 4; i++) {
            setTimeout(spawnBubble, i * 700);
        }
    }

    /* ============================================================
       5. ANIMAL FRIENDS EYE BLINKING & LIVELINESS
       ============================================================ */
    function initAnimalLiveliness() {
        if (prefersReducedMotion) return;

        // Periodic blink animation on SVG companion animals
        setInterval(() => {
            const eyes = document.querySelectorAll('.companion-animal circle[r="3.5"], .companion-animal circle[r="4"], .party-animal circle[r="4"], .party-animal circle[r="3.5"]');
            eyes.forEach(eye => {
                eye.style.transition = 'transform 0.12s ease';
                eye.style.transform = 'scaleY(0.1)';
                setTimeout(() => {
                    eye.style.transform = 'scaleY(1)';
                }, 140);
            });
        }, 3800);
    }

    /* ============================================================
       7. GRAND CELEBRATION FIREWORKS LAUNCHER
       ============================================================ */
    function initFireworksLauncher(worldInstance) {
        window.launch3DFireworks = function (x, y) {
            if (worldInstance) {
                worldInstance.launchFirework(x, y);
            }
        };

        // Attach to "Celebrate Again" in Section 7
        const replayBtn = document.getElementById('btn-replay-confetti');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        window.launch3DFireworks(
                            Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
                            Math.random() * window.innerHeight * 0.5 + 80
                        );
                    }, i * 350);
                }
            });
        }
    }

    /* ============================================================
       8. INITIALIZATION RUNNER
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        const world = new ThreeDWorld();
        new ThreeDParallaxController();
        init3DCakeDrag();
        init3DBubbles(world);
        initAnimalLiveliness();
        initFireworksLauncher(world);
    });

})();
