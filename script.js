// ====================================================================
// Scroll Progress Bar
// ====================================================================
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
    const progressEl = document.getElementById('scrollProgress');
    if (progressEl) progressEl.style.width = scrolled + '%';
});

// ====================================================================
// Theme Toggle
// ====================================================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
}

// ====================================================================
// Custom Cursor (Safely isolated to prevent main-thread locking)
// ====================================================================
const cursorDot = document.getElementById('cursorDot');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
});

function renderCursor() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    if (cursorFollower) {
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    }
    requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);

// Hover Effects using safe delegated listeners
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.hover-target, .project-card')) {
        document.body.classList.add('cursor-hover');
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.hover-target, .project-card')) {
        document.body.classList.remove('cursor-hover');
    }
});

// ====================================================================
// Magnetic Buttons
// ====================================================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// ====================================================================
// Reveal Animations
// ====================================================================
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ====================================================================
// Easter Egg
// ====================================================================
const easterEggBtn = document.getElementById('easterEggBtn');
if (easterEggBtn) {
    const compliments = [
        "✨ You have immaculate taste for scrolling all the way down!",
        "🚀 Thanks for checking out Clven's portfolio! Let's build something epic.",
        "💡 Fun fact: This entire page is built in a single vanilla HTML file.",
        "☕ Powered by clean code, UM spirit, and extra cups of coffee."
    ];
    easterEggBtn.addEventListener('click', () => {
        const span = easterEggBtn.querySelector('span');
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        if (span) span.textContent = randomCompliment;
        setTimeout(() => {
            if (span) span.textContent = "✨ Click for a surprise";
        }, 4000);
    });
}

// ====================================================================
// Active Nav Link on Scroll
// ====================================================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(current)) {
            link.classList.add('active');
        }
    });
});

// ====================================================================
// Buttery Smooth Sequenced Card-Shuffling Deck Modal Functionality
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    let modal = document.getElementById("projectModal");
    if (!modal) return;

    const modalClose = modal.querySelector("#modalClose");
    const modalBackdrop = modal.querySelector(".modal-backdrop");
    const projectCards = document.querySelectorAll(".project-card");

    const titleEl = modal.querySelector("#modalTitle");
    const linkEl = modal.querySelector("#modalLiveLink");

    let deckContainer = modal.querySelector("#modalDeck");
    if (!deckContainer) {
        deckContainer = document.createElement("div");
        deckContainer.id = "modalDeck";
        deckContainer.className = "modal-deck-container";
        const modalContent = modal.querySelector(".modal-content") || modal;
        modalContent.appendChild(deckContainer);
    }

    let cardsData = [];
    let isAnimating = false;

    projectCards.forEach(card => {
        card.addEventListener("click", (e) => {
            // If the user clicked the GitHub repository button, stop right here!
            if (e.target.closest('.github-repo-btn')) return;

            const projectTitle = card.getAttribute("data-title") || "Project Preview";
            const imagesString = card.getAttribute("data-images") || "";
            const liveUrl = card.getAttribute("data-url") || "#";

            if (!imagesString.trim()) return;

            if (titleEl) titleEl.textContent = projectTitle;

            if (linkEl) {
                linkEl.href = liveUrl;
                linkEl.style.display = liveUrl && liveUrl !== '#' ? 'inline-flex' : 'none';
            }

            cardsData = imagesString.split(",").map(img => img.trim());
            renderDeck();

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function renderDeck() {
        deckContainer.innerHTML = "";
        
        cardsData.forEach((imgSrc, index) => {
            const cardEl = document.createElement("div");
            cardEl.className = "modal-card-item";
            cardEl.style.zIndex = cardsData.length - index;
            cardEl.innerHTML = `<img src="${imgSrc}" alt="Project preview image" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; background: transparent;">`;
            
            applyTransform(cardEl, index);
            deckContainer.appendChild(cardEl);
        });
    }

    function applyTransform(cardEl, positionIndex) {
        cardEl.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease";
        cardEl.style.opacity = "1";
        
        if (positionIndex === 0) {
            cardEl.style.transform = "translateY(0) scale(1) rotate(0deg)";
            cardEl.style.pointerEvents = "auto";
        } else {
            const offset = positionIndex * 12;
            const scale = 1 - (positionIndex * 0.04);
            const rotate = positionIndex * 1.5;
            cardEl.style.transform = `translateY(${offset}px) scale(${scale}) rotate(${rotate}deg)`;
            cardEl.style.pointerEvents = "none";
        }
    }

    function cycleDeck() {
        if (cardsData.length <= 1 || isAnimating) return;
        isAnimating = true;

        const cardElements = deckContainer.querySelectorAll(".modal-card-item");
        const topCard = cardElements[0]; // The current front card

        if (!topCard) {
            isAnimating = false;
            return;
        }

        // STEP 1: Lift the active card smoothly upward and tilt it gracefully (takes 0.35s)
        topCard.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
        topCard.style.zIndex = 999; 
        topCard.style.transform = "translateY(-65px) scale(1.04) rotate(-6deg)";

        // STEP 2: Midpoint transition — instantly swap data layer so the next card occupies the front,
        // and send the old card on its smooth descent to the back layer.
        setTimeout(() => {
            const shiftedCard = cardsData.shift();
            cardsData.push(shiftedCard);

            deckContainer.innerHTML = "";
            cardsData.forEach((imgSrc, index) => {
                const cardEl = document.createElement("div");
                cardEl.className = "modal-card-item";
                cardEl.innerHTML = `<img src="${imgSrc}" alt="Project preview image" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; background: transparent;">`;
                deckContainer.appendChild(cardEl);

                if (index === cardsData.length - 1) {
                    // Place the old card at its lifted coordinate without transition first...
                    cardEl.style.zIndex = 1; 
                    cardEl.style.transition = "none";
                    cardEl.style.transform = "translateY(-65px) scale(1.04) rotate(-6deg)";

                    // ...then smoothly glide it down into the deep back-of-deck slot (takes 0.45s)
                    setTimeout(() => {
                        const backOffset = index * 12;
                        const backScale = 1 - (index * 0.04);
                        const backRotate = index * 1.5;

                        cardEl.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
                        cardEl.style.transform = `translateY(${backOffset}px) scale(${backScale}) rotate(${backRotate}deg)`;
                    }, 30);
                } else {
                    // New front card and middle cards slide smoothly into their updated stack positions
                    cardEl.style.zIndex = cardsData.length - index;
                    applyTransform(cardEl, index);
                }
            });
        }, 370);

        // Reset animation lock after the full fluid sequence completes
        setTimeout(() => {
            isAnimating = false;
        }, 850);
    }

    deckContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        cycleDeck();
    });

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        isAnimating = false;
    };

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    if (linkEl) {
        linkEl.addEventListener("click", (e) => {
            const targetUrl = linkEl.getAttribute("href");
            if (targetUrl && targetUrl.startsWith("#")) {
                e.preventDefault();
                closeModal();
                
                const targetSection = document.querySelector(targetUrl);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
            e.preventDefault();
            cycleDeck();
        }
    });
});

// ====================================================================
// Dedicated Certificate Lightbox / View Image Popup
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    const certModal = document.getElementById("certModal");
    if (!certModal) return;

    const certModalImg = document.getElementById("certModalImg");
    const certModalCaption = document.getElementById("certModalCaption");
    const certModalClose = document.getElementById("certModalClose");
    const certCards = document.querySelectorAll(".cert-cinematic-card");

    certCards.forEach(card => {
        card.addEventListener("click", () => {
            const imgSrc = card.getAttribute("data-images");
            const title = card.getAttribute("data-title");

            if (!imgSrc) return;

            certModalImg.src = imgSrc;
            if (certModalCaption) certModalCaption.textContent = title || "Certificate View";

            certModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const closeCertModal = () => {
        certModal.classList.remove("active");
        document.body.style.overflow = "";
    };

    if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
    certModal.addEventListener("click", (e) => {
        if (e.target === certModal) closeCertModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && certModal.classList.contains("active")) {
            closeCertModal();
        }
    });
});