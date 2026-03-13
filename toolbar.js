/* ============================================================
   ALIEMARKET — toolbar.js
   Barra de herramientas unificada: Tienda + Admin
   Navegación, filtros, breadcrumbs, acciones rápidas
   ============================================================ */

'use strict';

// ── TOOLBAR TIENDA ────────────────────────────────────────────
class StoreToolbar {
  constructor() {
    this.precioFiltro = 'all';
    this.vistaActual  = 'grid';
    this.filtrosActivos = [];
    this._mount();
    this._syncWithApp();
  }

  _mount() {
    // Reemplaza la sección #filters con el toolbar completo
    const oldFilters = document.getElementById('filters');
    if (!oldFilters) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'store-toolbar';
    toolbar.innerHTML = this._html();
    oldFilters.replaceWith(toolbar);

    this._bindEvents();
  }

  _html() {
    return `
    <!-- ── BREADCRUMB ── -->
    <div class="tb-breadcrumb">
      <div class="tb-crumbs">
        <span class="tb-crumb" onclick="window.location.reload()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Inicio
        </span>
        <span class="tb-crumb-sep">›</span>
        <span class="tb-crumb active" id="bc-section">Catálogo</span>
        <span class="tb-crumb-sep" id="bc-sep2" style="display:none">›</span>
        <span class="tb-crumb active" id="bc-cat" style="display:none"></span>
      </div>
      <div class="tb-live-tag">
        <span class="tb-live-dot"></span>
        <span id="tb-count">12 productos</span>
      </div>
    </div>

    <!-- ── FILA PRINCIPAL ── -->
    <div class="tb-main-row">
      <!-- Categorías -->
      <div class="tb-cats" id="tb-cats">
        <button class="tb-cat active" data-cat="all">
          <span class="tb-cat-icon">⬡</span> Todos
        </button>
        <button class="tb-cat" data-cat="programacion">
          <span class="tb-cat-icon">💻</span> Programación
        </button>
        <button class="tb-cat" data-cat="marketing">
          <span class="tb-cat-icon">📢</span> Marketing
        </button>
        <button class="tb-cat" data-cat="trading">
          <span class="tb-cat-icon">₿</span> Trading
        </button>
        <button class="tb-cat" data-cat="diseño">
          <span class="tb-cat-icon">🎨</span> Diseño
        </button>
        <button class="tb-cat" data-cat="negocios">
          <span class="tb-cat-icon">💼</span> Negocios
        </button>
        <button class="tb-cat" data-cat="bundle">
          <span class="tb-cat-icon">🚀</span> Bundles
        </button>
        <button class="tb-cat" data-cat="negocios">
          <span class="tb-cat-icon">💸</span> Afiliados & IA
        </button>
      </div>

      <!-- Separador vertical -->
      <div class="tb-divider"></div>

      <!-- Controles derechos -->
      <div class="tb-controls">
        <!-- Precio rápido -->
        <div class="tb-price-group">
          <button class="tb-price-btn active" data-price="all">Todos</button>
          <button class="tb-price-btn" data-price="0-30">‹$30</button>
          <button class="tb-price-btn" data-price="30-60">$30–60</button>
          <button class="tb-price-btn" data-price="60-999">$60+</button>
        </div>

        <!-- Ordenar -->
        <div class="tb-sort-wrap">
          <svg class="tb-sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
          <select id="tb-sort" class="tb-sort">
            <option value="default">Destacados</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="popular">Populares</option>
          </select>
        </div>

        <!-- Vista grid / lista -->
        <div class="tb-view-toggle">
          <button class="tb-view-btn active" id="view-grid" onclick="storeToolbar.setVista('grid')" title="Vista cuadrícula">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          <button class="tb-view-btn" id="view-list" onclick="storeToolbar.setVista('list')" title="Vista lista">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>

        <!-- Limpiar filtros -->
        <button class="tb-clear-btn" id="tb-clear" onclick="storeToolbar.limpiarFiltros()" title="Limpiar filtros">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Limpiar
        </button>
      </div>
    </div>

    <!-- ── FILTROS ACTIVOS (chips) ── -->
    <div class="tb-active-filters" id="tb-active-filters"></div>
    `;
  }

  _bindEvents() {
    // Categorías
    document.querySelectorAll('.tb-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tb-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        if (!window.ALIE) return; window.ALIE.state.filtroActivo = cat;
        this._updateBreadcrumb(cat, btn.textContent.trim());
        this._addChip('cat', cat, btn.textContent.trim());
        window.ALIE?.renderProductos();
        this._syncCount();
      });
    });

    // Precio
    document.querySelectorAll('.tb-price-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tb-price-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.precioFiltro = btn.dataset.price;
        this._applyPrecioFilter();
        if (btn.dataset.price !== 'all') {
          this._addChip('price', btn.dataset.price, `Precio: ${btn.textContent.trim()}`);
        } else {
          this._removeChip('price');
        }
      });
    });

    // Sort
    document.getElementById('tb-sort')?.addEventListener('change', function() {
      if (!window.ALIE) return; window.ALIE.state.orden = this.value;
      window.ALIE?.renderProductos();
    });
  }

  _applyPrecioFilter() {
    const [min, max] = this.precioFiltro === 'all'
      ? [0, Infinity]
      : this.precioFiltro.split('-').map(Number);

    // Aplicar filtro de precio sobre los productos visibles
    if (!window.ALIE) return; const todos = window.ALIE.state.productos;
    const filtrados = todos.filter(p => p.precioUSD >= min && p.precioUSD <= max);

    // Sobreescribir temporalmente la lista renderizada
    this._renderFiltradosPrecio(filtrados);
  }

  _renderFiltradosPrecio(lista) {
    if (this.precioFiltro === 'all') {
      window.ALIE?.renderProductos();
      return;
    }

    let filtro = window.ALIE.state.filtroActivo;
    let final = lista;
    if (filtro !== 'all') final = lista.filter(p => p.categoria === filtro);

    const grid = document.getElementById('products-grid');
    const count = document.getElementById('products-count');

    document.getElementById('tb-live-count') && (document.getElementById('tb-count').textContent = `${final.length} productos`);
    document.getElementById('products-count').textContent = `${final.length} productos`;

    if (!final.length) {
      grid.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--grey);grid-column:1/-1"><div style="font-size:3rem;margin-bottom:12px">🔍</div><p>Sin resultados en ese rango de precio.</p></div>`;
      return;
    }
    grid.innerHTML = final.map((p, i) => window.ALIE.productoCardHTML ? window.ALIE.productoCardHTML(p,i) : '').join('');
    this._syncCount();
  }

  _updateBreadcrumb(cat, label) {
    const sep = document.getElementById('bc-sep2');
    const bc  = document.getElementById('bc-cat');
    if (cat === 'all') {
      sep.style.display = 'none';
      bc.style.display  = 'none';
    } else {
      sep.style.display = '';
      bc.style.display  = '';
      bc.textContent    = label.replace(/^[^\w]+/, '').trim();
    }
  }

  _addChip(tipo, valor, label) {
    const container = document.getElementById('tb-active-filters');
    if (!container) return;

    // Quitar chip existente del mismo tipo
    this._removeChip(tipo);

    if (valor === 'all') return;

    this.filtrosActivos.push({ tipo, valor });

    const chip = document.createElement('span');
    chip.className = 'tb-chip';
    chip.dataset.tipo = tipo;
    chip.innerHTML = `${label} <button onclick="storeToolbar._clearChip('${tipo}')">✕</button>`;
    container.appendChild(chip);
  }

  _removeChip(tipo) {
    this.filtrosActivos = this.filtrosActivos.filter(f => f.tipo !== tipo);
    document.querySelector(`.tb-chip[data-tipo="${tipo}"]`)?.remove();
  }

  _clearChip(tipo) {
    this._removeChip(tipo);
    if (tipo === 'cat') {
      window.ALIE.state.filtroActivo = 'all';
      document.querySelectorAll('.tb-cat').forEach(b => b.classList.remove('active'));
      document.querySelector('.tb-cat[data-cat="all"]')?.classList.add('active');
      this._updateBreadcrumb('all', '');
      window.ALIE?.renderProductos();
    }
    if (tipo === 'price') {
      this.precioFiltro = 'all';
      document.querySelectorAll('.tb-price-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.tb-price-btn[data-price="all"]')?.classList.add('active');
      window.ALIE?.renderProductos();
    }
    this._syncCount();
  }

  limpiarFiltros() {
    // Reset categoría
    window.ALIE.state.filtroActivo = 'all';
    document.querySelectorAll('.tb-cat').forEach(b => b.classList.remove('active'));
    document.querySelector('.tb-cat[data-cat="all"]')?.classList.add('active');

    // Reset precio
    this.precioFiltro = 'all';
    document.querySelectorAll('.tb-price-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tb-price-btn[data-price="all"]')?.classList.add('active');

    // Reset sort
    window.ALIE.state.orden = 'default';
    const sortEl = document.getElementById('tb-sort');
    if (sortEl) sortEl.value = 'default';

    // Reset búsqueda
    window.ALIE.state.busqueda = '';
    const searchEl = document.getElementById('search-input');
    if (searchEl) searchEl.value = '';

    // Limpiar chips y breadcrumb
    this.filtrosActivos = [];
    const cont = document.getElementById('tb-active-filters');
    if (cont) cont.innerHTML = '';
    this._updateBreadcrumb('all', '');

    window.ALIE?.renderProductos();
    this._syncCount();
    window.ALIE.showToast('✅ Filtros limpiados', 'success');
  }

  setVista(tipo) {
    this.vistaActual = tipo;
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    document.getElementById('view-grid')?.classList.toggle('active', tipo === 'grid');
    document.getElementById('view-list')?.classList.toggle('active', tipo === 'list');

    grid.classList.toggle('list-view', tipo === 'list');
    window.ALIE?.renderProductos();
  }

  _syncCount() {
    setTimeout(() => {
      const c = document.getElementById('products-count');
      const t = document.getElementById('tb-count');
      if (c && t) t.textContent = c.textContent;
    }, 120);
  }

  _syncWithApp() {
    // Observar cambios en el count del catálogo
    const observer = new MutationObserver(() => this._syncCount());
    const target = document.getElementById('products-count');
    if (target) observer.observe(target, { childList: true, characterData: true, subtree: true });
  }
}

// ── TOOLBAR ADMIN ─────────────────────────────────────────────
class AdminToolbar {
  constructor() {
    this._currentTab = 'dashboard';
    this._searchTerm = '';
  }

  // Renderiza el toolbar del admin según el tab activo
  render(tabName) {
    this._currentTab = tabName;
    return `
    <div class="atb-root" id="admin-toolbar">
      <!-- Breadcrumb admin -->
      <div class="atb-top">
        <div class="atb-breadcrumb">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span class="atb-crumb" onclick="switchAdminTab(document.querySelector('[data-tab=dashboard]'),'dashboard')">Admin</span>
          <span class="atb-sep">›</span>
          <span class="atb-crumb atb-crumb-active">${this._tabLabel(tabName)}</span>
        </div>

        <!-- Quick nav pills -->
        <div class="atb-quick-nav">
          ${[
            ['dashboard','📊','Dashboard'],
            ['products','📦','Productos'],
            ['add-product','➕','Nuevo'],
            ['orders','🛒','Pedidos'],
            ['rates','💱','Tasas'],
          ].map(([t,ic,lb]) =>
            `<button class="atb-qnav ${tabName===t?'active':''}"
              onclick="switchAdminTab(document.querySelector('[data-tab=${t}]'),'${t}')">
              ${ic} ${lb}
            </button>`
          ).join('')}
        </div>
      </div>

      <!-- Barra de acciones contextual -->
      <div class="atb-actions-row">
        <!-- Búsqueda contextual -->
        <div class="atb-search-wrap">
          <svg class="atb-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="atb-search" id="atb-search-input"
            placeholder="${this._searchPlaceholder(tabName)}"
            oninput="adminToolbar.onSearch(this.value)">
          <button class="atb-search-clear" id="atb-search-clear" onclick="adminToolbar.clearSearch()" style="display:none">✕</button>
        </div>

        <div class="atb-spacer"></div>

        <!-- Acciones específicas por tab -->
        <div class="atb-tab-actions" id="atb-tab-actions">
          ${this._tabActions(tabName)}
        </div>

        <!-- Acciones globales -->
        <div class="atb-global-actions">
          <button class="atb-btn atb-btn-icon" onclick="adminToolbar.refresh()" title="Actualizar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          </button>
          <button class="atb-btn atb-btn-icon" onclick="adminToolbar.exportar()" title="Exportar datos">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button class="atb-btn atb-btn-close" onclick="closeAdmin()" title="Cerrar panel">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Cerrar
          </button>
        </div>
      </div>

      <!-- Status bar -->
      <div class="atb-statusbar">
        <div class="atb-status-items" id="atb-status-items">
          ${this._statusItems(tabName)}
        </div>
        <div class="atb-status-right">
          <span class="atb-status-item">🔐 Admin</span>
          <span class="atb-status-sep">·</span>
          <span class="atb-status-item" id="atb-clock"></span>
        </div>
      </div>
    </div>`;
  }

  _tabLabel(tab) {
    const map = {
      dashboard: '📊 Dashboard', products: '📦 Productos',
      'add-product': '➕ Nuevo Producto', orders: '🛒 Pedidos',
      rates: '💱 Tasas de Cambio', abandoned: '🔔 Abandonados',
      'aliebot-config': '🤖 AlieBot',
    'settings':        '⚙️ Config'
    };
    return map[tab] || tab;
  }

  _searchPlaceholder(tab) {
    const map = {
      dashboard: 'Buscar en estadísticas...', products: 'Buscar producto...',
      orders: 'Buscar pedido o cliente...', rates: 'Buscar moneda...',
      'add-product': 'Nombre del nuevo producto...'
    };
    return map[tab] || 'Buscar...';
  }

  _tabActions(tab) {
    const actions = {
      dashboard: `
        <button class="atb-btn atb-btn-primary" onclick="switchAdminTab(document.querySelector('[data-tab=add-product]'),'add-product')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Producto
        </button>
        <button class="atb-btn atb-btn-secondary" onclick="switchAdminTab(document.querySelector('[data-tab=orders]'),'orders')">
          📦 Ver Pedidos
        </button>`,

      products: `
        <button class="atb-btn atb-btn-primary" onclick="switchAdminTab(document.querySelector('[data-tab=add-product]'),'add-product')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
        <button class="atb-btn atb-btn-ghost" onclick="resetProductos()">
          ↩ Restaurar Demo
        </button>`,

      'add-product': `
        <button class="atb-btn atb-btn-primary" onclick="saveNewProduct()">
          💾 Guardar Producto
        </button>
        <button class="atb-btn atb-btn-ghost" onclick="switchAdminTab(document.querySelector('[data-tab=products]'),'products')">
          ← Volver
        </button>`,

      orders: `
        <button class="atb-btn atb-btn-ghost" onclick="clearOrders()">
          🗑 Limpiar Pedidos
        </button>`,

      rates: `
        <button class="atb-btn atb-btn-primary" onclick="saveRates()">
          💾 Guardar Tasas
        </button>`,

      'settings': `
      <button class="atb-action-btn" onclick="saveSettings()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Guardar Config
      </button>`,
    'aliebot-config': `
        <button class="atb-btn atb-btn-primary" onclick="testBot()">
          🤖 Probar AlieBot
        </button>`,
    };
    return actions[tab] || '';
  }

  _statusItems(tab) {
    const productos = window.ALIE?.state.productos.length || 0;
    const orders    = JSON.parse(localStorage.getItem('alie_orders') || '[]').length;
    const revenue   = JSON.parse(localStorage.getItem('alie_orders') || '[]')
                        .reduce((s,o) => s+(o.total||0), 0);
    const tasa      = window.ALIE?.tasas.cup || 350;

    return `
      <span class="atb-status-item">
        <span class="atb-status-dot atb-status-green"></span>
        ${productos} productos
      </span>
      <span class="atb-status-sep">·</span>
      <span class="atb-status-item">🛒 ${orders} pedidos</span>
      <span class="atb-status-sep">·</span>
      <span class="atb-status-item">💰 $${revenue} USD revenue</span>
      <span class="atb-status-sep">·</span>
      <span class="atb-status-item">💱 $1 = ${tasa} CUP</span>
    `;
  }

  onSearch(val) {
    this._searchTerm = val;
    const clearBtn = document.getElementById('atb-search-clear');
    if (clearBtn) clearBtn.style.display = val ? '' : 'none';

    if (this._currentTab === 'products') {
      // Filtrar tabla de productos
      document.querySelectorAll('#products-admin-body tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val.toLowerCase()) ? '' : 'none';
      });
    }
    if (this._currentTab === 'orders') {
      document.querySelectorAll('.data-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val.toLowerCase()) ? '' : 'none';
      });
    }
  }

  clearSearch() {
    this._searchTerm = '';
    const inp = document.getElementById('atb-search-input');
    if (inp) inp.value = '';
    const clearBtn = document.getElementById('atb-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    // Mostrar todos de nuevo
    document.querySelectorAll('.data-table tbody tr').forEach(r => r.style.display = '');
    document.querySelectorAll('#products-admin-body tr').forEach(r => r.style.display = '');
  }

  refresh() {
    const area = document.getElementById('admin-content-area');
    if (!area) return;
    area.style.opacity = '.4';
    area.style.transition = 'opacity .2s';
    setTimeout(() => {
      renderAdminTab(this._currentTab);
      area.style.opacity = '1';
      window.ALIE?.showToast('✅ Panel actualizado', 'success');
    }, 300);
  }

  exportar() {
    const tab = this._currentTab;
    let data, filename;

    if (tab === 'products') {
      data = window.ALIE?.state.productos || [];
      filename = 'aliemarket-productos.json';
    } else if (tab === 'orders') {
      data = JSON.parse(localStorage.getItem('alie_orders') || '[]');
      filename = 'aliemarket-pedidos.json';
    } else if (tab === 'rates') {
      data = window.ALIE?.tasas || {};
      filename = 'aliemarket-tasas.json';
    } else {
      data = {
        productos: window.ALIE?.state.productos.length,
        pedidos: JSON.parse(localStorage.getItem('alie_orders') || '[]').length,
        tasas: window.ALIE?.tasas,
        exportado: new Date().toISOString()
      };
      filename = 'aliemarket-export.json';
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    window.ALIE?.showToast(`📥 Exportado: ${filename}`, 'success');
  }

  startClock() {
    const update = () => {
      const el = document.getElementById('atb-clock');
      if (el) el.textContent = new Date().toLocaleTimeString('es-CU', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    };
    update();
    this._clockInterval = setInterval(update, 1000);
  }

  stopClock() {
    clearInterval(this._clockInterval);
  }
}

// ── INSTANCIAS GLOBALES ───────────────────────────────────────
let storeToolbar;
let adminToolbar;

document.addEventListener('DOMContentLoaded', () => {
  // Toolbar tienda — se monta automáticamente
  storeToolbar = new StoreToolbar();
  window.storeToolbar = storeToolbar;

  // Admin toolbar — se integra con renderAdminTab
  adminToolbar = new AdminToolbar();
  window.adminToolbar = adminToolbar;

  // Parchar renderAdminTab para inyectar el toolbar admin
  const _origRender = window.renderAdminTab;
  window.renderAdminTab = function(tab) {
    // Detener reloj anterior
    adminToolbar.stopClock();
    // Llamar render original
    _origRender(tab);
    // Prepend toolbar en el contenido
    const area = document.getElementById('admin-content-area');
    if (!area) return;
    const tbHTML = adminToolbar.render(tab);
    area.insertAdjacentHTML('afterbegin', tbHTML);
    // Iniciar reloj
    adminToolbar.startClock();
    // Foco en búsqueda al entrar a productos
    if (tab === 'products') {
      setTimeout(() => document.getElementById('atb-search-input')?.focus(), 200);
    }
  };
});

// Exportar para uso externo
window.storeToolbarFuncs = { StoreToolbar, AdminToolbar };
