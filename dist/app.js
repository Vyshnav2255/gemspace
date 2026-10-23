const gems = ['Dewdrop','Blue spark','Sea glass','Moonstone','Amethyst','Sunstone','Rose quartz','Jade','Aurora','Starlight','Prism','Everlight'];
const notes = {outline:'The shape of something special. Transparent, scalable SVG.',uncolored:'All the facets, softly desaturated. Transparent SVG with embedded artwork.',color:'Full color, faceted and ready to find a home. Transparent PNG.',glow:'A little extra stardust. Transparent SVG with a subtle built-in glow.'};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const grid = document.getElementById('grid');
const tabs = document.querySelector('.tabs');
const styleButtons = [...tabs.querySelectorAll('[data-style]')];
const status = document.getElementById('status');
const imageCache = new Map();
let style = 'color';
let revision = 0;
const slug = name => name.toLowerCase().replaceAll(' ','-');
const path = (name, variant = style) => `assets/${slug(name)}${variant === 'color' ? '.png' : `-${variant}.svg`}`;
const previewPath = (name, variant) => `assets/previews/${slug(name)}-${variant}.svg`;
const styleLabel = variant => variant === 'uncolored' ? 'without color' : variant;

// Construct the cards once so style changes preserve focus, layout and hover state.
grid.innerHTML = gems.map((name,i)=>`<article class="card"><div class="art"><span class="number">${String(i+1).padStart(2,'0')} / 12</span><div class="gem-stage"><img src="${previewPath(name,style)}" alt="${name}, ${styleLabel(style)} style" width="230" height="285" loading="lazy" decoding="async"></div></div><div class="card-info"><h3>${name}</h3><a class="download" href="${path(name)}" download aria-label="Download ${name}, ${styleLabel(style)} style" title="Download ${name}"><svg class="ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><use href="assets/interface-icons.svg#download"/></svg></a></div></article>`).join('');
const cards = [...grid.querySelectorAll('.card')];

function loadPreview(name, variant) {
  const src = previewPath(name, variant);
  if (!imageCache.has(src)) {
    const image = new Image();
    image.src = src;
    const ready = image.decode().then(() => src).catch(error => {
      imageCache.delete(src);
      throw error;
    });
    imageCache.set(src, ready);
  }
  return imageCache.get(src);
}

async function swapPreview(card, name, variant, request) {
  try {
    const src = await loadPreview(name, variant);
    if (request !== revision) return;
    card.settlePreview?.();
    const stage = card.querySelector('.gem-stage');
    const old = stage.querySelector('img');
    if (old.getAttribute('src') === src) return;
    const image = old.cloneNode(false);
    image.src = src;
    image.alt = `${name}, ${styleLabel(variant)} style`;
    image.loading = 'eager';
    // Only the incoming image is exposed to assistive technology during the fade.
    old.setAttribute('aria-hidden', 'true');
    stage.append(image);
    const bounds = card.getBoundingClientRect();
    const offscreen = bounds.bottom < 0 || bounds.top > window.innerHeight;
    if (reducedMotion.matches || document.hidden || offscreen || !stage.animate) {
      stage.replaceChildren(image);
      return;
    }
    const options = {duration: 380, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'};
    const animations = [old.animate([{opacity:1},{opacity:0}], options), image.animate([{opacity:0},{opacity:1}], options)];
    const settle = () => {
      if (card.settlePreview !== settle) return;
      stage.replaceChildren(image);
      animations.forEach(animation => animation.cancel());
      card.settlePreview = null;
    };
    card.settlePreview = settle;
    Promise.all(animations.map(animation => animation.finished)).then(settle, () => {});
  } catch {
    if (request === revision) status.textContent = 'A preview could not load. Select the style again to retry; downloads are still available.';
  }
}

const indicator = document.createElement('span');
indicator.className = 'tab-indicator';
indicator.setAttribute('aria-hidden', 'true');
tabs.prepend(indicator);
tabs.classList.add('has-indicator');
function positionIndicator() {
  const active = tabs.querySelector('[aria-pressed="true"]');
  indicator.style.width = `${active.offsetWidth}px`;
  indicator.style.height = `${active.offsetHeight}px`;
  indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
}
positionIndicator();
requestAnimationFrame(() => tabs.classList.add('indicator-ready'));
if ('ResizeObserver' in window) new ResizeObserver(positionIndicator).observe(tabs);
document.fonts?.ready.then(positionIndicator);

function selectStyle(variant) {
  if (!notes[variant]) return;
  style = variant;
  const request = ++revision;
  status.textContent = '';
  styleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.style === variant)));
  positionIndicator();
  const note = document.getElementById('style-note');
  note.textContent = notes[variant];
  if (!reducedMotion.matches) {
    note.getAnimations().forEach(animation => animation.cancel());
    note.animate([{opacity:.35,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}], {duration:280,easing:'ease-out'});
  }
  cards.forEach((card,i) => {
    const link = card.querySelector('.download');
    link.href = path(gems[i],variant);
    link.setAttribute('aria-label', `Download ${gems[i]}, ${styleLabel(variant)} style`);
    void swapPreview(card,gems[i],variant,request);
  });
}
styleButtons.forEach((button,index) => {
  button.addEventListener('click', () => selectStyle(button.dataset.style));
  button.addEventListener('keydown', event => {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? styleButtons.length-1 : event.key === 'ArrowRight' ? (index+1)%styleButtons.length : event.key === 'ArrowLeft' ? (index+styleButtons.length-1)%styleButtons.length : null;
    if (next === null) return;
    event.preventDefault();
    styleButtons[next].focus();
    styleButtons[next].click();
  });
});

// A restrained spotlight follows the pointer; no perpetual JavaScript animation loop.
cards.forEach(card => {
  let frame = 0;
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX-bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY-bounds.top}px`);
    });
  });
  card.addEventListener('pointerleave', () => cancelAnimationFrame(frame));
});

function downloadFeedback(control) {
  if (reducedMotion.matches) return;
  const icon = control.querySelector('.ui-icon');
  if (icon) {
    icon.getAnimations().forEach(animation => animation.cancel());
    icon.animate([{transform:'translateY(0)'},{transform:'translateY(4px)',offset:.35},{transform:'translateY(-2px)',offset:.7},{transform:'translateY(0)'}], {duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
  }
}
document.getElementById('download-pack').addEventListener('click', event => {
  const a = document.createElement('a');
  a.href = `gemspace-${style}.zip`;
  a.download = `gemspace-${style}.zip`;
  a.click();
  downloadFeedback(event.currentTarget);
  status.textContent = `Your ${styleLabel(style)} set download has started. Twelve gems, ready for your universe.`;
});
grid.addEventListener('click', event => {
  const link = event.target.closest('.download');
  if (!link) return;
  downloadFeedback(link);
  status.textContent = `${link.closest('.card').querySelector('h3').textContent} download started. A little treasure for your project.`;
});

// Reveal once, only when motion is welcome. Content stays visible without JS support.
const revealTargets = [...cards, document.querySelector('.license')];
let revealObserver;
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      revealObserver.unobserve(entry.target);
    }
  }), {threshold:.06});
  if (!reducedMotion.matches) revealTargets.forEach((element,index) => {
    element.style.setProperty('--reveal-delay', `${index%3*45}ms`);
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}
grid.addEventListener('focusin', event => event.target.closest('.card')?.classList.remove('reveal-pending'));
reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  revealTargets.forEach(element => element.classList.remove('reveal-pending'));
  revealObserver?.disconnect();
  cards.forEach(card => card.settlePreview?.());
});

let seed = 42;
const random = () => {seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<110;i++) {
  const star=document.createElement('i');
  star.className='star';
  const size=random()>.94?2:1;
  star.style.cssText=`left:${random()*100}%;top:${random()*100}%;width:${size}px;height:${size}px;--opacity:${.15+random()*.45};--time:${4+random()*6}s;animation-delay:-${random()*10}s`;
  document.getElementById('stars').append(star);
}
function syncVisibility() {document.body.classList.toggle('page-inactive',document.hidden);}
document.addEventListener('visibilitychange',syncVisibility);
syncVisibility();
if ('IntersectionObserver' in window) {
  const hero=document.querySelector('.hero');
  new IntersectionObserver(([entry]) => hero.classList.toggle('hero-offscreen',!entry.isIntersecting)).observe(hero);
}
