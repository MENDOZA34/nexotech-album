import "./styles.css";
import { products } from "./data/products.js";
import { concepts, preparedComparisons } from "./data/concepts.js";
import { siteMeta } from "./data/siteMeta.js";

const app = document.querySelector("#app");
const FAVORITES_KEY = "nexotech:favorites";
const categoryOrder = [...new Set(products.map((product) => product.category))];
let lastRoute = "";

const state = {
  search: "",
  category: "Todas",
  type: "Todos",
  brand: "Todas",
  range: "Todas",
  compareType: "Escritorio gama alta",
  compareA: "",
  compareB: "",
  listCompareType: "",
  listCompareA: "",
  listCompareB: "",
  slide: 0,
  moreOpen: false,
  favorites: loadFavorites(),
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

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20h-5v-6H9v6H4v-8.5Z"/></svg>',
  products: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z"/></svg>',
  pcs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H4V5Zm6 12h4l1 2H9l1-2Z"/></svg>',
  lists: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16l-5-3-5 3V4Z"/></svg>',
  brands: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v4H4V7Zm2 6h5v5H6v-5Zm7 0h5v5h-5v-5Z"/></svg>',
  more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>',
  compare: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h5v14H7V5Zm5 3h5v11h-5V8Z"/></svg>',
  analysis: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V5h3v14H5Zm6 0V9h3v10h-3Zm6 0V7h3v12h-3Z"/></svg>',
  guide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h10a4 4 0 0 1 4 4v10H9a4 4 0 0 1-4-4V5Z"/></svg>',
  sources: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h8l4 4v12H7V4Zm7 0v5h5"/></svg>',
  presentation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H4V5Zm7 10h2v4h3v2H8v-2h3v-4Z"/></svg>',
};

const unique = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
const byId = (id) => products.find((product) => product.id === id);
const route = () => location.hash.replace(/^#/, "") || "/";
const currentPath = () => route().split("?")[0] || "/";
const paramsForRoute = () => new URLSearchParams(route().split("?")[1] || "");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id, index) => products.some((product) => product.id === id) && parsed.indexOf(id) === index);
  } catch {
    return [];
  }
}

function saveFavorites() {
  const validIds = state.favorites.filter((id, index) => products.some((product) => product.id === id) && state.favorites.indexOf(id) === index);
  state.favorites = validIds;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(validIds));
  } catch {
    // localStorage puede no estar disponible en modos restrictivos.
  }
}

function isFavorite(id) {
  return state.favorites.includes(id);
}

function toggleFavorite(id) {
  if (!byId(id)) return;
  state.favorites = isFavorite(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
  saveFavorites();
}

function money(price) {
  if (!price || price.status === "pendiente") return "Precio por confirmar";
  if (String(price.amount).toLowerCase() === "pendiente") return "Precio por confirmar";
  if (String(price.amount).toLowerCase() === "varía") return "Precio variable";
  if (price.currency === "GTQ") {
    const numeric = Number(String(price.amount).replaceAll(",", ""));
    if (Number.isFinite(numeric)) return `Q ${numeric.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  const currencyLabels = { GTQ: "Q", USD: "US$" };
  return `${currencyLabels[price.currency] || price.currency} ${price.amount}`;
}

function getImageState(product) {
  const status = product.image?.status || "pendiente de verificación";
  return {
    showsPhoto: status === "verificada" || status.startsWith("enlazada"),
    verified: status === "verificada",
    linkedPending: status.startsWith("enlazada"),
    pending: status.includes("pendiente") && !status.startsWith("enlazada"),
  };
}

function productVisual(product, variant = "card") {
  const profile = visualProfiles[product.category] || { code: "TEC", tone: "tone-violet", label: "producto tecnológico" };
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
  if (getImageState(product).showsPhoto) {
    return `<img src="${product.image.src}" alt="${escapeHtml(product.image.alt)}" loading="lazy" />`;
  }
  return productVisual(product, variant);
}

function imageCredit(product) {
  const imageState = getImageState(product);
  if (imageState.verified) return product.image.credit;
  if (imageState.linkedPending) return `${product.image.credit} Permiso de reutilización pendiente.`;
  return product.image?.credit || "Visual generado por categoría. No es una fotografía del modelo.";
}

function link(href, label, className = "") {
  return `<a class="${className}" href="${href}">${label}</a>`;
}

function navItem(href, label, iconName, active = false) {
  return `<a class="nav-item ${active ? "active" : ""}" href="${href}">${icons[iconName]}<span>${label}</span></a>`;
}

function layout(content) {
  const path = currentPath();
  const moreActive = ["/comparador", "/comparaciones", "/guia", "/fuentes", "/presentacion"].includes(path);
  return `
    <header class="topbar">
      <a class="brand" href="#/" aria-label="Inicio NexoTech">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>${siteMeta.title}</span>
      </a>
      <nav class="nav" aria-label="Navegación principal">
        ${navItem("#/", "Inicio", "home", path === "/")}
        ${navItem("#/catalogo", "Productos", "products", path === "/catalogo")}
        ${navItem("#/pcs", "PCs", "pcs", path === "/pcs")}
        ${navItem("#/listas", `Listas${state.favorites.length ? ` ${state.favorites.length}` : ""}`, "lists", path === "/listas")}
        ${navItem("#/marcas", "Marcas", "brands", path === "/marcas")}
        <div class="more-nav">
          <button class="nav-item more-button ${moreActive ? "active" : ""}" type="button" data-action="toggle-more" aria-haspopup="true" aria-expanded="${state.moreOpen ? "true" : "false"}">
            ${icons.more}<span>Más</span>
          </button>
          <div class="more-menu ${state.moreOpen ? "open" : ""}" role="menu">
            <a href="#/comparador" role="menuitem">${icons.compare}<span>Comparador</span></a>
            <a href="#/comparaciones" role="menuitem">${icons.analysis}<span>Análisis</span></a>
            <a href="#/guia" role="menuitem">${icons.guide}<span>Guía</span></a>
            <a href="#/fuentes" role="menuitem">${icons.sources}<span>Fuentes</span></a>
            <a href="#/presentacion" role="menuitem">${icons.presentation}<span>Presentación</span></a>
          </div>
        </div>
      </nav>
    </header>
    <main>${content}</main>
  `;
}

function setFilters(next) {
  Object.assign(state, next);
  state.moreOpen = false;
}

function clearFilters() {
  setFilters({ search: "", category: "Todas", type: "Todos", brand: "Todas", range: "Todas" });
}

function applyQueryFilters(defaults = {}) {
  const params = paramsForRoute();
  if (params.has("limpiar")) {
    clearFilters();
    return;
  }
  setFilters({
    search: params.get("buscar") ?? defaults.search ?? "",
    category: params.get("categoria") ?? defaults.category ?? "Todas",
    type: params.get("tipo") ?? defaults.type ?? "Todos",
    brand: params.get("marca") ?? defaults.brand ?? "Todas",
    range: params.get("gama") ?? defaults.range ?? "Todas",
  });
}

function filterProducts(sourceProducts = products) {
  const text = state.search.trim().toLowerCase();
  return sourceProducts.filter((product) => {
    const haystack = [product.category, product.type, product.brand, product.model, product.range, product.description, product.recommendedUse]
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

function favoriteButton(product, extraClass = "") {
  const saved = isFavorite(product.id);
  return `
    <button class="button icon-button favorite-button ${extraClass} ${saved ? "saved" : ""}" type="button" data-fav-id="${product.id}" aria-pressed="${saved ? "true" : "false"}" title="${saved ? "Quitar de Listas" : "Guardar en Listas"}">
      ${icons.lists}<span>${saved ? "Guardado" : "Guardar"}</span>
    </button>
  `;
}

function productCard(product) {
  const imageState = getImageState(product);
  return `
    <article class="product-card">
      <a class="product-media" href="#/producto/${product.id}" aria-label="Abrir ficha de ${escapeHtml(product.brand)} ${escapeHtml(product.model)}">
        ${productMedia(product)}
        <span class="status-stack">
          ${imageState.pending ? `<span class="status-chip">Sin foto verificada</span>` : ""}
          ${product.price.status === "pendiente" ? `<span class="status-chip muted-chip">Precio por confirmar</span>` : ""}
        </span>
      </a>
      <div class="product-body">
        <p class="product-type">${escapeHtml(product.category)} · ${escapeHtml(product.type)}${product.range ? ` · ${escapeHtml(product.range)}` : ""}</p>
        <h3>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <dl>
          <div><dt>Precio</dt><dd>${escapeHtml(money(product.price))}</dd></div>
          <div><dt>Mercado</dt><dd>${escapeHtml(product.price.market)}</dd></div>
        </dl>
        <div class="card-actions">
          ${link(`#/producto/${product.id}`, "Ver ficha", "button small")}
          ${favoriteButton(product, "small")}
        </div>
      </div>
    </article>
  `;
}

function categoryAccessGrid() {
  return categoryOrder
    .map((category) => {
      const count = products.filter((product) => product.category === category).length;
      return `<a class="category-tile" href="#/catalogo?categoria=${encodeURIComponent(category)}"><span>${escapeHtml(category)}</span><strong>${count}</strong></a>`;
    })
    .join("");
}

function renderHome() {
  return layout(`
    <section class="hero">
      <div class="hero-copy">
        <h1>${siteMeta.title}</h1>
        <p>${siteMeta.subtitle}</p>
        <div class="hero-actions">
          ${link("#/catalogo", "Explorar productos", "button primary")}
          ${link("#/pcs", "Ver PCs", "button")}
          ${link("#/listas", "Abrir Listas", "button")}
        </div>
      </div>
    </section>
    <section class="section split">
      <div>
        <h2>Catálogo comparativo</h2>
        <p>Consulta productos reales por categoría, marca, tipo y gama. Cada ficha conserva sus fuentes, precios de referencia y datos pendientes cuando corresponde.</p>
      </div>
      <div class="callout">
        <strong>Información para tu compra</strong>
        <p>Compara las características y los precios de referencia de cada producto. Para consultar el precio vigente, la disponibilidad y las opciones de configuración, visita la página de la tienda o del fabricante enlazada en su ficha.</p>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Explora por categoría</h2></div>
      <div class="category-grid">${categoryAccessGrid()}</div>
    </section>
  `);
}

function categoryHero(results, options = {}) {
  const selectedCategory = state.category !== "Todas" ? state.category : "";
  const selectedBrand = state.brand !== "Todas" ? state.brand : "";
  const title = options.title || (selectedCategory ? selectedCategory.toUpperCase() : "Encuentra la tecnología que buscas");
  const subtitle = [selectedCategory, selectedBrand].filter(Boolean).join(" · ") || "Catálogo completo";
  const baseForBrands = selectedCategory ? products.filter((product) => product.category === selectedCategory) : products;
  const brands = ["Todas", ...unique(baseForBrands.map((product) => product.brand))];
  return `
    <section class="catalog-hero">
      <div>
        <p class="catalog-kicker">${escapeHtml(subtitle)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${results.length} resultados visibles de ${products.length} productos del catálogo.</p>
      </div>
      ${
        selectedCategory
          ? `<div class="brand-pills" aria-label="Marcas en ${escapeHtml(selectedCategory)}">${brands
              .map((brand) => {
                const href = `#/catalogo?categoria=${encodeURIComponent(selectedCategory)}${brand !== "Todas" ? `&marca=${encodeURIComponent(brand)}` : ""}`;
                return `<a class="${brand === state.brand ? "active" : ""}" href="${href}">${escapeHtml(brand)}</a>`;
              })
              .join("")}</div>`
          : ""
      }
    </section>
  `;
}

function filterToolbar(availableProducts = products) {
  const scopedByCategory = state.category === "Todas" ? products : products.filter((product) => product.category === state.category);
  const categories = ["Todas", ...categoryOrder];
  const types = ["Todos", ...unique(scopedByCategory.map((product) => product.type))];
  const brands = ["Todas", ...unique(scopedByCategory.map((product) => product.brand))];
  const ranges = ["Todas", ...unique(availableProducts.map((product) => product.range))];
  return `
    <section class="toolbar" aria-label="Controles de búsqueda y filtros">
      <label class="field search-field" for="search">
        <span>Buscar</span>
        <input id="search" type="search" value="${escapeHtml(state.search)}" placeholder="Ej. NVMe, Samsung, gama alta..." />
      </label>
      ${selectControl("category", "Categoría", state.category, categories)}
      ${selectControl("type", "Tipo", state.type, types)}
      ${selectControl("brand", "Marca", state.brand, brands)}
      ${selectControl("range", "Gama", state.range, ranges)}
      <button class="button clear-button" type="button" data-action="clear-filters">Limpiar filtros</button>
    </section>
  `;
}

function groupByCategory(items) {
  return categoryOrder
    .map((category) => ({ category, products: items.filter((product) => product.category === category) }))
    .filter((group) => group.products.length);
}

function renderGroupedCatalog(results) {
  if (!results.length) {
    return `<section class="catalog-grid"><div class="empty-state"><h2>No se encontraron productos</h2><p>Prueba quitar filtros o buscar por marca, categoría, tipo, gama o uso recomendado.</p><button class="button" data-action="clear-filters">Limpiar filtros</button></div></section>`;
  }
  return groupByCategory(results)
    .map((group) => `<section class="catalog-section"><div class="category-title-row"><h2>${escapeHtml(group.category.toUpperCase())}</h2><span>${group.products.length} producto${group.products.length === 1 ? "" : "s"}</span></div><div class="catalog-grid">${group.products.map(productCard).join("")}</div></section>`)
    .join("");
}

function renderCatalog(options = {}) {
  const results = filterProducts();
  const pcLinks = options.pcHub
    ? `<section class="quick-links"><a class="button ${state.category === "Computadoras de escritorio" ? "primary" : ""}" href="#/pcs">Escritorio</a><a class="button ${state.category === "Laptops" ? "primary" : ""}" href="#/catalogo?categoria=${encodeURIComponent("Laptops")}">Laptops</a></section>`
    : "";
  return layout(`
    ${categoryHero(results, options)}
    ${pcLinks}
    <p class="catalog-count">${products.length} productos en el catálogo</p>
    ${filterToolbar(results)}
    <section class="result-line" aria-live="polite"><strong>${results.length}</strong> resultados visibles</section>
    ${renderGroupedCatalog(results)}
  `);
}

function renderBrands() {
  const brandCounts = unique(products.map((product) => product.brand)).map((brand) => ({
    brand,
    count: products.filter((product) => product.brand === brand).length,
  }));
  return layout(`
    <section class="page-head"><h1>Marcas del catálogo</h1><p>Elige una marca para ver sus productos dentro del catálogo. Los conteos se generan desde los datos actuales.</p></section>
    <section class="brand-grid">${brandCounts.map(({ brand, count }) => `<a class="brand-card" href="#/catalogo?marca=${encodeURIComponent(brand)}"><strong>${escapeHtml(brand)}</strong><span>${count} producto${count === 1 ? "" : "s"}</span></a>`).join("")}</section>
  `);
}

function validFavoriteProducts() {
  return state.favorites.map(byId).filter(Boolean);
}

function listCompareSelect(slot, value, options) {
  return `<label class="field"><span>Producto ${slot.toUpperCase()}</span><select data-list-compare="${slot}">${options.map((product) => `<option value="${product.id}" ${product.id === value ? "selected" : ""}>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</option>`).join("")}</select></label>`;
}

function renderLists() {
  state.favorites = state.favorites.filter((id) => byId(id));
  saveFavorites();
  const savedProducts = validFavoriteProducts();
  const comparableTypes = unique(savedProducts.map((product) => product.type)).filter((type) => savedProducts.filter((product) => product.type === type).length >= 2);
  if (!comparableTypes.includes(state.listCompareType)) state.listCompareType = comparableTypes[0] || "";
  const compareOptions = savedProducts.filter((product) => product.type === state.listCompareType);
  if (!compareOptions.some((product) => product.id === state.listCompareA)) state.listCompareA = compareOptions[0]?.id || "";
  if (!compareOptions.some((product) => product.id === state.listCompareB) || state.listCompareB === state.listCompareA) state.listCompareB = compareOptions.find((product) => product.id !== state.listCompareA)?.id || "";
  const comparePanel = comparableTypes.length
    ? `<section class="panel list-compare"><h2>Comparar productos guardados</h2><p>Solo puedes comparar dos productos guardados del mismo tipo.</p><div class="toolbar comparator-toolbar"><label class="field"><span>Tipo compatible</span><select data-list-compare="type">${comparableTypes.map((type) => `<option value="${escapeHtml(type)}" ${type === state.listCompareType ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select></label>${listCompareSelect("a", state.listCompareA, compareOptions)}${listCompareSelect("b", state.listCompareB, compareOptions)}<button class="button primary" type="button" data-action="compare-saved">Comparar</button></div></section>`
    : "";
  return layout(`
    <section class="page-head"><h1>Listas</h1><p>Guarda productos para revisarlos después. La lista vive en este navegador y solo almacena identificadores.</p></section>
    <section class="list-summary"><strong>${savedProducts.length}</strong><span>producto${savedProducts.length === 1 ? "" : "s"} guardado${savedProducts.length === 1 ? "" : "s"}</span><button class="button" type="button" data-action="clear-favorites" ${savedProducts.length ? "" : "disabled"}>Vaciar lista</button></section>
    ${savedProducts.length ? `${comparePanel}${renderGroupedCatalog(savedProducts)}` : `<section class="empty-state"><h2>Tu lista está vacía</h2><p>Guarda productos desde las tarjetas o fichas para tenerlos a mano.</p>${link("#/catalogo", "Explorar productos", "button primary")}</section>`}
  `);
}

function specTable(specs) {
  return `<dl class="spec-list">${specs.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`;
}

function renderProduct(id) {
  const product = byId(id);
  if (!product) return layout(`<section class="empty-state"><h1>Ficha no encontrada</h1>${link("#/catalogo", "Volver al catálogo", "button")}</section>`);
  return layout(`
    <section class="detail-hero">
      <div class="detail-media">${productMedia(product, "detail")}<p>${escapeHtml(imageCredit(product))}</p></div>
      <div>
        <p class="eyebrow">${escapeHtml(product.category)} · ${escapeHtml(product.type)}</p>
        <h1>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <div class="badge-row">${product.range ? `<span>${escapeHtml(product.range)}</span>` : ""}<span>${getImageState(product).showsPhoto ? "Foto enlazada" : "Sin foto verificada"}</span><span>Consulta: ${escapeHtml(product.price.date)}</span></div>
        <div class="hero-actions">${link("#/catalogo", "Volver al catálogo", "button")}${favoriteButton(product)}${link(`#/comparador?tipo=${encodeURIComponent(product.type)}&a=${encodeURIComponent(product.id)}`, "Comparar", "button primary")}</div>
      </div>
    </section>
    <section class="detail-grid">
      <article class="panel"><h2>Características</h2>${specTable(product.specs)}</article>
      <article class="panel"><h2>Precio</h2><p class="price">${escapeHtml(money(product.price))}</p><p><strong>Mercado:</strong> ${escapeHtml(product.price.market)}</p><p><strong>Fuente:</strong> ${product.price.sourceUrl ? `<a href="${product.price.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(product.price.sourceName)}</a>` : escapeHtml(product.price.sourceName)}</p><p>${escapeHtml(product.price.note)}</p></article>
      <article class="panel"><h2>Ventajas</h2><ul>${product.advantages.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
      <article class="panel"><h2>Limitaciones</h2><ul>${product.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
      <article class="panel wide"><h2>Uso recomendado</h2><p>${escapeHtml(product.recommendedUse)}</p></article>
      <article class="panel wide"><h2>Fuentes</h2><ul class="source-list">${product.sources.map((item) => `<li><span>${escapeHtml(item.type)}</span><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></li>`).join("")}</ul></article>
    </section>
  `);
}

function compareSelect(id, label, value, options) {
  return `<label class="field" for="${id}"><span>${label}</span><select id="${id}" data-compare="${id}">${options.map((product) => `<option value="${product.id}" ${product.id === value ? "selected" : ""}>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</option>`).join("")}</select></label>`;
}

function specValue(product, label) {
  return product?.specs.find(([key]) => key === label)?.[1] || "";
}

function compareHighlights(a, b, labels) {
  if (!a || !b) return "";
  const priority = [
    "Procesador y núcleos",
    "CPU y núcleos",
    "Chip",
    "RAM",
    "Memoria",
    "Memoria gráfica",
    "GPU",
    "Almacenamiento",
    "Pantalla",
    "Resolución",
    "Frecuencia",
    "Batería",
    "Peso",
    "Conectividad",
    "Puertos",
    "Compatibilidad",
    "Dimensiones",
  ];
  const orderedLabels = unique([...priority.filter((label) => labels.includes(label)), ...labels]);
  const differences = orderedLabels
    .map((label) => ({ label, aValue: specValue(a, label), bValue: specValue(b, label) }))
    .filter(({ aValue, bValue }) => aValue && bValue && aValue !== bValue)
    .slice(0, 4);
  if (!differences.length) {
    return `<p class="compare-summary">Estos dos productos comparten las características principales documentadas; revisa precio, uso recomendado y disponibilidad antes de decidir.</p>`;
  }
  const details = differences
    .map(({ label, aValue, bValue }) => `${label}: ${a.brand} ${a.model} indica ${aValue}; ${b.brand} ${b.model} indica ${bValue}.`)
    .join(" ");
  const context =
    a.category === b.category
      ? "Resumen de diferencias relevantes:"
      : "Resumen entre categorías distintas; se comparan solo aspectos compatibles:";
  return `<p class="compare-summary">${escapeHtml(context)} ${escapeHtml(details)}</p>`;
}

function applyCompareQuery() {
  const params = paramsForRoute();
  if (params.get("tipo")) state.compareType = params.get("tipo");
  if (params.get("a")) state.compareA = params.get("a");
  if (params.get("b")) state.compareB = params.get("b");
}

function renderComparator() {
  const types = unique(products.map((product) => product.type));
  if (!types.includes(state.compareType)) state.compareType = types[0];
  const options = products.filter((product) => product.type === state.compareType);
  if (!options.some((product) => product.id === state.compareA)) state.compareA = options[0]?.id || "";
  if (!options.some((product) => product.id === state.compareB) || state.compareB === state.compareA) state.compareB = options.find((product) => product.id !== state.compareA)?.id || options[0]?.id || "";
  const a = byId(state.compareA);
  const b = byId(state.compareB);
  const labels = unique([...(a?.specs || []), ...(b?.specs || [])].map(([label]) => label));
  const summary = compareHighlights(a, b, labels);
  const rows = labels
    .map((label) => {
      const av = a?.specs.find(([key]) => key === label)?.[1] || "No indicado";
      const bv = b?.specs.find(([key]) => key === label)?.[1] || "No indicado";
      return `<tr class="${av !== bv ? "difference" : ""}"><th>${escapeHtml(label)}</th><td>${escapeHtml(av)}</td><td>${escapeHtml(bv)}</td></tr>`;
    })
    .join("");
  return layout(`
    <section class="page-head"><h1>¿Cuál se adapta mejor a ti?</h1><p>Compara dos modelos del mismo tipo para ver diferencias en precio, características y uso recomendado sin mezclar productos incompatibles.</p></section>
    <section class="toolbar comparator-toolbar"><label class="field" for="compare-type"><span>Tipo de producto</span><select id="compare-type" data-compare="type">${types.map((type) => `<option value="${escapeHtml(type)}" ${type === state.compareType ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select></label>${compareSelect("compare-a", "Producto A", state.compareA, options)}${compareSelect("compare-b", "Producto B", state.compareB, options)}</section>
    ${a && b ? `<section class="compare-grid"><article class="compare-card">${productCard(a)}</article><article class="compare-card">${productCard(b)}</article></section><section class="panel compare-table-panel"><h2>Diferencias destacadas</h2>${summary}<table class="compare-table"><thead><tr><th>Campo</th><th>${escapeHtml(a.brand)} ${escapeHtml(a.model)}</th><th>${escapeHtml(b.brand)} ${escapeHtml(b.model)}</th></tr></thead><tbody><tr class="${money(a.price) !== money(b.price) ? "difference" : ""}"><th>Precio</th><td>${escapeHtml(money(a.price))}</td><td>${escapeHtml(money(b.price))}</td></tr>${rows}<tr class="difference"><th>Uso recomendado</th><td>${escapeHtml(a.recommendedUse)}</td><td>${escapeHtml(b.recommendedUse)}</td></tr></tbody></table></section>` : `<section class="empty-state"><h2>Este tipo necesita al menos dos productos</h2><p>Elige otro tipo para comparar dos modelos.</p></section>`}
  `);
}

function renderPreparedComparisons() {
  return layout(`<section class="page-head"><h1>Diferencias que importan</h1><p>Revisa análisis breves para entender qué cambia entre gamas, tecnologías y usos frecuentes.</p></section><section class="comparison-list">${preparedComparisons.map((comparison) => { const items = comparison.productIds.map(byId).filter(Boolean); return `<article class="comparison-panel"><div><p class="eyebrow">${escapeHtml(comparison.topic)}</p><h2>${escapeHtml(comparison.title)}</h2><p>${escapeHtml(comparison.conclusion)}</p></div><div class="mini-products">${items.map((product) => `<a href="#/producto/${product.id}"><strong>${escapeHtml(product.brand)}</strong><span>${escapeHtml(product.model)}</span></a>`).join("")}</div></article>`; }).join("")}</section>`);
}

function renderGuide() {
  return layout(`<section class="page-head"><h1>Entiende cada componente</h1><p>Conceptos esenciales para leer especificaciones y elegir con más seguridad.</p></section><section class="concept-grid">${concepts.map((item) => `<article><h2>${escapeHtml(item.term)}</h2><p>${escapeHtml(item.explanation)}</p></article>`).join("")}</section>`);
}

function renderSources() {
  const sourceRows = products
    .map((product) => {
      const specLinks = product.sources.map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>`).join("<br>");
      const priceSource = product.price.sourceUrl ? `<a href="${product.price.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(product.price.sourceName)}</a>` : escapeHtml(product.price.sourceName);
      const priceNote = product.price.note ? `<br><span>${escapeHtml(product.price.note)}</span>` : "";
      const thumbnail = `<div class="source-thumbnail"><img src="${escapeHtml(product.image.src)}" alt="${escapeHtml(product.image.alt || `${product.brand} ${product.model}`)}" loading="lazy" /></div>`;
      return `<tr><td><a href="#/producto/${product.id}">${escapeHtml(product.brand)} ${escapeHtml(product.model)}</a></td><td>${escapeHtml(product.brand)}</td><td>${specLinks}</td><td>${priceSource}<br><span>${escapeHtml(money(product.price))} · ${escapeHtml(product.price.market)} · ${escapeHtml(product.price.date)}</span>${priceNote}</td><td>${thumbnail}</td></tr>`;
    })
    .join("");
  const sourceCount = products.reduce((count, product) => count + product.sources.length, 0);
  const thumbnailCount = products.filter((product) => product.image?.src).length;
  const pendingPrices = products.filter((product) => product.price.status === "pendiente").length;
  return layout(`<section class="page-head"><h1>Consulta el origen de los datos</h1><p>Cada ficha conserva sus fuentes, enlaces de referencia y precio consultado.</p></section><section class="notice-grid"><div><strong>${sourceCount}</strong><span>fuentes enlazadas</span></div><div><strong>${products.length}</strong><span>productos documentados</span></div><div><strong>${thumbnailCount}</strong><span>miniaturas del catálogo</span></div><div><strong>${pendingPrices}</strong><span>precios por confirmar</span></div></section><section class="source-table-wrap"><table class="source-table"><thead><tr><th>Producto</th><th>Fabricante</th><th>Especificaciones</th><th>Precio</th><th>Imagen</th></tr></thead><tbody>${sourceRows}</tbody></table></section>`);
}

function slides() {
  return [
    { title: siteMeta.title, body: siteMeta.subtitle, meta: `${products.length} productos · ${categoryOrder.length} categorías` },
    { title: "Clasificación por gama", body: "Alta significa mayor rendimiento, mejores materiales o funciones profesionales. Media equilibra costo y capacidad. Baja cubre necesidades esenciales.", meta: "Aplica a computadoras, laptops y celulares." },
    { title: "Categorías del catálogo", body: "El catálogo reúne computadoras de escritorio, laptops, celulares, tablets, almacenamiento, componentes internos, periféricos, otros equipos, consolas y placas de desarrollo.", meta: "La validación local confirma 93 productos." },
    { title: "Almacenamiento", body: "HDD guarda mucho por bajo costo. SSD SATA acelera equipos antiguos. SSD NVMe aprovecha PCI Express para máxima velocidad.", meta: "SATA es interfaz; HDD y SSD son tecnologías de almacenamiento." },
    { title: "Comparador", body: "Permite elegir dos productos del mismo tipo y resalta diferencias en precio, características y uso recomendado.", meta: "Evita comparaciones inválidas entre categorías incompatibles." },
    { title: "Raspberry Pi y Arduino", body: "Raspberry Pi funciona como mini computadora con Linux. Arduino controla sensores y actuadores como microcontrolador.", meta: "Se parecen en educación, pero resuelven problemas distintos." },
    { title: "Elegir con criterio", body: "Las comparaciones muestran que no siempre gana el modelo más caro: conviene partir del uso, revisar límites y confirmar precio, compatibilidad y fuentes.", meta: "La mejor opción depende de tus necesidades reales." },
  ];
}

function renderPresentation() {
  const deck = slides();
  if (state.slide >= deck.length) state.slide = deck.length - 1;
  if (state.slide < 0) state.slide = 0;
  const slide = deck[state.slide];
  return layout(`<section class="presentation"><p class="eyebrow">Modo presentación</p><h1>${escapeHtml(slide.title)}</h1><p>${escapeHtml(slide.body)}</p><strong>${escapeHtml(slide.meta)}</strong><div class="presentation-controls"><button class="button" data-slide="prev" ${state.slide === 0 ? "disabled" : ""}>Anterior</button><span>${state.slide + 1} / ${deck.length}</span><button class="button primary" data-slide="next" ${state.slide === deck.length - 1 ? "disabled" : ""}>${state.slide === deck.length - 1 ? "Fin" : "Siguiente"}</button></div></section>`);
}

function render() {
  const path = currentPath();
  const fullRoute = route();
  state.favorites = loadFavorites();
  if (fullRoute !== lastRoute) {
    if (path === "/catalogo") applyQueryFilters();
    if (path === "/pcs") applyQueryFilters({ category: "Computadoras de escritorio", type: "Todos", brand: "Todas", range: "Todas", search: "" });
    if (path === "/comparador") applyCompareQuery();
    lastRoute = fullRoute;
  }
  let html;
  if (path.startsWith("/producto/")) html = renderProduct(path.split("/producto/")[1]);
  else if (path === "/catalogo") html = renderCatalog();
  else if (path === "/pcs") html = renderCatalog({ pcHub: true, title: "PCS" });
  else if (path === "/listas") html = renderLists();
  else if (path === "/marcas") html = renderBrands();
  else if (path === "/comparador") html = renderComparator();
  else if (path === "/comparaciones") html = renderPreparedComparisons();
  else if (path === "/guia") html = renderGuide();
  else if (path === "/fuentes") html = renderSources();
  else if (path === "/presentacion") html = renderPresentation();
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
      if (id === "category") {
        state.type = "Todos";
        state.brand = "Todas";
        state.range = "Todas";
      }
      render();
    });
  });
  document.querySelectorAll("[data-fav-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(event.currentTarget.dataset.favId);
      render();
    });
  });
  document.querySelector("[data-action='clear-filters']")?.addEventListener("click", () => {
    clearFilters();
    render();
  });
  document.querySelector("[data-action='clear-favorites']")?.addEventListener("click", () => {
    state.favorites = [];
    saveFavorites();
    render();
  });
  document.querySelector("[data-action='toggle-more']")?.addEventListener("click", (event) => {
    event.stopPropagation();
    state.moreOpen = !state.moreOpen;
    render();
  });
  document.querySelectorAll(".more-menu a").forEach((item) => item.addEventListener("click", () => (state.moreOpen = false)));
  document.querySelectorAll("[data-compare]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const key = event.target.dataset.compare;
      if (key === "type") {
        state.compareType = event.target.value;
        state.compareA = "";
        state.compareB = "";
      } else if (key === "compare-a") state.compareA = event.target.value;
      else if (key === "compare-b") state.compareB = event.target.value;
      render();
    });
  });
  document.querySelectorAll("[data-list-compare]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const key = event.target.dataset.listCompare;
      if (key === "type") {
        state.listCompareType = event.target.value;
        state.listCompareA = "";
        state.listCompareB = "";
      } else if (key === "a") state.listCompareA = event.target.value;
      else if (key === "b") state.listCompareB = event.target.value;
      render();
    });
  });
  document.querySelector("[data-action='compare-saved']")?.addEventListener("click", () => {
    const a = byId(state.listCompareA);
    const b = byId(state.listCompareB);
    if (!a || !b || a.type !== b.type) return;
    state.compareType = a.type;
    state.compareA = a.id;
    state.compareB = b.id;
    location.hash = `#/comparador?tipo=${encodeURIComponent(a.type)}&a=${encodeURIComponent(a.id)}&b=${encodeURIComponent(b.id)}`;
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

window.addEventListener("hashchange", () => {
  state.moreOpen = false;
  render();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.moreOpen) {
    state.moreOpen = false;
    render();
    return;
  }
  if (currentPath() !== "/presentacion") return;
  if (event.key === "ArrowLeft") {
    state.slide -= 1;
    render();
  }
  if (event.key === "ArrowRight") {
    state.slide += 1;
    render();
  }
});

document.addEventListener("click", (event) => {
  if (!state.moreOpen) return;
  if (event.target.closest(".more-nav")) return;
  state.moreOpen = false;
  render();
});

render();
