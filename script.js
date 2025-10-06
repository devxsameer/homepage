// script.js (drop-in replacement)
// ==================================================
// Robust scroll-spy + hamburger + loader + smooth scroll
// Works with <main id="hero"> AND <section id="..."> etc.
// ==================================================

const header = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-list a");
// include any direct child of body that has an id (main, section, etc.)
let sections = document.querySelectorAll("body > *[id]");

if (!header) console.warn("No element with class '.header' found.");
if (!hamburger) console.warn("No element with class '.hamburger' found.");
if (!navBar) console.warn("No element with class '.navbar' found.");
if (!navLinks.length)
  console.warn("No nav links found for selector '.nav-list a'.");
if (!sections.length) console.warn("No sections found (body > *[id]).");

// -----------------------------
// Loader ripple hide (unchanged)
// -----------------------------
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  loader?.classList.add("hidden");
  setTimeout(() => loader?.remove(), 1600);

  // ensure sections list is current after load (if DOM changed)
  sections = document.querySelectorAll("body > *[id]");
  updateActiveLink(); // initial update
});

// -----------------------------
// Hamburger toggle
// -----------------------------
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navBar?.classList.toggle("open");
    hamburger.classList.toggle("active");
  });
}

// -----------------------------
// Smooth scroll + link click handling
// -----------------------------
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // only handle same-page anchors
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;

    e.preventDefault();

    const targetId = href.slice(1);
    const targetSection = document.getElementById(targetId);
    if (!targetSection) {
      // fallback: let browser handle it
      window.location.href = href;
      return;
    }

    const headerHeight = header ? header.offsetHeight : 0;
    const offsetTop = Math.max(0, targetSection.offsetTop - headerHeight);

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });

    // Close mobile menu (if any)
    navBar?.classList.remove("open");
    hamburger?.classList.remove("active");

    // Update active immediately
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// -----------------------------
// Scroll spy (stable for small sections)
// Uses viewport midpoint relative to header offset
// -----------------------------
let ticking = false;

function updateActiveLink() {
  // refresh sections in case DOM changed
  sections = document.querySelectorAll("body > *[id]");
  const headerHeight = header ? header.offsetHeight : 0;

  // use a point that is a bit below the header: a midpoint for stability
  const viewportPoint =
    window.scrollY + headerHeight + window.innerHeight * 0.25;

  // default to first section if none match
  let current = sections.length ? sections[0].getAttribute("id") : null;

  for (const section of sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    // If the viewportPoint (a stable point) is within the section bounds, pick it
    if (viewportPoint >= top && viewportPoint < bottom) {
      current = section.getAttribute("id");
      break;
    }
  }

  // Special-case: if scrolled to very bottom, set to last section
  const scrollBottom = window.scrollY + window.innerHeight;
  if (
    Math.abs(scrollBottom - document.documentElement.scrollHeight) < 5 &&
    sections.length
  ) {
    current = sections[sections.length - 1].getAttribute("id");
  }

  // Toggle active class on nav links
  if (current) {
    navLinks.forEach((link) => {
      const linkHash = link.hash || "";
      link.classList.toggle("active", linkHash === "#" + current);
    });
  }
}

// Debounced scroll handler using rAF for smoothness
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveLink();
      ticking = false;
    });
    ticking = true;
  }
});

// Also update on resize, load, and hashchange
window.addEventListener("resize", () => {
  // recalls immediately after resize
  updateActiveLink();
});
window.addEventListener("hashchange", () => {
  // if user navigates with browser back/forward
  updateActiveLink();
});

// initial run in case page is already scrolled (or has hash)
updateActiveLink();
