import "./styles.css";
import { products } from "./data/products.js";
import { concepts, preparedComparisons } from "./data/concepts.js";
import { siteMeta } from "./data/siteMeta.js";

const app = document.querySelector("#app");
const state = {
  search: "",
  category: "Todas",
  type: "Todos",
  brand: "Todas",
  range: "Todas",
  compareType: "Escritorio gama alta",
  compareA: "",
  compareB: "",
  slide: 0,
};

const unique = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
const byId = (id) => products.find((product) => product.id === id);
const route = () => location.hash.replace(/^#/, "") || "/";
const money = (price) => {
  if (!price || price.status === "pendiente") return "Precio por confirmar";
  if (String(price.amount).toLowerCase() === "pendiente") return "Precio por confirmar";
  if (String(price.amount).toLowerCase() === "varía") return "Precio variable";
  return `${price.currency} ${price.amount}`;
};

const visualProfiles = {
  "Computadoras de escritorio": { code: "PC", tone: "tone-red", label: "computadora de escritorio" },
  Laptops: { code: "NB", tone: "tone-cyan", label: "laptop" },
  Celulares: { code: "5G", tone: "tone-violet", label: "celular" },
  Tablets: { code: "TAB", tone: "tone-lime", label: "tablet" },
  Almacenamiento: { code: "SSD", tone: "tone-cyan", label: "almacenamiento" },
  "Componentes internos": { code: "CPU", tone: "tone-red", label: "componente interno" },
  Periféricos: { code: "USB", tone: "tone-violet", label: "periférico" },
  "Otros equipos": { code: "EQ", tone: "tone-lime", label: "equipo tecnológico" },
  Consolas: { code: "PAD", tone: "tone-red", label: "consola" },
  "Placas de desarrollo": { code: "I/O", tone: "tone-cyan", label: "placa de desarrollo" },
};

function productVisual(product, variant = "card") {
  const profile = visualProfiles[product.category] || {
    code: "TEC",
    tone: "tone-violet",
    label: "producto tecnológico",
  };
  return `
    <div class="product-visual ${variant} ${profile.tone}" role="img" aria-label="Visual de ${profile.label} para ${escapeHtml(product.brand)} ${escapeHtml(product.model)}. No es una fotografía del producto.">
      <span class="visual-kind">${escapeHtml(product.category)}</span>
      <span class="visual-code">${escapeHtml(profile.code)}</span>
      <strong>${escapeHtml(product.type)}</strong>
      <span>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</span>
      <em>No es fotografía del producto</em>
    </div>
  `;
}

function productMedia(product, variant = "card") {
  if (product.image.status === "verificada") {
    return `<img src="${product.image.src}" alt="${escapeHtml(product.image.alt)}" loading="lazy" />`;
  }
  return productVisual(product, variant);
}

function imageCredit(product) {
  if (product.image.status === "verificada") return product.image.credit;
  return "Visual generado por categoría para identificar el tipo de producto. No es una fotografía del modelo.";
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const link = (href, label, className = "") => `<a class="${className}" href="${href}">${label}</a>`;

function layout(content) {
  return `
    <header class="topbar">
      <a class="brand" href="#/">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>${siteMeta.title}</span>
      </a>
      <nav class="nav" aria-label="Navegación principal">
        ${link("#/catalogo", "Catálogo")}
        ${link("#/comparador", "Comparador")}
        ${link("#/comparaciones", "Análisis")}
        ${link("#/guia", "Guía")}
        ${link("#/fuentes", "Fuentes")}
        ${link("#/presentacion", "Presentación", "presentation-link")}
      </nav>
    </header>
    <main>${content}</main>
  `;
}

function renderHome() {
  const categoryCounts = unique(products.map((p) => p.category))
    .map((category) => {
      const count = products.filter((p) => p.category === category).length;
      return `
        <a class="category-tile" href="#/catalogo?categoria=${encodeURIComponent(category)}">
          <span>${category}</span>
          <strong>${count}</strong>
        </a>
      `;
    })
    .join("");

  return layout(`
    <section class="hero">
      <div class="hero-copy">
        <h1>${siteMeta.title}</h1>
        <p>${siteMeta.subtitle}</p>
        <div class="hero-actions">
          ${link("#/catalogo", "Explorar catálogo", "button primary")}
          ${link("#/comparador", "Comparar dos productos", "button")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <h2>Explora por categoría</h2>
      </div>
      <div class="category-grid">${categoryCounts}</div>
    </section>
    <section class="section split">
      <div>
        <h2>Cómo se clasifica la gama</h2>
        <p>La gama alta reúne mejor rendimiento, materiales, pantalla, refrigeración o funciones profesionales. La gama media busca equilibrio entre costo y capacidad. La gama baja cubre tareas esenciales con precio menor y menos margen para cargas pesadas.</p>
      </div>
      <div class="callout">
        <strong>Datos con contexto</strong>
        <p>${siteMeta.priceNotice}</p>
        <p>${siteMeta.imageNotice}</p>
      </div>
    </section>
  `);
}

function readCatalogQuery() {
  const raw = route().split("?")[1] || "";
  const params = new URLSearchParams(raw);
  if (params.has("categoria")) state.category = params.get("categoria");
}

function filterProducts() {
  const text = state.search.trim().toLowerCase();
  return products.filter((product) => {
    const haystack = [
      product.category,
      product.type,
      product.brand,
      product.model,
      product.range,
      product.description,
      product.recommendedUse,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!text || haystack.includes(text)) &&
      (state.category === "Todas" || product.category === state.category) &&
      (state.type === "Todos" || product.type === state.type) &&
      (state.brand === "Todas" || product.brand === state.brand) &&
      (state.range === "Todas" || product.range === state.range)
    );
  });
}

function selectControl(id, label, value, options) {
  return `
    <label class="field" for="${id}">
      <span>${label}</span>
      <select id="${id}" data-filter="${id}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-media" href="#/producto/${product.id}" aria-label="Abrir ficha de ${escapeHtml(product.brand)} ${escapeHtml(product.model)}">
        ${productMedia(product)}
        <span class="status-stack">
          ${product.image.status.includes("pendiente") ? `<span class="status-chip">Sin foto verificada</span>` : ""}
          ${product.price.status === "pendiente" ? `<span class="status-chip muted-chip">Precio por confirmar</span>` : ""}
        </span>
      </a>
      <div class="product-body">
        <p class="product-type">${escapeHtml(product.type)} ${product.range ? `· ${escapeHtml(product.range)}` : ""}</p>
        <h3>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <dl>
          <div><dt>Precio</dt><dd>${escapeHtml(money(product.price))}</dd></div>
          <div><dt>Mercado</dt><dd>${escapeHtml(product.price.market)}</dd></div>
        </dl>
        ${link(`#/producto/${product.id}`, "Ver ficha", "button small")}
      </div>
    </article>
  `;
}

function renderCatalog() {
  readCatalogQuery();
  const results = filterProducts();
  const categories = ["Todas", ...unique(products.map((p) => p.category))];
  const types = ["Todos", ...unique(products.map((p) => p.type))];
  const brands = ["Todas", ...unique(products.map((p) => p.brand))];
  const ranges = ["Todas", ...unique(products.map((p) => p.range))];

  const empty = `
    <div class="empty-state">
      <h2>No se encontraron productos</h2>
      <p>Prueba quitar filtros o buscar por marca, categoría, tipo o uso recomendado.</p>
      <button class="button" data-action="clear-filters">Limpiar filtros</button>
    </div>
  `;

  return layout(`
    <section class="page-head">
      <h1>Encuentra la tecnología que buscas</h1>
      <p>Filtra modelos reales por categoría, tipo, marca o gama y abre cada ficha para revisar especificaciones, precio de referencia, ventajas y fuentes.</p>
    </section>
    <p class="catalog-count">${products.length} productos en el catálogo</p>
    <section class="toolbar" aria-label="Controles de búsqueda y filtros">
      <label class="field search-field" for="search">
        <span>Buscar</span>
        <input id="search" type="search" value="${escapeHtml(state.search)}" placeholder="Ej. NVMe, Samsung, gama alta..." />
      </label>
      ${selectControl("category", "Categoría", state.category, categories)}
      ${selectControl("type", "Tipo", state.type, types)}
      ${selectControl("brand", "Marca", state.brand, brands)}
      ${selectControl("range", "Gama", state.range, ranges)}
    </section>
    <section class="result-line" aria-live="polite">
      <strong>${results.length}</strong> resultados visibles
    </section>
    <section class="catalog-grid">${results.length ? results.map(productCard).join("") : empty}</section>
  `);
}

function specTable(specs) {
  return `
    <dl class="spec-list">
      ${specs.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
    </dl>
  `;
}

function renderProduct(id) {
  const product = byId(id);
  if (!product) {
    return layout(`<section class="empty-state"><h1>Ficha no encontrada</h1>${link("#/catalogo", "Volver al catálogo", "button")}</section>`);
  }
  return layout(`
    <section class="detail-hero">
      <div class="detail-media">
        ${productMedia(product, "detail")}
        <p>${escapeHtml(imageCredit(product))}</p>
      </div>
      <div>
        <p class="eyebrow">${escapeHtml(product.category)} · ${escapeHtml(product.type)}</p>
        <h1>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <div class="badge-row">
          ${product.range ? `<span>${escapeHtml(product.range)}</span>` : ""}
          <span>${escapeHtml(product.verified === "parcial" ? "Verificación parcial" : "Verificado")}</span>
          <span>Consulta: ${escapeHtml(product.price.date)}</span>
        </div>
      </div>
    </section>
    <section class="detail-grid">
      <article class="panel">
        <h2>Características</h2>
        ${specTable(product.specs)}
      </article>
      <article class="panel">
        <h2>Precio</h2>
        <p class="price">${escapeHtml(money(product.price))}</p>
        <p><strong>Mercado:</strong> ${escapeHtml(product.price.market)}</p>
        <p><strong>Fuente:</strong> ${product.price.sourceUrl ? `<a href="${product.price.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(product.price.sourceName)}</a>` : escapeHtml(product.price.sourceName)}</p>
        <p>${escapeHtml(product.price.note)}</p>
      </article>
      <article class="panel">
        <h2>Ventajas</h2>
        <ul>${product.advantages.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>
      <article class="panel">
        <h2>Limitaciones</h2>
        <ul>${product.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>
      <article class="panel wide">
        <h2>Uso recomendado</h2>
        <p>${escapeHtml(product.recommendedUse)}</p>
      </article>
      <article class="panel wide">
        <h2>Fuentes</h2>
        <ul class="source-list">
          ${product.sources.map((item) => `<li><span>${escapeHtml(item.type)}</span><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></li>`).join("")}
        </ul>
      </article>
    </section>
  `);
}

function compareSelect(id, label, value, options) {
  return `
    <label class="field" for="${id}">
      <span>${label}</span>
      <select id="${id}" data-compare="${id}">
        ${options.map((product) => `<option value="${product.id}" ${product.id === value ? "selected" : ""}>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderComparator() {
  const types = unique(products.map((p) => p.type));
  if (!types.includes(state.compareType)) state.compareType = types[0];
  const options = products.filter((p) => p.type === state.compareType);
  if (!options.some((p) => p.id === state.compareA)) state.compareA = options[0]?.id || "";
  if (!options.some((p) => p.id === state.compareB) || state.compareB === state.compareA) state.compareB = options[1]?.id || options[0]?.id || "";
  const a = byId(state.compareA);
  const b = byId(state.compareB);
  const labels = unique([...(a?.specs || []), ...(b?.specs || [])].map(([label]) => label));

  const rows = labels
    .map((label) => {
      const av = a?.specs.find(([key]) => key === label)?.[1] || "No indicado";
      const bv = b?.specs.find(([key]) => key === label)?.[1] || "No indicado";
      const changed = av !== bv ? "difference" : "";
      return `<tr class="${changed}"><th>${escapeHtml(label)}</th><td>${escapeHtml(av)}</td><td>${escapeHtml(bv)}</td></tr>`;
    })
    .join("");

  return layout(`
    <section class="page-head">
      <h1>¿Cuál se adapta mejor a ti?</h1>
      <p>Compara dos modelos del mismo tipo para ver diferencias en precio, características y uso recomendado sin mezclar productos incompatibles.</p>
    </section>
    <section class="toolbar comparator-toolbar">
      <label class="field" for="compare-type">
        <span>Tipo de producto</span>
        <select id="compare-type" data-compare="type">
          ${types.map((type) => `<option value="${escapeHtml(type)}" ${type === state.compareType ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
        </select>
      </label>
      ${compareSelect("compare-a", "Producto A", state.compareA, options)}
      ${compareSelect("compare-b", "Producto B", state.compareB, options)}
    </section>
    ${
      a && b
        ? `<section class="compare-grid">
            <article class="compare-card">${productCard(a)}</article>
            <article class="compare-card">${productCard(b)}</article>
          </section>
          <section class="panel compare-table-panel">
            <h2>Diferencias destacadas</h2>
            <table class="compare-table">
              <thead><tr><th>Campo</th><th>${escapeHtml(a.brand)} ${escapeHtml(a.model)}</th><th>${escapeHtml(b.brand)} ${escapeHtml(b.model)}</th></tr></thead>
              <tbody>
                <tr class="${money(a.price) !== money(b.price) ? "difference" : ""}"><th>Precio</th><td>${escapeHtml(money(a.price))}</td><td>${escapeHtml(money(b.price))}</td></tr>
                ${rows}
                <tr class="difference"><th>Uso recomendado</th><td>${escapeHtml(a.recommendedUse)}</td><td>${escapeHtml(b.recommendedUse)}</td></tr>
              </tbody>
            </table>
          </section>`
        : `<section class="empty-state"><h2>Este tipo necesita al menos dos productos</h2><p>Elige otro tipo para comparar dos modelos.</p></section>`
    }
  `);
}

function renderPreparedComparisons() {
  return layout(`
    <section class="page-head">
      <h1>Diferencias que importan</h1>
      <p>Revisa análisis breves para entender qué cambia entre gamas, tecnologías y usos frecuentes.</p>
    </section>
    <section class="comparison-list">
      ${preparedComparisons
        .map((comparison) => {
          const items = comparison.productIds.map(byId).filter(Boolean);
          return `
            <article class="comparison-panel">
              <div>
                <p class="eyebrow">${escapeHtml(comparison.topic)}</p>
                <h2>${escapeHtml(comparison.title)}</h2>
                <p>${escapeHtml(comparison.conclusion)}</p>
              </div>
              <div class="mini-products">
                ${items.map((product) => `<a href="#/producto/${product.id}"><strong>${escapeHtml(product.brand)}</strong><span>${escapeHtml(product.model)}</span></a>`).join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
  `);
}

function renderGuide() {
  return layout(`
    <section class="page-head">
      <h1>Entiende cada componente</h1>
      <p>Conceptos esenciales para leer especificaciones y elegir con más seguridad.</p>
    </section>
    <section class="concept-grid">
      ${concepts.map((item) => `<article><h2>${escapeHtml(item.term)}</h2><p>${escapeHtml(item.explanation)}</p></article>`).join("")}
    </section>
  `);
}

function renderSources() {
  const allSources = products.flatMap((product) =>
    product.sources.map((item) => ({
      ...item,
      product: `${product.brand} ${product.model}`,
      id: product.id,
    }))
  );
  const pendingImages = products.filter((product) => product.image.status.includes("pendiente")).length;
  const pendingPrices = products.filter((product) => product.price.status === "pendiente").length;

  return layout(`
    <section class="page-head">
      <h1>Consulta el origen de los datos</h1>
      <p>Cada ficha conserva sus fuentes y muestra con claridad cuándo un precio o una imagen todavía no está confirmado.</p>
    </section>
    <section class="notice-grid">
      <div><strong>${allSources.length}</strong><span>fuentes enlazadas</span></div>
      <div><strong>${pendingImages}</strong><span>visuales sin foto verificada</span></div>
      <div><strong>${pendingPrices}</strong><span>precios por confirmar</span></div>
    </section>
    <section class="panel">
      <h2>Créditos visuales</h2>
      <p>${siteMeta.imageNotice}</p>
      <p>Los visuales diferenciados se generan desde la categoría y el tipo de cada ficha. No sustituyen fotografías reales.</p>
    </section>
    <section class="source-table-wrap">
      <table class="source-table">
        <thead><tr><th>Producto</th><th>Tipo</th><th>Fuente</th></tr></thead>
        <tbody>
          ${allSources
            .map((item) => `<tr><td><a href="#/producto/${item.id}">${escapeHtml(item.product)}</a></td><td>${escapeHtml(item.type)}</td><td><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></td></tr>`)
            .join("")}
        </tbody>
      </table>
    </section>
  `);
}

function slides() {
  return [
    {
      title: siteMeta.title,
      body: siteMeta.subtitle,
      meta: `${products.length} productos · ${unique(products.map((p) => p.category)).length} categorías`,
    },
    {
      title: "Clasificación por gama",
      body: "Alta significa mayor rendimiento, mejores materiales o funciones profesionales. Media equilibra costo y capacidad. Baja cubre necesidades esenciales.",
      meta: "Aplica a computadoras, laptops y celulares.",
    },
    {
      title: "Almacenamiento",
      body: "HDD guarda mucho por bajo costo. SSD SATA acelera equipos antiguos. SSD NVMe aprovecha PCI Express para máxima velocidad.",
      meta: "SATA es interfaz; HDD y SSD son tecnologías de almacenamiento.",
    },
    {
      title: "Comparador",
      body: "Permite elegir dos productos del mismo tipo y resalta diferencias en precio, características y uso recomendado.",
      meta: "Evita comparaciones inválidas entre categorías incompatibles.",
    },
    {
      title: "Raspberry Pi y Arduino",
      body: "Raspberry Pi funciona como mini computadora con Linux. Arduino controla sensores y actuadores como microcontrolador.",
      meta: "Se parecen en educación, pero resuelven problemas distintos.",
    },
    {
      title: "Elegir con criterio",
      body: "Las comparaciones muestran que no siempre gana el modelo más caro: conviene partir del uso, revisar límites y confirmar precio, compatibilidad y fuentes.",
      meta: "La mejor opción depende de tus necesidades reales.",
    },
  ];
}

function renderPresentation() {
  const deck = slides();
  if (state.slide >= deck.length) state.slide = deck.length - 1;
  if (state.slide < 0) state.slide = 0;
  const slide = deck[state.slide];
  return layout(`
    <section class="presentation">
      <p class="eyebrow">Modo presentación</p>
      <h1>${escapeHtml(slide.title)}</h1>
      <p>${escapeHtml(slide.body)}</p>
      <strong>${escapeHtml(slide.meta)}</strong>
      <div class="presentation-controls">
        <button class="button" data-slide="prev" ${state.slide === 0 ? "disabled" : ""}>Anterior</button>
        <span>${state.slide + 1} / ${deck.length}</span>
        <button class="button primary" data-slide="next" ${state.slide === deck.length - 1 ? "disabled" : ""}>${state.slide === deck.length - 1 ? "Fin" : "Siguiente"}</button>
      </div>
    </section>
  `);
}

function render() {
  const current = route();
  let html;
  if (current.startsWith("/producto/")) html = renderProduct(current.split("/producto/")[1]);
  else if (current.startsWith("/catalogo")) html = renderCatalog();
  else if (current === "/comparador") html = renderComparator();
  else if (current === "/comparaciones") html = renderPreparedComparisons();
  else if (current === "/guia") html = renderGuide();
  else if (current === "/fuentes") html = renderSources();
  else if (current === "/presentacion") html = renderPresentation();
  else html = renderHome();
  app.innerHTML = html;
  bindEvents();
  document.title = `${siteMeta.title}`;
}

function bindEvents() {
  document.querySelector("#search")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const id = event.target.dataset.filter;
      state[id] = event.target.value;
      render();
    });
  });

  document.querySelector("[data-action='clear-filters']")?.addEventListener("click", () => {
    state.search = "";
    state.category = "Todas";
    state.type = "Todos";
    state.brand = "Todas";
    state.range = "Todas";
    render();
  });

  document.querySelectorAll("[data-compare]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const key = event.target.dataset.compare;
      if (key === "type") {
        state.compareType = event.target.value;
        state.compareA = "";
        state.compareB = "";
      } else if (key === "compare-a") {
        state.compareA = event.target.value;
      } else if (key === "compare-b") {
        state.compareB = event.target.value;
      }
      render();
    });
  });

  document.querySelector("[data-slide='prev']")?.addEventListener("click", () => {
    state.slide -= 1;
    render();
  });
  document.querySelector("[data-slide='next']")?.addEventListener("click", () => {
    state.slide += 1;
    render();
  });
}

window.addEventListener("hashchange", render);
render();
