/* Minimal UI — no scroll libraries */
(function () {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("is-solid", window.scrollY > 24),
    { passive: true },
  );

  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      mobileNav.hidden = false;
      document.body.style.overflow = "hidden";
    } else {
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    }
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    });
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    const fades = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    fades.forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("is-visible"));
  }

  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you — we'll be in touch shortly.");
    e.target.reset();
  });
})();
