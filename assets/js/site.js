// Builders of Ceylon — site-wide behaviour
(function(){
  const D = window.CB_DATA;

  // ---------- 1. inject floating CTA + picker dialog (every page) ----------
  function ensurePicker(){
    if (document.getElementById('cb-picker')) return;
    const float = document.createElement('a');
    float.href = '#'; float.className = 'float-cta'; float.id = 'cb-float';
    float.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Tell us what\'s wrong';
    float.addEventListener('click', e => { e.preventDefault(); openPicker(); });
    document.body.appendChild(float);

    const dlg = document.createElement('dialog');
    dlg.id = 'cb-picker'; dlg.className = 'picker';
    dlg.innerHTML = `
      <div class="picker-inner">
        <div class="picker-head">
          <button class="back" id="pk-back" hidden>← Back</button>
          <div class="crumb" id="pk-crumb">Step 1 of 3 · What trade?</div>
          <button class="x" id="pk-x" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="picker-progress"><span id="pp1" class="on"></span><span id="pp2"></span><span id="pp3"></span></div>
        <div class="picker-body" id="pk-body"></div>
        <div class="picker-foot" style="justify-content:flex-end">
          <div id="pk-foot-right"></div>
        </div>
      </div>`;
    document.body.appendChild(dlg);

    dlg.querySelector('#pk-x').addEventListener('click', () => dlg.close());
    dlg.querySelector('#pk-back').addEventListener('click', () => stepBack());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  let state = { step:1, trade:null, problem:null, district:null };

  function openPicker(presetTrade){
    ensurePicker();
    state = { step:1, trade:null, problem:null, district:null };
    if (presetTrade){ state.trade = presetTrade; state.step = 2; }
    render();
    const dlg = document.getElementById('cb-picker');
    dlg.showModal();
  }
  window.CB_openPicker = openPicker;

  function render(){
    const body = document.getElementById('pk-body');
    const crumb = document.getElementById('pk-crumb');
    const back = document.getElementById('pk-back');
    const footR = document.getElementById('pk-foot-right');
    document.getElementById('pp1').classList.toggle('on', state.step >= 1);
    document.getElementById('pp2').classList.toggle('on', state.step >= 2);
    document.getElementById('pp3').classList.toggle('on', state.step >= 3);
    back.hidden = state.step === 1;
    footR.innerHTML = '';

    if (state.step === 1){
      crumb.textContent = 'Step 1 of 3 · What trade?';
      body.innerHTML = `
        <h2>What needs fixing?</h2>
        <p class="sub">Pick the area of the house we should look at.</p>
        <div class="picker-options cols-3" id="pk-opts"></div>`;
      const wrap = body.querySelector('#pk-opts');
      D.trades.forEach(t => {
        const b = document.createElement('button');
        b.className = 'picker-opt';
        b.innerHTML = `<span class="ot">${t.name}</span><span class="od">${t.tagline}</span>`;
        b.addEventListener('click', () => { state.trade = t.id; state.step = 2; render(); });
        wrap.appendChild(b);
      });
    } else if (state.step === 2){
      const trade = D.trades.find(t => t.id === state.trade);
      crumb.textContent = `Step 2 of 3 · ${trade.name} — what's the problem?`;
      body.innerHTML = `
        <h2>What's the problem?</h2>
        <p class="sub">Tap the closest match. You can explain more in the message.</p>
        <div class="picker-options" id="pk-opts"></div>`;
      const wrap = body.querySelector('#pk-opts');
      D.problems[state.trade].forEach(p => {
        const b = document.createElement('button');
        b.className = 'picker-opt';
        b.innerHTML = `<span class="ot">${p}</span>`;
        b.addEventListener('click', () => { state.problem = p; state.step = 3; render(); });
        wrap.appendChild(b);
      });
    } else if (state.step === 3){
      const trade = D.trades.find(t => t.id === state.trade);
      crumb.textContent = `Step 3 of 3 · Where are you?`;
      body.innerHTML = `
        <h2>Where are you?</h2>
        <p class="sub">We cover the entire Western Province. Pick your district.</p>
        <div class="picker-options cols-3" id="pk-opts"></div>
        <div class="picker-preview" id="pk-preview"></div>`;
      const wrap = body.querySelector('#pk-opts');
      D.districts.forEach(d => {
        const b = document.createElement('button');
        b.className = 'picker-opt';
        b.innerHTML = `<span class="ot">${d}</span>`;
        b.addEventListener('click', () => { state.district = d; updatePreview(); });
        wrap.appendChild(b);
      });
      // initial preview placeholder
      document.getElementById('pk-preview').innerHTML =
        `Your message preview: <br><br><i>Hi Builders of Ceylon — I have a "<b>${state.problem}</b>" issue (<b>${trade.name}</b>) in <b>[select district]</b>. Please help.</i>`;

      const send = document.createElement('button');
      send.className = 'send'; send.id = 'pk-send';
      send.disabled = true;
      send.innerHTML = 'Send on WhatsApp <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      send.addEventListener('click', () => {
        const url = send.dataset.url;
        if (!url) return;
        window.open(url, '_blank', 'noopener');
      });
      document.getElementById('pk-foot-right').appendChild(send);
    }
  }

  function updatePreview(){
    const trade = D.trades.find(t => t.id === state.trade);
    const txt = `Hi Builders of Ceylon — I have a "${state.problem}" issue (${trade.name}) in ${state.district}. Please help.`;
    document.getElementById('pk-preview').innerHTML =
      `Your message preview: <br><br><i>${escapeHtml(txt)}</i>`;
    const send = document.getElementById('pk-send');
    send.dataset.url = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(txt)}`;
    send.disabled = false;
    // highlight chosen district
    document.querySelectorAll('#pk-opts .picker-opt').forEach(b => {
      b.style.borderColor = b.querySelector('.ot').textContent === state.district ? 'var(--gold)' : '';
      b.style.background  = b.querySelector('.ot').textContent === state.district ? 'rgba(201,162,74,.12)' : '';
    });
  }

  function stepBack(){
    if (state.step === 3){ state.district = null; state.step = 2; }
    else if (state.step === 2){ state.problem = null; state.step = 1; }
    render();
  }

  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // ---------- 2. topbar scroll + mobile nav ----------
  function setupTopbar(){
    const bar = document.querySelector('.topbar');
    if (!bar) return;
    const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 20);
    onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

    const tog = bar.querySelector('.mobile-toggle');
    const nav = bar.querySelector('.nav');
    if (tog && nav){
      tog.addEventListener('click', () => nav.classList.toggle('open'));
    }
  }

  // ---------- 3. reveal on scroll ----------
  function setupReveal(){
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
    els.forEach(e => io.observe(e));
  }

  // ---------- 4. view transitions on same-origin links ----------
  function setupTransitions(){
    if (!('startViewTransition' in document)) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.startViewTransition(() => { window.location.href = href; });
    });
  }

  // ---------- 5. cursor ring ----------
  function setupCursor(){
    if (matchMedia('(hover:none)').matches) return;
    const r = document.createElement('div'); r.className = 'cursor-ring';
    document.body.appendChild(r);
    let x=0,y=0,tx=0,ty=0;
    document.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; r.classList.add('show'); });
    document.addEventListener('mouseleave', () => r.classList.remove('show'));
    document.addEventListener('mouseover', e => {
      const t = e.target;
      const big = t.closest('a, button, .trade-card, .picker-opt');
      r.classList.toggle('big', !!big);
    });
    (function loop(){ x += (tx-x)*.18; y += (ty-y)*.18; r.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  }

  // ---------- 6. CB easter egg ----------
  function setupEgg(){
    let buf = '';
    document.addEventListener('keydown', e => {
      buf = (buf + e.key.toLowerCase()).slice(-2);
      if (buf === 'bc'){
        document.body.classList.add('flash');
        setTimeout(() => document.body.classList.remove('flash'), 700);
      }
    });
  }

  // ---------- 7. fill contact placeholders ----------
  function fillContacts(){
    document.querySelectorAll('[data-cb-phone]').forEach(e => e.textContent = D.phoneDisplay);
    document.querySelectorAll('[data-cb-tel]').forEach(e => e.setAttribute('href', `tel:+${D.whatsapp}`));
    document.querySelectorAll('[data-cb-wa]').forEach(e => {
      const text = e.getAttribute('data-cb-wa') || 'Hi Builders of Ceylon — I need help.';
      e.setAttribute('href', `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`);
      e.setAttribute('target', '_blank'); e.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('[data-cb-hours]').forEach(e => e.textContent = D.hours);
    document.querySelectorAll('[data-cb-email]').forEach(e => { e.textContent = D.email; e.setAttribute('href', `mailto:${D.email}`); });
    // hook picker triggers
    document.querySelectorAll('[data-cb-picker]').forEach(e => {
      const preset = e.getAttribute('data-cb-picker') || '';
      e.addEventListener('click', ev => { ev.preventDefault(); openPicker(preset || undefined); });
    });
  }

  // ---------- 8. inline picker on trade pages ----------
  function setupInlinePicker(){
    const inline = document.getElementById('cb-inline-picker');
    if (!inline) return;
    const trade = inline.getAttribute('data-trade');
    const t = D.trades.find(x => x.id === trade);
    if (!t) return;
    let problem = null;
    const list = D.problems[trade].map(p => `<button class="picker-opt" data-p="${escapeHtml(p)}"><span class="ot">${p}</span></button>`).join('');
    inline.innerHTML = `
      <div class="section-label">Tell us what's wrong</div>
      <h2 class="section-title">A ${t.name.toLowerCase()} problem? Tap it.</h2>
      <p class="section-lede">Pick the problem, pick your district, and we'll open WhatsApp with the message ready.</p>
      <div class="picker-options mt-40" style="grid-template-columns:repeat(2,1fr)" id="ip-opts">${list}</div>
      <div id="ip-step2" style="display:none; margin-top:32px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <div class="section-label" style="margin:0">Step 2 · Where are you?</div>
          <button id="ip-back" style="background:none; border:none; cursor:pointer; font-family:var(--mono); font-size:11px; letter-spacing:.12em; color:var(--gold); padding:0">← Change problem</button>
        </div>
        <div class="picker-options cols-3 mt-40" id="ip-dist">
          ${D.districts.map(d => `<button class="picker-opt" data-d="${d}"><span class="ot">${d}</span></button>`).join('')}
        </div>
        <div class="picker-preview mt-40" id="ip-preview" style="max-width:none"></div>
        <div style="margin-top:20px"><button id="ip-send" class="cta-pill" disabled style="opacity:.4; cursor:not-allowed; border:none">Send on WhatsApp →</button></div>
      </div>`;
    inline.querySelectorAll('#ip-opts .picker-opt').forEach(b => {
      b.addEventListener('click', () => {
        problem = b.dataset.p;
        district = null;
        inline.querySelectorAll('#ip-opts .picker-opt').forEach(x => { x.style.borderColor=''; x.style.background=''; });
        inline.querySelectorAll('#ip-dist .picker-opt').forEach(x => { x.style.borderColor=''; x.style.background=''; });
        b.style.borderColor='var(--gold)'; b.style.background='rgba(201,162,74,.12)';
        const step2 = document.getElementById('ip-step2');
        step2.style.display='block';
        step2.scrollIntoView({ behavior:'smooth', block:'nearest' });
        updateIp();
      });
    });
    let district = null;
    inline.querySelectorAll('#ip-dist .picker-opt').forEach(b => {
      b.addEventListener('click', () => {
        district = b.dataset.d;
        inline.querySelectorAll('#ip-dist .picker-opt').forEach(x => { x.style.borderColor=''; x.style.background=''; });
        b.style.borderColor='var(--gold)'; b.style.background='rgba(201,162,74,.12)';
        updateIp();
      });
    });
    // "Change problem" resets step 2
    inline.addEventListener('click', e => {
      if (e.target.id === 'ip-back'){
        problem = null; district = null;
        document.getElementById('ip-step2').style.display='none';
        inline.querySelectorAll('#ip-opts .picker-opt').forEach(x => { x.style.borderColor=''; x.style.background=''; });
      }
    });
    function updateIp(){
      const pv = document.getElementById('ip-preview');
      const send = document.getElementById('ip-send');
      if (!problem) return;
      const txt = `Hi Builders of Ceylon — I have a "${problem}" issue (${t.name}) in ${district || '[select district]'}. Please help.`;
      pv.innerHTML = `Your message preview: <br><br><i>${escapeHtml(txt)}</i>`;
      if (district){
        send.disabled = false;
        send.style.opacity=''; send.style.cursor='pointer';
        send.onclick = () => window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
      } else {
        send.disabled = true;
        send.style.opacity='.4'; send.style.cursor='not-allowed';
        send.onclick = null;
      }
    }
  }

  // ---------- boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    fillContacts();
    setupTopbar();
    setupReveal();
    setupTransitions();
    setupCursor();
    setupEgg();
    ensurePicker();
    setupInlinePicker();
  });
})();
