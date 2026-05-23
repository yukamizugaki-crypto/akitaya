/* ================================================
   居酒屋 秋田や - JavaScript
================================================ */

// ---- Navbar scroll effect ----
const header = document.getElementById('header');
const handleScroll = () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleScroll, { passive: true });

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close nav when link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- Scroll reveal animation ----
const revealElements = document.querySelectorAll('.section-header, .about-content, .drinks-content, .reserve-card, .access-content, .intro-banner, .menu-lead');

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ---- Menu Carousel ----
const menuTrack = document.getElementById('menuTrack');
const menuPrev = document.getElementById('menuPrev');
const menuNext = document.getElementById('menuNext');
const menuDotsContainer = document.getElementById('menuDots');

const cards = Array.from(menuTrack.querySelectorAll('.menu-card'));
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let dragMoved = false;

// Calculate visible cards based on viewport
function getVisibleCount() {
  const w = window.innerWidth;
  if (w <= 600) return 1;
  if (w <= 900) return 2;
  return 3;
}

function getCardWidth() {
  if (cards.length === 0) return 0;
  const card = cards[0];
  return card.offsetWidth + 20; // 20 = gap
}

function getTotalSlides() {
  return Math.max(1, cards.length - getVisibleCount() + 1);
}

function updateTrack() {
  const offset = currentIndex * getCardWidth();
  menuTrack.style.transform = `translateX(-${offset}px)`;
  updateDots();
}

// Create dots
function buildDots() {
  menuDotsContainer.innerHTML = '';
  const total = getTotalSlides();
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'menu-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateTrack();
    });
    menuDotsContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = menuDotsContainer.querySelectorAll('.menu-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

menuNext.addEventListener('click', () => {
  currentIndex = Math.min(currentIndex + 1, getTotalSlides() - 1);
  updateTrack();
});

menuPrev.addEventListener('click', () => {
  currentIndex = Math.max(currentIndex - 1, 0);
  updateTrack();
});

// Drag to scroll (mouse)
menuTrack.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragMoved = false;
  startX = e.pageX;
  scrollLeft = currentIndex;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const deltaX = e.pageX - startX;
  if (Math.abs(deltaX) > 5) dragMoved = true;
  const threshold = getCardWidth() * 0.3;
  if (deltaX < -threshold) {
    currentIndex = Math.min(scrollLeft + 1, getTotalSlides() - 1);
  } else if (deltaX > threshold) {
    currentIndex = Math.max(scrollLeft - 1, 0);
  }
});

window.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    updateTrack();
  }
});

// Touch swipe
let touchStartX = 0;
menuTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

menuTrack.addEventListener('touchend', (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX < 0) {
      currentIndex = Math.min(currentIndex + 1, getTotalSlides() - 1);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }
    updateTrack();
  }
}, { passive: true });

// Init
buildDots();
updateTrack();

// Rebuild on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    currentIndex = Math.min(currentIndex, getTotalSlides() - 1);
    buildDots();
    updateTrack();
  }, 200);
});
