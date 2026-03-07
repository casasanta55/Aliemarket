const RAUM_DATA = (() => {
  const DEFAULT_PRODUCTS = [
    { id:"d001", nombre:"Masterclass: Diseño UX desde Cero", tipo:"digital", categoria:"Cursos", precio:49, moneda:"USD", imagen:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80", descripcion:"12 módulos para dominar Figma, wireframes y sistemas de diseño profesionales.", hotmartLink:"https://hotmart.com/product/ejemplo-ux", badge:"Bestseller" },
    { id:"d002", nombre:"Ebook: Finanzas para Freelancers", tipo:"digital", categoria:"Ebooks", precio:17, moneda:"USD", imagen:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80", descripcion:"Controla tus ingresos, ahorra en impuestos y construye patrimonio como independiente.", hotmartLink:null, badge:null },
    { id:"d003", nombre:"Pack Plantillas Notion para Negocios", tipo:"digital", categoria:"Plantillas", precio:29, moneda:"USD", imagen:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", descripcion:"15 workspaces de Notion listos: CRM, gestor de proyectos, diario productivo y más.", hotmartLink:null, badge:"Nuevo" },
    { id:"d004", nombre:"Software: Generador de Contratos PDF", tipo:"digital", categoria:"Software", precio:39, moneda:"USD", imagen:"https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=600&q=80", descripcion:"App web ligera para generar contratos profesionales en segundos. Sin suscripción.", hotmartLink:null, badge:null },
    { id:"d005", nombre:"Audiolibro: Los 7 Pilares del Liderazgo", tipo:"digital", categoria:"Audiolibros", precio:14, moneda:"USD", imagen:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80", descripcion:"6 horas de contenido narrado sobre liderazgo moderno, delegación y visión estratégica.", hotmartLink:null, badge:null },
    { id:"d006", nombre:"Curso: Marketing con IA — Nivel Avanzado", tipo:"digital", categoria:"Cursos", precio:67, moneda:"USD", imagen:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", descripcion:"Automatiza campañas, genera copies y analiza audiencias usando ChatGPT y otras IAs.", hotmartLink:"https://hotmart.com/product/ejemplo-marketing", badge:"Oferta" },
    { id:"d007", nombre:"Plantillas Canva: Identidad de Marca", tipo:"digital", categoria:"Plantillas", precio:22, moneda:"USD", imagen:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80", descripcion:"80 plantillas editables: logotipos, paletas, tarjetas, posts y kits de bienvenida.", hotmartLink:null, badge:null },
    { id:"d008", nombre:"Ebook: Guía Crypto para Principiantes", tipo:"digital", categoria:"Ebooks", precio:12, moneda:"USD", imagen:"https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80", descripcion:"Todo lo que necesitas saber sobre Bitcoin, Ethereum y stablecoins sin tecnicismos.", hotmartLink:null, badge:null },
    { id:"d009", nombre:"Pack Presets Lightroom — Cine Moderno", tipo:"digital", categoria:"Plantillas", precio:18, moneda:"USD", imagen:"https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80", descripcion:"25 presets profesionales para fotos de viaje, retratos y lifestyle con estética cinematográfica.", hotmartLink:null, badge:"Popular" },
    { id:"d010", nombre:"Curso: Python para Automatización", tipo:"digital", categoria:"Cursos", precio:55, moneda:"USD", imagen:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80", descripcion:"Aprende a automatizar tareas repetitivas, scraping web y reportes automáticos con Python.", hotmartLink:"https://hotmart.com/product/ejemplo-python", badge:null },
    { id:"f001", nombre:"Auriculares Inalámbricos Pro X7", tipo:"fisico", categoria:"Electrónica", precio:89, moneda:"USD", imagen:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", descripcion:"40h de batería, cancelación activa de ruido, drivers de 40mm, micrófono integrado.", hotmartLink:null, badge:"Nuevo" },
    { id:"f002", nombre:"Camiseta Oversize — Urban Black", tipo:"fisico", categoria:"Ropa", precio:24, moneda:"USD", imagen:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", descripcion:"100% algodón peinado, corte oversize unisex. Tallas S–XXL disponibles.", hotmartLink:null, badge:null },
    { id:"f003", nombre:"Lámpara LED de Escritorio Minimalista", tipo:"fisico", categoria:"Hogar", precio:45, moneda:"USD", imagen:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", descripcion:"Temperatura de color ajustable, carga inalámbrica integrada, diseño nórdico.", hotmartLink:null, badge:"Popular" },
    { id:"f004", nombre:"Mochila Urbana Impermeable 30L", tipo:"fisico", categoria:"Ropa", precio:58, moneda:"USD", imagen:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", descripcion:"Compartimento para laptop 15\", puerto USB externo, materiales resistentes al agua.", hotmartLink:null, badge:null },
    { id:"f005", nombre:"Teclado Mecánico Compacto RGB", tipo:"fisico", categoria:"Electrónica", precio:75, moneda:"USD", imagen:"https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80", descripcion:"Switches tactiles Cherry MX Brown, layout 75%, iluminación RGB por tecla.", hotmartLink:null, badge:"Oferta" },
    { id:"f006", nombre:"Esterilla de Yoga Premium 6mm", tipo:"fisico", categoria:"Deportes", precio:32, moneda:"USD", imagen:"https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80", descripcion:"Material TPE ecológico, antideslizante, con bolsa de transporte incluida.", hotmartLink:null, badge:null },
    { id:"f007", nombre:"Set de Escritorio Bambú — 4 piezas", tipo:"fisico", categoria:"Hogar", precio:38, moneda:"USD", imagen:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", descripcion:"Portaplumas, bandeja, soporte móvil y reloj. Madera de bambú sostenible.", hotmartLink:null, badge:null },
    { id:"f008", nombre:"Zapatillas Running Ultralight", tipo:"fisico", categoria:"Deportes", precio:95, moneda:"USD", imagen:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", descripcion:"Suela de gel amortiguador, upper mesh transpirable, peso 195g. Tallas 38–46.", hotmartLink:null, badge:"Bestseller" },
    { id:"f009", nombre:"Smartwatch Fit Pro — Negro", tipo:"fisico", categoria:"Electrónica", precio:120, moneda:"USD", imagen:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", descripcion:"Monitor cardíaco, SpO2, GPS integrado, resistente al agua 5ATM, batería 7 días.", hotmartLink:null, badge:null },
    { id:"f010", nombre:"Hoodie Essentials — Gris Carbón", tipo:"fisico", categoria:"Ropa", precio:42, moneda:"USD", imagen:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", descripcion:"Fleece interior suave 320g/m², bolsillo canguro, cordón ajustable. Unisex.", hotmartLink:null, badge:null },
  ];

  function loadProducts() {
    try { const s = localStorage.getItem('alie_products'); return s ? JSON.parse(s) : [...DEFAULT_PRODUCTS]; }
    catch { return [...DEFAULT_PRODUCTS]; }
  }
  function saveProducts(p) { localStorage.setItem('alie_products', JSON.stringify(p)); }
  function getAll()    { return loadProducts(); }
  function getById(id) { return loadProducts().find(p => p.id === id) || null; }
  function add(product) {
    const ps = loadProducts();
    if (ps.find(p => p.id === product.id)) throw new Error(`Ya existe id "${product.id}".`);
    product.imagen = product.imagen || 'https://placehold.co/600x400/050510/22d3ee?text=ALIE';
    product.descripcion = product.descripcion || '';
    product.hotmartLink = product.hotmartLink || null;
    product.badge = product.badge || null;
    ps.push(product); saveProducts(ps);
  }
  function remove(id) {
    const ps = loadProducts(); const i = ps.findIndex(p => p.id === id);
    if (i === -1) throw new Error(`No encontrado: "${id}".`);
    ps.splice(i, 1); saveProducts(ps);
  }
  function reset() { saveProducts([...DEFAULT_PRODUCTS]); }

  const CATEGORIES = {
    digital: ['Cursos','Ebooks','Plantillas','Software','Audiolibros'],
    fisico:  ['Ropa','Electrónica','Hogar','Deportes'],
  };
  const CONFIG = { whatsapp:'5353778973', instagram:'aliemarket', facebook:'aliemarket', storeName:'ALIEMARKET' };

  return { getAll, getById, add, remove, reset, CATEGORIES, CONFIG };
})();
