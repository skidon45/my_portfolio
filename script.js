// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
    const progressEl = document.getElementById('scrollProgress');
    if (progressEl) progressEl.style.width = scrolled + '%';
});

// Theme Toggle
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

// Custom Cursor (Safely isolated to prevent main-thread locking)
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

// Magnetic Buttons
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

// Reveal Animations
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Easter Egg
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

// Active Nav Link on Scroll
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
// Clean Stacked Deck Modal Functionality
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    let modal = document.getElementById("projectModal");
    if (!modal) return;

    const modalClose = modal.querySelector("#modalClose");
    const modalBackdrop = modal.querySelector(".modal-backdrop");
    const projectCards = document.querySelectorAll(".project-card");

    // Elements inside your modal structure
    const titleEl = modal.querySelector("#modalTitle");
    const linkEl = modal.querySelector("#modalLiveLink"); // Let's talk / preview button

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
        card.addEventListener("click", () => {
            const projectTitle = card.getAttribute("data-title") || "Project Preview";
            const imagesString = card.getAttribute("data-images") || "";
            const liveUrl = card.getAttribute("data-url") || "#";

            if (!imagesString.trim()) return;

            // Display ONLY the project name on top
            if (titleEl) titleEl.textContent = projectTitle;

            // Display the Let's Talk / Preview button below the images
            if (linkEl) {
                linkEl.href = liveUrl;
                linkEl.style.display = liveUrl && liveUrl !== '#' ? 'inline-flex' : 'none';
            }

            cardsData = imagesString.split(",").map(img => img.trim());
            renderDeck(false);

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function renderDeck(animate = false) {
        deckContainer.innerHTML = "";
        
        cardsData.forEach((imgSrc, index) => {
            const cardEl = document.createElement("div");
            cardEl.className = "modal-card-item";
            cardEl.style.zIndex = cardsData.length - index;
            
            if (animate && index === cardsData.length - 1) {
                cardEl.style.transform = "translateY(0) scale(1) rotate(0deg)";
                cardEl.style.opacity = "1";
                
                setTimeout(() => {
                    cardEl.style.transform = "translateX(120px) translateY(-20px) scale(0.95) rotate(15deg)";
                    cardEl.style.opacity = "0";
                }, 20);
            } else {
                updateCardTransform(cardEl, index);
            }

            cardEl.innerHTML = `<img src="${imgSrc}" alt="Project preview image" loading="lazy">`;
            deckContainer.appendChild(cardEl);
        });
    }

    function updateCardTransform(cardEl, positionIndex) {
        if (positionIndex === 0) {
            cardEl.style.transform = "translateY(0) scale(1) rotate(0deg)";
            cardEl.style.opacity = "1";
            cardEl.style.pointerEvents = "auto";
        } else {
            const offset = positionIndex * 14;
            const scale = 1 - (positionIndex * 0.04);
            cardEl.style.transform = `translateY(${offset}px) scale(${scale}) rotate(0deg)`;
            cardEl.style.opacity = Math.max(0.25, 1 - (positionIndex * 0.25));
            cardEl.style.pointerEvents = "none";
        }
    }

    function cycleDeck() {
        if (cardsData.length <= 1 || isAnimating) return;
        isAnimating = true;

        renderDeck(true);

        setTimeout(() => {
            const shiftedCard = cardsData.shift();
            cardsData.push(shiftedCard);
            renderDeck(false);
            isAnimating = false;
        }, 350);
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
                closeModal(); // Close the modal first
                
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