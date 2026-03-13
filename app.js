/* ============================================================
   ALIEMARKET DIGITAL — app.js  v9
   27 productos digitales · físicos ampliados · reseñas públicas
   dirección de entrega · GA4 eventos · email capture
   ============================================================ */

'use strict';

let tasas_global = {};

// ── RESEÑAS PÚBLICAS ──────────────────────────────────────────
// Estructura: { [productId]: [{autor, pais, texto, rating, fecha}] }
const RESENAS_BASE = {
  1:  [
    {autor:'Carlos M.', pais:'La Habana', texto:'Empecé sin saber nada de Python y en 3 semanas ya automaticé mis reportes del negocio. Vale cada centavo.', rating:5, fecha:'Enero 2026'},
    {autor:'Lianys R.', pais:'Santiago de Cuba', texto:'Muy completo y bien explicado. Los ejercicios son prácticos y reales.', rating:5, fecha:'Feb 2026'},
    {autor:'Roberto V.', pais:'Miami', texto:'Lo compré para mi sobrino en Cuba. Me dijo que es el mejor curso de programación que ha tomado.', rating:5, fecha:'Feb 2026'},
  ],
  2:  [
    {autor:'Yolanda P.', pais:'Matanzas', texto:'El módulo de Facebook Ads me ayudó a vender mis primeros 20 jabones artesanales online. ¡Gracias!', rating:5, fecha:'Dic 2025'},
    {autor:'Frank O.', pais:'Cienfuegos', texto:'Muy bueno. Los casos específicos de Cuba hacen la diferencia vs otros cursos de marketing.', rating:4, fecha:'Ene 2026'},
  ],
  4:  [
    {autor:'Adrián L.', pais:'La Habana', texto:'La sección de Binance P2P para Cuba es oro puro. Recuperé mi inversión en el primer mes de trading.', rating:5, fecha:'Ene 2026'},
    {autor:'Mariana S.', pais:'Madrid (diáspora)', texto:'Compré este curso para mi primo en Cuba. Dice que está aprendiendo un montón sobre gestión del riesgo.', rating:5, fecha:'Feb 2026'},
  ],
  9:  [
    {autor:'Yasiel T.', pais:'Holguín', texto:'Gracias a este curso posicioné mi página de arrendamiento en Google por primera vez. Resultados en 6 semanas.', rating:5, fecha:'Dic 2025'},
    {autor:'Cristina B.', pais:'La Habana', texto:'El módulo de link building adaptado a Cuba es único. No encontré esto en ningún otro lado.', rating:5, fecha:'Ene 2026'},
  ],
  10: [
    {autor:'Ernesto C.', pais:'Camagüey', texto:'El modelo de dropshipping adaptado a las realidades de Cuba es lo que diferencia este curso. Muy honesto sobre los retos.', rating:5, fecha:'Nov 2025'},
    {autor:'Daniela M.', pais:'Tampa (diáspora)', texto:'Mi hermana en Cuba lo tomó y ya tiene su primera tienda funcionando con proveedores de Alibaba.', rating:5, fecha:'Ene 2026'},
    {autor:'Jorge A.', pais:'Sancti Spíritus', texto:'Excelente. Los contactos de proveedores valen más que el precio del curso.', rating:5, fecha:'Feb 2026'},
  ],
  101:[
    {autor:'Yuliet R.', pais:'La Habana', texto:'El Samsung A15 llegó en perfectas condiciones. Exactamente como lo describieron. Súper recomendado.', rating:5, fecha:'Feb 2026'},
    {autor:'Alex P.', pais:'Santiago de Cuba', texto:'Buena pantalla y batería dura todo el día. Muy satisfecho con la compra.', rating:4, fecha:'Ene 2026'},
  ],
  301:[
    {autor:'Maylin O.', pais:'Ciego de Ávila', texto:'El ventilador llegó rápido y funciona silencioso. El mando a distancia es muy cómodo.', rating:5, fecha:'Feb 2026'},
  ],
  402:[
    {autor:'Luis R.', pais:'Matanzas', texto:'Ahorramos mucho con los LED. Llevamos 3 meses sin cambiar ninguno y dan buena luz.', rating:5, fecha:'Ene 2026'},
    {autor:'Carmen V.', pais:'La Habana', texto:'Esenciales para Cuba. Los mejores que hemos tenido. Llegan bien embalados.', rating:5, fecha:'Feb 2026'},
  ],
};

// ── CATÁLOGO DIGITAL ──────────────────────────────────────────
const PRODUCTOS_ALIE = [
  {
    id: 1, nombre: 'Curso Python Pro',
    descripcion: 'Domina Python desde cero hasta nivel avanzado. Automatización, scripts, bots y proyectos reales con IA.',
    precioUSD: 29, precioOrigUSD: 49, categoria: 'programacion', icon: '🐍',
    badge: 'hot', badgeText: 'HOT',
    hotmartLink: 'https://hotmart.com/product/curso-python-pro-aliemarket',
    archivo: 'curso-python-pro-aliemarket.pdf', esDigital: true, stock: 999, ventas: 432, rating: 4.9,
    beneficios: ['Acceso inmediato','8h video HD','Certificado oficial','Soporte 24/7','Actualizaciones gratis'],
    duracion: '8 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 2, nombre: 'Marketing Digital 360',
    descripcion: 'Estrategias completas de marketing digital para el mercado cubano y latinoamericano. Facebook Ads, email, funnels.',
    precioUSD: 49, precioOrigUSD: 79, categoria: 'marketing', icon: '📢',
    badge: 'popular', badgeText: 'POPULAR',
    hotmartLink: 'https://hotmart.com/product/marketing-digital-360-aliemarket',
    archivo: 'marketing-digital-360-aliemarket.pdf', esDigital: true, stock: 999, ventas: 318, rating: 4.8,
    beneficios: ['12h de contenido','Plantillas incluidas','Casos Cuba','Certificado','Grupo privado'],
    duracion: '12 horas', nivel: 'Intermedio', destacado: true
  },
  {
    id: 3, nombre: 'WordPress Avanzado',
    descripcion: 'Crea sitios web profesionales con WordPress, WooCommerce y optimización SEO para posicionar en Google.',
    precioUSD: 39, precioOrigUSD: 59, categoria: 'programacion', icon: '🌐',
    badge: 'new', badgeText: 'NUEVO',
    hotmartLink: 'https://hotmart.com/product/wordpress-avanzado-aliemarket',
    archivo: 'wordpress-avanzado-aliemarket.pdf', esDigital: true, stock: 999, ventas: 187, rating: 4.7,
    beneficios: ['10h de contenido','Temas premium','WooCommerce','SEO básico','Certificado'],
    duracion: '10 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 4, nombre: 'Trading Crypto Pro',
    descripcion: 'Análisis técnico, gestión de riesgo, P2P Binance y estrategias adaptadas al mercado cubano con USDT.',
    precioUSD: 79, precioOrigUSD: 129, categoria: 'trading', icon: '₿',
    badge: 'off', badgeText: '38% OFF',
    hotmartLink: 'https://hotmart.com/product/trading-crypto-pro-aliemarket',
    archivo: 'trading-crypto-pro-aliemarket.pdf', esDigital: true, stock: 999, ventas: 256, rating: 4.9,
    beneficios: ['15h video','Señales gratis 30 días','Binance P2P guía Cuba','Soporte Telegram','Certificado'],
    duracion: '15 horas', nivel: 'Básico → Pro', destacado: true
  },
  {
    id: 5, nombre: 'Diseño UI/UX Figma',
    descripcion: 'Diseña interfaces profesionales con Figma. Principios UX, design systems, prototyping y portafolio.',
    precioUSD: 59, precioOrigUSD: 89, categoria: 'diseño', icon: '🎨',
    badge: null, badgeText: null,
    hotmartLink: 'https://hotmart.com/product/ux-ui-figma-aliemarket',
    archivo: 'diseno-ui-ux-figma-aliemarket.pdf', esDigital: true, stock: 999, ventas: 203, rating: 4.8,
    beneficios: ['11h de contenido','Figma Pro incluido','10 proyectos reales','Portafolio','Certificado'],
    duracion: '11 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 6, nombre: 'Copywriting Pro',
    descripcion: 'Escribe textos que venden. Fórmulas de copywriting, storytelling, emails, landing pages y redes sociales.',
    precioUSD: 35, precioOrigUSD: 55, categoria: 'marketing', icon: '✍️',
    badge: null, badgeText: null,
    hotmartLink: 'https://hotmart.com/product/copywriting-pro-aliemarket',
    archivo: 'copywriting-pro-aliemarket.pdf', esDigital: true, stock: 999, ventas: 159, rating: 4.7,
    beneficios: ['7h de contenido','50 plantillas','Swipe file','Ejercicios','Certificado'],
    duracion: '7 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 7, nombre: 'Excel & Data Analysis',
    descripcion: 'Domina Excel avanzado, tablas dinámicas, macros VBA, Power BI y análisis de datos para negocios.',
    precioUSD: 25, precioOrigUSD: 39, categoria: 'negocios', icon: '📊',
    badge: null, badgeText: null,
    hotmartLink: 'https://hotmart.com/product/excel-data-aliemarket',
    archivo: 'excel-data-analysis-aliemarket.pdf', esDigital: true, stock: 999, ventas: 144, rating: 4.6,
    beneficios: ['9h de contenido','Archivos práctica','VBA básico','Power BI intro','Certificado'],
    duracion: '9 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 8, nombre: 'Instagram Mastery 2026',
    descripcion: 'Crece tu cuenta y monetiza en Instagram. Reels virales, algoritmo, colaboraciones y venta de servicios.',
    precioUSD: 45, precioOrigUSD: 69, categoria: 'marketing', icon: '📸',
    badge: 'hot', badgeText: 'HOT',
    hotmartLink: 'https://hotmart.com/product/instagram-mastery-aliemarket',
    archivo: 'instagram-tiktok-negocios-cuba-2026.pdf', esDigital: true, stock: 999, ventas: 287, rating: 4.8,
    beneficios: ['8h de contenido','Templates Canva','Scripts virales','Analytics','Certificado'],
    duracion: '8 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 9, nombre: 'SEO Dominación 2026',
    descripcion: 'Posiciona sitios web en Google con SEO técnico, contenido, link building y herramientas de análisis.',
    precioUSD: 69, precioOrigUSD: 99, categoria: 'marketing', icon: '🔍',
    badge: 'off', badgeText: '30% OFF',
    hotmartLink: 'https://hotmart.com/product/seo-dominacion-aliemarket',
    archivo: 'seo-dominacion-2026-aliemarket.pdf', esDigital: true, stock: 999, ventas: 178, rating: 4.9,
    beneficios: ['14h video','Auditoría template','Keyword research','Link building','Certificado'],
    duracion: '14 horas', nivel: 'Intermedio → Pro', destacado: true
  },
  {
    id: 10, nombre: 'Dropshipping Cuba Guide',
    descripcion: 'Modelo completo para hacer dropshipping desde Cuba. Proveedores, pagos internacionales, marketing y escala.',
    precioUSD: 99, precioOrigUSD: 149, categoria: 'negocios', icon: '📦',
    badge: 'off', badgeText: '33% OFF',
    hotmartLink: 'https://hotmart.com/product/dropshipping-cuba-aliemarket',
    archivo: 'dropshipping-cuba-guide-aliemarket.pdf', esDigital: true, stock: 999, ventas: 312, rating: 4.9,
    beneficios: ['20h de contenido','Contactos proveedores','Guía pagos Cuba','Comunidad VIP','Certificado'],
    duracion: '20 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 11, nombre: 'Video Editing Pro',
    descripcion: 'Edita videos profesionales con Premiere Pro, After Effects y Da Vinci Resolve. Color grading y motion.',
    precioUSD: 49, precioOrigUSD: 75, categoria: 'diseño', icon: '🎬',
    badge: null, badgeText: null,
    hotmartLink: 'https://hotmart.com/product/video-editing-pro-aliemarket',
    archivo: 'video-editing-pro-aliemarket.pdf', esDigital: true, stock: 999, ventas: 196, rating: 4.7,
    beneficios: ['13h video','Presets incluidos','Fuentes & assets','Proyectos reales','Certificado'],
    duracion: '13 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 13, nombre: 'WhatsApp Business Mastery',
    descripcion: 'El canal de ventas #1 para emprendedores cubanos. Scripts, automatizaciones, etiquetas y sistema de cierre.',
    precioUSD: 25, precioOrigUSD: 45, categoria: 'marketing', icon: '💬',
    badge: 'new', badgeText: 'NUEVO',
    hotmartLink: 'https://hotmart.com/product/whatsapp-business-mastery-aliemarket',
    archivo: 'whatsapp-business-mastery.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 143, rating: 4.8,
    beneficios: ['Configuración profesional WA Business','5 scripts para tipos de clientes','Sistema CRM con etiquetas','Secuencia seguimiento 7 días','Recuperación de chats fríos'],
    duracion: '5 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 14, nombre: 'Shopify Ecommerce 2026',
    descripcion: 'Monta tu tienda online y empieza a vender esta semana. Configuración, productos, email marketing y escala.',
    precioUSD: 39, precioOrigUSD: 69, categoria: 'negocios', icon: '🛍️',
    badge: 'hot', badgeText: 'HOT',
    hotmartLink: 'https://hotmart.com/product/shopify-ecommerce-2026-aliemarket',
    archivo: 'shopify-ecommerce-aliemarket.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 198, rating: 4.8,
    beneficios: ['Shopify desde cero paso a paso','Páginas de producto que convierten','Email marketing + carritos abandonados','Apps esenciales para ventas','Escalar de $0 a $5000/mes'],
    duracion: '10 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 15, nombre: 'Marca Personal en Redes',
    descripcion: 'Conviértete en el referente de tu nicho en 90 días. LinkedIn, Instagram, Telegram y 5 fuentes de ingresos.',
    precioUSD: 35, precioOrigUSD: 59, categoria: 'marketing', icon: '🌟',
    badge: 'new', badgeText: 'NUEVO',
    hotmartLink: 'https://hotmart.com/product/marca-personal-redes-sociales-aliemarket',
    archivo: 'marca-personal-redes-sociales.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 167, rating: 4.8,
    beneficios: ['Define tu propuesta de valor única','LinkedIn que atrae clientes en automático','Contenido Instagram sin burnout','Canal Telegram que vende','Hoja de ruta 12 meses'],
    duracion: '8 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 16, nombre: 'Freelancing: Cobra en USD',
    descripcion: 'El sistema completo para trabajar remotamente desde Cuba y cobrar en dólares. Upwork, Fiverr, contratos y escala.',
    precioUSD: 39, precioOrigUSD: 65, categoria: 'negocios', icon: '💻',
    badge: 'hot', badgeText: '🔥 MÁS NUEVO',
    hotmartLink: 'https://hotmart.com/product/freelancing-cuba-aliemarket',
    archivo: 'freelancing-cobra-usd-cuba-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 221, rating: 4.9,
    beneficios: ['Perfil de Upwork/Fiverr que atrae clientes','Cómo cobrar en USD desde Cuba con USDT','Propuesta irresistible paso a paso','Subir tarifas de $5 a $50/hora','Primer cliente en 30 días'],
    duracion: '11 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 17, nombre: 'IA para Emprendedores 2026',
    descripcion: 'Domina ChatGPT, Midjourney, Gemini y 20 herramientas de IA para automatizar tu negocio y triplicar productividad.',
    precioUSD: 35, precioOrigUSD: 59, categoria: 'programacion', icon: '🤖',
    badge: 'hot', badgeText: 'TENDENCIA',
    hotmartLink: 'https://hotmart.com/product/ia-para-emprendedores-aliemarket',
    archivo: 'ia-para-emprendedores-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 289, rating: 4.9,
    beneficios: ['ChatGPT para negocios dominio total','Midjourney: imágenes profesionales sin diseñador','Automatizar con IA sin código','20 herramientas IA con casos reales','Ahorrar 20h/semana con IA'],
    duracion: '12 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 18, nombre: 'Facebook & Instagram Ads',
    descripcion: 'Campañas de pago que convierten en Meta. Segmentación avanzada, retargeting, creativos y ROAS optimizado.',
    precioUSD: 45, precioOrigUSD: 75, categoria: 'marketing', icon: '📣',
    badge: 'popular', badgeText: 'POPULAR',
    hotmartLink: 'https://hotmart.com/product/facebook-instagram-ads-aliemarket',
    archivo: 'facebook-instagram-ads-mastery.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 234, rating: 4.8,
    beneficios: ['Estructura de campañas que funciona','Pixel de Meta instalación y eventos','Audiencias personalizadas y lookalike','Creativos que se detienen el scroll','ROAS > 3x metodología probada'],
    duracion: '9 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 19, nombre: 'Finanzas del Emprendedor',
    descripcion: 'Gestiona el dinero de tu negocio como profesional. Contabilidad, flujo de caja, precios e impuestos para pymes cubanas.',
    precioUSD: 29, precioOrigUSD: 45, categoria: 'negocios', icon: '💰',
    badge: 'new', badgeText: 'NUEVO',
    hotmartLink: 'https://hotmart.com/product/finanzas-emprendedor-aliemarket',
    archivo: 'finanzas-del-emprendedor-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 127, rating: 4.7,
    beneficios: ['Estado de resultados en Excel simple','Calcular precios para ganar dinero de verdad','Control de flujo de caja mensual','Separar dinero personal del negocio','Declaraciones y MiPYME: guía básica'],
    duracion: '5 horas', nivel: 'Básico → Intermedio', destacado: false
  },
  {
    id: 20, nombre: 'Inglés para Negocios Digitales',
    descripcion: 'El inglés exacto que necesitas para conseguir clientes internacionales, escribir emails y usar Upwork y LinkedIn.',
    precioUSD: 29, precioOrigUSD: 45, categoria: 'negocios', icon: '🇺🇸',
    badge: null, badgeText: null,
    hotmartLink: 'https://hotmart.com/product/ingles-negocios-aliemarket',
    archivo: 'ingles-para-negocios-digitales.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 108, rating: 4.7,
    beneficios: ['Vocabulario específico del trabajo remoto','Emails profesionales con plantillas reales','Entrevistas con clientes en inglés','Perfil de Upwork en inglés que convierte','Frases para negociar tarifas en USD'],
    duracion: '7 horas', nivel: 'Pre-intermedio → Avanzado', destacado: false
  },
  {
    id: 21, nombre: 'Crea y Vende tu Curso Online',
    descripcion: 'Transforma tu conocimiento en un curso digital que vende 24/7. Estructura, producción, plataforma y marketing completo.',
    precioUSD: 49, precioOrigUSD: 79, categoria: 'negocios', icon: '🎓',
    badge: 'popular', badgeText: 'POPULAR',
    hotmartLink: 'https://hotmart.com/product/crea-vende-curso-aliemarket',
    archivo: 'crea-vende-curso-online-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 176, rating: 4.8,
    beneficios: ['Valida tu idea antes de crearla','Estructura de curso que retiene alumnos','Grabación con el celular: calidad profesional','Hotmart, Teachable o Gumroad: comparativa','Tu primer lanzamiento paso a paso'],
    duracion: '8 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 22, nombre: 'Canva Pro para Negocios',
    descripcion: 'Diseña sin ser diseñador. Brand Kit, plantillas que venden, Magic Resize, PDFs, presentaciones y contenido viral.',
    precioUSD: 29, precioOrigUSD: 45, categoria: 'diseño', icon: '🖌️',
    badge: 'new', badgeText: '✨ NUEVO',
    hotmartLink: 'https://hotmart.com/product/canva-pro-negocios-aliemarket',
    archivo: 'canva-pro-negocios-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 89, rating: 4.8,
    beneficios: ['Brand Kit: tu marca en un clic','50 plantillas para negocios incluidas','Magic Resize: 1 diseño → todos los formatos','Reels, posts, PDFs y presentaciones','Flujo que ahorra 10h semanales'],
    duracion: '6 horas', nivel: 'Básico → Pro', destacado: true
  },
  {
    id: 23, nombre: 'TikTok Ads desde Cero',
    descripcion: 'Campañas en el feed más adictivo del mundo. Creativos virales, audiencias, test de $50 y escalado a $200/día.',
    precioUSD: 55, precioOrigUSD: 89, categoria: 'marketing', icon: '🎵',
    badge: 'hot', badgeText: '🔥 TENDENCIA',
    hotmartLink: 'https://hotmart.com/product/tiktok-ads-cuba-aliemarket',
    archivo: 'tiktok-ads-cuba-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 67, rating: 4.9,
    beneficios: ['Gancho de 3 segundos que para el scroll','5 tipos de campaña: cuándo usar cada uno','Spark Ads: amplifica tus mejores orgánicos','Test de $50 para encontrar el creativo ganador','Escalar de $10/día a $200/día sin matar el ROAS'],
    duracion: '7 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 24, nombre: 'Email Marketing con Mailchimp',
    descripcion: 'Construye tu lista y automatiza las ventas. Lead magnets, secuencias, A/B test y el canal de $36 por cada $1.',
    precioUSD: 35, precioOrigUSD: 55, categoria: 'marketing', icon: '📧',
    badge: 'new', badgeText: 'NUEVO',
    hotmartLink: 'https://hotmart.com/product/email-marketing-aliemarket',
    archivo: 'email-marketing-mailchimp.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 54, rating: 4.8,
    beneficios: ['Mailchimp Free: configuración completa','Lead magnet que convierte al 25%','Secuencia de bienvenida de 5 días automática','Flow de carrito abandonado que recupera ventas','A/B testing para optimizar aperturas'],
    duracion: '5 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 25, nombre: 'Reparación de Celulares: Negocio en Casa',
    descripcion: 'El negocio de mayor demanda en Cuba 2026. Kit $40, las 5 reparaciones más solicitadas y tu primer cliente.',
    precioUSD: 45, precioOrigUSD: 75, categoria: 'negocios', icon: '🔧',
    badge: 'hot', badgeText: '🔥 DEMANDA ALTA',
    hotmartLink: 'https://hotmart.com/product/reparacion-celulares-aliemarket',
    archivo: 'reparacion-celulares-negocio.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 112, rating: 4.9,
    beneficios: ['Kit de herramientas: qué comprar y dónde','Las 5 reparaciones más solicitadas en Cuba','Diagnóstico de fallas en 6 pasos','Proyección: $1,400 USD/mes al mes 6','Cómo conseguir repuestos desde Cuba'],
    duracion: '6 horas', nivel: 'Básico → Intermedio', destacado: true
  },
  {
    id: 26, nombre: 'Energía Solar en Cuba 2026',
    descripcion: 'Instala tu sistema solar y di adiós a los apagones. Panel + batería + inversor: cálculo, instalación y mantenimiento.',
    precioUSD: 59, precioOrigUSD: 95, categoria: 'negocios', icon: '☀️',
    badge: 'hot', badgeText: '⚡ URGENTE CUBA',
    hotmartLink: 'https://hotmart.com/product/energia-solar-cuba-aliemarket',
    archivo: 'energia-solar-cuba-2026.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 203, rating: 5.0,
    beneficios: ['Calcula exactamente qué sistema necesitas','Panel + batería + inversor: guía de compra','Instalación paso a paso con imágenes','ROI real: recuperas la inversión en 3-5 años','Mantenimiento: 25 años de vida útil'],
    duracion: '5 horas', nivel: 'Básico → Avanzado', destacado: true
  },
  {
    id: 27, nombre: 'Pack 100 Prompts ChatGPT Pro',
    descripcion: 'El arsenal de IA para emprendedores. 100 prompts listos para copiar: marketing, ventas, SEO, copywriting y más.',
    precioUSD: 15, precioOrigUSD: 25, categoria: 'programacion', icon: '🤖',
    badge: 'new', badgeText: '💰 PRECIO ENTRADA',
    hotmartLink: 'https://hotmart.com/product/prompts-chatgpt-aliemarket',
    archivo: 'pack-prompts-chatgpt.pdf', esDigital: true, tipo: 'digital', stock: 999, ventas: 341, rating: 4.9,
    beneficios: ['20 prompts de marketing y redes sociales','15 prompts de copywriting y emails de venta','10 prompts de SEO y contenido','15 prompts para atención al cliente','40 prompts de productividad y IA'],
    duracion: '1 hora', nivel: 'Cualquier nivel', destacado: true
  },
  {
    nombre: '🔥 Bundle Élite — 3 Cursos Top',
    descripcion: 'Python Pro + Marketing Digital + Trading Crypto. El paquete más completo para emprendedores cubanos digitales.',
    precioUSD: 79, precioOrigUSD: 157, categoria: 'bundle', icon: '🚀',
    badge: 'bundle', badgeText: 'BUNDLE ★',
    hotmartLink: 'https://hotmart.com/product/bundle-elite-aliemarket',
    archivo: 'marketing-digital-360-aliemarket.pdf', esDigital: true, stock: 999, ventas: 541, rating: 5.0,
    beneficios: ['3 cursos completos (35h de contenido)','3 certificados oficiales','Acceso inmediato a todo','Grupo VIP Telegram','Ahorra $78 vs compra individual'],
    duracion: '35 horas', nivel: 'Básico → Pro', destacado: true
  },
  // ── NUEVOS DIGITALES (IDs 28-35) ──────────────────────────────
  {
    id: 28, archivo: 'notion-productividad-2026.pdf',
    nombre: 'Productividad con Notion 2026',
    descripcion: 'Tu sistema de trabajo que funciona solo. CRM, gestión de proyectos, finanzas y calendario editorial en una sola herramienta gratuita.',
    precioUSD: 27, precioOrigUSD: 49,
    categoria: 'negocios', icon: '🗂',
    badge: 'new', badgeText: '✨ NUEVO',
    hotmartLink: 'https://hotmart.com/product/notion-productividad-aliemarket',
    esDigital: true, stock: 999, ventas: 84, rating: 4.9,
    beneficios: ['Sistema completo en Notion gratis', 'CRM, proyectos, finanzas y contenido', 'Templates listos para clonar', 'Automatizaciones básicas paso a paso', 'Dashboard de negocio en 20 minutos'],
    duracion: '4 horas', nivel: 'Básico → Pro', destacado: false
  },
  {
    id: 29, archivo: 'telegram-ventas-automatizadas.pdf',
    nombre: 'Telegram: Ventas Automatizadas',
    descripcion: 'Convierte tu canal de Telegram en una máquina de ventas 24/7. Bot de ventas, secuencias automáticas y crecimiento a 1,000 suscriptores.',
    precioUSD: 39, precioOrigUSD: 65,
    categoria: 'marketing', icon: '✈️',
    badge: 'hot', badgeText: '🔥 CUBA TREND',
    hotmartLink: 'https://hotmart.com/product/telegram-ventas-aliemarket',
    esDigital: true, stock: 999, ventas: 156, rating: 5.0,
    beneficios: ['Bot de ventas con BotFather paso a paso', 'Secuencia de 5 mensajes que convierte el 40%', 'Scripts de cierre para indecisos', 'De 0 a 1,000 suscriptores en 60 días', 'Canal premium: cobra acceso en USDT'],
    duracion: '5 horas', nivel: 'Básico → Pro', destacado: true
  },
  {
    id: 30, archivo: 'google-ads-desde-cero-2026.pdf',
    nombre: 'Google Ads desde Cero 2026',
    descripcion: 'Aparece #1 en Google cuando te buscan. Campañas que convierten, Quality Score alto y costo por clic mínimo.',
    precioUSD: 49, precioOrigUSD: 89,
    categoria: 'marketing', icon: '🔍',
    badge: 'new', badgeText: '✨ NUEVO 2026',
    hotmartLink: 'https://hotmart.com/product/google-ads-aliemarket',
    esDigital: true, stock: 999, ventas: 61, rating: 4.8,
    beneficios: ['Quality Score que reduce CPC hasta 50%', 'Keywords de baja competencia y alto volumen', 'Estructura de campaña ganadora paso a paso', 'A/B testing de anuncios en 7 días', 'Reglas automatizadas: pausa lo que no funciona'],
    duracion: '7 horas', nivel: 'Básico → Avanzado', destacado: false
  },
  {
    id: 31, archivo: 'youtube-crea-monetiza-2026.pdf',
    nombre: 'YouTube: Crea y Monetiza 2026',
    descripcion: 'El canal que genera ingresos mientras duermes. Setup con móvil, SEO en YouTube y monetización más allá de AdSense.',
    precioUSD: 45, precioOrigUSD: 79,
    categoria: 'marketing', icon: '▶️',
    badge: 'hot', badgeText: '🔥 INGRESOS PASIVOS',
    hotmartLink: 'https://hotmart.com/product/youtube-monetiza-aliemarket',
    esDigital: true, stock: 999, ventas: 112, rating: 4.9,
    beneficios: ['Setup profesional con móvil y $15 de equipo', 'SEO en YouTube: keywords que posicionan rápido', 'Thumbnails con 3 fórmulas probadas', 'Membresías, Super Thanks y marketing de afiliados', 'De 0 a monetizable: plan semana a semana'],
    duracion: '8 horas', nivel: 'Básico → Pro', destacado: true
  },
  {
    id: 32, archivo: 'fotografia-movil-negocios.pdf',
    nombre: 'Fotografía con Móvil para Negocios',
    descripcion: 'Fotos que venden sin cámara profesional. 5 ángulos de producto, edición con apps gratis y 30 fotos en 2 horas.',
    precioUSD: 25, precioOrigUSD: 39,
    categoria: 'diseño', icon: '📸',
    badge: 'off', badgeText: '36% OFF',
    hotmartLink: 'https://hotmart.com/product/fotografia-movil-aliemarket',
    esDigital: true, stock: 999, ventas: 203, rating: 4.8,
    beneficios: ['5 ángulos obligatorios de cualquier producto', 'Edición con Snapseed y Lightroom gratis', 'Remove.bg: fondo blanco en segundos con IA', 'Pack de 30 fotos en 2 horas — checklist completo', 'Canva AI y Midjourney para mejorar fotos reales'],
    duracion: '3 horas', nivel: 'Todo nivel', destacado: false
  },
  {
    id: 33, archivo: 'agencia-redes-sociales-cuba.pdf',
    nombre: 'Agencia de Redes Sociales desde Casa',
    descripcion: 'Cobra en USD gestionando redes de otros negocios. Paquetes de $150-$500/mes, primer cliente en 7 días.',
    precioUSD: 59, precioOrigUSD: 99,
    categoria: 'negocios', icon: '📱',
    badge: 'hot', badgeText: '🔥 $500/MES',
    hotmartLink: 'https://hotmart.com/product/agencia-redes-aliemarket',
    esDigital: true, stock: 999, ventas: 94, rating: 5.0,
    beneficios: ['Paquetes de $150, $300 y $500/mes listos', 'Primer cliente en 7 días sin portafolio previo', 'Batch creation: 30 días de contenido en 1 día', 'Herramientas IA que reducen el trabajo 70%', 'Contrato de servicios y gestión multicliente'],
    duracion: '6 horas', nivel: 'Básico → Pro', destacado: true
  },
  {
    id: 34, archivo: 'afiliados-sin-inventario-2026.pdf',
    nombre: 'Afiliados: Gana sin Inventario',
    descripcion: 'Comisiones en USD sin tener productos propios. Hotmart, ClickBank y programas directos. De $100 a $1,000/mes.',
    precioUSD: 35, precioOrigUSD: 59,
    categoria: 'negocios', icon: '💸',
    badge: 'new', badgeText: '✨ INGRESOS PASIVOS',
    hotmartLink: 'https://hotmart.com/product/afiliados-aliemarket',
    esDigital: true, stock: 999, ventas: 137, rating: 4.9,
    beneficios: ['Hotmart y ClickBank: las mejores para cubanos', 'Comisiones hasta el 80% en productos digitales', 'Canal Telegram + YouTube + SEO para afiliados', 'El embudo automatizado que trabaja solo', 'De $100 a $1,000/mes: plan real paso a paso'],
    duracion: '5 horas', nivel: 'Todo nivel', destacado: false
  },
  {
    id: 35, archivo: 'linkedin-emprendedor-cubano.pdf',
    nombre: 'LinkedIn para Emprendedores Cubanos',
    descripcion: 'La red que conecta con clientes internacionales. Perfil magnético, contenido de autoridad y 3 clientes extranjeros en 90 días.',
    precioUSD: 29, precioOrigUSD: 49,
    categoria: 'marketing', icon: '💼',
    badge: 'new', badgeText: '✨ NUEVO',
    hotmartLink: 'https://hotmart.com/product/linkedin-cuba-aliemarket',
    esDigital: true, stock: 999, ventas: 48, rating: 4.9,
    beneficios: ['Perfil que aparece en búsquedas de compradores reales', 'Los 5 posts con más alcance en LinkedIn 2026', 'Secuencia de conexión de 3 mensajes sin spam', 'Cobro internacional: Wise, PayPal y USDT', 'De 0 a 3 clientes internacionales en 90 días'],
    duracion: '4 horas', nivel: 'Todo nivel', destacado: false
  }
];

// ── PRODUCTOS FÍSICOS (eliminados — tienda 100% digital) ──────
const PRODUCTOS_FISICOS = [];

// ── CONFIGURACIÓN ─────────────────────────────────────────────
let config = {
  transfermovilNum:  '53XXXXXXXX',
  transfermovilNombre: 'ALIEMARKET',
  usdtAddress:       'TXxxxxxxxxxxxxxxxxxxxxxxxx',
  usdtRed:           'TRC20',
  telegramUser:      '@AlieMarket',
  telegramLink:      'https://t.me/AlieMarket',
  emailSoporte:      'soporte@aliemarket.cu',
  whatsappNum:       '',
  nombreTienda:      'ALIEMARKET',
  siteUrl:           'https://aliemarket.github.io',
  ga4Id:             '',     // Completar: G-XXXXXXXXXX
  metaPixelId:       '',     // Completar: tu pixel ID
};

let tasas = tasas_global = { cup: 350, mlc: 4200, updatedAt: new Date().toLocaleString('es-CU') };

// ── ESTADO ────────────────────────────────────────────────────
let state = {
  productos: [...PRODUCTOS_ALIE],
  carrito: [],
  filtroActivo: 'all',
  filtroTipo: null,
  busqueda: '',
  orden: 'default',
  wishlist: new Set(),
  metodoPago: 'hotmart',
  carritoAbandonadoTimer: null
};

// ── INICIALIZACIÓN ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  cargarEstado();
  renderProductos();
  configurarEventos();
  actualizarCarritoUI();
  setTimeout(() => alieBotWelcome(), 3500);
  // GA4 pageview
  trackEvent('page_view', { page: 'store_home' });
});

function cargarEstado() {
  try {
    const saved = localStorage.getItem('alie_cart');
    if (saved) state.carrito = JSON.parse(saved);
    const savedTasas = localStorage.getItem('alie_tasas');
    if (savedTasas) tasas = JSON.parse(savedTasas);
    const savedWish = localStorage.getItem('alie_wishlist');
    if (savedWish) state.wishlist = new Set(JSON.parse(savedWish));
    const savedConfig = localStorage.getItem('alie_config');
    if (savedConfig) Object.assign(config, JSON.parse(savedConfig));
    const savedProductos = localStorage.getItem('alie_productos_custom');
    if (savedProductos) {
      const custom = JSON.parse(savedProductos);
      if (custom.length) state.productos = custom;
    }
  } catch(e) { console.warn('Estado no cargado:', e); }
}

function guardarEstado() {
  try {
    localStorage.setItem('alie_cart', JSON.stringify(state.carrito));
    localStorage.setItem('alie_wishlist', JSON.stringify([...state.wishlist]));
  } catch(e) {}
}

// ── GA4 / META PIXEL ──────────────────────────────────────────
function trackEvent(eventName, params = {}) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    if (typeof fbq === 'function') {
      const fbMap = {
        'add_to_cart': () => fbq('track', 'AddToCart', { value: params.price, currency: 'USD' }),
        'purchase':    () => fbq('track', 'Purchase',  { value: params.total, currency: 'USD' }),
        'view_item':   () => fbq('track', 'ViewContent', { content_name: params.name }),
      };
      if (fbMap[eventName]) fbMap[eventName]();
    }
  } catch(e) {}
}

// ── RENDER PRODUCTOS ──────────────────────────────────────────
function renderProductos() {
  let lista = [...state.productos];

  if (state.filtroTipo) {
    lista = lista.filter(p => state.filtroTipo === 'fisico' ? p.tipo === 'fisico' : !p.tipo || p.tipo !== 'fisico');
  }
  if (state.filtroActivo !== 'all') {
    lista = lista.filter(p => p.categoria === state.filtroActivo);
  }
  if (state.busqueda) {
    const q = state.busqueda.toLowerCase();
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }
  if (state.orden === 'price-asc')  lista.sort((a,b) => a.precioUSD - b.precioUSD);
  if (state.orden === 'price-desc') lista.sort((a,b) => b.precioUSD - a.precioUSD);
  if (state.orden === 'popular')    lista.sort((a,b) => (b.ventas||0) - (a.ventas||0));

  const grid  = document.getElementById('products-grid');
  const count = document.getElementById('products-count');
  count.textContent = `${lista.length} producto${lista.length !== 1 ? 's' : ''}`;

  if (!lista.length) {
    grid.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--grey);grid-column:1/-1">
      <div style="font-size:3rem;margin-bottom:12px">🔍</div>
      <p>No se encontraron productos.<br><span style="font-size:.85rem">Prueba con otra búsqueda.</span></p>
    </div>`;
    return;
  }
  grid.innerHTML = lista.map((p, i) => productoCardHTML(p, i)).join('');
}

function formatPrecio(usd) {
  const cur = (typeof window !== 'undefined' && window.ALIE?._activeCurrency) || 'USD';
  const t = window.ALIE?.tasas || { cup: 350, mlc: 130 };
  const mlcRate = t.mlc > 10 ? t.mlc / 100 : t.mlc;
  if (cur === 'CUP') return Math.round(usd * t.cup).toLocaleString() + ' CUP';
  if (cur === 'MLC') return (usd * mlcRate).toFixed(2) + ' MLC';
  return '$' + usd + ' USD';
}

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for(let i=0;i<full;i++) s += '<span style="color:var(--amber)">★</span>';
  if(half) s += '<span style="color:var(--amber)">½</span>';
  return s;
}

function productoCardHTML(p, idx) {
  const enCarrito = state.carrito.some(c => c.id === p.id);
  const enWishlist = state.wishlist.has(p.id);
  const descuento = p.precioOrigUSD ? Math.round((1 - p.precioUSD/p.precioOrigUSD)*100) : 0;
  const esFisico = p.tipo === 'fisico';
  const badgeDigital = esFisico ? '<span class="badge badge-fisico">📦 FÍSICO</span>' : '<span class="badge badge-digital">⚡ DIGITAL</span>';

  return `
  <article class="product-card" style="animation-delay:${idx*0.06}s" onclick="abrirModal(${p.id})">
    <div class="card-thumb" data-cat="${p.categoria}">
      <div class="card-thumb-bg"></div>
      <div class="card-thumb-pattern"></div>
      <div class="card-thumb-icon">${p.icon}</div>
      <div class="card-badge-wrap">
        ${p.badge ? `<span class="badge badge-${p.badge}">${p.badgeText}</span>` : ''}
        ${badgeDigital}
      </div>
      <button class="card-wishlist ${enWishlist ? 'active' : ''}"
              onclick="event.stopPropagation();toggleWishlist(${p.id})" title="Guardar">
        ${enWishlist ? '♥' : '♡'}
      </button>
    </div>
    <div class="card-body">
      <div class="card-cat">${labelCategoria(p.categoria)}</div>
      <h3 class="card-title">${p.nombre}</h3>
      <p class="card-desc">${p.descripcion.substring(0,90)}...</p>
      <div class="card-benefits">
        ${p.beneficios.slice(0,3).map(b => `<span class="card-benefit">${b}</span>`).join('')}
      </div>
      ${p.rating ? `<div style="font-size:.75rem;margin:4px 0 2px;color:var(--amber)">${starsHTML(p.rating)} <span style="color:var(--grey)">${p.rating} · ${(p.ventas||0).toLocaleString()} ${esFisico?'vendidos':'estudiantes'}</span></div>` : ''}
      <div class="card-footer">
        <div class="card-price">
          ${p.precioOrigUSD ? `<span class="old-price">$${p.precioOrigUSD}</span>` : ''}
          <span class="amount" data-precio-usd="${p.precioUSD}">${formatPrecio(p.precioUSD)}</span>
          ${descuento ? `<div style="font-size:.72rem;color:var(--green);font-family:var(--font-mono)">−${descuento}% OFF</div>` : ''}
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          ${enCarrito
            ? `<button class="btn btn-ghost btn-sm" onclick="removeFromCart(${p.id})">✓ En carrito</button>`
            : `<button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">+ Añadir</button>`
          }
        </div>
      </div>
    </div>
  </article>`;
}

function labelCategoria(cat) {
  const map = {
    programacion:'💻 Programación', marketing:'📢 Marketing', trading:'₿ Trading',
    'diseño':'🎨 Diseño', negocios:'💼 Negocios', bundle:'📦 Bundle',
    tecnologia:'📱 Tecnología', accesorios:'🎧 Accesorios', ropa:'👕 Ropa & Moda',
    electrodomesticos:'⚡ Electrodomésticos', hogar:'🏠 Hogar', alimentos:'🛒 Alimentos',
    'ofertas-fisicas':'🔥 Ofertas', solar:'☀️ Energía Solar'
  };
  return map[cat] || cat;
}

// ── CARRITO ───────────────────────────────────────────────────
function addToCart(id, qty = 1) {
  const prod = state.productos.find(p => p.id === id);
  if (!prod) return;
  if (prod.tipo === 'fisico' && prod.stock !== undefined && prod.stock <= 0) {
    showToast('❌ Sin stock disponible', 'error'); return;
  }
  const enCarrito = state.carrito.find(c => c.id === id);
  if (enCarrito) {
    const maxQty = prod.tipo === 'fisico' ? (prod.stock || 99) : 1;
    if (enCarrito.cantidad >= maxQty) {
      showToast(`⚠ Máximo ${maxQty} unidad(es) disponibles`, 'warning'); return;
    }
    enCarrito.cantidad = (enCarrito.cantidad || 1) + qty;
  } else {
    state.carrito.push({...prod, cantidad: qty});
  }
  guardarEstado();
  actualizarCarritoUI();
  renderProductos();
  showToast(`✅ ${prod.nombre} — añadido al carrito`, 'success');
  trackEvent('add_to_cart', { item_name: prod.nombre, price: prod.precioUSD });
  triggerUpsell(prod);
  resetAbandonTimer();
}

function changeCartQty(id, delta) {
  const item = state.carrito.find(p => p.id === id);
  if (!item) return;
  const prod = state.productos.find(p => p.id === id);
  const maxQty = prod?.tipo === 'fisico' ? (prod.stock || 99) : 1;
  item.cantidad = Math.max(1, Math.min(maxQty, (item.cantidad || 1) + delta));
  guardarEstado();
  actualizarCarritoUI();
  renderCartItems();
}

function removeFromCart(id) {
  state.carrito = state.carrito.filter(c => c.id !== id);
  guardarEstado();
  actualizarCarritoUI();
  renderProductos();
  renderCartItems();
}

function clearCart() {
  if (!state.carrito.length) return;
  state.carrito = [];
  guardarEstado();
  actualizarCarritoUI();
  renderCartItems();
  showToast('🗑 Carrito vaciado', 'warning');
}

function actualizarCarritoUI() {
  const hayFisicos = state.carrito.some(p => p.tipo === 'fisico');
  const btnEfectivo = document.getElementById('pay-method-efectivo');
  if (btnEfectivo) btnEfectivo.style.display = hayFisicos ? '' : 'none';

  const total = state.carrito.reduce((s, p) => s + p.precioUSD * (p.cantidad || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = state.carrito.length;
    badge.classList.toggle('zero', state.carrito.length === 0);
  }
  const sbBadge = document.getElementById('sb-cart-count');
  if (sbBadge) {
    sbBadge.textContent = state.carrito.length;
    sbBadge.classList.toggle('zero', state.carrito.length === 0);
  }
  const sub = total;
  const desc = 0;
  const setT = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setT('cart-subtotal', `$${sub} USD`);
  setT('cart-discount', `-$${desc}`);
  setT('cart-total',    `$${sub - desc} USD`);
  setT('cup-equiv',     ((sub-desc) * tasas.cup).toLocaleString());
  setT('mlc-equiv',     (((sub-desc) * tasas.mlc)/100).toFixed(2));
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;
  if (!state.carrito.length) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Tu carrito está vacío.<br>¡Explora nuestros cursos!</p></div>`;
    return;
  }
  container.innerHTML = state.carrito.map(p => {
    const qty = p.cantidad || 1;
    const subtotal = (p.precioUSD * qty).toFixed(2);
    const maxQty = p.tipo === 'fisico' ? (p.stock || 99) : 1;
    return `
    <div class="cart-item">
      <div class="cart-item-icon">${p.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.nombre}</div>
        <div class="cart-item-cat">${labelCategoria(p.categoria)}</div>
        ${p.tipo === 'fisico' ? `
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeCartQty(${p.id},-1)" ${qty<=1?'disabled':''}>−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" onclick="changeCartQty(${p.id},1)" ${qty>=maxQty?'disabled':''}>+</button>
        </div>` : `<div class="cart-item-tag">⚡ Acceso inmediato</div>`}
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">$${subtotal} USD</div>
        ${qty > 1 ? `<div class="cart-item-unit">$${p.precioUSD}/u</div>` : ''}
        <button class="cart-item-del" onclick="removeFromCart(${p.id})" title="Eliminar">✕</button>
      </div>
    </div>`;
  }).join('');
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

// ── CHECKOUT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkout-btn');
  if (btn) btn.addEventListener('click', handleCheckout);
});

function handleCheckout() {
  if (!state.carrito.length) { showToast('Tu carrito está vacío', 'warning'); return; }
  const method = state.metodoPago;
  const total  = state.carrito.reduce((s,p) => s + p.precioUSD * (p.cantidad||1), 0);
  const digitales = state.carrito;
  const fisicos   = [];
  procesarPago(method, total, fisicos, digitales, null);
}

function pedirDireccion(total, method, fisicos, digitales, callback) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <div class="pay-modal-wrap">
      <button class="modal-close" onclick="closeModal()" style="position:absolute;top:16px;right:16px">✕</button>
      <div class="pay-modal-icon">📦</div>
      <h3 class="pay-modal-title">Datos de Entrega</h3>
      <p style="text-align:center;font-size:.85rem;color:var(--grey);margin-bottom:16px">
        Necesitamos tu dirección para coordinar la entrega de tu pedido
      </p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Nombre completo *</label>
            <input id="del-nombre" type="text" placeholder="Juan García López"
              style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
          </div>
          <div>
            <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Teléfono *</label>
            <input id="del-tel" type="tel" placeholder="53XXXXXXXX"
              style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Provincia *</label>
            <select id="del-prov" style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
              <option value="">— Selecciona —</option>
              ${['La Habana','Artemisa','Mayabeque','Matanzas','Cienfuegos','Villa Clara','Sancti Spíritus','Ciego de Ávila','Camagüey','Las Tunas','Holguín','Granma','Santiago de Cuba','Guantánamo','Isla de la Juventud'].map(p=>`<option>${p}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Municipio *</label>
            <input id="del-mun" type="text" placeholder="Tu municipio"
              style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
          </div>
        </div>
        <div>
          <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Dirección completa *</label>
          <input id="del-dir" type="text" placeholder="Calle, número, entre calles, reparto"
            style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:.75rem;color:var(--grey);display:block;margin-bottom:4px">Nota adicional (opcional)</label>
          <input id="del-nota" type="text" placeholder="Ej: Apartamento 3B, portero, referencia..."
            style="width:100%;background:var(--black-card);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 12px;color:var(--white);font-size:.88rem;box-sizing:border-box">
        </div>
      </div>
      <button class="btn btn-primary btn-full" style="margin-top:18px"
              onclick="confirmarDireccion(${total},'${method}')">
        ✅ Confirmar y Ver Instrucciones de Pago
      </button>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function confirmarDireccion(total, method) {
  const nombre = document.getElementById('del-nombre')?.value.trim();
  const tel    = document.getElementById('del-tel')?.value.trim();
  const prov   = document.getElementById('del-prov')?.value;
  const mun    = document.getElementById('del-mun')?.value.trim();
  const dir    = document.getElementById('del-dir')?.value.trim();
  const nota   = document.getElementById('del-nota')?.value.trim();

  if (!nombre || !tel || !prov || !mun || !dir) {
    showToast('⚠ Completa todos los campos obligatorios', 'warning'); return;
  }

  const direccionCompleta = `${nombre} · ${tel} · ${prov}, ${mun} · ${dir}${nota ? ' · ' + nota : ''}`;
  const fisicos  = state.carrito.filter(p => p.tipo === 'fisico');
  const digitales = state.carrito.filter(p => !p.tipo || p.tipo !== 'fisico');

  procesarPago(method, total, fisicos, digitales, direccionCompleta);
}

function procesarPago(method, total, fisicos, digitales, direccion) {
  if (method === 'efectivo') {
    const hayFisicos = fisicos.length > 0;
    if (!hayFisicos) { showToast('⚠ Efectivo solo aplica a productos físicos', 'warning'); return; }
    const ordenId = registrarPedido(total, 'efectivo', direccion);
    showPaymentModal('efectivo', { total, ordenId,
      telegram: config.telegramUser, whatsapp: config.whatsappNum || '5352123456',
      direccion });
    setTimeout(() => {
      state.carrito = state.carrito.filter(p => p.tipo !== 'fisico');
      guardarEstado(); actualizarCarritoUI();
    }, 1200);
    return;
  }

  if (method === 'hotmart') {
    if (fisicos.length > 0 && digitales.length === 0) {
      showToast('⚠ Los físicos no se procesan por Hotmart. Usa Transfermóvil, MLC o USDT.', 'warning'); return;
    }
    if (fisicos.length > 0) {
      showToast('⚠ Los físicos no se pagan con Hotmart. Separa tu pedido o usa otro método.', 'warning'); return;
    }
    const links = [...new Set(digitales.map(p => p.hotmartLink).filter(Boolean))];
    const toOpen = links.filter(l => l.includes('hotmart.com'));
    toOpen.forEach((link, i) => setTimeout(() => window.open(link, '_blank'), i * 400));
    showToast(`🔥 Abriendo ${toOpen.length || 1} ventana(s) de Hotmart...`, 'success');
  } else if (method === 'transfermovil') {
    const cup = (total * tasas.cup).toLocaleString();
    const ordenId = registrarPedido(total, 'transfermovil', direccion);
    showPaymentModal('transfermovil', { total, cup, ordenId,
      num: config.transfermovilNum, nombre: config.transfermovilNombre,
      telegram: config.telegramUser, email: config.emailSoporte,
      tieneFisicos: fisicos.length > 0, direccion });
  } else if (method === 'mlc') {
    const mlc = (total * tasas.mlc / 100).toFixed(2);
    const ordenId = registrarPedido(total, 'mlc', direccion);
    showPaymentModal('mlc', { total, mlc, ordenId,
      telegram: config.telegramUser, email: config.emailSoporte,
      tieneFisicos: fisicos.length > 0, direccion });
  } else if (method === 'usdt') {
    const ordenId = registrarPedido(total, 'usdt', direccion);
    showPaymentModal('usdt', { total, ordenId,
      address: config.usdtAddress, red: config.usdtRed,
      telegram: config.telegramUser, email: config.emailSoporte,
      tieneFisicos: fisicos.length > 0, direccion });
  }

  // Post-compra
  setTimeout(() => {
    descargarArchivo([...state.carrito]);
    if (window.alieBot) alieBot.onPurchase([...state.carrito]);
    trackEvent('purchase', { total, method });
    state.carrito = []; guardarEstado(); actualizarCarritoUI(); closeCart();
  }, 1500);
}

function descargarArchivo(items) {
  const digitales = items.filter(p => p.tipo !== 'fisico' && p.archivo);
  digitales.forEach((p, i) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = p.archivo; a.download = p.archivo; a.target = '_blank';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }, i * 800);
  });
  if (digitales.length > 0) showToast(`📥 Descargando ${digitales.length} archivo(s) PDF...`, 'success');
}

function generarOrdenId() {
  const n  = Math.floor(1000 + Math.random() * 9000);
  const yr = new Date().getFullYear().toString().slice(-2);
  return `ALIE-${yr}-${n}`;
}

function registrarPedido(total, method, direccion = '') {
  const orders = JSON.parse(localStorage.getItem('alie_orders') || '[]');
  const ordenId = generarOrdenId();
  const itemsDetalle = state.carrito.map(p => ({
    id: p.id, nombre: p.nombre, precio: p.precioUSD,
    cantidad: p.cantidad || 1, tipo: p.tipo || 'digital'
  }));

  state.carrito.forEach(item => {
    if (item.tipo !== 'fisico') return;
    const prod = state.productos.find(p => p.id === item.id);
    if (prod && prod.stock !== undefined) prod.stock = Math.max(0, prod.stock - (item.cantidad || 1));
    const gp = window.ALIE?.PRODUCTOS_FISICOS?.find(p => p.id === item.id);
    if (gp && gp.stock !== undefined) gp.stock = Math.max(0, gp.stock - (item.cantidad || 1));
  });

  orders.unshift({
    ordenId, id: Date.now(),
    fecha: new Date().toLocaleString('es-CU'),
    items: itemsDetalle, itemsNames: itemsDetalle.map(p => p.nombre),
    total, metodo: method, estado: 'pendiente',
    tieneFisicos: itemsDetalle.some(i => i.tipo === 'fisico'),
    direccion
  });
  localStorage.setItem('alie_orders', JSON.stringify(orders.slice(0, 200)));
  return ordenId;
}

// ── MODAL DE PAGO ─────────────────────────────────────────────
function showPaymentModal(method, data) {
  const dirRow = data.tieneFisicos && data.direccion ? `
    <div class="pay-modal-row" style="flex-direction:column;gap:4px">
      <span class="pay-modal-label">📦 Dirección de entrega</span>
      <span style="font-size:.82rem;color:var(--turquesa);background:rgba(0,212,255,0.06);padding:8px 10px;border-radius:6px;border:1px solid rgba(0,212,255,0.15)">${data.direccion}</span>
    </div>` : '';

  const body = {
    transfermovil: `
      <div class="pay-modal-icon">📱</div>
      <h3 class="pay-modal-title">Pago por Transfermóvil</h3>
      <div style="text-align:center;margin-bottom:14px">
        <span style="font-family:var(--font-mono);font-size:.78rem;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);padding:4px 12px;border-radius:6px;color:var(--turquesa)">Pedido: ${data.ordenId}</span>
      </div>
      <div class="pay-modal-row">
        <span class="pay-modal-label">Monto en CUP</span>
        <span class="pay-modal-value mono text-cyan">${data.cup} CUP</span>
      </div>
      <div class="pay-modal-row">
        <span class="pay-modal-label">Equivale a</span>
        <span class="pay-modal-value mono">$${data.total} USD</span>
      </div>
      <div class="pay-modal-row highlight-row">
        <span class="pay-modal-label">Número destino</span>
        <span class="pay-modal-value mono" style="color:var(--turquesa);font-size:1.1rem">${data.num}</span>
      </div>
      <div class="pay-modal-row">
        <span class="pay-modal-label">Titular</span>
        <span class="pay-modal-value">${data.nombre}</span>
      </div>
      ${dirRow}
      <div class="pay-modal-steps">
        <div class="pay-step">1️⃣ Abre tu app Transfermóvil</div>
        <div class="pay-step">2️⃣ Envía exactamente <strong>${data.cup} CUP</strong> al <strong>${data.num}</strong></div>
        <div class="pay-step">3️⃣ Toma captura del comprobante</div>
        <div class="pay-step">4️⃣ Envíala a <strong>${data.telegram}</strong> indicando el pedido <strong>${data.ordenId}</strong></div>
      </div>`,
    mlc: `
      <div class="pay-modal-icon">💳</div>
      <h3 class="pay-modal-title">Pago en MLC</h3>
      <div style="text-align:center;margin-bottom:14px">
        <span style="font-family:var(--font-mono);font-size:.78rem;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);padding:4px 12px;border-radius:6px;color:var(--turquesa)">Pedido: ${data.ordenId}</span>
      </div>
      <div class="pay-modal-row highlight-row">
        <span class="pay-modal-label">Monto MLC</span>
        <span class="pay-modal-value mono" style="color:var(--turquesa);font-size:1.1rem">${data.mlc} MLC</span>
      </div>
      <div class="pay-modal-row">
        <span class="pay-modal-label">Equivale a</span>
        <span class="pay-modal-value mono">$${data.total} USD</span>
      </div>
      ${dirRow}
      <div class="pay-modal-steps">
        <div class="pay-step">1️⃣ Realiza el pago de <strong>${data.mlc} MLC</strong></div>
        <div class="pay-step">2️⃣ Toma captura del comprobante bancario</div>
        <div class="pay-step">3️⃣ Envía la captura a <strong>${data.telegram}</strong> con el pedido <strong>${data.ordenId}</strong></div>
        <div class="pay-step">4️⃣ Recibirás tu acceso en menos de 2 horas</div>
      </div>`,
    usdt: `
      <div class="pay-modal-icon">₿</div>
      <h3 class="pay-modal-title">Pago USDT P2P Binance</h3>
      <div style="text-align:center;margin-bottom:14px">
        <span style="font-family:var(--font-mono);font-size:.78rem;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);padding:4px 12px;border-radius:6px;color:var(--turquesa)">Pedido: ${data.ordenId}</span>
      </div>
      <div class="pay-modal-row highlight-row">
        <span class="pay-modal-label">Monto USDT</span>
        <span class="pay-modal-value mono" style="color:var(--turquesa);font-size:1.1rem">${data.total} USDT</span>
      </div>
      <div class="pay-modal-row">
        <span class="pay-modal-label">Red</span>
        <span class="pay-modal-value mono">${data.red}</span>
      </div>
      <div class="pay-modal-row" style="flex-direction:column;gap:6px">
        <span class="pay-modal-label">Dirección</span>
        <span class="pay-modal-value mono" style="color:var(--turquesa);font-size:.78rem;word-break:break-all;background:rgba(0,212,255,0.06);padding:10px;border-radius:8px;border:1px solid rgba(0,212,255,0.15)">${data.address}</span>
      </div>
      ${dirRow}
      <div class="pay-modal-steps">
        <div class="pay-step">1️⃣ Abre Binance P2P y envía <strong>${data.total} USDT</strong></div>
        <div class="pay-step">2️⃣ Usa la dirección de arriba (Red: ${data.red})</div>
        <div class="pay-step">3️⃣ Envía comprobante a <strong>${data.telegram}</strong> con el pedido <strong>${data.ordenId}</strong></div>
        <div class="pay-step">4️⃣ Acceso entregado en menos de 1 hora</div>
      </div>`,
    efectivo: `
      <div class="pay-modal-icon">💵</div>
      <h3 class="pay-modal-title">Pago en Efectivo — Contra Entrega</h3>
      <div style="text-align:center;margin-bottom:14px">
        <span style="font-family:var(--font-mono);font-size:.78rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);padding:4px 12px;border-radius:6px;color:var(--verde-success)">Pedido: ${data.ordenId}</span>
      </div>
      <div class="pay-modal-row highlight-row">
        <span class="pay-modal-label">Total a pagar</span>
        <span class="pay-modal-value mono" style="color:var(--verde-success);font-size:1.1rem">$${data.total} USD</span>
      </div>
      ${dirRow}
      <div class="pay-modal-steps">
        <div class="pay-step">1️⃣ Confirma tu pedido por <strong>${data.telegram}</strong> en Telegram</div>
        <div class="pay-step">2️⃣ Coordinaremos contigo el día y hora de entrega</div>
        <div class="pay-step">3️⃣ Paga <strong>$${data.total} USD</strong> al recibir el pedido</div>
      </div>`
  }[method];

  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <div class="pay-modal-wrap">
      <button class="modal-close" onclick="closeModal()" style="position:absolute;top:16px;right:16px">✕</button>
      ${body}
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);font-size:.8rem;color:var(--grey);text-align:center">
        ¿Dudas? <strong style="color:var(--turquesa)">${data.telegram}</strong> — respondemos en &lt;2h
      </div>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── MÉTODOS DE PAGO (event delegation) ───────────────────────
document.addEventListener('click', e => {
  const pm = e.target.closest('.pay-method');
  if (pm) {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
    pm.classList.add('selected');
    state.metodoPago = pm.dataset.method;
  }
});

// ── MODAL PRODUCTO con RESEÑAS ────────────────────────────────
function abrirHotmart(id) {
  const prod = state.productos.find(p => p.id === id);
  if (!prod) return;
  const link = prod.hotmartLink;
  if (!link || (link.includes('/product/') && !link.match(/[?&]/))) {
    showToast('⚠ Link Hotmart pendiente de configurar. Contáctanos por Telegram.', 'warning');
    return;
  }
  window.open(link, '_blank');
  registrarPedido(prod.precioUSD, 'hotmart');
  showToast('🔥 Redirigiendo a Hotmart...', 'success');
  trackEvent('view_item', { name: prod.nombre });
}

function abrirModal(id) {
  const p = state.productos.find(x => x.id === id);
  if (!p) return;
  const descuento  = p.precioOrigUSD ? Math.round((1 - p.precioUSD/p.precioOrigUSD)*100) : 0;
  const enCarrito  = state.carrito.some(c => c.id === id);
  const savedUSD   = p.precioOrigUSD ? p.precioOrigUSD - p.precioUSD : 0;
  const resenas    = (() => {
    const base = RESENAS_BASE[id] || [];
    const guardadas = JSON.parse(localStorage.getItem('alie_resenas') || '{}');
    return [...base, ...(guardadas[id] || [])];
  })();

  const resenasHTML = resenas.length ? `
    <div style="margin-top:18px">
      <div style="font-size:.82rem;color:var(--grey);margin-bottom:10px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.06em">
        💬 Reseñas (${resenas.length})
      </div>
      ${resenas.map(r => `
        <div style="padding:12px;background:var(--black-card);border-radius:10px;border:1px solid rgba(255,255,255,0.07);margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <span style="font-size:.85rem;font-weight:700;color:var(--white)">${r.autor}</span>
            <span style="font-size:.75rem;color:var(--grey)">${r.pais} · ${r.fecha}</span>
          </div>
          <div style="color:var(--amber);font-size:.85rem;margin-bottom:5px">${'★'.repeat(r.rating)}</div>
          <p style="font-size:.85rem;color:var(--grey);margin:0;line-height:1.5">${r.texto}</p>
        </div>
      `).join('')}
    </div>` : '';

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-header">
      <div class="modal-icon">${p.icon}</div>
      <div>
        <div class="modal-cat">${labelCategoria(p.categoria)} · ${p.duracion} · ${p.nivel}</div>
        <h2 class="modal-title">${p.nombre}</h2>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
          <span style="color:var(--amber)">${starsHTML(p.rating || 4.8)}</span>
          <span style="font-size:.82rem;color:var(--grey)">${p.rating || 4.8}/5 · ${(p.ventas||0).toLocaleString()} ${p.tipo==='fisico'?'vendidos':'estudiantes'}</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div>
        <p class="modal-desc">${p.descripcion}</p>
        <div class="modal-benefits-title">✅ Lo que incluye:</div>
        <div class="modal-benefits">
          ${p.beneficios.map(b => `<div class="modal-benefit"><span class="check">✓</span>${b}</div>`).join('')}
        </div>
        <div style="margin-top:14px;padding:12px;background:var(--black-card);border-radius:var(--radius);border:1px solid rgba(255,255,255,0.07)">
          <div style="font-size:.78rem;color:var(--grey);margin-bottom:5px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.06em">Equivalencia</div>
          <div style="font-size:.88rem;color:var(--grey)">
            $${p.precioUSD} USD =
            <span style="color:var(--cyan)">${(p.precioUSD * tasas.cup).toLocaleString()} CUP</span>
            · <span style="color:var(--amber)">${((p.precioUSD * tasas.mlc)/100).toFixed(2)} MLC</span>
          </div>
        </div>
        ${resenasHTML}
      </div>
      <div class="modal-buy">
        <div class="modal-price">
          ${p.precioOrigUSD ? `<div class="old">Precio normal: $${p.precioOrigUSD} USD</div>` : ''}
          <div class="amount">$${p.precioUSD} USD</div>
          ${descuento ? `<span class="save">AHORRAS $${savedUSD} — ${descuento}% OFF</span>` : ''}
        </div>
        <div class="modal-buy-actions">
          ${p.tipo === 'fisico' ? `
            ${p.stock <= 0 ? '<div class="modal-stock-zero">❌ Sin stock actualmente</div>' : `
              <div class="modal-stock-info">
                <span class="${p.stock <= 5 ? 'stock-low' : 'stock-ok'}">
                  ${p.stock <= 5 ? '⚠ Solo ' + p.stock + ' unidades' : '✅ En stock (' + p.stock + ' unid.)'}
                </span>
              </div>
              ${enCarrito
                ? `<button class="btn btn-ghost btn-full" onclick="removeFromCart(${p.id});closeModal()">✕ Quitar del carrito</button>`
                : `<button class="btn btn-primary btn-full" onclick="addToCart(${p.id});closeModal()">🛒 Añadir al carrito</button>`
              }
            `}
          ` : `
            <button class="btn btn-primary btn-full" onclick="abrirHotmart(${p.id})">
              🔥 Comprar en Hotmart
            </button>
            ${enCarrito
              ? `<button class="btn btn-ghost btn-full" onclick="removeFromCart(${p.id});closeModal()">✕ Quitar del carrito</button>`
              : `<button class="btn btn-secondary btn-full" onclick="addToCart(${p.id});closeModal()">🛒 Añadir al carrito</button>`
            }
          `}
        </div>
        <div class="modal-meta">
          ${p.tipo === 'fisico' ? `
            <span>🚚 Entrega ${p.entrega}</span>
            <span>📦 Producto físico original</span>
            <span>📱 Transfermóvil / MLC / USDT</span>
            <span>🔒 Pago seguro + garantía</span>
          ` : `
            <span>⚡ Acceso inmediato tras pago</span>
            <span>🔥 Entrega vía Hotmart</span>
            <span>📱 Transfermóvil / MLC / USDT</span>
            <span>🔒 Pago 100% seguro</span>
          `}
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  trackEvent('view_item', { name: p.nombre, price: p.precioUSD });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const ol = document.getElementById('modal-overlay');
  if (ol && e.target === ol) closeModal();
});

// ── WISHLIST ──────────────────────────────────────────────────
function toggleWishlist(id) {
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    showToast('Eliminado de guardados', 'warning');
  } else {
    state.wishlist.add(id);
    showToast('❤ Guardado en tu lista', 'success');
  }
  guardarEstado();
  renderProductos();
  // Actualizar badge
  const sbWish = document.getElementById('sb-wish-count');
  if (sbWish) sbWish.textContent = state.wishlist.size;
}

// ── UPSELL ────────────────────────────────────────────────────
function triggerUpsell(prodAgregado) {
  const upsells = {
    programacion: { title: '🎁 ¿Agregas IA para Emprendedores?', sub: 'Python + IA = emprendedor imparable en 2026.', id: 17 },
    marketing:    { title: '📈 ¿Sumamos SEO 2026?', sub: 'Marketing + SEO = dominas Google y redes.', id: 9 },
    trading:      { title: '🚀 ¿Te llevas el Bundle Élite?', sub: 'Trading + Python + Marketing por $79 (ahorra $78)', id: null },
    diseño:       { title: '🎬 ¿Agregas Canva Pro?', sub: 'Diseño Figma + Canva = portafolio imparable.', id: 22 },
    negocios:     { title: '📢 ¿Agregas Marketing Digital 360?', sub: 'Negocios + Marketing = ventas explosivas.', id: 2 },
    solar:        { title: '☀️ ¿Te llevas el libro de Energía Solar?', sub: 'Instala y optimiza tu sistema con la guía completa.', id: 26 },
  };
  const upsell = upsells[prodAgregado.categoria];
  if (!upsell || !upsell.id) return;
  if (state.carrito.some(c => c.id === upsell.id)) return;

  const banner = document.getElementById('upsell-banner');
  if (!banner) return;
  document.getElementById('upsell-title').textContent = upsell.title;
  document.getElementById('upsell-sub').textContent = upsell.sub;
  document.getElementById('upsell-cta').onclick = () => {
    addToCart(upsell.id); banner.classList.add('hidden');
  };
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 8000);
}

// ── CARRITO ABANDONADO ────────────────────────────────────────
function resetAbandonTimer() {
  clearTimeout(state.carritoAbandonadoTimer);
  if (!state.carrito.length) return;
  state.carritoAbandonadoTimer = setTimeout(() => {
    if (state.carrito.length && !document.getElementById('cart-sidebar')?.classList.contains('open')) {
      showToast('⏰ ¿Olvidaste tu carrito? ¡Tienes productos esperando!', 'warning');
      if (window.alieBot) alieBot.sendAbandonMessage();
    }
  }, 45000);
}

// ── EMAIL CAPTURE ─────────────────────────────────────────────
function suscribirNewsletter(email) {
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('⚠ Ingresa un email válido', 'warning'); return false;
  }
  const subs = JSON.parse(localStorage.getItem('alie_subscribers') || '[]');
  if (subs.includes(email)) {
    showToast('✅ Ya estás suscrito — ¡gracias!', 'success'); return true;
  }
  subs.push(email);
  localStorage.setItem('alie_subscribers', JSON.stringify(subs));
  showToast('🎉 ¡Suscrito! Recibirás novedades y descuentos exclusivos.', 'success');
  trackEvent('newsletter_subscribe', { email });
  // Ocultar el formulario
  const form = document.getElementById('newsletter-form');
  if (form) form.innerHTML = `<p style="color:var(--verde-success);text-align:center;font-weight:700">✅ ¡Ya eres parte de la comunidad ALIEMARKET!</p>`;
  return true;
}

// ── FILTROS & BÚSQUEDA ────────────────────────────────────────
function configurarEventos() {
  const searchInput = document.getElementById('search-input');
  let searchTimer;
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.busqueda = this.value.trim();
        renderProductos();
        if (state.busqueda.length > 2 && window.alieBot) alieBot.onSearch(state.busqueda);
      }, 300);
    });
  }
  const cartBtn = document.getElementById('cart-toggle-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity .3s, transform .3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── ADMIN HELPERS ─────────────────────────────────────────────
function openAdminLogin() {
  document.getElementById('admin-login').classList.add('open');
  setTimeout(() => document.getElementById('admin-pin-input')?.focus(), 100);
}
function closeAdminLogin() {
  document.getElementById('admin-login').classList.remove('open');
  if (document.getElementById('admin-pin-input')) document.getElementById('admin-pin-input').value = '';
  if (document.getElementById('login-error')) document.getElementById('login-error').textContent = '';
}

// ── EXPORTS ───────────────────────────────────────────────────
window.ALIE = {
  state, tasas, config, PRODUCTOS_ALIE, PRODUCTOS_FISICOS, RESENAS_BASE,
  get _activeCurrency() { return typeof activeCurrency !== 'undefined' ? activeCurrency : 'USD'; },
  addToCart, removeFromCart, clearCart, openCart, showToast,
  abrirModal, closeModal, renderProductos, actualizarCarritoUI,
  labelCategoria, productoCardHTML, suscribirNewsletter, trackEvent
};
