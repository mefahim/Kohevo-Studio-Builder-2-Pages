const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const canvas = $('#siteCanvas');
const hero = $('#heroSection');
const toast = $('#toast');
let zoom = 100;
let toastTimer;
function notify(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),1800); }
function selectHero(){ hero.classList.add('selected'); notify('Hero section selected'); }
hero.addEventListener('click', selectHero);
hero.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); selectHero(); } });
$$('.context-toolbar [data-action]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const action=btn.dataset.action; if(action==='delete'){ hero.classList.remove('selected'); notify('Hero section deselected'); } if(action==='duplicate'){ notify('Hero section duplicated'); } }));
$$('.device-top').forEach(btn => btn.addEventListener('click', ()=>{ $$('.device-top').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); canvas.classList.remove('device-desktop','device-tablet','device-mobile'); canvas.classList.add(`device-${btn.dataset.device}`); notify(`${btn.dataset.device[0].toUpperCase()+btn.dataset.device.slice(1)} viewport`); }));
$$('[data-zoom]').forEach(btn => btn.addEventListener('click', ()=>{ const action=btn.dataset.zoom; if(action==='in') zoom=Math.min(125,zoom+10); if(action==='out') zoom=Math.max(50,zoom-10); if(action==='fit') zoom=100; $('#zoomValue').textContent=`${zoom}%`; canvas.style.transform=`scale(${zoom/100})`; canvas.style.transformOrigin='top center'; notify(action==='fit'?'Canvas fitted':`Zoom ${zoom}%`); }));
$('#overlayOpacity').addEventListener('input', e=>{ const value=e.target.value; $('#opacityValue').textContent=`${value}%`; $('.hero-overlay').style.background=`rgba(8,9,13,${value/100})`; });
$('#overlayToggle').addEventListener('click', e=>{ e.currentTarget.classList.toggle('active'); $('.hero-overlay').style.opacity=e.currentTarget.classList.contains('active')?'1':'0'; notify(e.currentTarget.classList.contains('active')?'Overlay enabled':'Overlay hidden'); });
$('#fitControl').addEventListener('change', e=>{ $('.hero-image').style.backgroundSize=e.target.value.toLowerCase(); notify(`Image fit: ${e.target.value}`); });
$('#positionControl').addEventListener('change', e=>{ $('.hero-image').style.backgroundPosition=e.target.value.toLowerCase(); notify(`Focal position: ${e.target.value}`); });
$('#heightControl').addEventListener('input', e=>{ const v=Math.max(420,Math.min(1000,Number(e.target.value)||720)); $('.hero-section').style.height=`${v}px`; });
$('#focalPicker').addEventListener('click', e=>{ const r=e.currentTarget.getBoundingClientRect(); const x=((e.clientX-r.left)/r.width)*100; const y=((e.clientY-r.top)/r.height)*100; $('#focalDot').style.left=`${x}%`; $('#focalDot').style.top=`${y}%`; $('.hero-image').style.backgroundPosition=`${x}% ${y}%`; notify(`Focal point ${Math.round(x)}% / ${Math.round(y)}%`); });
$$('.group-title').forEach(btn=>btn.addEventListener('click', ()=>{ const group=btn.closest('.inspector-group'); group.classList.toggle('open'); const body=$('.group-body',group); if(body) body.style.display=group.classList.contains('open')?'block':'none'; $('span',btn).textContent=group.classList.contains('open')?'⌃':'›'; }));
$$('.inspector-tab').forEach(btn=>btn.addEventListener('click', ()=>{ $$('.inspector-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); if(btn.dataset.tab!=='style') notify(`${btn.textContent} controls coming next`); }));
$$('.add-tab').forEach(btn=>btn.addEventListener('click', ()=>{ $$('.add-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); notify(`${btn.textContent} panel`); }));
$$('.bg-type').forEach(btn=>btn.addEventListener('click', ()=>{ $$('.bg-type').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); notify(`Background mode: ${btn.textContent}`); }));
$$('.palette-item').forEach(btn=>btn.addEventListener('click', ()=>notify(`${$('span',btn).textContent} added to canvas`)));
$('.publish-btn').addEventListener('click',()=>notify('Prototype publish flow ready')); $('.preview-btn').addEventListener('click',()=>notify('Preview mode toggled')); $('.reset-btn').addEventListener('click',()=>{ $('#overlayOpacity').value=52; $('#overlayOpacity').dispatchEvent(new Event('input')); $('#heightControl').value=720; $('#heightControl').dispatchEvent(new Event('input')); notify('Style changes reset'); });
document.addEventListener('keydown', e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault(); $('.search-box input').focus();} if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'){e.preventDefault();notify('Changes saved');} });
