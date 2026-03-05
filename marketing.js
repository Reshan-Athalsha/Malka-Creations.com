/* ═══════════════════════════════════════════════
   මල්කා — MARKETING & GROWTH ENGINE
   GA4, Facebook Pixel,
   First-visit discount, Social proof,
   Referral program, Instagram feed
   ═══════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ─────────────────────────────────────────────
       1. GOOGLE ANALYTICS (GA4)
       Replace G-XXXXXXXXXX with your real GA4 Measurement ID.
       Get it from: https://analytics.google.com → Admin → Data Streams → Measurement ID
       ───────────────────────────────────────────── */
    const GA4_ID = 'G-XXXXXXXXXX'; // ← REPLACE WITH YOUR GA4 ID

    function loadGA4() {
        if (GA4_ID === 'G-XXXXXXXXXX') return; // Skip placeholder
        if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) return;
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA4_ID, {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        });
    }

    /* ─────────────────────────────────────────────
       2. FACEBOOK PIXEL
       Replace YOUR_PIXEL_ID with your real Pixel ID.
       Get it from: https://business.facebook.com → Events Manager → Pixel ID
       ───────────────────────────────────────────── */
    const FB_PIXEL_ID = 'YOUR_PIXEL_ID'; // ← REPLACE WITH YOUR FACEBOOK PIXEL ID

    function loadFBPixel() {
        if (FB_PIXEL_ID === 'YOUR_PIXEL_ID') return; // Skip placeholder
        if (window.fbq) return;
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', FB_PIXEL_ID);
        window.fbq('track', 'PageView');
    }

    /* ─────────────────────────────────────────────
       3. COOKIE CONSENT LISTENER
       Loads GA4 / FB Pixel only after user consent
       ───────────────────────────────────────────── */
    function checkAndLoadTracking() {
        try {
            var prefs = JSON.parse(localStorage.getItem('malka_cookie_preferences'));
            if (prefs && prefs.analytics) loadGA4();
            if (prefs && prefs.marketing) loadFBPixel();
        } catch (e) { /* no prefs yet */ }
    }

    // Listen for cookie consent changes
    window.addEventListener('cookiePrefsChanged', function (e) {
        if (e.detail.analytics) loadGA4();
        if (e.detail.marketing) loadFBPixel();
    });

    // Check on load
    checkAndLoadTracking();

    /* ─────────────────────────────────────────────
       4. FIRST-TIME VISITOR DISCOUNT POPUP
       "10% off with code MALKA10"
       ───────────────────────────────────────────── */
    function initFirstVisitPopup() {
        if (localStorage.getItem('malka_promo_seen')) return;

        var html =
            '<div class="promo-overlay" id="promo-overlay">' +
            '<div class="promo-popup">' +
            '<button class="promo-close" id="promo-close" aria-label="Close">&times;</button>' +
            '<div class="promo-emoji">🌺</div>' +
            '<div class="promo-title">Welcome to the Malka family!</div>' +
            '<p class="promo-subtitle">As a first-time visitor, enjoy an exclusive discount on your very first order.</p>' +
            '<div class="promo-code-wrap">' +
            '<div class="promo-code-label">Your discount code</div>' +
            '<div class="promo-code">MALKA10</div>' +
            '<button class="promo-code-copy" id="promo-code-copy">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
            'Copy code' +
            '</button>' +
            '</div>' +
            '<div class="promo-steps">' +
            '<div class="promo-step"><div class="promo-step-num">1</div><div class="promo-step-text">Browse our plants & creations</div></div>' +
            '<div class="promo-step"><div class="promo-step-num">2</div><div class="promo-step-text">Message us on WhatsApp</div></div>' +
            '<div class="promo-step"><div class="promo-step-num">3</div><div class="promo-step-text">Send code <strong>MALKA10</strong> for 10% off</div></div>' +
            '</div>' +
            '<a href="https://wa.me/94705845678?text=Hi!%20I\'d%20like%20to%20use%20my%20code%20MALKA10%20for%2010%25%20off%20my%20first%20order.%20Thank%20you!" ' +
            'target="_blank" rel="noopener" class="promo-wa-btn">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>' +
            'Claim on WhatsApp' +
            '</a>' +
            '<br><button class="promo-dismiss" id="promo-dismiss">No thanks, maybe later</button>' +
            '</div>' +
            '</div>';

        document.body.insertAdjacentHTML('beforeend', html);

        var overlay = document.getElementById('promo-overlay');
        var closeBtn = document.getElementById('promo-close');
        var dismissBtn = document.getElementById('promo-dismiss');
        var copyBtn = document.getElementById('promo-code-copy');
        var shown = false;

        function showPopup() {
            if (shown) return;
            shown = true;
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }

        function hidePopup() {
            overlay.classList.remove('visible');
            document.body.style.overflow = '';
            localStorage.setItem('malka_promo_seen', '1');
        }

        if (closeBtn) closeBtn.addEventListener('click', hidePopup);
        if (dismissBtn) dismissBtn.addEventListener('click', hidePopup);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hidePopup();
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText('MALKA10').then(function () {
                    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m20 6-11 11-5-5"/></svg> Copied!';
                    setTimeout(function () {
                        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy code';
                    }, 2000);
                });
            });
        }

        // Trigger: after 15s or on 50% scroll, whichever comes first
        setTimeout(showPopup, 15000);

        var scrollTriggered = false;
        window.addEventListener('scroll', function () {
            if (scrollTriggered) return;
            var scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            if (scrollPct >= 0.5) {
                scrollTriggered = true;
                showPopup();
            }
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────
       6. SOCIAL PROOF POPUP
       "Nethmi from Colombo just ordered a Blooming Anthurium"
       ───────────────────────────────────────────── */
    function initSocialProof() {
        var names = [
            'Nethmi', 'Kasun', 'Dinusha', 'Chamara', 'Sanduni',
            'Tharushi', 'Nuwan', 'Sachini', 'Ravindu', 'Dilini',
            'Amaya', 'Ishara', 'Harini', 'Supun', 'Madushi',
            'Kavinda', 'Hiruni', 'Rashmi', 'Dulanga', 'Piumini'
        ];
        var cities = [
            'Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara',
            'Nugegoda', 'Dehiwala', 'Maharagama', 'Kaduwela', 'Ratnapura',
            'Kurunegala', 'Battaramulla', 'Piliyandala', 'Kottawa', 'Homagama'
        ];
        var products = [
            { name: 'Blooming Anthurium', img: 'assets/opt/f1.webp' },
            { name: 'Rose Garden Planter', img: 'assets/opt/f2.webp' },
            { name: 'Orchid Blush', img: 'assets/opt/f3.webp' },
            { name: 'Jasmine Dream', img: 'assets/opt/f4.webp' },
            { name: 'Heritage Hibiscus', img: 'assets/opt/f5.webp' },
            { name: 'Spring Garden', img: 'assets/opt/f6.webp' },
            { name: 'Sunset Frangipani', img: 'assets/opt/f7.webp' },
            { name: 'Royal Marigold', img: 'assets/opt/f8.webp' },
            { name: 'Crown Succulent', img: 'assets/opt/f10.webp' },
            { name: 'Emerald Fern', img: 'assets/opt/f11.webp' },
            { name: 'Tropical Palm', img: 'assets/opt/f13.webp' },
            { name: 'Golden Orchid', img: 'assets/opt/f14.webp' }
        ];
        var actions = ['just ordered', 'just purchased', 'is viewing', 'added to wishlist'];
        var times = ['just now', '2 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago'];

        // Inject container
        var container = document.createElement('div');
        container.className = 'social-proof';
        container.id = 'social-proof';
        container.innerHTML = '<div class="social-proof-card">' +
            '<button class="social-proof-close" id="sp-close" aria-label="Close">&times;</button>' +
            '<img class="social-proof-img" id="sp-img" src="" alt="">' +
            '<div class="social-proof-text">' +
            '<div class="social-proof-msg" id="sp-msg"></div>' +
            '<div class="social-proof-time" id="sp-time"></div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(container);

        var el = document.getElementById('social-proof');
        var imgEl = document.getElementById('sp-img');
        var msgEl = document.getElementById('sp-msg');
        var timeEl = document.getElementById('sp-time');
        var closeBtn = document.getElementById('sp-close');
        var paused = false;

        function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

        function showProof() {
            if (paused) return;
            var person = rand(names);
            var city = rand(cities);
            var product = rand(products);
            var action = rand(actions);
            var time = rand(times);

            imgEl.src = product.img;
            imgEl.alt = product.name;
            msgEl.innerHTML = '<strong>' + person + '</strong> from ' + city + ' ' + action + ' <strong>' + product.name + '</strong>';
            timeEl.textContent = time;

            el.classList.add('visible');

            // Auto-hide after 6s
            setTimeout(function () {
                el.classList.remove('visible');
            }, 6000);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                el.classList.remove('visible');
                paused = true;
                // Resume after 60s
                setTimeout(function () { paused = false; }, 60000);
            });
        }

        // Start showing after 20s, then every 25-40s
        setTimeout(function () {
            showProof();
            setInterval(function () {
                var delay = Math.floor(Math.random() * 15000) + 25000; // 25-40s
                setTimeout(showProof, delay);
            }, 35000);
        }, 20000);
    }

    /* ─────────────────────────────────────────────
       7. REFERRAL PROGRAM
       "Share with a friend, both get Rs. 200 off"
       ───────────────────────────────────────────── */
    function initReferralProgram() {
        // Generate or retrieve referral code
        var code = localStorage.getItem('malka_referral_code');
        if (!code) {
            code = 'MALKA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem('malka_referral_code', code);
        }
        var referralLink = 'https://www.malka-creations.lk/?ref=' + code;

        var html =
            '<div class="referral-overlay" id="referral-overlay">' +
            '<div class="referral-modal">' +
            '<button class="referral-close" id="referral-close" aria-label="Close">&times;</button>' +
            '<div class="referral-icon">🎁</div>' +
            '<div class="referral-title">Give Rs. 200, Get Rs. 200</div>' +
            '<p class="referral-desc">Share the love of plants! When your friend makes their first order using your link, you both get Rs. 200 off.</p>' +
            '<div class="referral-reward">' +
            '<div class="referral-reward-item">' +
            '<div class="referral-reward-emoji">💝</div>' +
            '<div class="referral-reward-label">Your Friend Gets</div>' +
            '<div class="referral-reward-value">Rs. 200 Off</div>' +
            '</div>' +
            '<div class="referral-reward-item">' +
            '<div class="referral-reward-emoji">🎉</div>' +
            '<div class="referral-reward-label">You Get</div>' +
            '<div class="referral-reward-value">Rs. 200 Off</div>' +
            '</div>' +
            '</div>' +
            '<div class="referral-link-wrap">' +
            '<input class="referral-link-input" id="referral-link" value="' + referralLink + '" readonly>' +
            '<button class="referral-copy-btn" id="referral-copy">Copy</button>' +
            '</div>' +
            '<div class="referral-share-row">' +
            '<a href="https://wa.me/?text=' + encodeURIComponent('🌿 Check out Malka Creations — beautiful flower plants in uniquely decorated pots! Use my link and we both get Rs. 200 off: ' + referralLink) + '" ' +
            'target="_blank" rel="noopener" class="referral-share-btn referral-share-wa">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>' +
            'WhatsApp' +
            '</a>' +
            '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(referralLink) + '" ' +
            'target="_blank" rel="noopener" class="referral-share-btn referral-share-fb">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' +
            'Facebook' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>';

        document.body.insertAdjacentHTML('beforeend', html);

        var overlay = document.getElementById('referral-overlay');
        var closeBtn = document.getElementById('referral-close');
        var copyBtn = document.getElementById('referral-copy');

        function openReferral() {
            overlay.classList.add('visible');
        }
        function closeReferral() {
            overlay.classList.remove('visible');
        }

        // Expose globally so buttons can call it
        window.openReferralProgram = openReferral;

        if (closeBtn) closeBtn.addEventListener('click', closeReferral);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeReferral();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) closeReferral();
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                var input = document.getElementById('referral-link');
                input.select();
                navigator.clipboard.writeText(input.value).then(function () {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(function () {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            });
        }

        // Add trigger buttons to page
        addReferralTriggers();
    }

    function addReferralTriggers() {
        // Add a referral button in CTA section
        var ctaActions = document.querySelector('.cta-actions');
        if (ctaActions && !ctaActions.querySelector('.referral-trigger')) {
            var btn = document.createElement('button');
            btn.className = 'referral-trigger';
            btn.innerHTML = '🎁 Refer a Friend — Both Get Rs. 200 Off';
            btn.addEventListener('click', function () {
                if (window.openReferralProgram) window.openReferralProgram();
            });
            ctaActions.appendChild(btn);
        }

        // Add referral link in footer
        var footCol = document.querySelectorAll('.foot-col');
        if (footCol.length >= 3) {
            var lastCol = footCol[footCol.length - 1];
            if (!lastCol.querySelector('.referral-footer-link')) {
                var link = document.createElement('a');
                link.href = '#';
                link.className = 'referral-footer-link';
                link.textContent = 'Refer a Friend 🎁';
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (window.openReferralProgram) window.openReferralProgram();
                });
                lastCol.appendChild(link);
            }
        }
    }

    /* ─────────────────────────────────────────────
       8. INSTAGRAM FEED SECTION
       Static grid linking to Instagram
       ───────────────────────────────────────────── */
    function initInstagramFeed() {
        var target = document.querySelector('.foot');
        if (!target) return;

        // Use existing product images as Instagram-style posts
        var posts = [
            { img: 'assets/opt/f1.webp', alt: 'Blooming Anthurium' },
            { img: 'assets/opt/f3.webp', alt: 'Orchid Blush' },
            { img: 'assets/opt/f12.webp', alt: 'Vintage Rose Art' },
            { img: 'assets/opt/f6.webp', alt: 'Spring Garden' },
            { img: 'assets/opt/f14.webp', alt: 'Golden Orchid' },
            { img: 'assets/opt/f4.webp', alt: 'Jasmine Dream' }
        ];

        var html =
            '<section class="insta-feed" id="instagram-feed">' +
            '<div class="container">' +
            '<div class="insta-feed-header">' +
            '<h2 class="insta-feed-title">' +
            '<svg viewBox="0 0 24 24">' +
            '<defs><linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">' +
            '<stop offset="0%" style="stop-color:#F77737"/>' +
            '<stop offset="50%" style="stop-color:#E1306C"/>' +
            '<stop offset="100%" style="stop-color:#833AB4"/>' +
            '</linearGradient></defs>' +
            '<rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="url(#insta-gradient)" stroke-width="2"/>' +
            '<circle cx="12" cy="12" r="4" fill="none" stroke="url(#insta-gradient)" stroke-width="2"/>' +
            '<circle cx="17.5" cy="6.5" r="1.2" fill="url(#insta-gradient)"/>' +
            '</svg>' +
            'Follow our journey' +
            '</h2>' +
            '<a href="https://www.instagram.com/malka_creations_lk/" target="_blank" rel="noopener" class="insta-feed-handle">' +
            '@malka_creations_lk' +
            '</a>' +
            '</div>' +
            '<div class="insta-feed-grid">' +
            posts.map(function (p) {
                return '<a href="https://www.instagram.com/malka_creations_lk/" target="_blank" rel="noopener" class="insta-feed-item">' +
                    '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy" decoding="async">' +
                    '<svg class="insta-hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
                    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
                    '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>' +
                    '<circle cx="17.5" cy="6.5" r="1.2"/>' +
                    '</svg>' +
                    '</a>';
            }).join('') +
            '</div>' +
            '<div class="insta-feed-cta">' +
            '<a href="https://www.instagram.com/malka_creations_lk/" target="_blank" rel="noopener">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">' +
            '<rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="17.5" cy="6.5" r="1.2"/>' +
            '</svg>' +
            'Follow us on Instagram' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</section>';

        target.insertAdjacentHTML('beforebegin', html);
    }

    /* ─────────────────────────────────────────────
       9. MAILCHIMP NEWSLETTER UPGRADE
       Wire the existing form to Mailchimp
       ───────────────────────────────────────────── */
    function initMailchimpNewsletter() {
        var form = document.getElementById('newsletter-form');
        if (!form) return;

        /*
         * ──────────────────────────────────────────
         * HOW TO SET UP MAILCHIMP (FREE TIER):
         * 1. Go to https://mailchimp.com and create a free account
         * 2. Create an Audience (Audience → All contacts → Create audience)
         * 3. Go to Audience → Signup forms → Embedded forms
         * 4. Copy the form action URL (looks like: https://xxxxx.us1.list-manage.com/subscribe/post?u=xxxxx&id=xxxxx)
         * 5. Replace the URL below with your form action URL
         * ──────────────────────────────────────────
         */
        var MAILCHIMP_URL = ''; // ← PASTE YOUR MAILCHIMP FORM ACTION URL HERE

        if (!MAILCHIMP_URL) return; // Keep localStorage fallback if no URL set

        // Override the form to submit to Mailchimp
        form.setAttribute('action', MAILCHIMP_URL);
        form.setAttribute('method', 'post');
        form.setAttribute('target', '_blank');

        // Mailchimp expects the email field to have name="EMAIL"
        var emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.setAttribute('name', 'EMAIL');
        }

        // Add hidden honeypot field (Mailchimp anti-spam)
        var honeypot = document.createElement('div');
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-5000px';
        honeypot.setAttribute('aria-hidden', 'true');
        honeypot.innerHTML = '<input type="text" name="b_PLACEHOLDER" tabindex="-1" value="">';
        form.appendChild(honeypot);
    }

    /* ─────────────────────────────────────────────
       INIT ALL MARKETING FEATURES
       ───────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        initFirstVisitPopup();
        initSocialProof();
        initReferralProgram();
        initInstagramFeed();
        initMailchimpNewsletter();
    });

})();
