const gems = ['Dewdrop','Blue spark','Sea glass','Moonstone','Amethyst','Sunstone','Rose quartz','Jade','Aurora','Starlight','Prism','Everlight'];
const descriptions = ['A fresh beginning','A flicker of possibility','A moment of calm','A little lunar magic','Quietly extraordinary','Pocket-sized sunshine','A softer kind of strength','Something worth growing','Chase a new horizon','A wish made tangible','Every color, every possibility','Keep your light on'];
const notes = {outline:'The shape of something special. Transparent, scalable SVG.',uncolored:'All the facets, softly desaturated. Transparent SVG with embedded artwork.',color:'Full color, faceted and ready to find a home. Transparent PNG.',glow:'A little extra stardust. Transparent SVG with a subtle built-in glow.'};
let style = 'color';
const slug = name => name.toLowerCase().replaceAll(' ','-');
const path = name => `assets/${slug(name)}${style === 'color' ? '.png' : `-${style}.svg`}`;
function render() {
 document.getElementById('grid').innerHTML = gems.map((name,i)=>`<article class="card"><div class="art"><span class="number">${String(i+1).padStart(2,'0')} / 12</span><img src="${path(name)}" alt="${name}, ${style === 'uncolored' ? 'without color' : style} style" width="110" height="145" loading="lazy"></div><div class="card-info"><div><h3>${name}</h3><small>${descriptions[i]}</small></div><a class="download" href="${path(name)}" download aria-label="Download ${name}, ${style} style" title="Download ${name}">↘</a></div></article>`).join('');
 document.getElementById('style-note').textContent = notes[style];
 document.querySelectorAll('[data-style]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.style===style)));
}
document.querySelectorAll('[data-style]').forEach(b=>b.addEventListener('click',()=>{style=b.dataset.style;render()}));
document.getElementById('download-pack').addEventListener('click',()=>{const a=document.createElement('a');a.href=`gemspace-${style}.zip`;a.download=`gemspace-${style}.zip`;a.click();document.getElementById('status').textContent=`Your ${style === 'uncolored' ? 'without color' : style} set download has started. Twelve gems, ready for your universe.`});
let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
for(let i=0;i<160;i++){const star=document.createElement('i');star.className='star';const size=random()>0.94?2:1;star.style.cssText=`left:${random()*100}%;top:${random()*100}%;width:${size}px;height:${size}px;--opacity:${.15+random()*.5};--time:${2+random()*5}s;animation-delay:-${random()*6}s`;document.getElementById('stars').append(star)}
render();
