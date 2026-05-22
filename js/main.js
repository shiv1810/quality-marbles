/* Quality Granite & Marble — interactive brochure */
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none)").matches;

  /* ——— Loader ——— */
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderPct = document.getElementById("loaderPct");
  let loadProgress = 0;

  const tickLoader = () => {
    loadProgress = Math.min(loadProgress + Math.random() * 18 + 8, 100);
    loaderFill.style.width = loadProgress + "%";
    loaderPct.textContent = Math.floor(loadProgress);
    if (loadProgress < 100) requestAnimationFrame(tickLoader);
    else setTimeout(finishLoader, 400);
  };
  requestAnimationFrame(tickLoader);

  function finishLoader() {
    loader.classList.add("done");
    document.body.classList.add("ready");
    initMotion();
  }

  /* ——— Lenis + GSAP ——— */
  let lenis;
  function initMotion() {
    if (typeof Lenis !== "undefined" && !prefersReduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    gsap.registerPlugin(ScrollTrigger);
    runAnimations();
  }

  /* ——— WebGL Marble Hero ——— */
  const canvas = document.getElementById("marbleCanvas");
  if (canvas && typeof THREE !== "undefined" && !prefersReduced) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uRes;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
          vec2 u=f*f*(3.-2.*f);
          return mix(a,b,u.x)+ (c-a)*u.y*(1.-u.x)+ (d-b)*u.x*u.y;
        }
        float fbm(vec2 p){
          float v=0., a=.5;
          for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.1; a*=.5; }
          return v;
        }

        void main(){
          vec2 uv = vUv;
          vec2 m = uMouse;
          vec2 warp = uv + (m - 0.5) * 0.08;
          float t = uTime * 0.15;
          float n = fbm(warp * 3.5 + t);
          float veins = sin((warp.x + n * 2.5) * 12. + t * 2.) * 0.5 + 0.5;
          veins *= sin((warp.y * 0.7 + n) * 9. - t) * 0.5 + 0.5;
          float v = smoothstep(0.35, 0.95, n + veins * 0.35);
          vec3 dark = vec3(0.04, 0.035, 0.03);
          vec3 mid = vec3(0.18, 0.16, 0.14);
          vec3 light = vec3(0.85, 0.82, 0.78);
          vec3 gold = vec3(0.79, 0.66, 0.38);
          vec3 col = mix(dark, mid, v);
          col = mix(col, light, pow(v, 3.) * 0.9);
          col += gold * veins * 0.12 * v;
          float rim = pow(1. - abs(uv.y - 0.3), 3.) * 0.15;
          col += vec3(rim);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - r.left) / r.width;
      targetMouse.y = 1 - (e.clientY - r.top) / r.height;
    });

    function animate(t) {
      requestAnimationFrame(animate);
      mouse.lerp(targetMouse, 0.06);
      uniforms.uMouse.value.copy(mouse);
      uniforms.uTime.value = t * 0.001;
      renderer.render(scene, camera);
    }
    animate(0);
  }

  /* ——— Custom cursor ——— */
  const cursor = document.getElementById("cursor");
  if (cursor && !isTouch) {
    let cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener("mousemove", (e) => { cx = e.clientX; cy = e.clientY; });
    const loop = () => {
      rx += (cx - rx) * 0.15;
      ry += (cy - ry) * 0.15;
      cursor.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("a,button,[data-magnetic]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }

  /* ——— Magnetic buttons ——— */
  if (!isTouch) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ——— Burger ——— */
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  burger?.addEventListener("click", () => {
    burger.classList.toggle("open");
    drawer.classList.toggle("open");
    document.body.style.overflow = drawer.classList.contains("open") ? "hidden" : "";
  });
  drawer?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    }),
  );

  /* ——— Hero word cycle ——— */
  const words = ["carved", "polished", "placed", "perfected"];
  const heroWord = document.getElementById("heroWord");
  let wi = 0;
  if (heroWord && !prefersReduced) {
    setInterval(() => {
      wi = (wi + 1) % words.length;
      gsap.to(heroWord, { opacity: 0, y: -12, duration: 0.25, onComplete: () => {
        heroWord.textContent = words[wi];
        gsap.fromTo(heroWord, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
      }});
    }, 2800);
  }

  function runAnimations() {
    /* Hero entrance */
    gsap.from(".hero-tag", { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
    gsap.from(".hero-line", { opacity: 0, y: 80, duration: 1, stagger: 0.15, delay: 0.35, ease: "power4.out" });
    gsap.from(".hero-sub, .hero-cta", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, delay: 0.9 });

    /* Manifesto */
    gsap.from(".manifesto-text", {
      scrollTrigger: { trigger: ".manifesto", start: "top 75%" },
      opacity: 0, y: 60, duration: 1.2, ease: "power3.out",
    });

    /* Counters */
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: end, duration: 2, ease: "power2.out",
            onUpdate: function () { el.textContent = Math.floor(this.targets()[0].val).toLocaleString(); },
          });
        },
      });
    });

    /* Pinned slabs — scroll-driven panel swap */
    const panels = document.querySelectorAll(".slab-panel");
    const progress = document.getElementById("slabProgress");
    if (panels.length && !prefersReduced) {
      ScrollTrigger.create({
        trigger: ".slabs-pin",
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length),
          );
          panels.forEach((p, j) => p.classList.toggle("is-active", j === idx));
          if (progress)
            progress.style.width = ((idx + 1) / panels.length) * 100 + "%";
        },
      });
    }

    /* Horizontal gallery */
    const track = document.getElementById("galleryTrack");
    if (track && window.innerWidth >= 768 && !prefersReduced) {
      const getScroll = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery-pin",
          start: "top top",
          end: () => "+=" + getScroll(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    /* Process cards stagger */
    gsap.from(".process-card", {
      scrollTrigger: { trigger: ".process-track", start: "top 80%" },
      opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: "power3.out",
    });

    gsap.from(".quote blockquote", {
      scrollTrigger: { trigger: ".quote", start: "top 75%" },
      opacity: 0, scale: 0.96, duration: 1, ease: "power2.out",
    });

    gsap.from(".contact-left, .contact-form > *", {
      scrollTrigger: { trigger: ".contact", start: "top 75%" },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.08,
    });

    ScrollTrigger.refresh();
  }

  /* Form */
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    gsap.fromTo(e.target.querySelector("button"), { scale: 1 }, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.15 });
  });

  if (prefersReduced) {
    loaderFill.style.width = "100%";
    loaderPct.textContent = "100";
    setTimeout(finishLoader, 100);
  }
})();
