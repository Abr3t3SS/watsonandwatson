gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Loader robusto para logos: intenta varias rutas reales */
function setImgWithFallback(imgEl, paths, label){
  if (!imgEl) return;

  let i = 0;
  const tryNext = () => {
    if (i >= paths.length) {
      console.warn(`[WW] No se pudo cargar ${label}. Probé:`, paths);
      return;
    }
    imgEl.src = paths[i++];
  };

  imgEl.addEventListener("error", () => {
    tryNext();
  });

  tryNext();
}

const wordmark = document.getElementById("wordmark");
const monogram = document.getElementById("monogram");

/* Rutas reales según tu estructura actual */
setImgWithFallback(
  wordmark,
  [
    "./assets/ww-wordmark-white.svg",   // PRIORIDAD: este es el que quieres
    "./assets/ww-wordmark.svg",
    "./assets/logo/ww-wordmark-white.svg",
    "./assets/logo/ww-wordmark.svg"
  ],
  "wordmark"
);

setImgWithFallback(
  monogram,
  [
    "./assets/ww-monogram.svg",
    "./assets/logo/ww-monogram.svg"
  ],
  "monogram"
);

/* Patrón usa el monograma como background. Si falla, no pasa nada */
const pattern = document.querySelector(".pattern");
if (pattern) pattern.style.backgroundImage = "url('./assets/ww-monogram.svg')";

/* Scroll suave a anchors (para que no “brinque” raro con header fijo) */
(function smoothAnchors(){
  const header = document.querySelector(".top");
  const headerH = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y = window.scrollY + target.getBoundingClientRect().top - (headerH() + 18);
      window.scrollTo({ top: Math.max(0, y), behavior: prefersReduced ? "auto" : "smooth" });
    });
  });
})();

/* Motion off */
if (prefersReduced) {
  document.documentElement.classList.add("reduced");
} else {

  /* Entrada */
  gsap.set(".lockup", { opacity:0, y:14, filter:"blur(10px)" });
  gsap.set(".top", { y:-10, opacity:0 });

  const chips = gsap.utils.toArray(".chip");
  gsap.set(chips, { opacity:0, y:10 });

  gsap.timeline({ defaults:{ ease:"power2.out" } })
    .to(".top", { y:0, opacity:1, duration:0.7 })
    .to(".lockup", { opacity:1, y:0, filter:"blur(0px)", duration:0.9 }, 0.05)
    .to(chips, { opacity:1, y:0, duration:0.6, stagger:0.05 }, 0.35);

  /* Scroll reveals */
  const revealEls = gsap.utils.toArray(".bio, .contact-card, .contact-photo");
  revealEls.forEach((el) => {
    gsap.set(el, { opacity:0, y:14, willChange:"transform,opacity" });

    ScrollTrigger.create({
      trigger: el,
      start: "top 84%",
      once: true,
      onEnter: () => gsap.to(el, { opacity:1, y:0, duration:0.8, ease:"power2.out" })
    });
  });

  /* Footerline: Concepts / Strategy / Systems */
  const footerLine = document.querySelector(".footerline");
  if (footerLine) {
    const items = Array.from(footerLine.children);
    gsap.set(items, { opacity:0, y:8 });

    ScrollTrigger.create({
      trigger: footerLine,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out"
      })
    });
  }

  /* Hero disuelve elegante al scrollear: no destruye, refina */
  ScrollTrigger.create({
    trigger: "#p-hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      const t = self.progress;

      gsap.to(".lockup", {
        opacity: Math.max(0, 1 - (t * 1.25)),
        y: -t * 22,
        filter: `blur(${t * 9}px)`,
        duration: 0
      });

      gsap.to(".pattern", {
        opacity: 0.07 + (t * 0.06),
        duration: 0
      });

      gsap.to(".paper", {
        filter: `contrast(${1 + t * 0.05})`,
        duration: 0
      });
    }
  });

  /* Micro: hover en chips (sutil, no gimmick) */
  chips.forEach((c) => {
    c.addEventListener("mouseenter", () => {
      gsap.to(c, { y:-2, duration:0.18, ease:"power2.out" });
    });
    c.addEventListener("mouseleave", () => {
      gsap.to(c, { y:0, duration:0.18, ease:"power2.out" });
    });
  });
}