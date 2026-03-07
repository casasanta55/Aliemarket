/**
 * ALIEMARKET — App Module
 * Gestiona: render de productos, filtros, carrito, checkout.
 *
 * Arquitectura: objeto App con submódulos
 *  App.Products  — render y filtrado
 *  App.Cart      — estado y UI del carrito
 *  App.Checkout  — flujo de pago simulado
 *  App.UI        — helpers generales de interfaz
 */

const App = (() => {

  // ══════════════════════════════════════════════════════
  // PRODUCTS — Render y filtrado
  // ══════════════════════════════════════════════════════
  const Products = (() => {
    let state = { tipo: 'todos', categoria: '', query: '' };

    function filter(products) {
      return products.filter(p => {
        const matchTipo = state.tipo === 'todos' || p.tipo === state.tipo;
        const matchCat  = !state.categoria || p.categoria === state.categoria;
        const matchQ    = !state.query ||
          [p.nombre, p.descripcion, p.categoria].join(' ')
            .toLowerCase().includes(state.query.toLowerCase());
        return matchTipo && matchCat && matchQ;
      });
    }

    function cardHTML(p) {
      const typeClass = p.tipo === 'digital' ? 'card--digital' : 'card--physical';
      const typeLabel = p.tipo === 'digital' ? 'Digital' : 'Físico';
      const badge = p.badge ? `<span class="card-badge card-badge--${p.badge.toLowerCase().replace(/\s/g,'-')}">${p.badge}</span>` : '';
      const hotmart = p.hotmartLink
        ? `<a href="${p.hotmartLink}" target="_blank" class="btn btn--hotmart" rel="noopener">Hotmart</a>`
        : '';
      const wa = `<a href="https://wa.me/${ALIEMARKET_DATA.CONFIG.whatsapp}?text=Hola%2C%20me%20interesa%20${encodeURIComponent(p.nombre)}" target="_blank" class="btn btn--wa" title="Preguntar por WhatsApp" aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.885l6.21-1.63A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.516-5.178-1.415l-.371-.22-3.686.967.985-3.593-.242-.38A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      </a>`;

      return `
        <article class="card ${typeClass}" data-id="${p.id}" role="listitem">
          <div class="card-image-wrap">
            <img src="${p.imagen}" alt="${p.nombre}" class="card-img" loading="lazy"
              onerror="this.src='https://placehold.co/600x400/0f0f0f/aaaaaa?text=ALIEMARKET'">
            ${badge}
            <span class="card-type-pill">${typeLabel}</span>
          </div>
          <div class="card-body">
            <span class="card-category">${p.categoria}</span>
            <h3 class="card-title">${p.nombre}</h3>
            <p class="card-desc">${p.descripcion}</p>
            <div class="card-footer">
              <span class="card-price">$${p.precio} <small>${p.moneda}</small></span>
              <div class="card-actions">
                ${wa}
                ${hotmart}
                <button class="btn btn--cart" data-id="${p.id}" aria-label="Añadir al carrito">
                  + Carrito
                </button>
              </div>
            </div>
          </div>
        </article>`;
    }

    function render() {
      const grid = document.getElementById('products-grid');
      const empty = document.getElementById('products-empty');
      if (!grid) return;

      const products = filter(ALIEMARKET_DATA.getAll());
      if (products.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      grid.innerHTML = products.map(cardHTML).join('');

      // Bind carrito
      grid.querySelectorAll('.btn--cart').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.currentTarget.dataset.id;
          const product = ALIEMARKET_DATA.getById(id);
          if (product) Cart.add(product, btn);
        });
      });
    }

    function updateCategoryFilter() {
      const select = document.getElementById('filter-category');
      if (!select) return;
      const cats = state.tipo === 'todos'
        ? [...ALIEMARKET_DATA.CATEGORIES.digital, ...ALIEMARKET_DATA.CATEGORIES.fisico]
        : (ALIEMARKET_DATA.CATEGORIES[state.tipo] || []);

      select.innerHTML = `<option value="">Todas las categorías</option>` +
        cats.map(c => `<option value="${c}" ${state.categoria === c ? 'selected' : ''}>${c}</option>`).join('');
    }

    function initFilters() {
      // Tipo (digital / físico / todos)
      document.querySelectorAll('[data-filter-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.tipo = btn.dataset.filterTipo;
          state.categoria = '';
          document.querySelectorAll('[data-filter-tipo]').forEach(b =>
            b.classList.toggle('active', b === btn));
          updateCategoryFilter();
          render();
        });
      });

      // Categoría
      document.getElementById('filter-category')?.addEventListener('change', e => {
        state.categoria = e.target.value;
        render();
      });

      // Búsqueda
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', e => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            state.query = e.target.value;
            render();
          }, 250);
        });
      }
    }

    function init() {
      initFilters();
      render();
    }

    return { init, render };
  })();

  // ══════════════════════════════════════════════════════
  // CART — Estado y UI
  // ══════════════════════════════════════════════════════
  const Cart = (() => {
    let items = JSON.parse(localStorage.getItem('alie_cart') || '[]');

    function save() {
      localStorage.setItem('alie_cart', JSON.stringify(items));
    }

    function total() {
      return items.reduce((sum, i) => sum + i.precio * i.qty, 0);
    }

    function count() {
      return items.reduce((sum, i) => sum + i.qty, 0);
    }

    function updateBadge() {
      const badge = document.getElementById('cart-count');
      const c = count();
      if (badge) {
        badge.textContent = c;
        badge.hidden = c === 0;
      }
    }

    function add(product, triggerEl) {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        existing.qty++;
      } else {
        items.push({ ...product, qty: 1 });
      }
      save();
      updateBadge();
      renderDrawer();
      UI.flyAnimation(triggerEl);
      UI.toast(`"${product.nombre}" añadido al carrito`);
    }

    function remove(id) {
      items = items.filter(i => i.id !== id);
      save();
      updateBadge();
      renderDrawer();
    }

    function changeQty(id, delta) {
      const item = items.find(i => i.id === id);
      if (!item) return;
      item.qty = Math.max(1, item.qty + delta);
      save();
      updateBadge();
      renderDrawer();
    }

    function clear() {
      items = [];
      save();
      updateBadge();
      renderDrawer();
    }

    function renderDrawer() {
      const body = document.getElementById('cart-body');
      const footer = document.getElementById('cart-footer');
      if (!body) return;

      if (items.length === 0) {
        body.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
        if (footer) footer.hidden = true;
        return;
      }

      if (footer) footer.hidden = false;

      body.innerHTML = items.map(i => `
        <div class="cart-item">
          <img src="${i.imagen}" alt="${i.nombre}" class="cart-item-img"
            onerror="this.src='https://placehold.co/60x60/0f0f0f/aaa?text=R'">
          <div class="cart-item-info">
            <p class="cart-item-name">${i.nombre}</p>
            <p class="cart-item-price">$${(i.precio * i.qty).toFixed(2)}</p>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-id="${i.id}" data-delta="-1">−</button>
            <span>${i.qty}</span>
            <button class="qty-btn" data-id="${i.id}" data-delta="1">+</button>
          </div>
          <button class="cart-item-remove" data-id="${i.id}" aria-label="Eliminar">✕</button>
        </div>`).join('');

      document.getElementById('cart-total-val').textContent = `$${total().toFixed(2)} USD`;

      body.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => changeQty(btn.dataset.id, parseInt(btn.dataset.delta)));
      });
      body.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => remove(btn.dataset.id));
      });
    }

    function open() {
      const drawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('cart-overlay');
      if (drawer) drawer.classList.add('cart--open');
      if (overlay) overlay.classList.add('overlay--visible');
      document.body.style.overflow = 'hidden';
      renderDrawer();
    }

    function close() {
      const drawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('cart-overlay');
      if (drawer) drawer.classList.remove('cart--open');
      if (overlay) overlay.classList.remove('overlay--visible');
      document.body.style.overflow = '';
    }

    function init() {
      document.getElementById('cart-btn')?.addEventListener('click', open);
      document.getElementById('cart-overlay')?.addEventListener('click', close);
      document.getElementById('cart-close')?.addEventListener('click', close);
      document.getElementById('cart-clear')?.addEventListener('click', clear);
      document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
        close();
        Checkout.open(items, total());
      });
      updateBadge();
    }

    function getItems() { return items; }
    function getTotal() { return total(); }

    return { init, add, remove, clear, open, close, getItems, getTotal };
  })();

  // ══════════════════════════════════════════════════════
  // CHECKOUT — Flujo de pago simulado
  // Para conectar pasarela real: reemplaza la función
  // _confirmOrder() con una llamada fetch() a tu API.
  // ══════════════════════════════════════════════════════
  const Checkout = (() => {
    let currentItems = [];
    let currentTotal = 0;

    const PAYMENT_METHODS = [
      { id: 'usd',    label: 'USD — PayPal / Stripe',          hint: 'Pago externo. Te enviaremos instrucciones.' },
      { id: 'cup',    label: 'CUP / MLC — Transferencia',       hint: 'Pago manual. Coordinaremos por WhatsApp.' },
      { id: 'crypto', label: 'Crypto — BTC / USDT / ETH',       hint: 'Envía a la dirección que te indicaremos.' },
    ];

    function open(items, total) {
      currentItems = items;
      currentTotal = total;

      const modal = document.getElementById('checkout-modal');
      if (!modal) return;

      document.getElementById('co-items').innerHTML = items.map(i =>
        `<div class="co-line"><span>${i.nombre} ×${i.qty}</span><span>$${(i.precio*i.qty).toFixed(2)}</span></div>`
      ).join('');
      document.getElementById('co-total').textContent = `$${total.toFixed(2)} USD`;

      document.getElementById('co-methods').innerHTML = PAYMENT_METHODS.map(m => `
        <label class="co-method">
          <input type="radio" name="pay_method" value="${m.id}" ${m.id === 'usd' ? 'checked' : ''}>
          <span class="co-method-label">${m.label}</span>
          <span class="co-method-hint">${m.hint}</span>
        </label>`).join('');

      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      const modal = document.getElementById('checkout-modal');
      if (modal) modal.classList.remove('modal--open');
      document.body.style.overflow = '';
    }

    function _confirmOrder() {
      const method = document.querySelector('input[name="pay_method"]:checked')?.value;
      if (!method) return;

      // ─── PUNTO DE INTEGRACIÓN: Pasarela real ──────────
      // Reemplaza este bloque con:
      //   fetch('/api/orders', { method:'POST', body: JSON.stringify({ items, method }) })
      //   .then(res => res.json()).then(data => { window.location = data.paymentUrl; })
      // ─────────────────────────────────────────────────

      document.getElementById('co-success').hidden = false;
      document.getElementById('co-form').hidden = true;
      Cart.clear();
      setTimeout(close, 3500);
    }

    function init() {
      document.getElementById('checkout-close')?.addEventListener('click', close);
      document.getElementById('co-confirm')?.addEventListener('click', _confirmOrder);
      document.getElementById('checkout-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) close();
      });
    }

    return { init, open, close };
  })();

  // ══════════════════════════════════════════════════════
  // UI — Helpers generales
  // ══════════════════════════════════════════════════════
  const UI = (() => {
    function toast(msg, duration = 2800) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      container.appendChild(el);
      requestAnimationFrame(() => el.classList.add('toast--visible'));
      setTimeout(() => {
        el.classList.remove('toast--visible');
        setTimeout(() => el.remove(), 400);
      }, duration);
    }

    function flyAnimation(btn) {
      if (!btn) return;
      const cartIcon = document.getElementById('cart-btn');
      if (!cartIcon) return;

      const start = btn.getBoundingClientRect();
      const end   = cartIcon.getBoundingClientRect();

      const dot = document.createElement('div');
      dot.className = 'fly-dot';
      dot.style.cssText = `left:${start.left + start.width/2}px;top:${start.top + start.height/2}px`;
      document.body.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.transform = `translate(${end.left - start.left}px, ${end.top - start.top}px) scale(0.2)`;
        dot.style.opacity = '0';
      });
      setTimeout(() => dot.remove(), 600);
    }

    function initNavScroll() {
      const nav = document.getElementById('main-nav');
      window.addEventListener('scroll', () => {
        nav?.classList.toggle('nav--scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    function initMobileMenu() {
      const toggle = document.getElementById('nav-menu-toggle');
      const menu   = document.getElementById('nav-links');
      toggle?.addEventListener('click', () => {
        menu?.classList.toggle('nav-links--open');
        toggle.setAttribute('aria-expanded', menu?.classList.contains('nav-links--open'));
      });
      // Cerrar al hacer clic en enlace
      menu?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => menu.classList.remove('nav-links--open'));
      });
    }

    function initHeroScroll() {
      document.getElementById('hero-cta')?.addEventListener('click', () => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    function initScrollReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    function init() {
      initNavScroll();
      initMobileMenu();
      initHeroScroll();
      initScrollReveal();
    }

    return { init, toast, flyAnimation };
  })();

  // ══════════════════════════════════════════════════════
  // INIT — Punto de entrada
  // ══════════════════════════════════════════════════════
  function init() {
    UI.init();
    Products.init();
    Cart.init();
    Checkout.init();
    RaumBot.init();

    // Escucha eventos del bot
    document.addEventListener('raum:addToCart', e => Cart.add(e.detail, null));
    document.addEventListener('raum:dataChanged', () => Products.render());
  }

  document.addEventListener('DOMContentLoaded', init);

  return { UI, Cart, Products };
})();
