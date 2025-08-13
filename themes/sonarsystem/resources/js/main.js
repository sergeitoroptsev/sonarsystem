import {gsap} from "gsap";

import {ScrollTrigger} from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import {ScrollSmoother} from "gsap/ScrollSmoother";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {SplitText} from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

import 'fslightbox';

function initAnimations() {
    // Scroll To

    const anchors = document.querySelectorAll('a[href]');

    function getSamePageAnchor(link) {
        return (link.protocol === location.protocol &&
            link.host === location.host &&
            link.pathname === location.pathname &&
            link.search === location.search)
            ? link.hash
            : null;
    }

    function scrollToHash(hash, e) {
        if (!hash) {
            return;
        }
        const el = document.querySelector(hash);
        if (!el) {
            return;
        }
        if (e) {
            e.preventDefault();
        }
        gsap.to(window, {scrollTo: {y: el, offsetY: 40}});
    }

    anchors.forEach(
        a =>
            a.addEventListener(
                'click',
                e =>
                    scrollToHash(getSamePageAnchor(a), e)
            )
    );

    scrollToHash(location.hash);

// Custom Cursor

    let isTouchDevice = checkIfTouchDevice();
    let cursorFollowerCreated = false;
    let $cursorFollower = null;

    function checkIfTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    function createCursorFollower() {
        $cursorFollower = document.querySelector('.cursor-follower');

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
    }

    function destroyCursorFollower() {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);

        if ($cursorFollower) {
            gsap.to($cursorFollower, {opacity: 0, duration: 0.3});
        }
    }

    function onMouseMove(e) {
        const {target, x, y} = e;
        const isTargetLinkOrBtn = target?.closest('a') || target?.closest('button');

        gsap.to($cursorFollower, {
            x: x + 3,
            y: y + 3,
            duration: 0.7,
            ease: 'power4',
            opacity: isTargetLinkOrBtn ? 0.6 : 1,
            scale: isTargetLinkOrBtn ? 2 : 1
        });
    }

    function onMouseLeave() {
        gsap.to($cursorFollower, {
            duration: 0.7,
            opacity: 0
        });
    }

// Debounced resize check
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newIsTouch = checkIfTouchDevice();

            if (newIsTouch !== isTouchDevice) {
                isTouchDevice = newIsTouch;

                if (!isTouchDevice && !cursorFollowerCreated) {
                    createCursorFollower();
                    cursorFollowerCreated = true;
                } else if (isTouchDevice && cursorFollowerCreated) {
                    destroyCursorFollower();
                    cursorFollowerCreated = false;
                }
            }
        }, 300); // 300ms debounce
    });

// Initial load
    if (!isTouchDevice) {
        createCursorFollower();
        cursorFollowerCreated = true;
    }

// Start Scroll Trigger Animations

    const heroTitles = document.querySelectorAll(".hero-title-animation");

    heroTitles.forEach(heroTitle => {

        document.fonts.ready.then(() => {
            const split = new SplitText(heroTitle, {type: "lines"});
            const lines = split.lines;

            // clear out the original content
            heroTitle.innerHTML = "";

            // wrap each line in the mask → inner structure
            lines.forEach(lineEl => {
                const mask = document.createElement("div");
                mask.className = "mask";

                const inner = document.createElement("div");
                inner.className = "line-inner";
                inner.textContent = lineEl.textContent;

                mask.appendChild(inner);
                heroTitle.appendChild(mask);
            });

            // animate all the .line-inner children we just made
            gsap.from(
                heroTitle.querySelectorAll(".mask .line-inner"),
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.25      // line2 will start .25s after line1
                }
            );
        })
    });

    const titles = document.querySelectorAll(".title-animation");

    titles.forEach(title => {

        document.fonts.ready.then(() => {
            const split = new SplitText(title, {type: "lines"});
            const lines = split.lines;

            // clear out the original content
            title.innerHTML = "";

            // wrap each line in the mask → inner structure
            lines.forEach(lineEl => {
                const mask = document.createElement("div");
                mask.className = "mask";

                const inner = document.createElement("div");
                inner.className = "line-inner";
                inner.textContent = lineEl.textContent;

                mask.appendChild(inner);
                title.appendChild(mask);
            });

            // animate all the .line-inner children we just made
            gsap.from(
                title.querySelectorAll(".mask .line-inner"),
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: title,
                        start: "top 90%",
                        toggleActions: "play none play",
                        once: true
                    }
                }
            );
        })
    });
}

document.addEventListener('page:load', () => {
    initAnimations()
})

