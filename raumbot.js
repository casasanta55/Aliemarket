/**
 * ALIEMARKET — AlieBot Module
 * Chat simulado. Para conectar IA real: reemplaza _generateResponse()
 * con fetch() a OpenAI / Claude API.
 */
const RaumBot = (() => {
  let isOpen = false;
  let adminMode = false;
  const ADMIN_PIN = 'alie2026';

  const GREETINGS = ['hola','buenos días','buenas tardes','buenas noches','hey','hi'];
  const FALLBACKS = [
    'Hmm, no entendí bien. Prueba con "cursos", "ropa" o "auriculares".',
    'No encontré algo exacto. ¿Puedes ser más específico?',
    'Dime qué tipo de producto buscas y te ayudo.',
  ];

  function parseAdminCommand(input) {
    const t = input.trim();
    if (t.startsWith('/login ')) {
      const pin = t.slice(7).trim();
      adminMode = pin === ADMIN_PIN;
      return { type: 'login', success: adminMode };
    }
    if (t === '/logout') { adminMode = false; return { type: 'logout' }; }
    if (!adminMode) return null;
    if (t.startsWith('/addProduct ')) {
      try {
        const product = JSON.parse(t.slice(12).trim());
        const missing = ['id','nombre','tipo','categoria','precio','moneda'].filter(k => !(k in product));
        if (missing.length) return { type:'addProduct', error:`Faltan: ${missing.join(', ')}` };
        RAUM_DATA.add(product);
        return { type:'addProduct', product };
      } catch(e) { return { type:'addProduct', error: e.message }; }
    }
    if (t.startsWith('/removeProduct ')) {
      const id = t.slice(15).trim();
      try { RAUM_DATA.remove(id); return { type:'removeProduct', id }; }
      catch(e) { return { type:'removeProduct', error: e.message }; }
    }
    if (t === '/listProducts') return { type:'listProducts', products: RAUM_DATA.getAll() };
    if (t === '/resetProducts') { RAUM_DATA.reset(); return { type:'resetProducts' }; }
    if (t === '/help') return { type:'help' };
    return null;
  }

  function _generateResponse(input) {
    const q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const products = RAUM_DATA.getAll();
    if (q.startsWith('/login')) return { text:'🔐 Admin: <code>/login TU_PIN</code>' };
    if (q.startsWith('/')) return { text:'⚠️ Comando no reconocido. Escribe <code>/help</code> en modo admin.' };
    if (GREETINGS.some(g => q.includes(g)))
      return { text:`¡Hola! 👋 Soy <strong>AlieBot</strong>, tu asistente de ALIEMARKET. ¿Qué buscas hoy?` };

    const budgetMatch = q.match(/menos de (\d+)|maximo (\d+)|hasta (\d+)|presupuesto (\d+)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1]||budgetMatch[2]||budgetMatch[3]||budgetMatch[4]);
      const matches = products.filter(p => p.precio <= budget);
      if (!matches.length) return { text:`No encontré productos por debajo de $${budget}.` };
      return { text:`${matches.length} producto(s) por $${budget} o menos:`, products: matches.slice(0,4) };
    }

    const keywords = q.split(/\s+/).filter(w => w.length > 2);
    const scored = products.map(p => {
      const h = `${p.nombre} ${p.categoria} ${p.descripcion} ${p.tipo}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      return { ...p, _score: keywords.reduce((a,kw) => a + (h.includes(kw)?1:0), 0) };
    }).filter(p => p._score > 0).sort((a,b) => b._score - a._score);

    if (scored.length) return { text:`Encontré ${scored.length} resultado(s) para "<em>${input}</em>":`, products: scored.slice(0,3) };
    if (q.includes('digital')||q.includes('curso')||q.includes('ebook'))
      return { text:'Productos digitales destacados:', products: products.filter(p=>p.tipo==='digital').slice(0,3) };
    if (q.includes('fisico')||q.includes('ropa')||q.includes('electronica'))
      return { text:'Productos físicos destacados:', products: products.filter(p=>p.tipo==='fisico').slice(0,3) };
    if (q.includes('oferta')||q.includes('descuento')) {
      const m = products.filter(p=>p.badge==='Oferta').slice(0,3);
      if (m.length) return { text:'Productos en oferta:', products: m };
    }
    return { text: FALLBACKS[Math.floor(Math.random()*FALLBACKS.length)] };
  }

  function _adminResponse(cmd) {
    switch(cmd.type) {
      case 'login': return cmd.success ? '✅ <strong>Modo Admin activado.</strong> Escribe <code>/help</code>.' : '❌ PIN incorrecto.';
      case 'logout': return '🔒 Sesión admin cerrada.';
      case 'addProduct': return cmd.error ? `❌ Error: ${cmd.error}` : `✅ "<strong>${cmd.product.nombre}</strong>" añadido.`;
      case 'removeProduct': return cmd.error ? `❌ ${cmd.error}` : `🗑️ Producto <strong>${cmd.id}</strong> eliminado.`;
      case 'listProducts': return `📦 <strong>${cmd.products.length} productos:</strong><br>${cmd.products.map(p=>`• <code>${p.id}</code> — ${p.nombre} ($${p.precio})`).join('<br>')}`;
      case 'resetProducts': return '♻️ Productos restaurados a valores por defecto.';
      case 'help': return `<strong>Comandos admin:</strong><br><code>/addProduct {json}</code><br><code>/removeProduct ID</code><br><code>/listProducts</code><br><code>/resetProducts</code><br><code>/logout</code>`;
      default: return '❓ Comando no reconocido.';
    }
  }

  function _renderProductCard(p) {
    return `<div class="bot-product-card" data-id="${p.id}">
      <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://placehold.co/80x60/050510/22d3ee?text=ALIE'">
      <div class="bot-product-info">
        <span class="bot-product-name">${p.nombre}</span>
        <span class="bot-product-price">$${p.precio} ${p.moneda}</span>
        <button class="bot-add-btn" onclick="RaumBot.addToCartFromBot('${p.id}')">+ Carrito</button>
      </div>
    </div>`;
  }

  function _appendMessage(role, html, products) {
    const c = document.getElementById('raumbot-messages');
    if (!c) return;
    const b = document.createElement('div');
    b.className = `bot-msg bot-msg--${role}`;
    b.innerHTML = role === 'bot'
      ? `<div class="bot-avatar">A</div><div class="bot-bubble"><div>${html}</div>${products ? `<div class="bot-products">${products.map(_renderProductCard).join('')}</div>` : ''}</div>`
      : `<div class="bot-bubble">${html}</div>`;
    c.appendChild(b);
    c.scrollTop = c.scrollHeight;
    requestAnimationFrame(() => b.classList.add('bot-msg--visible'));
  }

  function _typing() {
    return new Promise(resolve => {
      _appendMessage('bot','<span class="bot-typing"><span></span><span></span><span></span></span>',null);
      setTimeout(() => {
        const msgs = document.querySelectorAll('.bot-msg--bot');
        msgs[msgs.length-1]?.remove();
        resolve();
      }, 700 + Math.random()*400);
    });
  }

  async function handleInput(input) {
    const text = input.trim();
    if (!text) return;
    _appendMessage('user', text, null);
    await _typing();
    const cmd = parseAdminCommand(text);
    if (cmd) {
      _appendMessage('bot', _adminResponse(cmd), null);
      if (['addProduct','removeProduct','resetProducts'].includes(cmd.type) && !cmd.error)
        document.dispatchEvent(new CustomEvent('raum:dataChanged'));
      return;
    }
    const r = _generateResponse(text);
    _appendMessage('bot', r.text, r.products || null);
  }

  function addToCartFromBot(id) {
    const p = RAUM_DATA.getById(id);
    if (p) {
      document.dispatchEvent(new CustomEvent('raum:addToCart', { detail: p }));
      _appendMessage('bot', `✅ <strong>${p.nombre}</strong> añadido al carrito.`, null);
    }
  }

  function toggle() {
    isOpen = !isOpen;
    document.getElementById('raumbot-widget')?.classList.toggle('raumbot--open', isOpen);
    document.getElementById('raumbot-fab')?.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      document.getElementById('raumbot-input')?.focus();
      const msgs = document.getElementById('raumbot-messages');
      if (msgs && msgs.children.length === 0) {
        setTimeout(() => _appendMessage('bot',
          `¡Hola! Soy <strong>AlieBot</strong> 🤖<br>Dime qué buscas o escribe <em>"cursos"</em>, <em>"electrónica"</em>...<br><small>Admin: <code>/login alie2026</code></small>`,
          null), 300);
      }
    }
  }

  function init() {
    const input = document.getElementById('raumbot-input');
    document.getElementById('raumbot-send')?.addEventListener('click', () => {
      const v = input?.value||''; if(input) input.value=''; handleInput(v);
    });
    input?.addEventListener('keydown', e => {
      if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); const v=input.value; input.value=''; handleInput(v); }
    });
    document.getElementById('raumbot-fab')?.addEventListener('click', toggle);
    document.getElementById('raumbot-close')?.addEventListener('click', toggle);
  }

  return { init, toggle, addToCartFromBot, handleInput };
})();
