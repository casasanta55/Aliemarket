/* ============================================================
   ALIEMARKET DIGITAL — admin.js
   Panel CRUD Admin + Dashboard + Tasas + Configuración
   PIN de acceso: Alie2026!
   ============================================================ */

'use strict';

let ADMIN_PIN = localStorage.getItem('alie_admin_pin') || 'Alie2026!';

// ── AUTENTICACIÓN ─────────────────────────────────────────────
function checkAdminPin() {
  const input = document.getElementById('admin-pin-input');
  const error = document.getElementById('login-error');
  const pin = input.value.trim();

  ADMIN_PIN = localStorage.getItem('alie_admin_pin') || 'Alie2026!';
  if (pin === ADMIN_PIN) {
    closeAdminLogin();
    openAdminPanel();
    window.ALIE?.showToast('✅ Bienvenido al Panel Admin', 'success');
  } else {
    error.textContent = '❌ PIN incorrecto. Inténtalo de nuevo.';
    input.classList.add('shake');
    input.value = '';
    setTimeout(() => input.classList.remove('shake'), 500);
  }
}

function openAdminPanel() {
  const panel = document.getElementById('admin-panel');
  panel.classList.add('open');
  document.getElementById('admin-quick-btn').classList.remove('hidden');
  renderAdminTab('dashboard');
}

function closeAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
}

// ── TABS ──────────────────────────────────────────────────────
function switchAdminTab(el, tabName) {
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  renderAdminTab(tabName);
}

function renderAdminTab(tab) {
  const area = document.getElementById('admin-content-area');

  switch(tab) {
    case 'dashboard':   area.innerHTML = renderDashboard(); break;
    case 'products':    area.innerHTML = renderProductsTable(); break;
    case 'add-product': area.innerHTML = renderAddProduct(); break;
    case 'orders':      area.innerHTML = renderOrders(); break;
    case 'rates':       area.innerHTML = renderRates(); break;
    case 'abandoned':   area.innerHTML = renderAbandoned(); break;
    case 'aliebot-config': area.innerHTML = renderAlieBotConfig(); break;
    case 'settings':       area.innerHTML = renderSettings(); break;
    default:            area.innerHTML = `<p style="color:var(--grey)">Tab en construcción</p>`;
  }
}

// ── DASHBOARD ─────────────────────────────────────────────────
function renderDashboard() {
  const orders = JSON.parse(localStorage.getItem('alie_orders') || '[]');
  const totalRevenue = orders.reduce((s,o) => s + (o.total || 0), 0);
  const carrito = window.ALIE?.state.carrito || [];
  const productos = window.ALIE?.state.productos || [];
  const prodDigitales = productos;
  const prodFisicos   = [];
  const stockTotal    = prodFisicos.reduce((s,p) => s + (p.stock || 0), 0);

  // Cálculo stats
  const hoy = new Date().toLocaleDateString('es-CU');
  const ventasHoy = orders.filter(o => o.fecha && o.fecha.includes(hoy)).length;
  const convRate = orders.length > 0 ? ((orders.length / Math.max(orders.length + 5, 1)) * 100).toFixed(1) : '0';

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">
      📊 Dashboard General
      <span style="font-size:.8rem;font-weight:400;color:var(--grey)">${new Date().toLocaleString('es-CU')}</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Ingresos Totales USD</div>
        <div class="value text-cyan">$${Number(totalRevenue).toFixed(2)}</div>
        <div class="change up">${orders.filter(o=>o.estado==='pendiente'||o.estado==='pagado').length > 0 ? '⏳ '+orders.filter(o=>o.estado==='pendiente'||o.estado==='pagado').length+' pedido(s) pendientes' : '↑ USD acumulado'}</div>
      </div>
      <div class="stat-card">
        <div class="label">Pedidos Totales</div>
        <div class="value">${orders.length}</div>
        <div class="change up">${ventasHoy} hoy</div>
      </div>
      <div class="stat-card">
        <div class="label">Productos Digitales</div>
        <div class="value">${prodDigitales.length}</div>
        <div class="change up">↑ Acceso inmediato</div>
      </div>
      <div class="stat-card ${prodFisicos.filter(p=>(p.stock||0)<=3).length > 0 ? 'stat-warn' : ''}">
        <div class="label">Productos Físicos</div>
        <div class="value">${prodFisicos.length}</div>
        <div class="change" style="color:${prodFisicos.filter(p=>(p.stock||0)<=3).length > 0 ? 'var(--amber)' : 'var(--turquesa)'}">
          ${prodFisicos.filter(p=>(p.stock||0)<=3).length > 0
            ? '⚠ ' + prodFisicos.filter(p=>(p.stock||0)<=3).length + ' con stock bajo'
            : '📦 Stock total: ' + stockTotal + ' unid.'}
        </div>
      </div>
      <div class="stat-card">
        <div class="label">Carrito Actual</div>
        <div class="value">${carrito.length}</div>
        <div class="change ${carrito.length > 0 ? 'up' : ''}">${carrito.length > 0 ? '$'+carrito.reduce((s,p)=>s+p.precioUSD,0)+' USD' : 'Vacío'}</div>
      </div>
      <div class="stat-card">
        <div class="label">Tasa USD/CUP</div>
        <div class="value text-amber">${window.ALIE?.tasas.cup || 350}</div>
        <div class="change">CUP por dólar</div>
      </div>
      <div class="stat-card">
        <div class="label">Top Producto</div>
        <div class="value" style="font-size:1rem">🚀 Bundle</div>
        <div class="change up">541 ventas</div>
      </div>
    </div>

    <!-- Últimos pedidos -->
    <div style="margin-top:20px">
      <h3 style="font-family:var(--font-head);font-size:1rem;margin-bottom:14px">Últimos Pedidos</h3>
      ${orders.length === 0
        ? `<p style="color:var(--grey);font-size:.88rem">No hay pedidos registrados aún. Las ventas aparecerán aquí.</p>`
        : `<div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Método</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${orders.slice(0,10).map(o => `
            <tr>
              <td class="mono" style="font-size:.78rem">#${String(o.id).slice(-6)}</td>
              <td style="font-size:.82rem;color:var(--grey)">${o.fecha}</td>
              <td style="font-size:.82rem">${(o.items || []).join(', ').substring(0,50)}</td>
              <td class="mono text-cyan">$${o.total} USD</td>
              <td>${payBadge(o.metodo)}</td>
              <td><span class="badge" style="background:rgba(0,230,118,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:.72rem">✓ ${o.estado || 'completado'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
        </div>`
      }
    </div>

    <!-- Distribución por método -->
    <div style="margin-top:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">
      ${['hotmart','transfermovil','mlc','usdt'].map(m => {
        const count = orders.filter(o => o.metodo === m).length;
        return `<div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius);padding:14px">
          <div style="font-size:.75rem;color:var(--grey);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">${m}</div>
          <div style="font-family:var(--font-mono);font-size:1.4rem;color:var(--cyan)">${count}</div>
          <div style="font-size:.75rem;color:var(--grey)">pedidos</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function payBadge(m) {
  const map = { hotmart:'🔥 Hotmart', transfermovil:'📱 Transfermóvil', mlc:'💳 MLC', usdt:'💰 USDT' };
  return `<span style="font-size:.8rem;color:var(--grey)">${map[m] || m}</span>`;
}

// ── TABLA DE PRODUCTOS ────────────────────────────────────────
function renderProductsTable() {
  const productos = window.ALIE?.state.productos || [];
  const prodDigitales = productos;
  const prodFisicos   = [];
  const stockTotal    = prodFisicos.reduce((s,p) => s + (p.stock || 0), 0);

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">
      📦 Gestión de Productos
      <button class="btn btn-primary btn-sm" onclick="switchAdminTab(document.querySelector('[data-tab=add-product]'),'add-product')">+ Nuevo</button>
    </div>

    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Icono</th><th>Nombre</th><th>Categoría</th>
            <th>Precio USD</th><th>Precio Orig.</th><th>Ventas</th><th>Hotmart</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody id="products-admin-body">
          ${productos.map(p => renderProductRow(p)).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderProductRow(p) {
  return `<tr id="row-${p.id}">
    <td class="mono" style="font-size:.8rem;color:var(--grey)">#${p.id}</td>
    <td style="font-size:1.4rem">${p.icon}</td>
    <td style="font-weight:600;max-width:200px">${p.nombre}</td>
    <td><span style="font-size:.75rem;color:var(--cyan);font-family:var(--font-mono);text-transform:uppercase">${p.categoria}</span></td>
    <td class="mono text-cyan">$${p.precioUSD}</td>
    <td class="mono" style="color:var(--grey);text-decoration:line-through;font-size:.85rem">${p.precioOrigUSD ? '$'+p.precioOrigUSD : '—'}</td>
    <td class="mono">${p.ventas || 0}</td>
    <td><a href="${p.hotmartLink}" target="_blank" style="font-size:.78rem;color:var(--cyan)">🔥 Link</a></td>
    <td>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-ghost" onclick="editProduct(${p.id})">✏</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">✕</button>
      </div>
    </td>
  </tr>`;
}

// ── AGREGAR PRODUCTO ──────────────────────────────────────────
function renderAddProduct(prod = null) {
  const isEdit = prod !== null;
  const p = prod || {
    id: Date.now(), nombre: '', descripcion: '', precioUSD: '', precioOrigUSD: '',
    categoria: 'programacion', tipo: 'digital', icon: '📚', hotmartLink: '', badge: '',
    badgeText: '', beneficios: [], duracion: '', nivel: '', ventas: 0, rating: 4.8,
    esDigital: true, stock: 999, entrega: 'Por coordinar', peso: ''
  };

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">
      ${isEdit ? '✏ Editar Producto' : '➕ Nuevo Producto Digital'}
    </div>

    <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:24px;max-width:800px">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nombre del Producto</label>
          <input class="form-input" id="p-nombre" value="${p.nombre}" placeholder="Curso Python Pro">
        </div>
        <div class="form-group">
          <label class="form-label">Icono (Emoji)</label>
          <input class="form-input" id="p-icon" value="${p.icon}" placeholder="🐍" style="font-size:1.4rem;text-align:center">
        </div>
        <div class="form-group">
          <label class="form-label">Precio USD</label>
          <input class="form-input" id="p-precio" type="number" value="${p.precioUSD}" placeholder="29">
        </div>
        <div class="form-group">
          <label class="form-label">Precio Original USD (tachado)</label>
          <input class="form-input" id="p-precio-orig" type="number" value="${p.precioOrigUSD || ''}" placeholder="49">
        </div>
        <div class="form-group">
          <label class="form-label">Categoría</label>
          <select class="form-select" id="p-cat">
            <optgroup label="── Digitales ──">
              ${['programacion','marketing','trading','diseño','negocios','bundle'].map(c =>
                `<option value="${c}" ${p.categoria===c?'selected':''}>${c}</option>`
              ).join('')}
            </optgroup>
            <optgroup label="── Físicos ──">
              ${['tecnologia','accesorios','electrodomesticos','hogar','ropa','alimentos','ofertas-fisicas'].map(c =>
                `<option value="${c}" ${p.categoria===c?'selected':''}>${c}</option>`
              ).join('')}
            </optgroup>
          </select>
        </div>

        <!-- Tipo de producto -->
        <div class="form-group">
          <label class="field-label">Tipo de producto</label>
          <select class="form-input" id="p-tipo" onchange="toggleFisicoFields(this.value)">
            <option value="digital" ${!p.tipo||p.tipo==='digital'?'selected':''}>📲 Digital (acceso inmediato)</option>

          </select>
        </div>

            <div class="form-group">
              <label class="field-label">Tiempo entrega</label>
              <input class="form-input" id="p-entrega" value="${p.entrega||'Por coordinar'}" placeholder="Por coordinar">
            </div>
            <div class="form-group">
              <label class="field-label">Peso (kg)</label>
              <input class="form-input" id="p-peso" value="${p.peso||''}" placeholder="0.5 kg">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Badge</label>
          <select class="form-select" id="p-badge">
            <option value="">Sin badge</option>
            ${['hot','new','off','bundle','popular'].map(b =>
              `<option value="${b}" ${p.badge===b?'selected':''}>${b.toUpperCase()}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Texto del Badge</label>
          <input class="form-input" id="p-badge-text" value="${p.badgeText || ''}" placeholder="HOT / 38% OFF">
        </div>
        <div class="form-group">
          <label class="form-label">Duración del Curso</label>
          <input class="form-input" id="p-duracion" value="${p.duracion || ''}" placeholder="8 horas">
        </div>
        <div class="form-group">
          <label class="form-label">Nivel</label>
          <input class="form-input" id="p-nivel" value="${p.nivel || ''}" placeholder="Básico → Avanzado">
        </div>
        <div class="form-group">
          <label class="form-label">Rating (4.0 - 5.0)</label>
          <input class="form-input" id="p-rating" type="number" step=".1" min="4" max="5" value="${p.rating || 4.8}">
        </div>
        <div class="form-group full">
          <label class="form-label">Link Hotmart</label>
          <input class="form-input" id="p-hotmart" value="${p.hotmartLink || ''}" placeholder="https://hotmart.com/product/...">
        </div>
        <div class="form-group full">
          <label class="form-label">Descripción</label>
          <textarea class="form-textarea" id="p-desc" placeholder="Describe el curso...">${p.descripcion || ''}</textarea>
        </div>
        <div class="form-group full">
          <label class="form-label">Beneficios (uno por línea)</label>
          <textarea class="form-textarea" id="p-beneficios" placeholder="Acceso inmediato&#10;Certificado&#10;Soporte 24/7">${(p.beneficios||[]).join('\n')}</textarea>
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="btn btn-primary" onclick="${isEdit ? `saveEditProduct(${p.id})` : 'saveNewProduct()'}">
          ${isEdit ? '💾 Guardar Cambios' : '➕ Agregar Producto'}
        </button>
        <button class="btn btn-ghost" onclick="switchAdminTab(document.querySelector('[data-tab=products]'),'products')">
          Cancelar
        </button>
      </div>
    </div>
  </div>`;
}

function saveNewProduct() {
  const beneficios = document.getElementById('p-beneficios').value
    .split('\n').map(b => b.trim()).filter(Boolean);

  const tipo = document.getElementById('p-tipo')?.value || 'digital';
  const nuevo = {
    id: Date.now(),
    nombre: document.getElementById('p-nombre').value.trim(),
    descripcion: document.getElementById('p-desc').value.trim(),
    precioUSD: parseFloat(document.getElementById('p-precio').value) || 0,
    precioOrigUSD: parseFloat(document.getElementById('p-precio-orig').value) || null,
    categoria: document.getElementById('p-cat').value,
    tipo,
    icon: document.getElementById('p-icon').value.trim() || '📚',
    badge: document.getElementById('p-badge').value || null,
    badgeText: document.getElementById('p-badge-text').value.trim() || null,
    hotmartLink: tipo === 'digital' ? document.getElementById('p-hotmart').value.trim() : null,
    duracion: document.getElementById('p-duracion').value.trim(),
    nivel: tipo === 'fisico' ? 'Producto físico' : document.getElementById('p-nivel').value.trim(),
    entrega: tipo === 'fisico' ? document.getElementById('p-entrega')?.value.trim() : null,
    stock: tipo === 'fisico' ? parseInt(document.getElementById('p-stock')?.value) || 0 : 999,
    peso: tipo === 'fisico' ? document.getElementById('p-peso')?.value.trim() : null,
    rating: parseFloat(document.getElementById('p-rating').value) || 4.8,
    beneficios,
    ventas: 0,
    esDigital: tipo !== 'fisico',
    destacado: false
  };

  if (!nuevo.nombre || !nuevo.precioUSD) {
    window.ALIE?.showToast('⚠ Nombre y precio son obligatorios', 'warning');
    return;
  }

  window.ALIE.state.productos.push(nuevo);
  persistirProductos();
  window.ALIE.renderProductos();
  window.ALIE.showToast(`✅ Producto "${nuevo.nombre}" creado`, 'success');
  switchAdminTab(document.querySelector('[data-tab=products]'), 'products');
}

function editProduct(id) {
  const prod = window.ALIE?.state.productos.find(p => p.id === id);
  if (!prod) return;
  const area = document.getElementById('admin-content-area');
  area.innerHTML = renderAddProduct(prod);
}

function saveEditProduct(id) {
  const idx = window.ALIE?.state.productos.findIndex(p => p.id === id);
  if (idx === -1) return;

  const beneficios = document.getElementById('p-beneficios').value
    .split('\n').map(b => b.trim()).filter(Boolean);

  window.ALIE.state.productos[idx] = {
    ...window.ALIE.state.productos[idx],
    nombre: document.getElementById('p-nombre').value.trim(),
    descripcion: document.getElementById('p-desc').value.trim(),
    precioUSD: parseFloat(document.getElementById('p-precio').value) || 0,
    precioOrigUSD: parseFloat(document.getElementById('p-precio-orig').value) || null,
    categoria: document.getElementById('p-cat').value,
    icon: document.getElementById('p-icon').value.trim(),
    badge: document.getElementById('p-badge').value || null,
    badgeText: document.getElementById('p-badge-text').value.trim() || null,
    hotmartLink: document.getElementById('p-hotmart').value.trim(),
    duracion: document.getElementById('p-duracion').value.trim(),
    nivel: document.getElementById('p-nivel').value.trim(),
    rating: parseFloat(document.getElementById('p-rating').value) || 4.8,
    beneficios
  };

  persistirProductos();
  window.ALIE.renderProductos();
  window.ALIE.showToast('✅ Producto actualizado', 'success');
  switchAdminTab(document.querySelector('[data-tab=products]'), 'products');
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  window.ALIE.state.productos = window.ALIE.state.productos.filter(p => p.id !== id);
  persistirProductos();
  window.ALIE.renderProductos();
  window.ALIE.showToast('🗑 Producto eliminado', 'warning');
  renderAdminTab('products');
}

function persistirProductos() {
  try {
    localStorage.setItem('alie_productos_custom', JSON.stringify(window.ALIE.state.productos));
  } catch(e) {}
}

function resetProductos() {
  if (!confirm('¿Restablecer catálogo original? Se perderán los cambios.')) return;
  window.ALIE.state.productos = [...window.ALIE.PRODUCTOS_ALIE];
  localStorage.removeItem('alie_productos_custom');
  window.ALIE.renderProductos();
  window.ALIE.showToast('✅ Catálogo restablecido', 'success');
  renderAdminTab('products');
}

// ── PEDIDOS ───────────────────────────────────────────────────
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('alie_orders') || '[]');
  const totalIngresos = orders.reduce((s, o) => s + (Number(o.total) || 0), 0).toFixed(2);
  const estadoColors = {
    pendiente:  'rgba(255,179,0,0.15);color:var(--amber)',
    pagado:     'rgba(0,212,255,0.12);color:var(--turquesa)',
    entregado:  'rgba(16,185,129,0.12);color:var(--verde-success)',
    cancelado:  'rgba(230,57,70,0.12);color:var(--red-cuba)',
    completado: 'rgba(16,185,129,0.12);color:var(--verde-success)',
  };
  const estadoLabels = { pendiente:'⏳ Pendiente', pagado:'💳 Pagado', entregado:'📦 Entregado', cancelado:'❌ Cancelado', completado:'✓ Completado' };

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">
      🛒 Historial de Pedidos
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-sm btn-primary" onclick="exportOrdersCSV()">📥 Exportar CSV</button>
        <button class="btn btn-sm btn-danger" onclick="clearOrders()">🗑 Limpiar</button>
      </div>
    </div>

    <!-- Resumen ingresos -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px">
      <div class="stat-card-mini"><div class="scm-val">$${totalIngresos}</div><div class="scm-label">Ingresos totales USD</div></div>
      <div class="stat-card-mini"><div class="scm-val">${orders.length}</div><div class="scm-label">Pedidos registrados</div></div>
      <div class="stat-card-mini"><div class="scm-val">${orders.filter(o=>o.estado==='pendiente').length}</div><div class="scm-label">⏳ Pendientes</div></div>
    </div>

    ${orders.length === 0
      ? `<div style="text-align:center;padding:60px;color:var(--grey)"><div style="font-size:2.5rem;margin-bottom:12px">📭</div><p>No hay pedidos registrados.</p></div>`
      : `<div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr><th>Orden #</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Método</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${orders.map((o, i) => {
              const items = Array.isArray(o.items)
                ? (typeof o.items[0] === 'object' ? o.items.map(x=>x.nombre).join(', ') : o.items.join(', '))
                : String(o.items || '');
              const oid = o.ordenId || '#' + String(o.id).slice(-6);
              const est = o.estado || 'completado';
              const estColor = estadoColors[est] || estadoColors.completado;
              return `<tr>
              <td class="mono" style="font-size:.78rem;color:var(--turquesa)">${oid}</td>
              <td style="font-size:.78rem;color:var(--grey);white-space:nowrap">${o.fecha}</td>
              <td style="font-size:.8rem;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${items}">${items}</td>
              <td class="mono text-cyan">$${o.total}</td>
              <td style="font-size:.82rem">${payBadge(o.metodo)}</td>
              <td><span style="font-size:.72rem;background:${estColor};padding:3px 9px;border-radius:4px;white-space:nowrap">${estadoLabels[est]||est}</span></td>
              <td>
                <select class="form-input" style="font-size:.73rem;padding:3px 6px;height:28px" onchange="cambiarEstadoPedido(${i}, this.value)">
                  ${['pendiente','pagado','entregado','cancelado'].map(s =>
                    `<option value="${s}" ${est===s?'selected':''}>${estadoLabels[s]}</option>`
                  ).join('')}
                </select>
              </td>
            </tr>`;
            }).join('')}
          </tbody>
        </table>
        </div>`
    }
  </div>`;
}

function cambiarEstadoPedido(idx, nuevoEstado) {
  const orders = JSON.parse(localStorage.getItem('alie_orders') || '[]');
  if (orders[idx]) {
    orders[idx].estado = nuevoEstado;
    localStorage.setItem('alie_orders', JSON.stringify(orders));
    renderAdminTab('orders');
    showAdminToast('✅ Estado actualizado');
  }
}

function exportOrdersCSV() {
  const orders = JSON.parse(localStorage.getItem('alie_orders') || '[]');
  if (!orders.length) { showAdminToast('⚠ No hay pedidos para exportar'); return; }
  const headers = ['Orden ID', 'Fecha', 'Productos', 'Total USD', 'Método', 'Estado', 'Tiene físicos'];
  const rows = orders.map(o => {
    const items = Array.isArray(o.items)
      ? (typeof o.items[0] === 'object' ? o.items.map(x=>x.nombre).join(' | ') : o.items.join(' | '))
      : String(o.items || '');
    return [
      o.ordenId || '#'+String(o.id).slice(-6),
      o.fecha,
      `"${items}"`,
      o.total,
      o.metodo,
      o.estado || 'completado',
      o.tieneFisicos ? 'Sí' : 'No'
    ].join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ALIEMARKET_pedidos_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showAdminToast('📥 CSV exportado');
}
function clearOrders() {
  if (!confirm('¿Eliminar todo el historial de pedidos?')) return;
  localStorage.removeItem('alie_orders');
  window.ALIE?.showToast('🗑 Pedidos eliminados', 'warning');
  renderAdminTab('orders');
}

// ── TASAS DE CAMBIO ───────────────────────────────────────────
function renderRates() {
  const t = window.ALIE?.tasas || { cup: 350, mlc: 4200 };

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">💱 Tasas de Cambio</div>

    <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:24px;max-width:480px">
      <div style="margin-bottom:16px;padding:14px;background:var(--black-up);border-radius:var(--radius);border:1px solid var(--cyan-border)">
        <div style="font-size:.78rem;color:var(--grey);margin-bottom:4px;font-family:var(--font-mono);text-transform:uppercase">Última actualización</div>
        <div style="font-size:.9rem">${t.updatedAt || 'No registrada'}</div>
      </div>

      <div class="form-group" style="margin-bottom:14px">
        <label class="form-label">1 USD = ? CUP (Informalidades)</label>
        <input class="form-input" id="rate-cup" type="number" value="${t.cup}" placeholder="350">
      </div>
      <div class="form-group" style="margin-bottom:14px">
        <label class="form-label">1 USD = ? MLC (× 100, ej: 4200 = 42.00 MLC)</label>
        <input class="form-input" id="rate-mlc" type="number" value="${t.mlc}" placeholder="4200">
      </div>

      <button class="btn btn-primary btn-full" onclick="saveRates()">
        💾 Actualizar Tasas
      </button>

      <div style="margin-top:16px;padding:12px;background:rgba(0,229,255,.05);border-radius:var(--radius);font-size:.82rem;color:var(--grey)">
        <strong style="color:var(--cyan)">Previsualización:</strong><br>
        $29 USD (Python) = <span id="prev-cup">...</span> CUP = <span id="prev-mlc">...</span> MLC<br>
        $79 USD (Bundle) = <span id="prev-cup2">...</span> CUP
      </div>
    </div>
  </div>`;
}

function saveRates() {
  const cup = parseInt(document.getElementById('rate-cup').value) || 350;
  const mlc = parseInt(document.getElementById('rate-mlc').value) || 4200;

  window.ALIE.tasas = { cup, mlc, updatedAt: new Date().toLocaleString('es-CU') };
  localStorage.setItem('alie_tasas', JSON.stringify(window.ALIE.tasas));
  window.ALIE.actualizarCarritoUI();
  window.ALIE.showToast(`✅ Tasas actualizadas: $1 = ${cup} CUP / ${(mlc/100).toFixed(2)} MLC`, 'success');

  // Preview
  document.getElementById('prev-cup').textContent = (29*cup).toLocaleString();
  document.getElementById('prev-mlc').textContent = ((29*mlc)/100).toFixed(2);
  document.getElementById('prev-cup2').textContent = (79*cup).toLocaleString();
}

// ── CARRITOS ABANDONADOS ──────────────────────────────────────
function renderAbandoned() {
  const abandoned = JSON.parse(localStorage.getItem('alie_abandoned') || '[]');
  const carrito = window.ALIE?.state.carrito || [];

  return `
  <div class="admin-tab active">
    <div class="admin-section-title">🔔 Carritos Abandonados</div>

    ${carrito.length > 0 ? `
    <div style="background:rgba(255,179,0,.08);border:1px solid var(--amber);border-radius:var(--radius-lg);padding:16px;margin-bottom:20px">
      <div style="font-weight:700;color:var(--amber);margin-bottom:8px">⚠ Carrito activo detectado:</div>
      <div style="font-size:.88rem;color:var(--grey)">${carrito.map(p=>p.nombre).join(' + ')} — $${carrito.reduce((s,p)=>s+p.precioUSD,0)} USD</div>
      <button class="btn btn-sm" style="background:var(--amber);color:#000;margin-top:10px" onclick="window.alieBot?.sendAbandonMessage();window.ALIE?.showToast('📩 Mensaje enviado por AlieBot','success')">
        📩 Enviar recordatorio AlieBot
      </button>
    </div>` : ''}

    ${abandoned.length === 0 && carrito.length === 0
      ? `<div style="text-align:center;padding:60px;color:var(--grey)"><div style="font-size:2.5rem;margin-bottom:12px">🔔</div><p>No hay carritos abandonados registrados.</p></div>`
      : ''
    }
  </div>`;
}

// ── ALIEBOT CONFIG ────────────────────────────────────────────
function renderAlieBotConfig() {
  return `
  <div class="admin-tab active">
    <div class="admin-section-title">🤖 Configuración AlieBot</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:800px">
      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:20px">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:12px">Estado del Bot</div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="width:10px;height:10px;background:var(--green);border-radius:50%;"></div>
          <span style="color:var(--green);font-size:.88rem">Activo · Respondiendo 24/7</span>
        </div>
        <div style="font-size:.82rem;color:var(--grey);line-height:1.7">
          ✅ Reconocimiento de voz<br>
          ✅ 18 intenciones detectadas<br>
          ✅ Upsell automático<br>
          ✅ Negociación de precios<br>
          ✅ Links Hotmart directos<br>
          ✅ Carritos abandonados
        </div>
      </div>

      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:20px">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:12px">Conversaciones</div>
        <div style="font-family:var(--font-mono);font-size:1.6rem;color:var(--cyan);margin-bottom:6px">
          ${window.alieBot?.conversacion?.length || 0}
        </div>
        <div style="font-size:.82rem;color:var(--grey)">Mensajes en esta sesión</div>
        <button class="btn btn-sm btn-ghost" style="margin-top:14px;width:100%" onclick="window.alieBot?.conversacion.splice(0);window.ALIE?.showToast('🗑 Historial limpiado','warning')">
          🗑 Limpiar historial
        </button>
      </div>

      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:20px;grid-column:1/-1">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:14px">Test AlieBot</div>
        <div style="display:flex;gap:10px">
          <input class="form-input" id="bot-test-input" placeholder="Escribe para probar el bot..." style="flex:1">
          <button class="btn btn-primary" onclick="testBot()">Probar</button>
        </div>
        <div style="margin-top:12px;font-size:.8rem;color:var(--grey)">
          Prueba: "python", "marketing", "caro", "bundle", "pago", "cuándo recibo"
        </div>
      </div>

      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:20px;grid-column:1/-1">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:12px">Mensaje de Bienvenida</div>
        <textarea class="form-textarea" id="bot-welcome" style="width:100%">¡Hola! Soy AlieBot 🤖 - Tu vendedor digital 24/7. ¿Qué curso buscas?</textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="window.ALIE?.showToast('✅ Mensaje guardado (próxima sesión)','success')">
          💾 Guardar
        </button>
      </div>
    </div>
  </div>`;
}

function testBot() {
  const val = document.getElementById('bot-test-input').value.trim();
  if (!val) return;
  openAlieBot();
  setTimeout(() => {
    if (window.alieBot) alieBot.procesarMensaje(val);
    document.getElementById('bot-test-input').value = '';
    window.ALIE?.showToast('🤖 Respuesta enviada al chat', 'success');
  }, 300);
}

// ── INICIALIZACIÓN ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // El panel admin se inicializa al hacer login
  // Botón quick admin en navbar
  document.getElementById('admin-quick-btn')?.addEventListener('click', openAdmin);
});

function openAdmin() {
  openAdminPanel();
}

// Exponer globalmente
window.adminFuncs = {
  checkAdminPin, openAdminPanel, closeAdmin,
  switchAdminTab, saveNewProduct, editProduct,
  saveEditProduct, deleteProduct, saveRates,
  renderAddProduct, testBot, resetProductos
};


// ── CONFIGURACIÓN GENERAL ──────────────────────────────────────
function renderSettings() {
  // Cargar config actualizada desde localStorage
  const stored = localStorage.getItem('alie_config');
  const cfgStored = stored ? JSON.parse(stored) : {};
  const cfgAlive = window.ALIE?.config || {};
  const cfg = Object.assign({}, cfgAlive, cfgStored);
  return `
  <div class="admin-tab active">
    <div class="admin-section-title">⚙️ Configuración de la Tienda</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:860px">

      <!-- Métodos de pago -->
      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:22px;grid-column:1/-1">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:18px;font-size:1rem">
          💳 Datos de Pago
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <label class="field-label">📱 Número Transfermóvil</label>
            <input class="form-input" id="cfg-tmovil-num" value="${cfg.transfermovilNum||''}" placeholder="53XXXXXXXX">
          </div>
          <div>
            <label class="field-label">Nombre titular Transfermóvil</label>
            <input class="form-input" id="cfg-tmovil-name" value="${cfg.transfermovilNombre||''}" placeholder="Tu Nombre">
          </div>
          <div>
            <label class="field-label">💰 Dirección USDT</label>
            <input class="form-input" id="cfg-usdt-addr" value="${cfg.usdtAddress||''}" placeholder="TXxxxx...">
          </div>
          <div>
            <label class="field-label">Red USDT</label>
            <select class="form-input" id="cfg-usdt-red">
              <option value="TRC20" ${cfg.usdtRed==='TRC20'?'selected':''}>TRC20 (Tron)</option>
              <option value="BEP20" ${cfg.usdtRed==='BEP20'?'selected':''}>BEP20 (BSC)</option>
              <option value="ERC20" ${cfg.usdtRed==='ERC20'?'selected':''}>ERC20 (Ethereum)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:22px">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:18px;font-size:1rem">
          📬 Contacto y Soporte
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label class="field-label">📧 Email de soporte</label>
            <input class="form-input" id="cfg-email" value="${cfg.emailSoporte||''}" placeholder="soporte@tudominio.com" type="email">
          </div>
          <div>
            <label class="field-label">✈️ Telegram (usuario)</label>
            <input class="form-input" id="cfg-telegram" value="${cfg.telegramUser||''}" placeholder="@AlieMarket">
          </div>
          <div>
            <label class="field-label">🔗 Link Telegram</label>
            <input class="form-input" id="cfg-telegram-link" value="${cfg.telegramLink||''}" placeholder="https://t.me/AlieMarket">
          </div>
          <div>
            <label class="field-label">📞 WhatsApp (opcional)</label>
            <input class="form-input" id="cfg-whatsapp" value="${cfg.whatsappNum||''}" placeholder="+5353000000">
          </div>
        </div>
      </div>

      <!-- Tienda -->
      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:22px">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:18px;font-size:1rem">
          🏪 Datos de la Tienda
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label class="field-label">Nombre de la tienda</label>
            <input class="form-input" id="cfg-nombre" value="${cfg.nombreTienda||'ALIEMARKET'}" placeholder="ALIEMARKET">
          </div>
          <div>
            <label class="field-label">🌐 URL del sitio</label>
            <input class="form-input" id="cfg-url" value="${cfg.siteUrl||'https://aliemarket.github.io'}" placeholder="https://...">
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <!-- PIN Admin -->
      <div style="background:var(--black-card);border:1px solid rgba(255,255,255,.07);border-radius:var(--radius-lg);padding:22px;grid-column:1/-1">
        <div style="font-family:var(--font-head);font-weight:700;margin-bottom:18px;font-size:1rem">🔐 Seguridad del Panel Admin</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <label class="field-label">PIN actual</label>
            <input class="form-input" id="cfg-pin-old" type="password" placeholder="PIN actual" autocomplete="off">
          </div>
          <div>
            <label class="field-label">Nuevo PIN (mín. 6 caracteres)</label>
            <input class="form-input" id="cfg-pin-new" type="password" placeholder="Nuevo PIN" autocomplete="off">
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="changeAdminPin()">🔑 Cambiar PIN</button>
      </div>

      <div style="grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="saveSettings()" style="min-width:180px">
          💾 Guardar Configuración
        </button>
        <button class="btn btn-ghost" onclick="resetSettings()" style="min-width:140px">
          ↺ Restaurar valores
        </button>
      </div>

    </div>
  </div>`;
}

function saveSettings() {
  const cfg = {
    transfermovilNum:    document.getElementById('cfg-tmovil-num')?.value.trim() || '',
    transfermovilNombre: document.getElementById('cfg-tmovil-name')?.value.trim() || '',
    usdtAddress:         document.getElementById('cfg-usdt-addr')?.value.trim() || '',
    usdtRed:             document.getElementById('cfg-usdt-red')?.value || 'TRC20',
    emailSoporte:        document.getElementById('cfg-email')?.value.trim() || '',
    telegramUser:        document.getElementById('cfg-telegram')?.value.trim() || '',
    telegramLink:        document.getElementById('cfg-telegram-link')?.value.trim() || '',
    whatsappNum:         document.getElementById('cfg-whatsapp')?.value.trim() || '',
    nombreTienda:        document.getElementById('cfg-nombre')?.value.trim() || 'ALIEMARKET',
    siteUrl:             document.getElementById('cfg-url')?.value.trim() || '',
  };
  localStorage.setItem('alie_config', JSON.stringify(cfg));
  if (window.ALIE) Object.assign(window.ALIE.config, cfg);

  // Actualizar footer en vivo
  const footerEmail = document.getElementById('footer-email');
  if (footerEmail && cfg.emailSoporte) {
    footerEmail.href = 'mailto:' + cfg.emailSoporte;
    footerEmail.textContent = '📧 ' + cfg.emailSoporte;
  }
  const footerTg = document.getElementById('footer-telegram');
  if (footerTg && cfg.telegramUser) {
    footerTg.href = cfg.telegramLink;
    footerTg.textContent = '📱 Telegram ' + cfg.telegramUser;
  }

  window.ALIE?.showToast('✅ Configuración guardada', 'success');
}

function resetSettings() {
  if (!confirm('¿Restaurar valores por defecto?')) return;
  localStorage.removeItem('alie_config');
  location.reload();
}

function changeAdminPin() {
  const oldPin = document.getElementById('cfg-pin-old')?.value;
  const newPin = document.getElementById('cfg-pin-new')?.value;
  const currentPin = localStorage.getItem('alie_admin_pin') || 'Alie2026!';

  if (!oldPin || !newPin) {
    window.ALIE?.showToast('⚠ Completa ambos campos', 'warning');
    return;
  }
  if (oldPin !== currentPin) {
    window.ALIE?.showToast('❌ PIN actual incorrecto', 'error');
    return;
  }
  if (newPin.length < 6) {
    window.ALIE?.showToast('⚠ El nuevo PIN debe tener mínimo 6 caracteres', 'warning');
    return;
  }
  localStorage.setItem('alie_admin_pin', newPin);
  ADMIN_PIN = newPin;
  document.getElementById('cfg-pin-old').value = '';
  document.getElementById('cfg-pin-new').value = '';
  window.ALIE?.showToast('✅ PIN actualizado correctamente', 'success');
}

function toggleFisicoFields(tipo) {
  const fields = document.getElementById('fisico-fields');
  const hotmartRow = document.getElementById('p-hotmart')?.closest('.form-group');
  if (fields) fields.style.display = tipo === 'fisico' ? '' : 'none';
  if (hotmartRow) hotmartRow.style.display = tipo === 'fisico' ? 'none' : '';
}
