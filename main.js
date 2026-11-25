/**
 * Main Application Script for Pranjal's 18th Birthday Website
 * Handles:
 * - Scroll Progress Indicator & Chapter Navigator
 * - Section Scroll Observers & Ambient Confetti triggers
 * - Section 4: Mysterious Surprise Gift Box Unlocking
 * - Section 5: Digital Scrapbook Grid, Filtering, Lightbox with Touch/Keyboard navigation
 * - Video player handling & animated canvas memory reel fallback
 * - Section 6: Envelope Opening Ceremony
 * - Section 7: Letter animations, confetti celebration, and replay triggers
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initChapterNavigation();
    initSurpriseBox();
    initScrapbook();
    initEnvelopeAndLetter();
    initCelebrationTriggers();
    triggerEntranceCelebration();
});

/* ============================================================
   1. SCROLL PROGRESS & CHAPTER TRACKER
   ============================================================ */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / (scrollHeight || 1)) * 100;
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }, { passive: true });
}

function initChapterNavigation() {
    const sections = document.querySelectorAll('section.birthday-section');
    const navDots = document.querySelectorAll('.chapter-dot');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navDots.forEach(dot => {
                    if (dot.getAttribute('data-target') === sectionId) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });

                // Add in-view class for trigger animations
                entry.target.classList.add('section-in-view');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Smooth scroll for nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                if (targetId === 'section-1' && (window.scrollY || document.documentElement.scrollTop) > 300) {
                    setTimeout(() => {
                        triggerEntranceCelebration(true);
                    }, 500);
                }
            }
        });
    });

    // Smooth scroll for all anchor buttons with [data-scroll-to]
    document.querySelectorAll('[data-scroll-to]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-scroll-to');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ============================================================
   2. SECTION 1: GRAND ENTRANCE CELEBRATION (CHOREOGRAPHED SEQUENCE)
   Step 1 (0-2s): Background Reveal
   Step 2 (2-4s): Birthday Lights Progressive Illumination
   Step 3 (4-6s): Balloons Float In from Bottom/Sides
   Step 4 (6-8s): "HAPPY BIRTHDAY" Cinematic Reveal
   Step 5 (8-10s): "PRANJAL" Letter-by-Letter Staggered Reveal
   Step 6 (10-12s): Subtitle, Decorations, 18 Badge, 28 Nov Date & Confetti Shower
   Step 7 (12-14s): "LET'S CELEBRATE" Button Entrance & Final CTA
   ============================================================ */
let entranceConfettiTimer = null;
let entranceCompleteTimer = null;
let hasEntranceConfettiFired = false;

function triggerEntranceCelebration(isReplay = false) {
    const section1 = document.getElementById('section-1');
    const skipBtn = document.getElementById('btn-skip-intro');

    if (isReplay && section1) {
        // Reset state for replay
        section1.classList.remove('entrance-complete');
        // Force reflow to re-trigger CSS animations from 0s
        void section1.offsetWidth;
        hasEntranceConfettiFired = false;
    }

    if (entranceConfettiTimer) clearTimeout(entranceConfettiTimer);
    if (entranceCompleteTimer) clearTimeout(entranceCompleteTimer);

    // Skip Intro button handler
    if (skipBtn) {
        skipBtn.onclick = () => {
            completeEntranceSequence(true);
        };
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        completeEntranceSequence(false);
        return;
    }

    // Step 6: Gentle Confetti Shower triggered at 10.5 seconds (only after PRANJAL has fully assembled)
    entranceConfettiTimer = setTimeout(() => {
        if (!hasEntranceConfettiFired && window.confetti) {
            hasEntranceConfettiFired = true;
            window.confetti.burst(window.innerWidth * 0.22, window.innerHeight * 0.42, 45, 140, 16);
            window.confetti.burst(window.innerWidth * 0.78, window.innerHeight * 0.42, 45, 140, 16);
            setTimeout(() => {
                window.confetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.36, 75, 180, 18);
            }, 300);
        }
    }, 10500);

    // Step 7: Final completion at 13.8 seconds so all elements are permanently interactive
    entranceCompleteTimer = setTimeout(() => {
        completeEntranceSequence(false);
    }, 13800);

    // Interactive party poppers on Section 1
    const poppers = document.querySelectorAll('.popper-trigger');
    poppers.forEach(popper => {
        popper.onclick = (e) => {
            const rect = popper.getBoundingClientRect();
            if (window.confetti) {
                window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50, 120, 16);
            }
            popper.classList.add('pop-active');
            setTimeout(() => popper.classList.remove('pop-active'), 600);
        };
    });
}

function completeEntranceSequence(triggerConfettiNow = false) {
    const section1 = document.getElementById('section-1');
    if (section1) {
        section1.classList.add('entrance-complete');
    }
    if (triggerConfettiNow && !hasEntranceConfettiFired && window.confetti) {
        hasEntranceConfettiFired = true;
        window.confetti.celebrateGrand();
    }
}

/* ============================================================
   3. SECTION 4: MYSTERIOUS SURPRISE BOX
   ============================================================ */
function initSurpriseBox() {
    const giftBox = document.getElementById('surprise-gift-box');
    const openBtn = document.getElementById('btn-open-surprise');
    let isOpened = false;

    function openBox() {
        if (isOpened) return;
        isOpened = true;

        if (giftBox) {
            giftBox.classList.add('box-opening');
        }

        // Golden sparkles & heart burst
        if (window.confetti) {
            const rect = giftBox ? giftBox.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
            window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70, 360, 18);
        }

        // Smoothly guide user into Section 5 (The Memories)
        setTimeout(() => {
            const section5 = document.getElementById('section-5');
            if (section5) {
                section5.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1200);
    }

    if (giftBox) {
        giftBox.addEventListener('click', openBox);
    }
    if (openBtn) {
        openBtn.addEventListener('click', openBox);
    }
}

/* ============================================================
   4. SECTION 5: DIGITAL SCRAPBOOK & LIGHTBOX
   ============================================================ */
let currentMemoryIndex = 0;
let currentFilteredData = [];

function initScrapbook() {
    currentFilteredData = [...SCRAPBOOK_DATA];
    renderScrapbook(currentFilteredData);
    initScrapbookFilters();
    initLightbox();
}

function renderScrapbook(items) {
    const grid = document.getElementById('scrapbook-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="empty-scrapbook-msg">No memories found in this category yet! ✨</div>`;
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `scrapbook-card polaroid ${item.type === 'video' ? 'video-polaroid' : ''}`;
        card.style.transform = `rotate(${item.rotation || 0}deg)`;
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-index', index);

        // Polaroid tape sticker
        const stickerClass = item.sticker || 'tape-rose';

        card.innerHTML = `
            <div class="tape-sticker ${stickerClass}"></div>
            <div class="polaroid-img-wrapper">
                <img src="${item.type === 'video' ? item.poster : item.src}" alt="${item.title}" loading="lazy" class="polaroid-img">
                ${item.type === 'video' ? `
                    <div class="video-overlay-badge">
                        <span class="video-play-icon">▶</span>
                        <span class="video-duration">${item.duration || 'Video'}</span>
                    </div>
                ` : ''}
            </div>
            <div class="polaroid-caption-area">
                <p class="polaroid-caption">${item.caption || item.title}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            openLightbox(index);
        });

        grid.appendChild(card);
    });
}

function initScrapbookFilters() {
    const filterButtons = document.querySelectorAll('.filter-pill');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            if (category === 'all') {
                currentFilteredData = [...SCRAPBOOK_DATA];
            } else if (category === 'video') {
                currentFilteredData = SCRAPBOOK_DATA.filter(item => item.type === 'video');
            } else {
                currentFilteredData = SCRAPBOOK_DATA.filter(item => item.category === category);
            }

            renderScrapbook(currentFilteredData);
        });
    });
}

/* Lightbox Modal with Full-Screen Preview, Keyboard & Touch Swipe */
function initLightbox() {
    const modal = document.getElementById('scrapbook-lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevMemory);
    if (nextBtn) nextBtn.addEventListener('click', showNextMemory);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation (Arrow keys + Esc)
    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevMemory();
        if (e.key === 'ArrowRight') showNextMemory();
    });

    // Touch Swipe Navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const diffX = touchEndX - touchStartX;
        const threshold = 50; // min swipe distance in px
        if (diffX > threshold) {
            // Swiped right -> go to previous
            showPrevMemory();
        } else if (diffX < -threshold) {
            // Swiped left -> go to next
            showNextMemory();
        }
    }
}

function openLightbox(index) {
    const modal = document.getElementById('scrapbook-lightbox');
    if (!modal || !currentFilteredData[index]) return;

    currentMemoryIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling while viewing
}

function closeLightbox() {
    const modal = document.getElementById('scrapbook-lightbox');
    if (!modal) return;

    // Pause any active video
    const videoEl = modal.querySelector('video');
    if (videoEl) {
        videoEl.pause();
    }

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevMemory() {
    if (currentMemoryIndex > 0) {
        currentMemoryIndex--;
    } else {
        currentMemoryIndex = currentFilteredData.length - 1; // loop around
    }
    updateLightboxContent();
}

function showNextMemory() {
    if (currentMemoryIndex < currentFilteredData.length - 1) {
        currentMemoryIndex++;
    } else {
        currentMemoryIndex = 0; // loop around
    }
    updateLightboxContent();
}

function updateLightboxContent() {
    const modal = document.getElementById('scrapbook-lightbox');
    const item = currentFilteredData[currentMemoryIndex];
    if (!modal || !item) return;

    const mediaContainer = modal.querySelector('.lightbox-media-container');
    const titleEl = modal.querySelector('.lightbox-title');
    const captionEl = modal.querySelector('.lightbox-caption');
    const tagEl = modal.querySelector('.lightbox-tag');
    const dateEl = modal.querySelector('.lightbox-date');
    const counterEl = modal.querySelector('.lightbox-counter');

    if (counterEl) {
        counterEl.textContent = `Memory ${currentMemoryIndex + 1} of ${currentFilteredData.length}`;
    }
    if (titleEl) titleEl.textContent = item.title;
    if (captionEl) captionEl.textContent = item.caption;
    if (tagEl) tagEl.textContent = item.tag || item.categoryName;
    if (dateEl) dateEl.textContent = item.date;

    if (mediaContainer) {
        if (item.type === 'video') {
            // Render video card with native player & simulated fallback
            mediaContainer.innerHTML = `
                <div class="video-lightbox-player-wrapper">
                    <video id="active-memory-video" controls playsinline poster="${item.poster}" preload="metadata">
                        <source src="${item.src}" type="video/mp4">
                        Your browser does not support HTML5 video.
                    </video>
                    <div id="video-sim-overlay" class="video-sim-overlay" style="display: none;">
                        <canvas id="sim-video-canvas" width="640" height="360"></canvas>
                        <div class="sim-video-info">
                            <span class="sim-badge">🎬 Memory Reel Preview</span>
                            <p class="sim-hint">To view Pranjal's real video, drop <strong>${item.src}</strong> into the project folder!</p>
                            <button id="sim-replay-btn" class="btn-cherry-pill">▶ Play Animated Reel</button>
                        </div>
                    </div>
                </div>
            `;

            // Detect if placeholder is empty or fails to load, gracefully display the animated canvas reel
            const videoEl = document.getElementById('active-memory-video');
            const simOverlay = document.getElementById('video-sim-overlay');

            if (videoEl && simOverlay) {
                videoEl.addEventListener('error', () => {
                    videoEl.style.display = 'none';
                    simOverlay.style.display = 'flex';
                    startSimulatedVideoReel(item);
                });

                // Also check if source is empty or short
                videoEl.addEventListener('loadedmetadata', () => {
                    if (videoEl.duration === 0 || isNaN(videoEl.duration)) {
                        videoEl.style.display = 'none';
                        simOverlay.style.display = 'flex';
                        startSimulatedVideoReel(item);
                    }
                });

                // Replay button for simulated reel
                const replayBtn = document.getElementById('sim-replay-btn');
                if (replayBtn) {
                    replayBtn.addEventListener('click', () => startSimulatedVideoReel(item));
                }
            }
        } else {
            // Standard high-res image
            mediaContainer.innerHTML = `
                <div class="lightbox-img-frame">
                    <img src="${item.src}" alt="${item.title}" class="lightbox-img">
                </div>
            `;
        }
    }
}

/* Simulated Animated Memory Reel for placeholder videos */
let simAnimationId = null;
function startSimulatedVideoReel(item) {
    const canvas = document.getElementById('sim-video-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    let frame = 0;
    const sparkles = Array.from({ length: 30 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        alpha: Math.random()
    }));

    if (simAnimationId) cancelAnimationFrame(simAnimationId);

    function renderReel() {
        frame++;
        ctx.fillStyle = '#2c040d';
        ctx.fillRect(0, 0, w, h);

        // Film grain & stars
        sparkles.forEach(s => {
            s.y -= s.speed;
            if (s.y < 0) s.y = h;
            ctx.fillStyle = `rgba(212, 175, 55, ${0.4 + Math.sin(frame * 0.05 + s.x) * 0.4})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Vintage film border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, w - 40, h - 40);

        // Center card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(50, 50, w - 100, h - 100);

        // Title and heart
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(item.title, w / 2, h / 2 - 20);

        ctx.fillStyle = '#f3e5ab';
        ctx.font = 'italic 15px Georgia';
        ctx.fillText(`Recorded Memory: ${item.tag || 'Special Moment'}`, w / 2, h / 2 + 15);

        ctx.fillStyle = '#d4af37';
        ctx.font = '13px Consolas';
        ctx.fillText(`Duration: ${item.duration} • Frame: ${frame % 60}`, w / 2, h / 2 + 45);

        simAnimationId = requestAnimationFrame(renderReel);
    }
    renderReel();
}

/* ============================================================
   5. SECTION 6: ENVELOPE OPENING & TRANSITION TO LETTER
   ============================================================ */
function initEnvelopeAndLetter() {
    const envelope = document.getElementById('letter-envelope');
    const readBtn = document.getElementById('btn-open-letter');
    const section7 = document.getElementById('section-7');

    function openEnvelope() {
        if (envelope) {
            envelope.classList.add('envelope-unsealed');
        }

        if (window.confetti) {
            window.confetti.showerHearts(35);
        }

        setTimeout(() => {
            if (section7) {
                section7.scrollIntoView({ behavior: 'smooth' });
            }

            // Animate letter unfolding & progressive paragraph reveal
            const letterStationery = document.getElementById('letter-stationery');
            if (letterStationery) {
                letterStationery.classList.add('letter-unfolded');
            }

            const letterParas = document.querySelectorAll('.letter-para');
            letterParas.forEach((p, idx) => {
                setTimeout(() => {
                    p.classList.add('para-visible');
                }, idx * 700 + 400);
            });
        }, 1100);
    }

    if (envelope) envelope.addEventListener('click', openEnvelope);
    if (readBtn) readBtn.addEventListener('click', openEnvelope);
}

/* ============================================================
   6. CELEBRATION TRIGGERS: CONFETTI REPLAY, SCROLL TOP
   ============================================================ */
function initCelebrationTriggers() {
    const replayConfettiBtn = document.getElementById('btn-replay-confetti');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    if (replayConfettiBtn) {
        replayConfettiBtn.addEventListener('click', () => {
            if (window.confetti) {
                window.confetti.celebrateGrand();
            }
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Re-trigger the entrance reveal when visitor deliberately returns to the beginning
            setTimeout(() => {
                triggerEntranceCelebration(true);
            }, 600);
        });
    }
}
