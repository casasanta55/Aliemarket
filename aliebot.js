/* ============================================================
   ALIEBOT.JS — AGENTE IA VENDEDOR DIGITAL
   El corazón de ALIEMARKET: Ventas 24/7, Upsell, Voz, Hotmart
   ============================================================ */

'use strict';

class AlieBotDigital {
  constructor() {
    this.chatOpen = false;
    this.conversacion = [];
    this.ultimaRecomendacion = null;
    this.negociando = false;
    this.recognition = null;
    this.listening = false;
    this.initialized = false;
    this.notifCount = 1;

    // Base de conocimiento de respuestas
    this.kb = this._buildKnowledgeBase();
    this._init();
  }

  _init() {
    // Esperar a que el DOM y app.js estén listos
    const tryInit = () => {
      if (window.ALIE) {
        this._setupVoice();
        this._renderWelcome();
        this.initialized = true;
        window.alieBot = this;
      } else {
        setTimeout(tryInit, 200);
      }
    };
    tryInit();
  }

  // ── KNOWLEDGE BASE ──────────────────────────────────────────
  _buildKnowledgeBase() {
    return {
      greetings: ['hola', 'buenas', 'hello', 'hey', 'saludos', 'buenas tardes', 'buenas noches', 'buen día'],
      python:     ['python', 'programar', 'programacion', 'programación', 'código', 'codigo', 'scripting', 'automatización', 'automatizacion'],
      marketing:  ['marketing', 'publicidad', 'facebook ads', 'redes sociales', 'ventas online', 'embudo', 'funnel'],
      trading:    ['trading', 'bitcoin', 'btc', 'crypto', 'cripto', 'binance', 'usdt', 'invertir', 'inversión'],
      diseño:     ['diseño', 'diseno', 'figma', 'ux', 'ui', 'interfaz', 'gráfico', 'grafico', 'canva'],
      wordpress:  ['wordpress', 'web', 'página web', 'pagina web', 'sitio web', 'woocommerce'],
      seo:        ['seo', 'posicionar', 'google', 'posicionamiento'],
      instagram:  ['instagram', 'ig', 'reels', 'influencer', 'viral'],
      excel:      ['excel', 'datos', 'data', 'análisis', 'analisis', 'office'],
      dropshipping:['dropshipping', 'tienda online', 'ecommerce', 'e-commerce', 'negocio online'],
      negocios:   ['negocios', 'negocio', 'emprender', 'dinero', 'ingresos', 'empresa', 'ganar dinero'],
      tecnologia: ['telefono', 'teléfono', 'samsung', 'xiaomi', 'tablet', 'router', 'wifi', 'camara', 'cámara', 'smartphone', 'movil', 'móvil', 'android'],
      accesorios: ['auriculares', 'earbuds', 'tws', 'powerbank', 'power bank', 'bateria', 'batería', 'smartwatch', 'reloj', 'accesorio', 'cable'],
      fisicos:    ['producto fisico', 'físico', 'fisico', 'entrega', 'envío', 'envio', 'domicilio', 'hardware', 'dispositivo', 'pago en mano', 'efectivo', 'contra entrega'],
      ropa:        ['ropa', 'camiseta', 'mochila', 'zapatilla', 'zapato', 'moda', 'talla', 'vestimenta', 'calzado'],
      electrod:    ['electrodomestico', 'electrodoméstico', 'ventilador', 'arrocera', 'plancha', 'lavadora', 'cafetera', 'abanico', 'cocina'],
      hogar:       ['hogar', 'casa', 'sabana', 'sábana', 'bombillo', 'led', 'cama', 'mueble', 'cocina', 'limpieza'],
      alimentos:   ['alimento', 'comida', 'cafe', 'café', 'miel', 'aceite', 'coco', 'despensa', 'alacena', 'comestible', 'cubano'],
      video:      ['video', 'premiere', 'after effects', 'edición', 'edicion', 'youtuber'],
      copywriting:['copy', 'copywriting', 'escribir', 'textos', 'redacción', 'redaccion'],
      bundle:     ['bundle', 'paquete', 'combo', 'oferta', 'varios', 'todo'],
      precio:     ['precio', 'costo', 'cuánto', 'cuanto', 'barato', 'caro', 'descuento', 'oferta', 'gratis'],
      pago:       ['pago', 'pagar', 'comprar', 'transfermovil', 'mlc', 'usdt', 'hotmart', 'cómo pago'],
      descuento:  ['caro', 'rebaja', 'negociar', 'descuento', 'menos', 'oferta especial'],
      ayuda:      ['ayuda', 'help', 'qué vendes', 'que vendes', 'qué tienes', 'que tienes', 'catálogo', 'catalogo'],
      acceso:     ['cuándo', 'cuando', 'cómo recibo', 'acceso', 'descarga', 'link', 'entrega'],
      voice:      ['oye alie', 'hey alie', 'aliebot', 'oye aliemarket'],
      comprar:    ['cómo compro', 'como compro', 'cómo funciona', 'como funciona', 'proceso de compra', 'pasos para comprar', 'quiero comprar', 'cómo pido', 'primera compra', 'tutorial de compra'],
      devolucion: ['devoluci', 'reembolso', 'reembolsar', 'devolver', 'garantia', 'garantía', 'no funciona', 'producto malo', 'cambio por', 'política de cambio'],
    };
  }

  // ── SETUP VOZ ───────────────────────────────────────────────
  _setupVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      document.getElementById('chat-voice').style.display = 'none';
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = 'es-CU';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      document.getElementById('voice-indicator').classList.remove('active');
      document.getElementById('chat-voice').classList.remove('listening');
      this.listening = false;

      // Activar por voz "Oye Alie"
      if (transcript.toLowerCase().includes('oye alie') || transcript.toLowerCase().includes('hey alie') || transcript.toLowerCase().includes('oye aliemarket')) {
        openAlieBot();
      }
      document.getElementById('chat-input').value = transcript;
      this.procesarMensaje(transcript);
    };

    this.recognition.onerror = () => {
      document.getElementById('voice-indicator').classList.remove('active');
      document.getElementById('chat-voice').classList.remove('listening');
      this.listening = false;
    };

    this.recognition.onend = () => {
      document.getElementById('voice-indicator').classList.remove('active');
      document.getElementById('chat-voice').classList.remove('listening');
      this.listening = false;
    };
  }

  toggleVoice() {
    if (!this.recognition) {
      window.ALIE.showToast('🎤 Tu navegador no soporta voz', 'warning');
      return;
    }
    if (this.listening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
      this.listening = true;
      document.getElementById('chat-voice').classList.add('listening');
      document.getElementById('voice-indicator').classList.add('active');
    }
  }

  // ── RENDER BIENVENIDA ────────────────────────────────────────
  _renderWelcome() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';
    this._addBotMessage(
      `¡Hola! Soy <strong>AlieBot</strong> 🤖<br>Tu vendedor digital 24/7.<br><br>
      Puedo ayudarte a:<br>
      🐍 Encontrar el curso perfecto<br>
      💰 Conseguir el mejor precio<br>
      🔥 Comprar directo en Hotmart<br><br>
      <em style="color:var(--grey);font-size:.82rem">Di "Oye Alie" si tienes micrófono activado.</em>`,
      []
    );
  }

  // ── MENSAJE BOT ──────────────────────────────────────────────
  _addBotMessage(html, acciones = []) {
    const container = document.getElementById('chat-messages');

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    return new Promise(resolve => {
      setTimeout(() => {
        typing.remove();
        const msg = document.createElement('div');
        msg.className = 'msg bot';
        const accionesHTML = acciones.length
          ? `<div class="msg-actions">${acciones.map(a =>
              `<button class="msg-action-btn ${a.primary ? 'primary' : ''}" onclick="${a.onclick}">${a.label}</button>`
            ).join('')}</div>`
          : '';
        msg.innerHTML = `
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble">${html}${accionesHTML}</div>`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
        resolve();
      }, 900 + Math.random() * 400);
    });
  }

  _addUserMessage(texto) {
    const container = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.innerHTML = `<div class="msg-avatar" style="background:var(--black-up);border:1px solid var(--grey-dim)">👤</div><div class="msg-bubble">${texto}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  // ── PROCESAR MENSAJE ─────────────────────────────────────────
  async procesarMensaje(texto) {
    if (!texto.trim()) return;
    const t = texto.toLowerCase().trim();

    this._addUserMessage(texto);
    document.getElementById('chat-input').value = '';

    // Guardar en historial
    this.conversacion.push({ role: 'user', text: texto, ts: Date.now() });

    // ── FLUJO DE INTENCIONES ─────────────────────────────────
    const R = window.ALIE;

    // 1. SALUDOS
    if (this._match(t, this.kb.greetings)) {
      await this._addBotMessage(
        `¡Hola! 👋 Bienvenido a <strong>ALIEMARKET</strong> — La marketplace #1 de Cuba.<br><br>
        Tenemos <span class="price">12 cursos</span> con acceso inmediato vía Hotmart.<br>
        ¿Qué área te interesa?`,
        [
          { label: '🐍 Python', onclick: `window.alieBot.procesarMensaje('python')`, primary: false },
          { label: '📢 Marketing', onclick: `window.alieBot.procesarMensaje('marketing')`, primary: false },
          { label: '₿ Trading', onclick: `window.alieBot.procesarMensaje('trading')`, primary: false },
          { label: '🚀 Bundle', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: true },
        ]
      );
      return;
    }

    // 2. PYTHON / PROGRAMACIÓN
    if (this._match(t, this.kb.python)) {
      this.ultimaRecomendacion = R.state.productos.find(p => p.id === 1);
      await this._addBotMessage(
        `🔥 <strong>Curso Python Pro</strong><br>
        <span class="price">$29 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$49</span><br><br>
        ✅ 8 horas de video HD<br>
        ✅ Certificado oficial<br>
        ✅ Soporte 24/7<br>
        ✅ <span class="highlight">Acceso inmediato en 60s</span><br><br>
        <em style="font-size:.8rem;color:var(--grey)">432 estudiantes ya lo tienen 🇨🇺</em>`,
        [
          { label: '🔥 Comprar Hotmart', onclick: `window.open('https://hotmart.com/product/curso-python-pro-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(1);window.ALIE.showToast('✅ Python Pro añadido','success')`, primary: false },
          { label: '🎁 Bundle mejor', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: false },
        ]
      );
      return;
    }

    // 3. MARKETING
    if (this._match(t, this.kb.marketing)) {
      this.ultimaRecomendacion = R.state.productos.find(p => p.id === 2);
      await this._addBotMessage(
        `💰 <strong>Marketing Digital 360</strong><br>
        <span class="price">$49 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$79</span> — <span class="highlight">38% OFF</span><br><br>
        ✅ Facebook Ads + Email + Funnels<br>
        ✅ Casos adaptados a Cuba 🇨🇺<br>
        ✅ 12 horas de contenido<br>
        ✅ Grupo privado de estudiantes<br><br>
        También tenemos <strong>SEO 2026</strong> e <strong>Instagram Mastery</strong>.`,
        [
          { label: '🔥 Comprar Hotmart', onclick: `window.open('https://hotmart.com/product/marketing-digital-360-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(2)`, primary: false },
          { label: '📊 Ver todo Marketing', onclick: `window.ALIE.state.filtroActivo='marketing';window.ALIE.renderProductos();document.getElementById('products-section').scrollIntoView({behavior:'smooth'})`, primary: false },
        ]
      );
      return;
    }

    // 4. TRADING
    if (this._match(t, this.kb.trading)) {
      this.ultimaRecomendacion = R.state.productos.find(p => p.id === 4);
      await this._addBotMessage(
        `₿ <strong>Trading Crypto Pro</strong><br>
        <span class="price">$79 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$129</span> — <span class="highlight">38% OFF 🔥</span><br><br>
        ✅ Binance P2P adaptado para Cuba<br>
        ✅ Análisis técnico profesional<br>
        ✅ Señales gratis 30 días<br>
        ✅ Gestión de riesgo y psicología<br><br>
        <em style="font-size:.8rem;color:var(--grey)">¡Aprende a mover USDT desde Cuba!</em>`,
        [
          { label: '₿ Comprar Hotmart', onclick: `window.open('https://hotmart.com/product/trading-crypto-pro-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(4)`, primary: false },
        ]
      );
      return;
    }

    // 5. DISEÑO
    if (this._match(t, this.kb.diseño)) {
      await this._addBotMessage(
        `🎨 <strong>Diseño UI/UX con Figma</strong><br>
        <span class="price">$59 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$89</span><br><br>
        ✅ Figma de 0 a Pro<br>
        ✅ Design Systems<br>
        ✅ 10 proyectos reales<br>
        ✅ Portafolio listo para clientes`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/ux-ui-figma-aliemarket','_blank')`, primary: true },
          { label: '🎬 + Video Editing', onclick: `window.alieBot.procesarMensaje('video')`, primary: false },
        ]
      );
      return;
    }

    // 6. SEO
    if (this._match(t, this.kb.seo)) {
      await this._addBotMessage(
        `🔍 <strong>SEO Dominación 2026</strong><br>
        <span class="price">$69 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$99</span> — <span class="highlight">30% OFF</span><br><br>
        ✅ Posiciona en Google desde Cuba<br>
        ✅ 14 horas de contenido técnico<br>
        ✅ Link building + keyword research`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/seo-dominacion-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(9)`, primary: false },
        ]
      );
      return;
    }

    // 7. INSTAGRAM
    if (this._match(t, this.kb.instagram)) {
      await this._addBotMessage(
        `📸 <strong>Instagram Mastery 2026</strong><br>
        <span class="price">$45 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$69</span><br><br>
        ✅ Reels virales + algoritmo<br>
        ✅ Templates Canva incluidos<br>
        ✅ Monetización desde 0`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/instagram-mastery-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(8)`, primary: false },
        ]
      );
      return;
    }

    // 8. WORDPRESS
    if (this._match(t, this.kb.wordpress)) {
      await this._addBotMessage(
        `🌐 <strong>WordPress Avanzado</strong><br>
        <span class="price">$39 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$59</span><br><br>
        ✅ Crea páginas profesionales<br>
        ✅ WooCommerce e-commerce<br>
        ✅ SEO básico incluido`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/wordpress-avanzado-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(3)`, primary: false },
        ]
      );
      return;
    }

    // 9. EXCEL / DATA
    if (this._match(t, this.kb.excel)) {
      await this._addBotMessage(
        `📊 <strong>Excel & Data Analysis</strong><br>
        <span class="price">$25 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$39</span><br><br>
        ✅ Tablas dinámicas + Macros VBA<br>
        ✅ Power BI introducción<br>
        ✅ El más accesible del catálogo`,
        [
          { label: '🔥 Comprar $25', onclick: `window.open('https://hotmart.com/product/excel-data-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(7)`, primary: false },
        ]
      );
      return;
    }

    // 10. DROPSHIPPING
    if (this._match(t, this.kb.dropshipping)) {
      await this._addBotMessage(
        `📦 <strong>Dropshipping Cuba Guide</strong><br>
        <span class="price">$99 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$149</span> — <span class="highlight">33% OFF</span><br><br>
        ✅ Modelo completo desde Cuba 🇨🇺<br>
        ✅ Proveedores + pagos internacionales<br>
        ✅ 20 horas + comunidad VIP`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/dropshipping-cuba-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(10)`, primary: false },
        ]
      );
      return;
    }


    // ROPA & MODA
    if (this._match(t, this.kb.ropa)) {
      await this._addBotMessage(
        `👕 <strong>Ropa & Moda ALIEMARKET</strong> 🇨🇺<br><br>
        👕 <strong>Camiseta Cyberpunk Habanero</strong> — <span class="price">$18 USD</span> · Edición limitada<br>
        🎒 <strong>Mochila Urbana Pro 30L</strong> — <span class="price">$35 USD</span> · Puerto USB integrado<br>
        👟 <strong>Zapatillas Urban</strong> — <span class="price">$42 USD</span> · Tallas 37-44<br><br>
        🚚 <em>Entrega a coordinar · Pago Transfermóvil, MLC, USDT o efectivo</em>`,
        [
          { label: '👕 Camiseta $18', onclick: 'window.ALIE.abrirModal(201)', primary: false },
          { label: '🎒 Mochila $35', onclick: 'window.ALIE.abrirModal(202)', primary: true },
          { label: '👟 Zapatillas $42', onclick: 'window.ALIE.abrirModal(203)', primary: false },
        ]
      );
      return;
    }

    // ELECTRODOMÉSTICOS
    if (this._match(t, this.kb.electrod)) {
      await this._addBotMessage(
        `⚡ <strong>Electrodomésticos</strong> — los esenciales para tu hogar 🇨🇺<br><br>
        🌀 <strong>Ventilador Torre 3vel</strong> — <span class="price">$58 USD</span> con mando<br>
        🍚 <strong>Arrocera Multifunción 5L</strong> — <span class="price">$32 USD</span><br>
        👔 <strong>Plancha Vapor Pro 2400W</strong> — <span class="price">$28 USD</span><br><br>
        🚚 <em>Entrega a coordinar según zona</em>`,
        [
          { label: '🌀 Ventilador $58', onclick: 'window.ALIE.abrirModal(301)', primary: true },
          { label: '🍚 Arrocera $32', onclick: 'window.ALIE.abrirModal(302)', primary: false },
          { label: '👔 Plancha $28', onclick: 'window.ALIE.abrirModal(303)', primary: false },
        ]
      );
      return;
    }

    // HOGAR
    if (this._match(t, this.kb.hogar)) {
      await this._addBotMessage(
        `🏠 <strong>Productos del Hogar</strong> 🇨🇺<br><br>
        🛏 <strong>Juego de Sábanas Premium</strong> — <span class="price">$24 USD</span> · 100% algodón<br>
        💡 <strong>Bombillos LED x10</strong> — <span class="price">$19 USD</span> · Ahorra 87% electricidad<br><br>
        <em>Esenciales para el hogar cubano. Pago Transfermóvil, MLC, USDT o efectivo.</em>`,
        [
          { label: '🛏 Sábanas $24', onclick: 'window.ALIE.abrirModal(401)', primary: false },
          { label: '💡 Bombillos LED x10 $19', onclick: 'window.ALIE.abrirModal(402)', primary: true },
        ]
      );
      return;
    }

    // ALIMENTOS
    if (this._match(t, this.kb.alimentos)) {
      await this._addBotMessage(
        `🛒 <strong>Alimentos & Despensa</strong> — productos cubanos naturales 🇨🇺<br><br>
        ☕ <strong>Café Cubano Premium</strong> — <span class="price">$8 USD</span> · 250g tostado artesanal<br>
        🥥 <strong>Aceite de Coco Orgánico 500ml</strong> — <span class="price">$12 USD</span><br>
        🍯 <strong>Miel de Abeja Pura 1kg</strong> — <span class="price">$14 USD</span> · Apicultura cubana<br><br>
        🚚 <em>Entrega a coordinar · También disponible pago efectivo en entrega</em>`,
        [
          { label: '☕ Café $8', onclick: 'window.ALIE.abrirModal(501)', primary: false },
          { label: '🥥 Aceite coco $12', onclick: 'window.ALIE.abrirModal(502)', primary: false },
          { label: '🍯 Miel $14', onclick: 'window.ALIE.abrirModal(503)', primary: true },
        ]
      );
      return;
    }

    // TECNOLOGÍA FÍSICA
    if (this._match(t, this.kb.tecnologia)) {
      await this._addBotMessage(
        `📱 <strong>Tecnología física</strong> — smartphones, tablets y más 🇨🇺<br><br>
        📱 <strong>Samsung Galaxy A15</strong> — <span class="price">$189 USD</span> (128GB/4GB)<br>
        📟 <strong>Tablet Xiaomi Redmi Pad</strong> — <span class="price">$165 USD</span> (11"/4GB/128GB)<br>
        📡 <strong>Router WiFi 6</strong> — <span class="price">$45 USD</span> (cobertura 150m²)<br><br>
        🚚 <em>Entrega a domicilio en Cuba · Pago Transfermóvil, MLC o USDT</em>`,
        [
          { label: '📱 Samsung $189', onclick: "window.ALIE.abrirModal(101)", primary: true },
          { label: '📟 Tablet $165', onclick: "window.ALIE.abrirModal(103)", primary: false },
          { label: '📡 Router $45', onclick: "window.ALIE.abrirModal(106)", primary: false },
        ]
      );
      return;
    }

    // ACCESORIOS FÍSICOS
    if (this._match(t, this.kb.accesorios)) {
      await this._addBotMessage(
        `🎧 <strong>Accesorios tecnológicos</strong> — los más vendidos 🇨🇺<br><br>
        🎧 <strong>Auriculares TWS Pro</strong> — <span class="price">$35 USD</span> <span class="highlight">36% OFF</span><br>
        🔋 <strong>Power Bank 20000mAh</strong> — <span class="price">$28 USD</span><br>
        ⌚ <strong>Smart Watch Pro</strong> — <span class="price">$55 USD</span> (GPS + salud)<br><br>
        🎁 <em>Bundle Tech Starter (Auriculares + Power Bank): <span class="price">$55</span></em>`,
        [
          { label: '🎧 Auriculares $35', onclick: "window.ALIE.abrirModal(102)", primary: false },
          { label: '🔋 Power Bank $28', onclick: "window.ALIE.abrirModal(104)", primary: false },
          { label: '🎁 Bundle Tech $55', onclick: "window.ALIE.abrirModal(108)", primary: true },
        ]
      );
      return;
    }

    // PRODUCTOS FÍSICOS EN GENERAL
    if (this._match(t, this.kb.fisicos)) {
      await this._addBotMessage(
        `📦 <strong>Productos físicos ALIEMARKET</strong><br><br>
        Tenemos <span class="price">20+ productos físicos</span> en todas las categorías:<br><br>
        📱 Tecnología · 🎧 Accesorios<br>
        ⚡ Electrodomésticos · 🏠 Hogar<br>
        👕 Ropa & Moda · 🛒 Alimentos<br>
        🔥 Ofertas combo<br><br>
        🚚 Entrega a coordinar según zona<br>
        💳 Transfermóvil · MLC · USDT · <strong>Efectivo en entrega</strong>`,
        [
          { label: '📱 Tecnología', onclick: "filterBycat('tecnologia')", primary: false },
          { label: '🎧 Accesorios', onclick: "filterBycat('accesorios')", primary: false },
          { label: '🔥 Ofertas físicas', onclick: "filterBycat('ofertas-fisicas')", primary: true },
        ]
      );
      return;
    }

    // 10b. NEGOCIOS (Excel + Dropshipping)
    if (this._match(t, this.kb.negocios)) {
      await this._addBotMessage(
        `💼 <strong>Cursos de Negocios</strong> — ideal para emprender desde Cuba 🇨🇺<br><br>
        📊 <strong>Excel & Data Analysis</strong> — <span class="price">$25 USD</span><br>
        Domina datos, automatiza reportes y toma decisiones con inteligencia.<br><br>
        📦 <strong>Dropshipping Cuba Guide</strong> — <span class="price">$99 USD</span><br>
        Modelo completo de negocio online desde Cuba con proveedores internacionales.`,
        [
          { label: '📊 Excel $25', onclick: `window.open('https://hotmart.com/product/excel-data-aliemarket','_blank')`, primary: false },
          { label: '📦 Dropshipping $99', onclick: `window.open('https://hotmart.com/product/dropshipping-cuba-aliemarket','_blank')`, primary: true },
          { label: '🛒 Ambos al carrito', onclick: `window.ALIE.addToCart(7);window.ALIE.addToCart(10);window.ALIE.showToast('✅ 2 cursos añadidos','success')`, primary: false },
        ]
      );
      return;
    }

    // 11. VIDEO
    if (this._match(t, this.kb.video)) {
      await this._addBotMessage(
        `🎬 <strong>Video Editing Pro</strong><br>
        <span class="price">$49 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$75</span><br><br>
        ✅ Premiere + After Effects + DaVinci<br>
        ✅ Presets y assets incluidos<br>
        ✅ Color grading profesional`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/video-editing-pro-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(11)`, primary: false },
        ]
      );
      return;
    }

    // 12. COPYWRITING
    if (this._match(t, this.kb.copywriting)) {
      await this._addBotMessage(
        `✍️ <strong>Copywriting Pro</strong><br>
        <span class="price">$35 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$55</span><br><br>
        ✅ Fórmulas que venden<br>
        ✅ 50 plantillas de copy<br>
        ✅ Emails, landing pages y redes`,
        [
          { label: '🔥 Comprar', onclick: `window.open('https://hotmart.com/product/copywriting-pro-aliemarket','_blank')`, primary: true },
          { label: '🛒 Al Carrito', onclick: `window.ALIE.addToCart(6)`, primary: false },
        ]
      );
      return;
    }

    // 13. BUNDLE
    if (this._match(t, this.kb.bundle)) {
      await this._addBotMessage(
        `🚀 <strong>Bundle Élite — 3 Cursos</strong><br>
        <span class="price">$79 USD</span> <span style="text-decoration:line-through;color:var(--grey);font-size:.82rem">$129</span> — <span class="highlight">¡AHORRAS $50!</span><br><br>
        📦 Incluye:<br>
        🐍 Python Pro + 📢 Marketing Digital + ₿ Trading Crypto<br><br>
        ✅ 35 horas de contenido<br>
        ✅ 3 certificados oficiales<br>
        ✅ Grupo VIP Telegram 🇨🇺`,
        [
          { label: '🚀 Comprar Bundle $79', onclick: `window.open('https://hotmart.com/product/bundle-elite-aliemarket','_blank')`, primary: true },
          { label: '🛒 Añadir al Carrito', onclick: `window.ALIE.addToCart(12)`, primary: false },
        ]
      );
      return;
    }

    // 14. PRECIO / AYUDA CON PRECIO
    if (this._match(t, this.kb.precio) || this._match(t, this.kb.descuento)) {
      const enCarrito = window.ALIE.state.carrito;
      if (enCarrito.length && (t.includes('caro') || t.includes('descuento') || t.includes('rebaja'))) {
        await this._negociarPrecio();
        return;
      }
      await this._addBotMessage(
        `💰 <strong>Precios ALIEMARKET 2026:</strong><br><br>
        🐍 Python Pro — <span class="price">$29</span><br>
        📢 Marketing 360 — <span class="price">$49</span><br>
        ₿ Trading Crypto — <span class="price">$79</span><br>
        🎨 UI/UX Figma — <span class="price">$59</span><br>
        🚀 Bundle Élite — <span class="price">$79</span> <em style="font-size:.8rem">(val. $129)</em><br><br>
        📱 <strong>Pagos:</strong> Hotmart · Transfermóvil · MLC · USDT<br>
        <em style="font-size:.8rem;color:var(--grey)">Tasa hoy: $1 USD = ${window.ALIE.tasas.cup} CUP</em>`,
        [
          { label: '🚀 Ver Bundle $79', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: true },
          { label: '💳 Cómo pagar', onclick: `window.alieBot.procesarMensaje('pago')`, primary: false },
        ]
      );
      return;
    }

    // 15. MÉTODOS DE PAGO
    // CÓMO COMPRAR
    if (this._match(t, this.kb.comprar)) {
      await this._addBotMessage(
        `🛒 <strong>¿Cómo comprar en ALIEMARKET?</strong><br><br>
        Es muy sencillo 👇<br><br>
        <strong>1️⃣</strong> Explora el catálogo y abre el producto que te interesa.<br>
        <strong>2️⃣</strong> Pulsa <em>"Añadir al carrito"</em> (🛒).<br>
        <strong>3️⃣</strong> Abre el carrito (arriba a la derecha) y elige tu método de pago:<br>
        &nbsp;&nbsp;• 📱 <strong>Transfermóvil</strong> (CUP)<br>
        &nbsp;&nbsp;• 💳 <strong>MLC</strong><br>
        &nbsp;&nbsp;• ₿ <strong>USDT P2P Binance</strong><br>
        &nbsp;&nbsp;• 💵 <strong>Efectivo en entrega</strong> (solo físicos)<br>
        &nbsp;&nbsp;• 🔥 <strong>Hotmart</strong> (solo digitales — acceso en 60 seg)<br>
        <strong>4️⃣</strong> Envía el comprobante por Telegram con tu número de pedido.<br><br>
        ¿Quieres ver el catálogo o tienes dudas sobre algún producto?`,
        [
          { label: '🛒 Ver catálogo', onclick: "document.getElementById('products-section').scrollIntoView({behavior:'smooth'})", primary: true },
          { label: '💳 Métodos de pago', onclick: "window.alieBot.procesarMensaje('pago')", primary: false },
        ]
      );
      return;
    }

    // DEVOLUCIONES Y GARANTÍA
    if (this._match(t, this.kb.devolucion)) {
      const tg = window.ALIE?.config?.telegramUser || '@AlieMarket';
      const tgLink = window.ALIE?.config?.telegramLink || 'https://t.me/AlieMarket';
      await this._addBotMessage(
        `↩️ <strong>Política de devoluciones ALIEMARKET</strong><br><br>
        <strong>📲 Productos digitales:</strong><br>
        ✅ Reembolso completo si no puedes acceder dentro de las primeras <strong>24 horas</strong>.<br>
        ❌ No aplica si ya accediste al contenido.<br><br>
        <strong>📦 Productos físicos:</strong><br>
        ✅ Cambio o devolución si llega dañado o diferente al anunciado.<br>
        ✅ Repórtalo en las primeras <strong>48 horas</strong> con fotos.<br>
        ❌ No aplica por cambio de opinión.<br><br>
        Para reclamaciones contacta a <strong>${tg}</strong> en Telegram.`,
        [{ label: '📱 Ir a Telegram', onclick: `window.open('${tgLink}','_blank')`, primary: true }]
      );
      return;
    }

    if (this._match(t, this.kb.pago)) {
      await this._addBotMessage(
        `💳 <strong>Métodos de pago disponibles:</strong><br><br>
        🔥 <strong>Hotmart</strong> — Tarjeta/PayPal internacional<br>
        &nbsp;&nbsp;&nbsp;→ Acceso en <span class="highlight">60 segundos</span><br><br>
        📱 <strong>Transfermóvil</strong> — Equivalente en CUP<br>
        &nbsp;&nbsp;&nbsp;→ Envía monto → soporte te da acceso<br><br>
        💳 <strong>MLC</strong> — Tarjeta magnética<br>
        &nbsp;&nbsp;&nbsp;→ ${window.ALIE.tasas.mlc} MLC por USD (hoy)<br><br>
        💰 <strong>USDT P2P Binance</strong> — Stablecoin<br>
        &nbsp;&nbsp;&nbsp;→ Contáctanos para dirección P2P`,
        [
          { label: '🔥 Ir a Hotmart', onclick: `window.open('https://hotmart.com','_blank')`, primary: true },
          { label: '📱 Transfermóvil', onclick: `window.ALIE.showToast('📱 Transfermóvil: contacta soporte para QR','success')`, primary: false },
        ]
      );
      return;
    }

    // 16. ACCESO / ENTREGA
    if (this._match(t, this.kb.acceso)) {
      await this._addBotMessage(
        `⚡ <strong>¿Cómo recibo mi curso / PDF?</strong><br><br>\n        📥 <strong>PDF inmediato</strong>: Los cursos digitales incluyen un <b>eBook PDF descargable</b> que se descarga automaticamente al completar tu pago.<br><br>
        🔥 <strong>Hotmart</strong>: Acceso automático en <span class="highlight">60 segundos</span> tras el pago. Recibes email con usuario y contraseña.<br><br>
        📱 <strong>Transfermóvil/MLC/USDT</strong>: Envías comprobante → te enviamos el link a tu email en menos de 2 horas.<br><br>
        ✅ <em>Acceso de por vida + actualizaciones gratis</em>`,
        [
          { label: '🚀 Comprar ahora', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: true },
        ]
      );
      return;
    }

    // 17. AYUDA GENERAL / CATÁLOGO
    if (this._match(t, this.kb.ayuda)) {
      await this._addBotMessage(
        `💻 <strong>Catálogo ALIEMARKET 2026</strong><br><br>
        Tenemos <span class="price">12 productos digitales</span>:<br><br>
        🐍 Programación · 📢 Marketing · ₿ Trading<br>
        🎨 Diseño · 💼 Negocios · 🚀 Bundles<br><br>
        ¿Qué área te interesa más?`,
        [
          { label: '🐍 Python $29', onclick: `window.alieBot.procesarMensaje('python')` },
          { label: '📢 Marketing $49', onclick: `window.alieBot.procesarMensaje('marketing')` },
          { label: '₿ Trading $79', onclick: `window.alieBot.procesarMensaje('trading')` },
          { label: '🚀 Bundle $79', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: true },
        ]
      );
      return;
    }

    // 18. UPSELL BASADO EN CARRITO
    if (window.ALIE.state.carrito.length > 0) {
      await this._upsellInteligente(t);
      return;
    }

    // 19. FALLBACK con IA sugerida
    await this._fallback(t);
  }

  // ── NEGOCIACIÓN ──────────────────────────────────────────────
  async _negociarPrecio() {
    this.negociando = true;
    const total = window.ALIE.state.carrito.reduce((s,p) => s + p.precioUSD, 0);
    const descTotal = Math.round(total * 0.2);

    await this._addBotMessage(
      `🤝 <strong>¡Entiendo! Negociemos.</strong><br><br>
      Tu carrito: <span class="price">$${total} USD</span><br>
      Con descuento especial: <span class="price">$${total - descTotal} USD</span> (−$${descTotal})<br><br>
      ¿Añades el <strong>Bundle Élite</strong> y te lo dejo en <span class="highlight">$79 USD por todo</span>? 🇨🇺`,
      [
        { label: '✅ ¡Sí, acepto!', onclick: `window.ALIE.addToCart(12);window.alieBot._cerrarVentaBundle()`, primary: true },
        { label: '❌ No gracias', onclick: `window.alieBot.procesarMensaje('pago')`, primary: false },
      ]
    );
  }

  async _cerrarVentaBundle() {
    await this._addBotMessage(
      `🎉 <strong>¡DEAL CERRADO!</strong><br><br>
      Bundle Élite añadido a tu carrito. <span class="price">$79 USD</span> — el mejor precio del año.<br><br>
      ⚡ ¿Finalizamos por Hotmart ahora?`,
      [
        { label: '🔥 Comprar en Hotmart', onclick: `window.open('https://hotmart.com/product/bundle-elite-aliemarket','_blank')`, primary: true },
        { label: '🛒 Ver carrito', onclick: `window.ALIE.openCart()`, primary: false },
      ]
    );
  }

  // ── UPSELL INTELIGENTE ───────────────────────────────────────
  async _upsellInteligente(texto) {
    const carrito = window.ALIE.state.carrito;
    const cats = carrito.map(p => p.categoria);

    let msg = `👀 Vi que tienes <strong>${carrito.map(p=>p.nombre).join(' + ')}</strong> en tu carrito.<br><br>`;

    if (cats.includes('programacion') && !cats.includes('marketing')) {
      msg += `¿Qué tal si sumas <strong>Marketing Digital</strong>? Python + Marketing = el combo perfecto para emprender desde Cuba. <span class="price">$49 → $39 si lo añades ahora</span>.`;
      await this._addBotMessage(msg, [
        { label: '📢 Añadir Marketing', onclick: `window.ALIE.addToCart(2)`, primary: true },
        { label: '🚀 Mejor Bundle $79', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: false },
      ]);
    } else if (cats.includes('marketing') && !cats.includes('programacion')) {
      msg += `Con <strong>Python Pro</strong> automatizarás tus campañas. El combo que usan los marketers Pro. <span class="price">$29 ahora</span>.`;
      await this._addBotMessage(msg, [
        { label: '🐍 Añadir Python', onclick: `window.ALIE.addToCart(1)`, primary: true },
        { label: '🚀 Bundle $79', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: false },
      ]);
    } else {
      await this._addBotMessage(
        `🛒 Tienes ${carrito.length} producto(s) en tu carrito.<br>¿Finalizamos la compra?`,
        [
          { label: '🔥 Comprar en Hotmart', onclick: `window.ALIE.openCart()`, primary: true },
          { label: '🚀 Ver Bundle $79', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: false },
        ]
      );
    }
  }

  // ── FALLBACK ─────────────────────────────────────────────────
  async _fallback(texto) {
    // Búsqueda fuzzy en productos
    const q = texto.toLowerCase();
    const match = window.ALIE.state.productos.find(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );

    if (match) {
      this.ultimaRecomendacion = match;
      await this._addBotMessage(
        `🎯 Creo que te puede interesar: <strong>${match.nombre}</strong><br>
        <span class="price">$${match.precioUSD} USD</span><br><br>
        ${match.beneficios.slice(0,3).map(b => `✅ ${b}`).join('<br>')}`,
        [
          { label: '🔥 Comprar Hotmart', onclick: `window.open('${match.hotmartLink}','_blank')`, primary: true },
          { label: '🛒 Añadir carrito', onclick: `window.ALIE.addToCart(${match.id})`, primary: false },
        ]
      );
      return;
    }

    await this._addBotMessage(
      `💻 No entendí del todo, pero puedo ayudarte con:<br><br>
      🐍 Python · 📢 Marketing · ₿ Trading · 🎨 Diseño<br>
      📦 Bundle · 💰 Precios · 💳 Pagos · ⚡ Acceso`,
      [
        { label: '📋 Ver Catálogo', onclick: `document.getElementById('products-section').scrollIntoView({behavior:'smooth'})`, primary: false },
        { label: '🚀 Bundle Élite', onclick: `window.alieBot.procesarMensaje('bundle')`, primary: true },
      ]
    );
  }

  // ── CARRITO ABANDONADO ────────────────────────────────────────
  async sendAbandonMessage() {
    if (!this.chatOpen) return;
    const carrito = window.ALIE?.state.carrito || [];
    if (!carrito.length) return;
    const total = carrito.reduce((s,p) => s+p.precioUSD, 0);
    await this._addBotMessage(
      `⏰ <strong>Oye, tienes ${carrito.length} curso(s) pendientes</strong><br><br>
      Total: <span class="price">$${total} USD</span><br><br>
      ¿Completamos la compra? Te puedo hacer un descuento del <span class="highlight">10% adicional</span>.`,
      [
        { label: '✅ Sí, finalizar', onclick: `window.ALIE.openCart()`, primary: true },
        { label: '❌ No ahora', onclick: ``, primary: false },
      ]
    );
  }

  // ── POST COMPRA ──────────────────────────────────────────────
  async onPurchase(itemsComprados) {
    const nombres = itemsComprados.map(p => p.nombre).join(', ');
    await this._addBotMessage(
      `🎉 <strong>¡FELICIDADES!</strong><br><br>
      Compraste: <strong>${nombres}</strong><br><br>
      ⚡ Acceso inmediato vía Hotmart.<br>
      📧 Revisa tu email en los próximos minutos.<br>
      💬 ¿Tienes dudas? Aquí estoy 24/7. 🇨🇺`
    );
  }

  // ── TRIGGER POR BÚSQUEDA ─────────────────────────────────────
  onSearch(query) {
    if (!query || query.length < 2) return;
    // Buscar productos relevantes
    const q = query.toLowerCase();
    const productos = window.ALIE?.state.productos || [];
    const matches = productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q) ||
      (p.beneficios || []).some(b => b.toLowerCase().includes(q))
    ).slice(0, 4);

    if (!matches.length) return;
    // Siempre abrir el bot para mostrar resultados
    const wasClosed = !this.chatOpen;
    if (wasClosed) openAlieBot();
    const delay = wasClosed ? 700 : 300;
    setTimeout(async () => {
      const lista = matches.map(p =>
        `• <strong>${p.nombre}</strong> — <span class="price">$${p.precioUSD} USD</span>${p.tipo === 'fisico' ? ' 📦' : ' ⚡'}`
      ).join('<br>');
      await this._addBotMessage(
        `🔍 Encontré ${matches.length} resultado(s) para "<strong>${query}</strong>":<br><br>${lista}`,
        matches.map(p => ({
          label: `${p.tipo === 'fisico' ? '📦' : '🛒'} ${p.nombre.split(' ').slice(0,3).join(' ')}`,
          onclick: `window.ALIE.abrirModal(${p.id})`,
          primary: matches.indexOf(p) === 0
        }))
      );
    }, delay);
  }

  // ── HELPERS ──────────────────────────────────────────────────
  _match(texto, keywords) {
    return keywords.some(k => texto.includes(k));
  }
}

// ── FUNCIONES GLOBALES (HTML onclicks) ───────────────────────
function openAlieBot() {
  const chat = document.getElementById('aliebot-chat');
  chat.classList.add('open');
  if (window.alieBot) window.alieBot.chatOpen = true;
  document.getElementById('aliebot-notif').style.display = 'none';
}

function toggleAlieBot() {
  const chat = document.getElementById('aliebot-chat');
  const isOpen = chat.classList.toggle('open');
  if (window.alieBot) window.alieBot.chatOpen = isOpen;
  if (isOpen) {
    document.getElementById('aliebot-notif').style.display = 'none';
    setTimeout(() => document.getElementById('chat-input').focus(), 300);
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  if (window.alieBot) alieBot.procesarMensaje(msg);
}

function sendQuickReply(msg) {
  openAlieBot();
  setTimeout(() => {
    if (window.alieBot) alieBot.procesarMensaje(msg);
  }, 300);
}

function toggleVoice() {
  if (window.alieBot) alieBot.toggleVoice();
}

function alieBotWelcome() {
  // Notificación proactiva en pantalla
  if (!document.getElementById('aliebot-chat').classList.contains('open')) {
    window.ALIE?.showToast('🤖 AlieBot: ¿Necesitas ayuda para elegir tu curso?', 'info');
  }
}

// Instanciar
const alieBot = new AlieBotDigital();
window.alieBot = alieBot;

// ── FUNCIONES GLOBALES (acceso desde HTML) ────────────────────
window.openAlieBot     = openAlieBot;
window.alieBotWelcome  = alieBotWelcome;
window.toggleAlieBot   = () => window.alieBot?.openAlieBot?.();
window.sendChatMessage = (msg) => window.alieBot?.sendChatMessage?.(msg);
window.sendQuickReply  = (label, msg) => window.alieBot?.sendQuickReply?.(label, msg);

// Auto-bienvenida después de 3.5s (ahora que aliebot.js ya cargó)
setTimeout(() => alieBotWelcome(), 3500);
