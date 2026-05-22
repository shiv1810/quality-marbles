(function () {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const isHeroPage = header && header.classList.contains("header--light");

  if (isHeroPage) {
    const onScroll = () => {
      header.classList.toggle("is-solid", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (mobileNav) {
      mobileNav.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    });
  });
})();
