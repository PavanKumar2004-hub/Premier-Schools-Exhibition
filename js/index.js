(function () {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function isReducedMotion() {
        return reducedMotionQuery.matches;
    }

    function stopFormNavigation() {
        const enquiryForms = document.querySelectorAll(".hero-form");

        enquiryForms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
            });
        });
    }

    function createSlideController(config) {
        const slider = config.slider;
        const slides = Array.from(config.slides || []);
        const dots = Array.from(config.dots || []);
        let activeIndex = 0;
        let touchStartX = 0;
        let autoplayId = null;
        let pausedByUser = false;

        if (!slider || !slides.length) {
            return null;
        }

        function getMaxIndex() {
            return typeof config.getMaxIndex === "function" ? config.getMaxIndex() : slides.length - 1;
        }

        function render() {
            const maxIndex = getMaxIndex();
            activeIndex = Math.min(activeIndex, maxIndex);

            slides.forEach(function (slide, index) {
                const active = index === activeIndex;

                if (config.hideInactive) {
                    slide.classList.toggle(config.activeClass, active);
                    slide.setAttribute("aria-hidden", active ? "false" : "true");
                }
            });

            dots.forEach(function (dot, index) {
                const active = index === activeIndex;
                dot.classList.toggle(config.dotActiveClass, active);
                dot.setAttribute("aria-current", active ? "true" : "false");
                dot.tabIndex = active ? 0 : -1;
            });

            if (typeof config.onRender === "function") {
                config.onRender(activeIndex, maxIndex);
            }
        }

        function goTo(index) {
            const maxIndex = getMaxIndex();
            activeIndex = (index + maxIndex + 1) % (maxIndex + 1);
            render();
        }

        function startAutoplay() {
            if (!config.autoplay || isReducedMotion() || autoplayId) {
                return;
            }

            autoplayId = window.setInterval(function () {
                if (!pausedByUser) {
                    goTo(activeIndex + 1);
                }
            }, config.autoplay);
        }

        function stopAutoplay() {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }

        function pause() {
            pausedByUser = true;
        }

        function resume() {
            pausedByUser = false;
        }

        if (config.prev) {
            config.prev.addEventListener("click", function () {
                goTo(activeIndex - 1);
            });
        }

        if (config.next) {
            config.next.addEventListener("click", function () {
                goTo(activeIndex + 1);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                goTo(Number(dot.dataset[config.dotDataset]));
            });
        });

        slider.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(activeIndex - 1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(activeIndex + 1);
            }
        });

        slider.addEventListener("touchstart", function (event) {
            touchStartX = event.changedTouches[0].clientX;
            pause();
        }, { passive: true });

        slider.addEventListener("touchend", function (event) {
            const deltaX = event.changedTouches[0].clientX - touchStartX;

            if (Math.abs(deltaX) > 40) {
                goTo(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
            }

            resume();
        }, { passive: true });

        slider.addEventListener("mouseenter", pause);
        slider.addEventListener("mouseleave", resume);
        slider.addEventListener("focusin", pause);
        slider.addEventListener("focusout", resume);

        if (reducedMotionQuery.addEventListener) {
            reducedMotionQuery.addEventListener("change", function () {
                if (isReducedMotion()) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
            });
        }

        render();
        startAutoplay();

        return {
            render: render,
            goTo: goTo
        };
    }

    function initHeroSlider() {
        createSlideController({
            slider: document.getElementById("heroSlider"),
            slides: document.querySelectorAll("[data-hero-slide]"),
            dots: document.querySelectorAll("[data-hero-dot]"),
            prev: document.getElementById("heroPrev"),
            next: document.getElementById("heroNext"),
            activeClass: "hero-slide--active",
            dotActiveClass: "hero__dot--active",
            dotDataset: "heroDot",
            hideInactive: true,
            autoplay: 5200
        });
    }

    function initHeroColumnPause() {
        const centerTracks = Array.from(document.querySelectorAll(".hero__column--center .hero__column-track"));

        centerTracks.forEach(function (track) {
            const photos = Array.from(track.querySelectorAll(".hero__photo"));
            const prependCount = Math.min(4, photos.length);

            for (let index = photos.length - prependCount; index < photos.length; index += 1) {
                track.insertBefore(photos[index].cloneNode(true), track.firstChild);
            }

            track.classList.add("hero__column-track--manual");
        });

        if (isReducedMotion() || !centerTracks.length) {
            return;
        }

        const sideLoopDuration = 10710;
        const centerPauseDuration = 1000;
        const centerAnimationStart = performance.now();

        function animateCenterTracks(now) {
            centerTracks.forEach(function (track) {
                if (track.offsetParent === null) {
                    return;
                }

                const gallery = track.closest(".hero__gallery");

                if (gallery && (gallery.matches(":hover") || gallery.matches(":focus-within"))) {
                    return;
                }

                const photo = track.querySelector(".hero__photo");

                if (!photo) {
                    return;
                }

                const styles = getComputedStyle(track);
                const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0");
                const photoHeight = photo.getBoundingClientRect().height;
                const photoStep = photoHeight + rowGap;
                const loopDistance = photoStep * 4;

                if (!Number.isFinite(loopDistance) || loopDistance === 0) {
                    return;
                }

                const elapsed = now - centerAnimationStart;
                let upwardProgress = 0;

                if (elapsed < sideLoopDuration) {
                    upwardProgress = (elapsed / sideLoopDuration) * loopDistance;
                } else {
                    const repeatDuration = centerPauseDuration + sideLoopDuration;
                    const repeatElapsed = elapsed - sideLoopDuration;
                    const repeatProgress = repeatElapsed % repeatDuration;

                    if (repeatProgress >= centerPauseDuration) {
                        const moveElapsed = repeatProgress - centerPauseDuration;
                        upwardProgress = Math.min((moveElapsed / sideLoopDuration) * loopDistance, loopDistance);
                    }
                }

                track.style.transform = "translateY(" + (-upwardProgress - loopDistance) + "px)";
            });

            window.requestAnimationFrame(animateCenterTracks);
        }

        window.requestAnimationFrame(animateCenterTracks);
    }

    function initChooseSlider() {
        const slider = document.getElementById("chooseSlider");
        const track = document.getElementById("chooseTrack");
        const slides = Array.from(document.querySelectorAll("[data-choose-slide]"));
        const dots = document.querySelectorAll("[data-choose-dot]");
        const mobileQuery = window.matchMedia("(max-width: 767px)");

        if (!slider || !track || !slides.length) {
            return;
        }

        const controller = createSlideController({
            slider: slider,
            slides: slides,
            dots: dots,
            dotActiveClass: "choose__dot--active",
            dotDataset: "chooseDot",
            hideInactive: false,
            onRender: function (activeIndex) {
                if (!mobileQuery.matches) {
                    track.style.transform = "";
                    slides.forEach(function (slide) {
                        slide.setAttribute("aria-hidden", "false");
                    });
                    return;
                }

                const step = slides[0].getBoundingClientRect().width + Number.parseFloat(getComputedStyle(track).gap || "0");
                track.style.transform = "translateX(-" + (activeIndex * step) + "px)";

                slides.forEach(function (slide, index) {
                    slide.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
                });
            }
        });

        function resetForViewport() {
            if (controller) {
                controller.goTo(0);
                controller.render();
            }
        }

        window.addEventListener("resize", resetForViewport);

        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener("change", resetForViewport);
        }
    }

    function initVisitSlider() {
        const visitSlider = document.getElementById("visitSlider");
        const visitTrack = document.getElementById("visitTrack");
        const visitPrev = document.getElementById("visitPrev");
        const visitNext = document.getElementById("visitNext");
        const visitCards = visitTrack ? Array.from(visitTrack.children) : [];

        if (!visitSlider || !visitTrack || !visitPrev || !visitNext || !visitCards.length) {
            return;
        }

        function getVisibleCards() {
            if (window.innerWidth <= 767) {
                return 1;
            }

            if (window.innerWidth <= 1180) {
                return 2;
            }

            return 4;
        }

        const controller = createSlideController({
            slider: visitSlider,
            slides: visitCards,
            prev: visitPrev,
            next: visitNext,
            hideInactive: false,
            getMaxIndex: function () {
                return Math.max(0, visitCards.length - getVisibleCards());
            },
            onRender: function (activeIndex, maxIndex) {
                const styles = getComputedStyle(visitTrack);
                const gap = Number.parseFloat(styles.gap || "0");
                const step = visitCards[0].getBoundingClientRect().width + gap;

                visitTrack.style.transform = "translateX(-" + (activeIndex * step) + "px)";
                visitPrev.disabled = activeIndex === 0;
                visitNext.disabled = activeIndex === maxIndex;
                visitPrev.style.opacity = visitPrev.disabled ? "0.5" : "1";
                visitNext.style.opacity = visitNext.disabled ? "0.5" : "1";

                visitCards.forEach(function (card, index) {
                    const visibleCards = getVisibleCards();
                    const isVisible = index >= activeIndex && index < activeIndex + visibleCards;
                    card.setAttribute("aria-hidden", isVisible ? "false" : "true");
                });
            }
        });

        window.addEventListener("resize", function () {
            controller.render();
        });
    }

    stopFormNavigation();
    initHeroSlider();
    initHeroColumnPause();
    initChooseSlider();
    initVisitSlider();
})();
