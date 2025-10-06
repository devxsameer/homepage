const header = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-list a");
const sections = document.querySelectorAll("body > *[id]");

// Loader ripple hide
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  loader?.classList.add("hidden");
  setTimeout(() => loader?.remove(), 1600);
});

// Hamburger toggle + ripple
hamburger.addEventListener("click", () => {
  navBar.classList.toggle("open");
  hamburger.classList.toggle("active");
});

// Add active class on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    navBar.classList.remove("open");
    hamburger.classList.remove("active");
  });
});

// Scroll-based active highlight (scroll spy)
window.addEventListener("scroll", () => {
  const headerHeight = header.offsetHeight; // sticky header height

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight - 20; // adjust based on header height
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});
