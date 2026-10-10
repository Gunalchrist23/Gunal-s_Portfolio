import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────── constants ───────────────────────────── */
const EZ = 'power4.inOut';
const pages = [].slice.call(document.querySelectorAll('[data-route]'));
const order = ['/', '/about', '/projects', '/publications', '/skills', '/training', '/education', '/certifications', '/stats', '/contact'];
const names = {
  '/': 'Introduction', '/about': 'About Me', '/projects': 'Projects',
  '/publications': 'Publications', '/skills': 'Skills & Tools',
  '/training': 'Training', '/education': 'Education',
  '/certifications': 'Certifications', '/stats': 'Stats',
  '/contact': "Let's Connect"
};

/* ────────────────────────── DOM references ─────────────────────────── */
const ul = document.getElementById('links');
const mb = document.getElementById('menu');
const dr = document.getElementById('drawer');
const dl = document.getElementById('dlist');
const navEl = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const themeBtn = document.getElementById('theme-toggle');

/* ─────────────────────── theme toggle ──────────────────────────────── */
if (themeBtn) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  const updateIcon = () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      themeBtn.textContent = '☀️';
    } else {
      themeBtn.textContent = '🌙';
    }
  };
  updateIcon();

  themeBtn.addEventListener('click', () => {
    document.documentElement.classList.add('theme-transition');
    
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateIcon();
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  });
}

/* ───────────────────────── skip-to-content ─────────────────────────── */
const skip = document.createElement('a');
skip.href = '#main-content';
skip.className = 'skip-link';
skip.textContent = 'Skip to content';
document.body.prepend(skip);
document.querySelector('main').id = 'main-content';

/* ─────────────────────── drawer links ──────────────────────────────── */
dl.innerHTML = order.map((r, i) =>
  '<a href="#' + r + '">' + ('0' + (i + 1)).slice(-2) + '&nbsp; ' + names[r] + '</a>'
).join('');

/* ─────────────────────── clock ─────────────────────────────────────── */
function tick() {
  try {
    document.getElementById('clock').textContent =
      new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
  } catch (e) { /* noop */ }
}
tick();
setInterval(tick, 30000);

/* ─────────────────────── Lenis smooth scroll ──────────────────────── */
let lenis = null;
const isTouch = window.matchMedia && matchMedia('(hover:none) and (pointer:coarse)').matches;
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

if (!reduceMotion && !isTouch) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

  // Correct Lenis + ScrollTrigger integration (works in Firefox & Safari)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Tell ScrollTrigger to use Lenis as the scroller
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });
}

/* ─────────────────────── route show ───────────────────────────────── */
function show() {
  const h = (location.hash || '#/').slice(1) || '/';
  const el = pages.find(p => p.dataset.route === h) || pages[0];
  const r = el.dataset.route;

  pages.forEach(p => { p.hidden = (p !== el); });
  document.title = (r === '/' ? '' : el.dataset.title + ' | ') + 'Gunal Christ A';

  // Update meta description per route
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descriptions = {
      '/': 'Gunal Christ A — AI/ML Engineer & Full-Stack Developer. IEEE-published researcher building intelligent apps.',
      '/about': 'About Gunal Christ A — AI & Machine Learning graduate who builds ML models, GenAI/RAG applications, and full-stack products.',
      '/projects': 'Projects by Gunal Christ A — FarmSense Pro (IEEE published), Resume Analyzer (GenAI/RAG), DocVault (full-stack).',
      '/publications': 'Publications — FarmSense Pro: A Data-Driven Approach to Crop Yield and Price Estimation, IEEE Xplore 2026.',
      '/skills': 'Skills & Tools — Python, Scikit-learn, XGBoost, LangChain, React, TypeScript, FastAPI, Supabase, and more.',
      '/contact': 'Get in touch with Gunal Christ A for AI/ML and full-stack development opportunities.'
    };
    metaDesc.content = descriptions[r] || descriptions['/'];
  }

  const base = '/' + (r.split('/')[1] || '');
  [].forEach.call(ul.querySelectorAll('a'), a => { a.classList.toggle('on', a.getAttribute('href') === '#' + base); });
  [].forEach.call(dl.querySelectorAll('a'), a => { a.classList.toggle('on', a.getAttribute('href') === '#' + base); });

  const i = order.indexOf(base);
  const n = order[(i + 1) % order.length];
  document.getElementById('nextlink').innerHTML = 'Next: <a href="#' + n + '">' + names[n] + ' &rarr;</a>';

  dr.hidden = true;
  mb.setAttribute('aria-expanded', 'false');

  // Scroll to top
  if (lenis) { lenis.scrollTo(0, { immediate: true }); } else { window.scrollTo(0, 0); }

  // Move focus to heading for a11y
  requestAnimationFrame(() => {
    const heading = el.querySelector('h1');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  });

  // Fire ScrollTrigger reveals for the new section
  requestAnimationFrame(() => { setupPageAnimations(el); });
}

/* ─────────────────────── drawer toggle ─────────────────────────────── */
mb.addEventListener('click', e => {
  e.stopPropagation();
  const open = dr.hidden;
  dr.hidden = !open;
  mb.setAttribute('aria-expanded', String(open));
  if (open) trapFocus(dr);
});
document.addEventListener('click', e => {
  if (!dr.hidden && !dr.contains(e.target)) { dr.hidden = true; mb.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { dr.hidden = true; mb.setAttribute('aria-expanded', 'false'); mb.focus(); }
});

/* ─────────────────────── focus trap ───────────────────────────────── */
function trapFocus(container) {
  const focusable = container.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  first.focus();
  container._trapHandler = e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
  };
  container.addEventListener('keydown', container._trapHandler);
}

/* ───────────────────── page transition (GSAP) ─────────────────────── */
const curtain = document.createElement('div');
curtain.className = 'curtain';
curtain.setAttribute('aria-hidden', 'true');
curtain.innerHTML = '<span></span>';
document.body.appendChild(curtain);

let busy = false, queued = null;

function doTransition() {
  if (reduceMotion) { show(); return; }
  if (busy) { queued = location.hash; return; }
  busy = true;

  const h = (location.hash || '#/').slice(1) || '/';
  const b = '/' + (h.split('/')[1] || '');
  curtain.firstChild.textContent = names[b] || '';

  const tl = gsap.timeline({
    onComplete() {
      busy = false;
      if (queued) { queued = null; doTransition(); }
    }
  });

  tl.set(curtain, { yPercent: 100, visibility: 'visible' })
    .to(curtain, { yPercent: 0, duration: 0.55, ease: EZ })
    .call(() => { show(); })
    .to(curtain, { yPercent: -100, duration: 0.65, ease: EZ, delay: 0.15 })
    .set(curtain, { visibility: 'hidden' });
}

window.addEventListener('hashchange', doTransition);

/* ───────────────── nav logo hover replay ──────────────────────────── */
const navLg = document.querySelector('.logo .lg');
function replay(el) { el.classList.remove('play'); void el.getBoundingClientRect(); el.classList.add('play'); }
document.querySelector('.logo').addEventListener('mouseenter', () => { replay(navLg); });

/* ───────────── show() override: init 3D on /skills ───────────────── */
// Wrap show() here (before any initial call) so ALL visits — first and return — get 3D init
const originalShow = show;
show = function () {
  originalShow();
  const h = (location.hash || '#/').slice(1) || '/';
  if (h.startsWith('/skills')) {
    setTimeout(init3DScene, 100); // slight delay to ensure layout is done
  }
};

/* ───────────────────── intro sequence (GSAP) ──────────────────────── */
let seen = false;
try {
  // Allow ?reset in URL to clear the intro-seen flag for dev/testing
  if (new URLSearchParams(location.search).has('reset')) sessionStorage.removeItem('gc_intro');
  seen = sessionStorage.getItem('gc_intro') === '1';
} catch (e) { /* noop */ }

/* ──────────────────── hero entrance timeline ──────────────────────── */
function heroEntrance() {
  if (reduceMotion) return gsap.timeline();
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  // Use x + opacity instead of clip-path for broad browser support (Safari/Firefox clip-path on large fonts is unreliable)
  tl.from('.hero .track', { x: '60%', opacity: 0, duration: 1.2, ease: 'power3.inOut' })
    .from('.hero .portrait', { y: 80, opacity: 0, duration: 1 }, '-=0.7')
    .from('.nav', { y: -100, duration: 0.8 }, '-=0.8')
    .from('.hero .label', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
    .from('.hero .contact a', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, '-=0.6');
  return tl;
}

if (reduceMotion || seen) {
  replay(navLg);
  show();
  if (!reduceMotion) heroEntrance();
} else {
  // Call show immediately so DOM is set up
  show();
  // Create hero timeline and pause it so initial states are set immediately
  const heroTl = heroEntrance().pause();

  const ov = document.createElement('div');
  ov.className = 'intro';
  ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = '<div class="box"><svg class="lg play" viewBox="0 0 140 140">' +
    '<path class="g" pathLength="100" d="M91.2 48.8 A30 30 0 1 0 100 70 L72 70" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle class="rg" cx="72" cy="70" r="11" fill="none" stroke="#1ecad3" stroke-width="3"/>' +
    '<circle class="nd" cx="72" cy="70" r="11" fill="#1ecad3"/>' +
    '</svg><div class="nm">Gunal Christ A</div></div>';
  document.body.appendChild(ov);

  const introTl = gsap.timeline({
    onComplete() {
      ov.remove();
      replay(navLg);
    }
  });

  introTl
    .to(ov.querySelector('.nm'), { opacity: 1, y: 0, duration: 0.6, delay: 1.1, ease: 'power2.out' })
    .to(ov, { opacity: 0, duration: 0.5, delay: 0.8, ease: 'power2.inOut' })
    .call(() => {
      heroTl.play();
    }, null, '-=0.4'); // Start hero entrance slightly before overlay fully fades

  ov.addEventListener('click', () => { introTl.progress(1); heroTl.play(); });

  try { sessionStorage.setItem('gc_intro', '1'); } catch (e) { /* noop */ }
}

/* ─────────────────── hero marquee (GSAP seamless loop) ────────────── */
(function initHeroMarquee() {
  if (reduceMotion) return;
  const tracks = document.querySelectorAll('.hero .track, .hero .track-sub');
  
  tracks.forEach(track => {
    // Duplicate spans for seamless loop
    const spans = track.querySelectorAll('span');
    spans.forEach(s => { track.appendChild(s.cloneNode(true)); });

    const marquee = gsap.to(track, {
      xPercent: -50,
      duration: track.classList.contains('track-sub') ? 35 : 28,
      ease: 'none',
      repeat: -1
    });

    // Speed up with scroll velocity
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const vel = Math.abs(self.getVelocity()) / 1000;
        const speed = gsap.utils.clamp(1, 4, 1 + vel);
        gsap.to(marquee, { timeScale: speed, duration: 0.4, ease: 'power2.out', overwrite: true });
      }
    });
  });
})();

/* ──────────── background rings parallax ───────────────────────────── */
(function initRingsParallax() {
  if (reduceMotion) return;
  gsap.utils.toArray('.ring').forEach(ring => {
    gsap.to(ring, {
      y: ring.classList.contains('r1') ? -15 : 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
})();

/* ──────────── about page marquee strip (velocity) ─────────────────── */
(function initStripMarquee() {
  if (reduceMotion) return;
  const strip = document.querySelector('.strip');
  if (!strip) return;
  const inner = strip.querySelector('div');
  if (!inner) return;

  // Replace CSS animation with GSAP
  inner.style.animation = 'none';
  const stripAnim = gsap.to(inner, {
    xPercent: -50,
    duration: 24,
    ease: 'none',
    repeat: -1
  });

  ScrollTrigger.create({
    trigger: strip,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      const vel = Math.abs(self.getVelocity()) / 800;
      const speed = gsap.utils.clamp(1, 5, 1 + vel);
      gsap.to(stripAnim, { timeScale: speed, duration: 0.5, ease: 'power2.out', overwrite: true });
    }
  });
})();

/* ─────────────────── project hover (gsap.quickTo) ─────────────────── */
(function initProjectHover() {
  const isDesktop = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!isDesktop || reduceMotion) return;

  const pk = document.createElement('div');
  pk.className = 'peek';
  pk.setAttribute('aria-hidden', 'true');
  pk.innerHTML = '<img alt="">';
  document.body.appendChild(pk);
  const pimg = pk.firstChild;

  const xTo = gsap.quickTo(pk, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(pk, 'y', { duration: 0.4, ease: 'power3.out' });

  document.querySelectorAll('[data-peek]').forEach(row => {
    row.addEventListener('mouseenter', e => {
      const s = document.querySelector('[data-route="' + row.dataset.peek + '"] .shots img');
      if (!s) return;
      pimg.src = s.src;
      gsap.set(pk, { x: e.clientX + 24, y: e.clientY + 24 });
      gsap.to(pk, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
      pk.classList.add('on');
    });
    row.addEventListener('mousemove', e => {
      xTo(e.clientX + 24);
      yTo(e.clientY + 24);
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(pk, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power2.in' });
      pk.classList.remove('on');
    });
  });
})();

/* ─────────────── page-level ScrollTrigger animations ──────────────── */
let currentTriggers = [];

function setupPageAnimations(section) {
  // Kill old triggers
  currentTriggers.forEach(t => t.kill());
  currentTriggers = [];
  // NOTE: refresh() is now called AFTER all triggers are set up (see end of function)

  if (reduceMotion) return;

  const route = section.dataset.route;

  // Title animation
  section.querySelectorAll('.pt').forEach(title => {
    gsap.set(title, { opacity: 0, y: 46 });
    const st = ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      }
    });
    currentTriggers.push(st);
    // If already visible (above fold), fire immediately
    if (title.getBoundingClientRect().top < window.innerHeight * 0.85) {
      gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
    }
  });

  // Cards, rows, shots, details — stagger reveal
  const revealItems = section.querySelectorAll('.card, .row, .shots figure, details, .flow span, .chip');
  if (revealItems.length) {
    gsap.set(revealItems, { opacity: 0, y: 24 });

    // Group by parent for staggering
    const groups = new Map();
    revealItems.forEach(item => {
      const parent = item.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(item);
    });

    groups.forEach(items => {
      const st = ScrollTrigger.create({
        trigger: items[0],
        start: 'top 90%',
        once: true,
        onEnter() {
          gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
        }
      });
      currentTriggers.push(st);
      // If first item already visible
      if (items[0].getBoundingClientRect().top < window.innerHeight * 0.9) {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
      }
    });
  }

  // Tables
  section.querySelectorAll('table').forEach(table => {
    gsap.set(table, { opacity: 0, y: 20 });
    const st = ScrollTrigger.create({
      trigger: table,
      start: 'top 90%',
      once: true,
      onEnter() { gsap.to(table, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }); }
    });
    currentTriggers.push(st);
    if (table.getBoundingClientRect().top < window.innerHeight * 0.9) {
      gsap.to(table, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 });
    }
  });

  // Arch images
  section.querySelectorAll('.arch').forEach(img => {
    gsap.set(img, { opacity: 0, y: 30 });
    const st = ScrollTrigger.create({
      trigger: img,
      start: 'top 90%',
      once: true,
      onEnter() { gsap.to(img, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }); }
    });
    currentTriggers.push(st);
  });

  // Two-column text
  section.querySelectorAll('.two p').forEach((p, i) => {
    gsap.set(p, { opacity: 0, y: 20 });
    const st = ScrollTrigger.create({
      trigger: p,
      start: 'top 90%',
      once: true,
      onEnter() { gsap.to(p, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.15 }); }
    });
    currentTriggers.push(st);
    if (p.getBoundingClientRect().top < window.innerHeight * 0.9) {
      gsap.to(p, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 + i * 0.15 });
    }
  });

  // Case study paragraphs
  section.querySelectorAll('.case p, .case li, .case ol').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 16 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter() { gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }); }
    });
    currentTriggers.push(st);
  });

  // Case headings
  section.querySelectorAll('.case h3').forEach(h => {
    gsap.set(h, { opacity: 0, y: 20 });
    const st = ScrollTrigger.create({
      trigger: h,
      start: 'top 90%',
      once: true,
      onEnter() { gsap.to(h, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }); }
    });
    currentTriggers.push(st);
  });

  // Stats countUp
  if (route === '/stats') {
    section.querySelectorAll('.stats b').forEach(b => {
      const text = b.textContent.trim();
      const num = parseFloat(text);
      if (isNaN(num)) return;
      const hasDecimal = text.includes('.');
      const suffix = text.replace(/[\d.]+/, '');

      gsap.set(b, { opacity: 0, y: 20 });
      const st = ScrollTrigger.create({
        trigger: b,
        start: 'top 85%',
        once: true,
        onEnter() {
          gsap.to(b, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
          const counter = { val: 0 };
          gsap.to(counter, {
            val: num,
            duration: 1.8,
            ease: 'power2.out',
            delay: 0.2,
            onUpdate() {
              b.textContent = (hasDecimal ? counter.val.toFixed(1) : Math.round(counter.val)) + suffix;
            }
          });
        }
      });
      currentTriggers.push(st);
    });
  }

  // Footer giant name: gray → full color on scrub
  const footerBig = section.querySelector('.big');
  if (footerBig) {
    gsap.set(footerBig, { color: '#555' });
    const st = ScrollTrigger.create({
      trigger: footerBig,
      start: 'top 95%',
      end: 'top 40%',
      scrub: 1,
      onUpdate(self) {
        const progress = self.progress;
        const theme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (theme === 'dark') {
          const c = Math.round(85 + progress * (243 - 85));
          footerBig.style.color = `rgb(${c}, ${c}, ${c})`;
        } else {
          const c = Math.round(200 - progress * (200 - 10));
          footerBig.style.color = `rgb(${c}, ${c}, ${c})`;
        }
      }
    });
    currentTriggers.push(st);
  }

  // Refresh AFTER all triggers are registered — ensures correct scroll
  // positions in Firefox and Safari (which have different layout timing than Chrome)
  requestAnimationFrame(() => { ScrollTrigger.refresh(); });
}

/* ───────────────────── 3D Scene (Skills Page) ─────────────────────── */
let scene, camera, renderer, particles, animationId;
let sceneInitialized = false;

function init3DScene() {
  if (sceneInitialized || reduceMotion) return;
  const canvas = document.getElementById('scene');
  if (!canvas) return;
  sceneInitialized = true;

  import('three').then((THREE) => {
    scene = new THREE.Scene();
    // Ensure we measure the parent for accurate sizing
    const container = canvas.parentElement;
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Neural network nodes
    const geometry = new THREE.BufferGeometry();
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorTeal = new THREE.Color('#1ecad3');

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 40;
      colorTeal.toArray(colors, i);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connections (Lines)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1ecad3, transparent: true, opacity: 0.15 });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    // Connect close nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 25) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let mouseX = 0;
    let mouseY = 0;

    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
      });
    }

    function animate() {
      if (!document.querySelector('[data-route="/skills"]').hidden) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        lines.rotation.y += 0.001;
        lines.rotation.x += 0.0005;

        particles.rotation.x += (mouseY - particles.rotation.x) * 0.05;
        particles.rotation.y += (mouseX - particles.rotation.y) * 0.05;
        lines.rotation.x += (mouseY - lines.rotation.x) * 0.05;
        lines.rotation.y += (mouseX - lines.rotation.y) * 0.05;

        renderer.render(scene, camera);
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!document.querySelector('[data-route="/skills"]').hidden) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });
  });
}

/* ─────────────── match-media for reduced motion ───────────────────── */
gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
  // Kill all ScrollTriggers, make everything visible
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.globalTimeline.clear();
  document.querySelectorAll('.pt, .card, .row, .shots figure, details, .flow span, .chip, table, .arch, .two p, .case p, .case li, .case ol, .case h3, .stats b, .big').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  if (hero) hero.classList.remove('pre');
  if (navEl) navEl.classList.remove('pre');
});
