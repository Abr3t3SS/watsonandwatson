/* main.js */
(() => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) document.documentElement.classList.add("reduced");

  // ===== Marquee (GSAP opcional, sin “corte”) =====
  const track = document.getElementById("marqueeTrack");
  const set = document.getElementById("marqueeSet");
  let marqueeTween = null;

  function setupMarquee() {
    if (!track || !set) return;

    [...track.querySelectorAll('[data-clone="1"]')].forEach((n) => n.remove());

    const clone = set.cloneNode(true);
    clone.dataset.clone = "1";
    track.appendChild(clone);

    const setWidth = Math.ceil(set.getBoundingClientRect().width);

    if (marqueeTween) marqueeTween.kill();
    track.style.transform = "translate3d(0,0,0)";

    if (prefersReduced || !window.gsap) return;

    const pxPerSecond = 70;
    const duration = Math.max(10, setWidth / pxPerSecond);

    marqueeTween = gsap.to(track, {
      x: -setWidth,
      duration,
      ease: "none",
      repeat: -1,
      force3D: true,
    });
  }

  window.addEventListener("load", setupMarquee);
  window.addEventListener("resize", () => {
    clearTimeout(window.__wwMarqueeResize);
    window.__wwMarqueeResize = setTimeout(setupMarquee, 120);
  });

  // ===== Contacto: email rápido + copiar + email con contexto =====
  const TO_EMAIL = "alexwatsonrinc@gmail.com";

  const quickEmail = document.getElementById("wwEmailQuick");
  const copyBtn = document.getElementById("wwCopyEmailBtn");
  const noteEl = document.getElementById("wwNote");
  const form = document.getElementById("wwInquiry");

  function setNote(msg) {
    if (!noteEl) return;
    noteEl.textContent = msg || "";
  }

  function encodeMailto(subject, body) {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    return `mailto:${TO_EMAIL}?${params.toString()}`;
  }

  // Plantilla mínima (botón principal)
  const baseSubject = "Watson & Watson — Consulta";
  const baseBody =
    "Hola Watson & Watson,\n\n" +
    "Estoy buscando apoyo con:\n\n" +
    "Objetivo:\n\n" +
    "Contexto (opcional):\n\n" +
    "Gracias,\n";

  if (quickEmail) {
    quickEmail.setAttribute("href", encodeMailto(baseSubject, baseBody));
  }

  // Copiar email
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(TO_EMAIL);
        setNote("Email copiado.");
        setTimeout(() => setNote(""), 1600);
      } catch (e) {
        setNote("No se pudo copiar. Selecciónalo manualmente abajo.");
        setTimeout(() => setNote(""), 2400);
      }
    });
  }

  // Submit: arma correo con contexto
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);

      const name = (fd.get("name") || "").toString().trim();
      const replyTo = (fd.get("replyTo") || "").toString().trim();
      const company = (fd.get("company") || "").toString().trim();
      const industry = (fd.get("industry") || "").toString().trim();
      const inquiryType = (fd.get("inquiryType") || "").toString().trim();
      const description = (fd.get("description") || "").toString().trim();

      const services = fd
        .getAll("services")
        .map((s) => s.toString().trim())
        .filter(Boolean);

      const subjectParts = ["Watson & Watson — Consulta"];
      if (inquiryType) subjectParts.push(inquiryType);
      if (industry) subjectParts.push(industry);
      const subject = subjectParts.join(" · ");

      const lines = [];
      lines.push("Hola Watson & Watson,");
      lines.push("");
      lines.push("Estoy buscando apoyo con:");
      if (inquiryType) lines.push(`Tipo: ${inquiryType}`);
      if (industry) lines.push(`Industria: ${industry}`);
      if (services.length) lines.push(`Servicios: ${services.join(", ")}`);
      lines.push("");
      lines.push("Objetivo:");
      lines.push(description || "");
      lines.push("");
      lines.push("Contexto (opcional):");
      if (company) lines.push(`Empresa: ${company}`);
      if (name) lines.push(`Nombre: ${name}`);
      if (replyTo) lines.push(`Email: ${replyTo}`);
      lines.push("");
      lines.push("Gracias,");

      const body = lines.join("\n");

      window.location.href = encodeMailto(subject, body);
    });
  }
})();

/* main.js */
(() => {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) document.documentElement.classList.add("reduced");

  const wordmarkImg = document.getElementById("wordmark");
  const monogramImg = document.getElementById("monogram");

  if (wordmarkImg && !wordmarkImg.getAttribute("src")) wordmarkImg.src = "assets/ww-wordmark-white.svg";
  if (monogramImg && !monogramImg.getAttribute("src")) monogramImg.src = "assets/ww-monogram.svg";

  // ===== Marquee seamless (GSAP, por px, sin “corte”) =====
  const track = document.getElementById("marqueeTrack");
  const set = document.getElementById("marqueeSet");
  let marqueeTween = null;

  function setupMarquee() {
    if (!track || !set) return;

    [...track.querySelectorAll('[data-clone="1"]')].forEach(n => n.remove());

    const clone = set.cloneNode(true);
    clone.dataset.clone = "1";
    track.appendChild(clone);

    const setWidth = Math.ceil(set.getBoundingClientRect().width);

    if (marqueeTween) marqueeTween.kill();
    track.style.transform = "translate3d(0,0,0)";

    if (prefersReduced || !window.gsap) return;

    const pxPerSecond = 70;
    const duration = Math.max(10, setWidth / pxPerSecond);

    marqueeTween = gsap.to(track, {
      x: -setWidth,
      duration,
      ease: "none",
      repeat: -1,
      force3D: true
    });
  }

  window.addEventListener("load", setupMarquee);
  window.addEventListener("resize", () => {
    clearTimeout(window.__wwMarqueeResize);
    window.__wwMarqueeResize = setTimeout(setupMarquee, 120);
  });

  // ===== Section nav active + hero cue =====
  const body = document.body;
  const nav = document.querySelector(".section-nav");
  const dots = nav ? [...nav.querySelectorAll(".section-dot")] : [];
  const sections = ["p-hero","p-system","p-duo","p-contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActive(id){
    dots.forEach(a => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === `#${id}`);
    });
  }

  // Observer para secciones
  if ("IntersectionObserver" in window && sections.length){
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id){
        setActive(visible.target.id);
        body.classList.toggle("in-hero", visible.target.id === "p-hero");
      }
    }, { threshold:[0.18,0.35,0.55] });

    sections.forEach(s => obs.observe(s));
  } else {
    // fallback básico
    body.classList.add("in-hero");
    setActive("p-hero");
  }

})();