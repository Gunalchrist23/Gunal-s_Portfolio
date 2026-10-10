# Prompt for Antigravity

You are a senior front-end engineer. Continue and finish this existing portfolio for Gunal Christ A (fresh AI/ML graduate and full-stack developer). Do NOT redesign it. Keep the current look (near-black #0a0a0a, light gray #d9dcdf, teal #1ecad3, Anton headlines, Plus Jakarta Sans body) and all existing content. Work in plan mode: read the whole project first, write a short plan, then implement step by step, running the dev server and checking every page in the browser as you go.

## Project
Vite + vanilla JS. `index.html` holds all pages as `<section data-route="...">` (13 routes), `src/main.js` has the hash router, Sections drawer, intro, and animated logo, `src/style.css` holds styles and light/dark tokens, `public/assets` holds images and the resume PDF. Run: `npm install`, `npm run dev`.

## 1. GSAP scroll animation (use gsap, ScrollTrigger, lenis; already in package.json)
a. Hero background name: the giant "GUNAL CHRIST" text behind the portrait must move continuously from right to left as a seamless GSAP loop (duplicated track, xPercent, linear, repeat -1). Keep it behind the portrait. Make it speed up with scroll velocity via ScrollTrigger and ease back to normal.
b. Hero entrance timeline after the logo intro: label, subtitle, contact chips, and "Enter portfolio" cue stagger up; the portrait rises and fades in (do not break its translateX(-50%) centering; animate yPercent or wrap it).
c. ScrollTrigger reveals on every page: page titles (line or character split), cards, project rows (stagger), certification details, figures and screenshots. Count up the numbers on the Stats page. Add a 10 to 15px parallax on the background rings.
d. Route transition: replace the basic one with the black-panel transition in section 6.
e. Lenis smooth scroll synced with ScrollTrigger (disable on touch if it feels janky).
Rules: animate only transform and opacity. Respect prefers-reduced-motion with gsap.matchMedia (no motion, all content visible). Content must stay visible if JS fails. No layout shift. Keep the existing once-per-session logo intro and the nav logo hover replay.

## 6. Reference transitions (match these motions)
Study `reference/transitions-1-intro-hero-about.jpg` and `reference/transitions-2-works-process-footer.jpg` (frames from a concept video; read left to right, top to bottom). Keep OUR colors and content; copy only the motion. A basic CSS/Web Animations version of items 1 to 5 already exists in `src/main.js` and `src/style.css` (curtain, `.pre` hero reveal, `titleIn`, `.strip`, `.peek`). Rebuild them with GSAP and remove the old code so nothing runs twice.
1. Load sequence: black screen with the small logo and name, then the giant name wipes in from the right (clip-path or xPercent), the portrait rises from below, the nav pill drops from the top, and the name marquee then runs right to left forever.
2. Page transition: a full-screen black panel (#0a0a0a) rises from the bottom, covers the viewport with the destination name small in the centre, content swaps, then the panel exits upward. Ease power4.inOut, about 0.55s in and 0.65s out. Handle rapid clicks (queue, never stack).
3. Section titles: huge condensed titles enter at low opacity and about 40px lower, then settle to full colour. Paragraphs, cards, arrows, and meta text follow 0.2 to 0.4s later with a stagger.
4. Marquee strip: a black strip of uppercase text with a star separator scrolls horizontally on the About page; its speed reacts to scroll velocity.
5. Projects list: hairline-divided rows. Hovering a row shows a floating preview image that follows the cursor with smooth easing (gsap.quickTo), scales in and out, and the row title nudges right. Disable on touch.
6. Sticky process card (optional): a rounded black card slides up over the previous section and pins; the headline words dim to gray except the active one, and a side image cross-fades per step as you scroll. Use only real steps from the projects (for example Data, Preprocess, Models, Dashboard). Do not invent claims.
7. Footer: the giant name fades from gray to full colour as it scrolls into view (scrub), above "Let's work together" with an arrow.

## 2. 3D (optional, only if it improves the site)
Add one tasteful Three.js scene, for example a slowly rotating teal wireframe neural-network or node-G object, on the Skills page or beside the hero. No model files exist, so build it procedurally, or use a CC0 .glb (Poly Pizza or Quaternius) under 1.5 MB and credit it in README. Lazy-load it, pause when off-screen, cap pixel ratio at 2, and show a static fallback on mobile, reduced motion, or no WebGL. No copyrighted models.

## 3. Check and fix
- Routing: move from hash routes to clean URLs (History API) with a `vercel.json` rewrite, or keep hash if risky. Add per-page `<title>`, meta description, Open Graph and Twitter tags, a social preview image, canonical, `robots.txt`, `sitemap.xml`.
- Accessibility: move focus to the page `<h1>` on route change, add a skip link, visible focus styles, a Sections drawer focus trap with Esc, contrast of muted text at least 4.5:1, and keyboard access everywhere.
- Responsive audit at 360, 768, 1024, and 1440px: portrait versus contact chips overlap in the hero, marquee size, nav, drawer, tables, screenshots. No horizontal scroll.
- Performance: Lighthouse at least 90 performance and 95 for accessibility, best practices, and SEO. Compress images, lazy-load, preload fonts, font-display swap.
- Clean up: console errors, broken links, dead or duplicated CSS. Confirm light and dark tokens still work.
- Replace the favicon with the node G logo set (`public/favicon.svg` exists).

## 4. Content rules (do not violate)
- Never add claims, metrics, or accomplishments that are not already on the site. The Ediglobe and YBI internships appear only as completion certificates. The 94.3% is the team's XGBoost result from the IEEE paper, not a personal claim.
- Do not state yield units (the paper says tons per acre, the dashboard shows t/ha; unresolved).
- Do not show the phone number anywhere on the site.
- Keep the project role statements as written. No fake testimonials or invented text.
- Leave these as `<!-- TODO(Gunal) -->` and list them at the end: verify the IEEE link (ieeexplore.ieee.org/document/11546909), confirm the co-author list, DocVault live demo and repo (current links point to an older version), the FarmSense dashboard repo link, and the final domain.

## 5. Deliver
A per-file summary of changes, the remaining TODOs, how to run and build, and Vercel deploy notes.
