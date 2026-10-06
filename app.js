const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const canvas = $('#siteCanvas');
const hero = $('#heroSection');
const toast = $('#toast');
const appShell = $('.app-shell');
const inspectorContent = $('#inspectorContent');
const inspectorTitle = $('.inspector h2');
const savedLabel = $('.saved-label');
const heroOverlay = $('.hero-overlay');
const heroImage = $('.hero-image');
let toastTimer;
let zoom = 100;
let activeTab = 'style';
let mobileDrawer = null;
const history = [];
const future = [];
const state = {
  device: 'desktop',
  selected: 'hero',
  overlay: true,
  overlayOpacity: 52,
  fit: 'cover',
  position: 'center center',
  focal: { x: 50, y: 50 },
  height: 720,
  grid: false,
  comments: false,
  added: [],
};

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}
function saveStatus(label = 'Saved just now') {
  savedLabel.textContent = label;
  $('.saved-dot').style.background = '#8be6b0';
}
function snapshot() {
  return JSON.stringify({ ...state, focal: { ...state.focal }, added: state.added.map(x => ({ ...x })) });
}
function restore(serialized) {
  const parsed = JSON.parse(serialized);
  Object.assign(state, parsed);
  state.focal = { ...parsed.focal };
  state.added = parsed.added || [];
  syncUI();
}
function transact(mutator, message) {
  history.push(snapshot());
  future.length = 0;
  mutator();
  syncUI();
  if (message) notify(message);
  saveStatus('Unsaved changes');
}
function undo() {
  if (!history.length) return notify('Nothing to undo');
  future.push(snapshot());
  restore(history.pop());
  notify('Change undone');
  saveStatus('Saved just now');
}
function redo() {
  if (!future.length) return notify('Nothing to redo');
  history.push(snapshot());
  restore(future.pop());
  notify('Change redone');
  saveStatus('Saved just now');
}
function selectNode(id, announce = true) {
  state.selected = id;
  syncUI();
  if (announce) notify(`${nodeLabel(id)} selected`);
}
function nodeLabel(id) {
  if (id === 'hero') return 'Hero section';
  const item = state.added.find(x => x.id === id);
  return item ? item.label : 'Canvas';
}
function selectedNode() {
  return state.selected === 'hero' ? hero : $(`[data-node-id="${state.selected}"]`);
}
function markEditorNode(node, id) {
  node.classList.add('editor-node');
  node.dataset.nodeId = id;
  node.tabIndex = 0;
  node.addEventListener('click', e => { if (!e.target.closest('button,a,input')) selectNode(id); });
  node.addEventListener('dblclick', e => {
    e.stopPropagation();
    const text = node.querySelector('[data-editable]');
    if (text) beginInlineEdit(text);
  });
}
function beginInlineEdit(element) {
  if (element.isContentEditable) return;
  const before = element.textContent;
  element.contentEditable = 'true';
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  const finish = () => {
    element.contentEditable = 'false';
    if (before !== element.textContent) {
      history.push(snapshot());
      future.length = 0;
      notify('Text updated');
      saveStatus('Unsaved changes');
    }
    element.removeEventListener('blur', finish);
    element.removeEventListener('keydown', onKey);
  };
  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); element.blur(); } if (e.key === 'Escape') { element.textContent = before; element.blur(); } };
  element.addEventListener('blur', finish);
  element.addEventListener('keydown', onKey);
  notify('Inline editing — press Enter to save');
}
function addNode(type, label, icon) {
  const id = `node-${Date.now()}`;
  state.added.push({ id, type, label, icon });
  const node = document.createElement('div');
  node.className = `added-node added-node-${type}`;
  node.innerHTML = `<span class="added-node-icon">${icon}</span><span data-editable>${label}</span><button class="node-remove" aria-label="Remove ${label}">×</button>`;
  $('.site-strip').before(node);
  markEditorNode(node, id);
  $('.node-remove', node).addEventListener('click', e => { e.stopPropagation(); removeNode(id); });
  selectNode(id, false);
}
function removeNode(id) {
  transact(() => {
    state.added = state.added.filter(x => x.id !== id);
    $(`[data-node-id="${id}"]`)?.remove();
    state.selected = 'hero';
  }, 'Element removed');
}
function duplicateSelected() {
  if (state.selected === 'hero') {
    transact(() => addNode('section', 'Hero section copy', '✦'), 'Hero section duplicated');
  } else {
    const item = state.added.find(x => x.id === state.selected);
    if (!item) return;
    transact(() => addNode(item.type, `${item.label} copy`, item.icon), `${item.label} duplicated`);
  }
}
function deleteSelected() {
  if (state.selected === 'hero') {
    transact(() => { hero.classList.remove('selected'); state.selected = null; }, 'Hero section deselected');
  } else if (state.selected) removeNode(state.selected);
}
function renderAddedNodes() {
  $$('.added-node').forEach(n => n.remove());
  const anchor = $('.site-strip');
  state.added.forEach(item => {
    const node = document.createElement('div');
    node.className = `added-node added-node-${item.type}`;
    node.innerHTML = `<span class="added-node-icon">${item.icon}</span><span data-editable>${item.label}</span><button class="node-remove" aria-label="Remove ${item.label}">×</button>`;
    anchor.before(node);
    markEditorNode(node, item.id);
    $('.node-remove', node).addEventListener('click', e => { e.stopPropagation(); removeNode(item.id); });
  });
}
function applyStyle() {
  hero.classList.toggle('selected', state.selected === 'hero');
  heroOverlay.style.opacity = state.overlay ? '1' : '0';
  heroOverlay.style.background = `rgba(8,9,13,${state.overlayOpacity / 100})`;
  heroImage.style.backgroundSize = state.fit;
  heroImage.style.backgroundPosition = state.position;
  $('.hero-section').style.height = `${state.height}px`;
  $('#overlayOpacity').value = state.overlayOpacity;
  $('#opacityValue').textContent = `${state.overlayOpacity}%`;
  $('#overlayToggle').classList.toggle('active', state.overlay);
  $('#fitControl').value = titleCase(state.fit);
  $('#positionControl').value = state.position.replace(/\b\w/g, c => c.toUpperCase());
  $('#heightControl').value = state.height;
  $('#focalDot').style.left = `${state.focal.x}%`;
  $('#focalDot').style.top = `${state.focal.y}%`;
  $('.canvas-stage').classList.toggle('show-grid', state.grid);
  $('.canvas-stage').classList.toggle('show-comments', state.comments);
}
function titleCase(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function syncInspectorSelection() {
  const label = nodeLabel(state.selected || 'canvas');
  inspectorTitle.textContent = label;
  $('.crumb-current').textContent = label;
  $('.breadcrumbs span:last-child').textContent = label;
  $$('.editor-node').forEach(node => node.classList.toggle('selected-node', node.dataset.nodeId === state.selected));
}
function syncUI() {
  canvas.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
  canvas.classList.add(`device-${state.device}`);
  $$('.device-top').forEach(btn => btn.classList.toggle('active', btn.dataset.device === state.device));
  appShell.classList.toggle('mobile-builder', state.device === 'mobile');
  applyStyle();
  renderAddedNodes();
  syncInspectorSelection();
  renderNavigator();
  if (activeTab !== 'style') renderInspectorTab(activeTab, false);
  if (state.device !== 'mobile') closeMobileDrawer();
}
function renderNavigator() {
  const nav = $('.navigator');
  const existing = $('.navigator-tree', nav);
  if (existing) existing.remove();
  const tree = document.createElement('div');
  tree.className = 'navigator-tree';
  tree.innerHTML = `<button data-nav-id="hero" class="${state.selected === 'hero' ? 'active' : ''}">▾ Hero section</button>${state.added.map(x => `<button data-nav-id="${x.id}" class="${state.selected === x.id ? 'active' : ''}">↳ ${x.label}</button>`).join('')}`;
  nav.append(tree);
  $$('[data-nav-id]', tree).forEach(btn => btn.addEventListener('click', () => selectNode(btn.dataset.navId)));
}
function renderInspectorTab(tab, announce = true) {
  activeTab = tab;
  $$('.inspector-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  if (tab === 'style') { inspectorContent.innerHTML = styleMarkup(); bindStyleMarkup(); }
  if (tab === 'content') { inspectorContent.innerHTML = contentMarkup(); bindContentMarkup(); }
  if (tab === 'advanced') { inspectorContent.innerHTML = advancedMarkup(); bindAdvancedMarkup(); }
  if (announce) notify(`${titleCase(tab)} controls`);
}
function styleMarkup() {
  return `<div class="inspector-group open"><button class="group-title">Background <span>⌃</span></button><div class="group-body"><div class="segmented"><button class="bg-type active">Image</button><button class="bg-type">Color</button><button class="bg-type">Gradient</button><button class="bg-type">Video</button></div><div class="media-card"><div class="media-thumb"></div><div><strong>northstar-hero.jpg</strong><small>1920 × 1280 · JPG</small></div><button class="media-more">⋯</button></div><div class="button-row"><button class="outline-btn" id="changeImage">Change image</button><button class="outline-btn icon-only" id="removeImage" title="Remove image">⌫</button></div><div class="control-row"><label>Fit</label><select id="fitControl"><option>Cover</option><option>Contain</option><option>Fill</option></select></div><div class="control-row"><label>Position</label><select id="positionControl"><option>Center center</option><option>Center top</option><option>Left center</option><option>Right center</option></select></div><div class="control-row focal-row"><label>Focal point</label><div class="focal-picker" id="focalPicker"><span id="focalDot"></span><i></i></div></div><div class="control-row"><label>Overlay</label><button class="toggle active" id="overlayToggle"><span></span></button></div><div class="control-row"><label>Overlay color</label><button class="color-control" id="colorControl"><span class="color-swatch"></span>#08090D <b>⌄</b></button></div><div class="control-row"><label>Opacity</label><div class="range-wrap"><input type="range" id="overlayOpacity" min="0" max="100" value="${state.overlayOpacity}" /><output id="opacityValue">${state.overlayOpacity}%</output></div></div></div></div><div class="inspector-group open"><button class="group-title">Layout <span>⌃</span></button><div class="group-body"><div class="two-controls"><div><label>Min height</label><div class="input-unit"><input id="heightControl" type="number" value="${state.height}" /><span>px</span></div></div><div><label>Content width</label><div class="input-unit"><input type="number" value="1180" /><span>px</span></div></div></div><div class="align-control"><button>≡</button><button class="active">≣</button><button>≡</button><button>↕</button><button>↕</button></div></div></div>${collapsibleMarkup(['Typography', 'Spacing', 'Border & radius', 'Shadow', 'Responsive', 'Interactions'])}`;
}
function collapsibleMarkup(items) { return items.map(item => `<div class="inspector-group"><button class="group-title">${item} <span>›</span></button><div class="group-body hidden-body"><div class="empty-control">Fine-tune ${item.toLowerCase()} for the selected element.</div></div></div>`).join(''); }
function contentMarkup() {
  return `<div class="inspector-group open"><button class="group-title">Text content <span>⌃</span></button><div class="group-body"><label class="field-label">Headline</label><textarea class="text-field" id="headlineField">Make space\nfor wonder.</textarea><label class="field-label">Supporting copy</label><textarea class="text-field" id="copyField">Northstar is a creative studio for people building a more considered future.</textarea><label class="field-label">CTA label</label><input class="text-field" id="ctaField" value="Explore our work" /><button class="apply-content" id="applyContent">Apply content</button></div></div><div class="inspector-group open"><button class="group-title">Media <span>⌃</span></button><div class="group-body"><div class="content-media-row"><span>Hero image</span><button class="outline-btn" id="contentChangeImage">Replace</button></div><div class="content-media-row"><span>Alt text</span><input class="text-field compact" value="Warm sunset over a creative landscape" /></div></div></div>`;
}
function advancedMarkup() {
  return `<div class="inspector-group open"><button class="group-title">Element identity <span>⌃</span></button><div class="group-body"><label class="field-label">HTML tag</label><select class="text-field"><option>section</option><option>header</option><option>main</option></select><label class="field-label">Element ID</label><input class="text-field" value="hero-section" /><label class="field-label">CSS classes</label><input class="text-field" value="hero-section selected" /></div></div><div class="inspector-group open"><button class="group-title">Visibility <span>⌃</span></button><div class="group-body"><div class="visibility-row"><span>Desktop</span><button class="toggle active"><span></span></button></div><div class="visibility-row"><span>Tablet</span><button class="toggle active"><span></span></button></div><div class="visibility-row"><span>Mobile</span><button class="toggle active"><span></span></button></div></div></div><div class="inspector-group open"><button class="group-title">Accessibility <span>⌃</span></button><div class="group-body"><label class="field-label">Aria label</label><input class="text-field" value="Hero section" /><label class="field-label">Keyboard focus</label><button class="selectable-row active">✓ Focusable element</button></div></div>`;
}
function bindGroupToggles() {
  $$('.group-title').forEach(btn => btn.addEventListener('click', () => {
    const group = btn.closest('.inspector-group');
    group.classList.toggle('open');
    const body = $('.group-body', group);
    if (body) body.style.display = group.classList.contains('open') ? 'block' : 'none';
    const span = $('span', btn);
    if (span) span.textContent = group.classList.contains('open') ? '⌃' : '›';
  }));
}
function bindStyleMarkup() {
  bindGroupToggles();
  $$('.bg-type').forEach(btn => btn.addEventListener('click', () => { $$('.bg-type').forEach(b => b.classList.remove('active')); btn.classList.add('active'); notify(`Background mode: ${btn.textContent}`); }));
  $('#overlayOpacity').addEventListener('input', e => transact(() => { state.overlayOpacity = Number(e.target.value); }, null));
  $('#overlayToggle').addEventListener('click', () => transact(() => { state.overlay = !state.overlay; }, state.overlay ? 'Overlay enabled' : 'Overlay hidden'));
  $('#fitControl').addEventListener('change', e => transact(() => { state.fit = e.target.value.toLowerCase(); }, `Image fit: ${e.target.value}`));
  $('#positionControl').addEventListener('change', e => transact(() => { state.position = e.target.value.toLowerCase(); }, `Focal position: ${e.target.value}`));
  $('#heightControl').addEventListener('input', e => { state.height = Math.max(420, Math.min(1000, Number(e.target.value) || 720)); applyStyle(); });
  $('#heightControl').addEventListener('change', () => { history.push(snapshot()); future.length = 0; saveStatus('Unsaved changes'); });
  $('#focalPicker').addEventListener('click', e => transact(() => { const r = e.currentTarget.getBoundingClientRect(); state.focal = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; state.position = `${state.focal.x}% ${state.focal.y}%`; }, `Focal point ${Math.round(state.focal.x)}% / ${Math.round(state.focal.y)}%`));
  $('#changeImage')?.addEventListener('click', () => notify('Media picker opened — choose a new image')); $('#removeImage')?.addEventListener('click', () => notify('Image removal queued'));
  $('#colorControl')?.addEventListener('click', () => notify('Color picker opened'));
}
function bindContentMarkup() {
  bindGroupToggles();
  $('#applyContent').addEventListener('click', () => {
    const headline = $('#headlineField').value.split('\n');
    const h1 = $('.hero-content h1');
    h1.innerHTML = `${escapeHTML(headline[0] || '')}<br><i>${escapeHTML(headline.slice(1).join(' ') || '')}</i>`;
    $('.hero-content p').textContent = $('#copyField').value;
    $('.hero-cta').childNodes[0].textContent = `${$('#ctaField').value} `;
    transact(() => {}, 'Content applied');
  });
  $('#contentChangeImage')?.addEventListener('click', () => notify('Content media picker opened'));
}
function bindAdvancedMarkup() { bindGroupToggles(); $$('.toggle').forEach(toggle => toggle.addEventListener('click', () => toggle.classList.toggle('active'))); $$('.selectable-row').forEach(row => row.addEventListener('click', () => row.classList.toggle('active'))); }
function escapeHTML(value) { return value.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function openMobileDrawer(name) {
  mobileDrawer = name;
  $('.mobile-builder-ui')?.classList.add('drawer-open');
  $$('.mobile-drawer').forEach(drawer => drawer.classList.toggle('active', drawer.dataset.drawer === name));
  $$('.mobile-dock button').forEach(btn => btn.classList.toggle('active', btn.dataset.mobilePanel === name));
}
function closeMobileDrawer() {
  mobileDrawer = null;
  $('.mobile-builder-ui')?.classList.remove('drawer-open');
  $$('.mobile-drawer').forEach(drawer => drawer.classList.remove('active'));
  $$('.mobile-dock button').forEach(btn => btn.classList.remove('active'));
}
function buildMobileUI() {
  if ($('.mobile-builder-ui')) return;
  const ui = document.createElement('div');
  ui.className = 'mobile-builder-ui';
  ui.innerHTML = `<div class="mobile-modebar"><button class="mobile-close">×</button><div><b>Mobile layout</b><span>390 × 844 · Editing responsive style</span></div><button class="mobile-save">Save</button></div><div class="mobile-drawers"><section class="mobile-drawer" data-drawer="add"><div class="mobile-drawer-head"><b>Add to mobile page</b><button class="mobile-drawer-close">×</button></div><input class="mobile-search" placeholder="Search mobile elements" />${mobilePalette()}</section><section class="mobile-drawer" data-drawer="layers"><div class="mobile-drawer-head"><b>Mobile layers</b><button class="mobile-drawer-close">×</button></div><div class="mobile-layer-list"><button data-nav-id="hero">✦ <span>Hero section</span><b>›</b></button><button>☰ <span>Mobile navigation</span><b>›</b></button>${state.added.map(x => `<button data-nav-id="${x.id}">${x.icon} <span>${x.label}</span><b>›</b></button>`).join('')}</div><button class="mobile-add-section">+ Add section</button></section><section class="mobile-drawer" data-drawer="inspect"><div class="mobile-drawer-head"><b>Quick inspector</b><button class="mobile-drawer-close">×</button></div><div class="mobile-inspect-grid"><button data-mobile-action="content">✎<span>Content</span></button><button data-mobile-action="style">✦<span>Style</span></button><button data-mobile-action="spacing">↕<span>Spacing</span></button><button data-mobile-action="visibility">◉<span>Visibility</span></button></div><div class="mobile-breakpoint"><span>Breakpoint</span><b>Mobile · 390px</b></div><div class="mobile-breakpoint"><span>Selected</span><b>${nodeLabel(state.selected)}</b></div></section></div><nav class="mobile-dock"><button data-mobile-panel="add"><span>＋</span>Add</button><button data-mobile-panel="layers"><span>☷</span>Layers</button><button data-mobile-panel="inspect"><span>✦</span>Inspect</button><button data-mobile-panel="preview"><span>◉</span>Preview</button></nav>`;
  $('.canvas-stage').append(ui);
  $$('.mobile-dock button').forEach(btn => btn.addEventListener('click', () => btn.dataset.mobilePanel === 'preview' ? notify('Mobile preview mode') : openMobileDrawer(btn.dataset.mobilePanel)));
  $$('.mobile-drawer-close, .mobile-close').forEach(btn => btn.addEventListener('click', closeMobileDrawer));
  $('.mobile-save').addEventListener('click', () => { saveStatus('Saved just now'); notify('Mobile changes saved'); });
  $$('.mobile-layer-list [data-nav-id]').forEach(btn => btn.addEventListener('click', () => { selectNode(btn.dataset.navId); closeMobileDrawer(); }));
  $$('.mobile-inspect-grid button').forEach(btn => btn.addEventListener('click', () => { if (btn.dataset.mobileAction === 'content') renderInspectorTab('content'); if (btn.dataset.mobileAction === 'style') renderInspectorTab('style'); notify(`${btn.textContent.trim()} controls opened`); }));
  $$('.mobile-palette-item').forEach(btn => btn.addEventListener('click', () => transact(() => addNode(btn.dataset.type, btn.dataset.label, btn.dataset.icon), `${btn.dataset.label} added to mobile canvas`)));
}
function mobilePalette() { return `<div class="mobile-palette"><p>Drag or tap to insert</p>${[['section','Section','▦'],['text','Text','T'],['image','Image','▣'],['button','Button','↗'],['form','Form','⌁']].map(([type,label,icon]) => `<button class="mobile-palette-item" data-type="${type}" data-label="${label}" data-icon="${icon}"><i>${icon}</i><span>${label}</span><b>＋</b></button>`).join('')}</div>`; }

function setupCanvasControls() {
  hero.addEventListener('click', e => { if (!e.target.closest('.context-toolbar')) selectNode('hero'); });
  hero.addEventListener('dblclick', e => { e.stopPropagation(); beginInlineEdit($('.hero-content h1')); });
  hero.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode('hero'); } });
  $$('.context-toolbar button').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); if (btn.dataset.action === 'duplicate') duplicateSelected(); else if (btn.dataset.action === 'delete') deleteSelected(); else notify(`${btn.title} tool active`); }));
  $$('.device-top').forEach(btn => btn.addEventListener('click', () => transact(() => { state.device = btn.dataset.device; }, `${titleCase(btn.dataset.device)} viewport`)));
  $$('[data-zoom]').forEach(btn => btn.addEventListener('click', () => { const action = btn.dataset.zoom; if (action === 'in') zoom = Math.min(140, zoom + 10); if (action === 'out') zoom = Math.max(50, zoom - 10); if (action === 'fit') zoom = 100; $('#zoomValue').textContent = `${zoom}%`; canvas.style.transform = `scale(${zoom / 100})`; canvas.style.transformOrigin = 'top center'; notify(action === 'fit' ? 'Canvas fitted' : `Zoom ${zoom}%`); }));
  $('.navigator-toggle').addEventListener('click', () => { $('.navigator-tree')?.classList.toggle('visible'); notify('Navigator toggled'); });
  $$('.canvas-tool').forEach(btn => btn.addEventListener('click', () => { if (btn.title === 'Show grid') transact(() => { state.grid = !state.grid; }, state.grid ? 'Grid enabled' : 'Grid hidden'); else if (btn.title === 'Comments') transact(() => { state.comments = !state.comments; }, state.comments ? 'Comments shown' : 'Comments hidden'); else notify('Select tool active'); }));
  $('.publish-btn').addEventListener('click', () => { saveStatus('Saved just now'); notify('Prototype publish flow ready'); });
  $('.preview-btn').addEventListener('click', () => notify('Preview mode toggled'));
  $('.reset-btn').addEventListener('click', () => transact(() => Object.assign(state, { overlay: true, overlayOpacity: 52, fit: 'cover', position: 'center center', height: 720, focal: { x: 50, y: 50 } }), 'Style changes reset'));
  $$('.add-tab').forEach(btn => btn.addEventListener('click', () => { $$('.add-tab').forEach(b => b.classList.remove('active')); btn.classList.add('active'); notify(`${btn.textContent} panel`); }));
  $$('.palette-item').forEach(btn => btn.addEventListener('click', () => transact(() => addNode(btn.querySelector('span').textContent.toLowerCase().replace(' ', '-'), btn.querySelector('span').textContent, btn.querySelector('i').textContent), `${btn.querySelector('span').textContent} added`)));
  $$('.utility-link').forEach(btn => btn.addEventListener('click', () => notify(`${btn.textContent.trim()} opened`)));
  $$('.inspector-tab').forEach(btn => btn.addEventListener('click', () => renderInspectorTab(btn.dataset.tab)));
  $$('.top-actions .icon-btn').forEach(btn => { if (btn.title === 'Undo') btn.addEventListener('click', undo); if (btn.title === 'Redo') btn.addEventListener('click', redo); });
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); } if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); } if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('.search-box input').focus(); } if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveStatus('Saved just now'); notify('Changes saved'); } if (e.key === 'Escape') closeMobileDrawer(); });
}

buildMobileUI();
setupCanvasControls();
renderInspectorTab('style', false);
syncUI();
