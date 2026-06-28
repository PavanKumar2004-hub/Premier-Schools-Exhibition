(function () {
    const enquiryForms = document.querySelectorAll(".hero-form");

    enquiryForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    });

    const heroSlider = document.getElementById("heroSlider");
    const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");
    const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    let heroIndex = 0;
    let heroTouchStartX = 0;

    function renderHeroSlides() {
        heroSlides.forEach(function (slide, index) {
            const active = index === heroIndex;
            slide.classList.toggle("hero-slide--active", active);
            slide.setAttribute("aria-hidden", active ? "false" : "true");
        });

        heroDots.forEach(function (dot, index) {
            const active = index === heroIndex;
            dot.classList.toggle("hero__dot--active", active);
            dot.setAttribute("aria-selected", active ? "true" : "false");
        });
    }

    function goToHeroSlide(index) {
        heroIndex = (index + heroSlides.length) % heroSlides.length;
        renderHeroSlides();
    }

    if (heroSlider && heroSlides.length) {
        renderHeroSlides();

        heroPrev.addEventListener("click", function () {
            goToHeroSlide(heroIndex - 1);
        });

        heroNext.addEventListener("click", function () {
            goToHeroSlide(heroIndex + 1);
        });

        heroDots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                goToHeroSlide(Number(dot.dataset.heroDot));
            });
        });

        heroSlider.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                goToHeroSlide(heroIndex - 1);
            }

            if (event.key === "ArrowRight") {
                goToHeroSlide(heroIndex + 1);
            }
        });

        heroSlider.addEventListener("touchstart", function (event) {
            heroTouchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        heroSlider.addEventListener("touchend", function (event) {
            const deltaX = event.changedTouches[0].clientX - heroTouchStartX;

            if (Math.abs(deltaX) > 40) {
                goToHeroSlide(deltaX < 0 ? heroIndex + 1 : heroIndex - 1);
            }
        }, { passive: true });
    }

    const centerTracks = Array.from(document.querySelectorAll(".hero__column--center .hero__column-track"));

    centerTracks.forEach(function (track) {
        const photos = Array.from(track.querySelectorAll(".hero__photo"));
        const prependCount = Math.min(4, photos.length);

        for (let index = photos.length - prependCount; index < photos.length; index += 1) {
            track.insertBefore(photos[index].cloneNode(true), track.firstChild);
        }

        track.classList.add("hero__column-track--manual");
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && centerTracks.length) {
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
                const centerTravelDistance = loopDistance;
                const centerMoveDuration = sideLoopDuration;

                if (!Number.isFinite(loopDistance) || loopDistance === 0 || !Number.isFinite(centerMoveDuration)) {
                    return;
                }

                const elapsed = now - centerAnimationStart;
                let upwardProgress = 0;

                if (elapsed < centerMoveDuration) {
                    upwardProgress = (elapsed / centerMoveDuration) * centerTravelDistance;
                } else {
                    const repeatDuration = centerPauseDuration + centerMoveDuration;
                    const repeatElapsed = elapsed - centerMoveDuration;
                    const repeatProgress = repeatElapsed % repeatDuration;

                    if (repeatProgress < centerPauseDuration) {
                        upwardProgress = 0;
                    } else {
                        const moveElapsed = repeatProgress - centerPauseDuration;
                        upwardProgress = Math.min((moveElapsed / centerMoveDuration) * centerTravelDistance, centerTravelDistance);
                    }
                }

                const totalOffset = -upwardProgress - loopDistance;

                track.style.transform = "translateY(" + totalOffset + "px)";
            });

            window.requestAnimationFrame(animateCenterTracks);
        }

        window.requestAnimationFrame(animateCenterTracks);
    }

    const visitTrack = document.getElementById("visitTrack");
    const visitPrev = document.getElementById("visitPrev");
    const visitNext = document.getElementById("visitNext");

    if (!visitTrack || !visitPrev || !visitNext) {
        return;
    }

    const visitCards = Array.from(visitTrack.children);
    let visitIndex = 0;
    let visitVisibleCards = 4;

    function getVisibleCards() {
        if (window.innerWidth <= 767) {
            return 1;
        }

        if (window.innerWidth <= 1180) {
            return 2;
        }

        return 4;
    }

    function updateVisitSlider() {
        visitVisibleCards = getVisibleCards();
        const maxIndex = Math.max(0, visitCards.length - visitVisibleCards);
        const step = visitCards[0].getBoundingClientRect().width + 16;

        visitIndex = Math.min(visitIndex, maxIndex);
        visitTrack.style.transform = "translateX(-" + (visitIndex * step) + "px)";
        visitPrev.disabled = visitIndex === 0;
        visitNext.disabled = visitIndex === maxIndex;
        visitPrev.style.opacity = visitPrev.disabled ? "0.5" : "1";
        visitNext.style.opacity = visitNext.disabled ? "0.5" : "1";
    }

    visitPrev.addEventListener("click", function () {
        visitIndex = Math.max(0, visitIndex - 1);
        updateVisitSlider();
    });

    visitNext.addEventListener("click", function () {
        const maxIndex = Math.max(0, visitCards.length - visitVisibleCards);
        visitIndex = Math.min(maxIndex, visitIndex + 1);
        updateVisitSlider();
    });

    window.addEventListener("resize", updateVisitSlider);
    updateVisitSlider();
})();
