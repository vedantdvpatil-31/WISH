/**
 * Interactive Cake-Cutting Ceremony Logic
 * Section 3: Let's Cut the Cake!
 * Features:
 * - 18 lit candles with individual animated flames
 * - "Make a Wish" step: blows out flames with rising smoke effect
 * - Knife cutting animation: ceremonial blade slices through top tier
 * - Slice vanishes onto plate with sparkle effect
 * - Massive confetti shower & birthday poppers
 * - Celebratory "YAY! LET'S CELEBRATE!" modal banner
 * - Fully responsive for mobile taps & desktop clicks
 */

class BirthdayCakeCeremony {
    constructor() {
        this.step = 'initial'; // 'initial' -> 'wished' -> 'cut'
        this.candlesLit = true;
        this.cakeCut = false;

        this.init();
    }

    init() {
        this.cakeContainer = document.getElementById('cake-container');
        this.wishBtn = document.getElementById('btn-make-wish');
        this.cutBtn = document.getElementById('btn-cut-cake');
        this.nextBtn = document.getElementById('btn-cake-next');
        this.knife = document.getElementById('ceremonial-knife');
        this.cakeSlice = document.getElementById('cake-slice');
        this.cakeMessage = document.getElementById('cake-status-message');
        this.celebrationBanner = document.getElementById('cake-celebration-modal');

        if (this.wishBtn) {
            this.wishBtn.addEventListener('click', () => this.makeWish());
        }

        if (this.cutBtn) {
            this.cutBtn.addEventListener('click', () => this.cutCake());
        }

        // Also allow direct tap on the cake to cut when ready
        if (this.cakeContainer) {
            this.cakeContainer.addEventListener('click', () => {
                if (this.step === 'wished' && !this.cakeCut) {
                    this.cutCake();
                }
            });
        }
    }

    makeWish() {
        if (this.step !== 'initial') return;
        this.step = 'wishing';

        // Update button status
        if (this.wishBtn) {
            this.wishBtn.disabled = true;
            this.wishBtn.innerHTML = `<span>Blowing out 18 candles... 🌬️</span>`;
        }

        if (this.cakeMessage) {
            this.cakeMessage.innerHTML = `<span class="glow-text">Making your 18th wish... May all your dreams come true! ✨</span>`;
        }

        // Animate wind effect on candles
        const flames = document.querySelectorAll('.candle-flame');
        const smokes = document.querySelectorAll('.candle-smoke');

        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('blow-out');
            }, index * 45); // slight stagger for natural wind sweep
        });

        // Trigger rising smoke wisps
        setTimeout(() => {
            smokes.forEach((smoke, index) => {
                setTimeout(() => {
                    smoke.classList.add('smoke-rise');
                }, index * 40);
            });
        }, 300);

        // After candles are out, transition to Cutting state
        setTimeout(() => {
            this.step = 'wished';
            this.candlesLit = false;

            if (this.wishBtn) {
                this.wishBtn.style.display = 'none';
            }

            if (this.cutBtn) {
                this.cutBtn.style.display = 'inline-flex';
                this.cutBtn.classList.add('pulse-glow');
            }

            if (this.cakeMessage) {
                this.cakeMessage.innerHTML = `<span>Your wish is flying to the stars! 🌟 Now, tap the button or cake to cut it! 🍰</span>`;
            }

            // Reveal and float the ceremonial knife into position
            if (this.knife) {
                this.knife.classList.add('knife-ready');
            }

            // Gentle sparkle burst
            if (window.confetti) {
                const rect = this.cakeContainer.getBoundingClientRect();
                window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 30, 180, 10);
            }
        }, 1200);
    }

    cutCake() {
        if (this.step !== 'wished' || this.cakeCut) return;
        this.cakeCut = true;
        this.step = 'cut';

        if (this.cutBtn) {
            this.cutBtn.disabled = true;
            this.cutBtn.innerHTML = `<span>Cutting the cake... ✨</span>`;
        }

        // Animate Knife downward slice motion
        if (this.knife) {
            this.knife.classList.add('knife-cutting');
        }

        // Knife slices through cake
        setTimeout(() => {
            // Cake slice moves forward onto plate and then vanishes with sparkle
            if (this.cakeSlice) {
                this.cakeSlice.classList.add('slice-extract');

                setTimeout(() => {
                    this.cakeSlice.classList.add('slice-vanish');
                }, 900);
            }

            // Knife withdraws
            setTimeout(() => {
                if (this.knife) {
                    this.knife.classList.add('knife-done');
                }
            }, 800);

            // Trigger multi-cannon confetti & poppers immediately
            setTimeout(() => {
                if (window.confetti) {
                    window.confetti.celebrateGrand();
                }

                // Show celebratory banner
                if (this.celebrationBanner) {
                    this.celebrationBanner.classList.add('show-celebration');
                }

                if (this.cutBtn) {
                    this.cutBtn.style.display = 'none';
                }

                if (this.nextBtn) {
                    this.nextBtn.style.display = 'inline-flex';
                    this.nextBtn.classList.add('pulse-glow');
                }

                if (this.cakeMessage) {
                    this.cakeMessage.innerHTML = `<span class="celebration-title">🎉 YAY! LET'S CELEBRATE! HAPPY 18TH PRANJAL! 🎂🥳</span>`;
                }

                // Animals trigger celebratory bounce
                const animals = document.querySelectorAll('.party-animal');
                animals.forEach(animal => animal.classList.add('animal-party-jump'));
            }, 1200);

        }, 600);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cakeCeremony = new BirthdayCakeCeremony();
});
