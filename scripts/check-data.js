import { products } from "../src/data/products.js";

const expected = {
  "Computadoras de escritorio": 9,
  Laptops: 9,
  Celulares: 9,
  Tablets: 3,
  Almacenamiento: 12,
  "Componentes internos": 12,
  Periféricos: 21,
  "Otros equipos": 9,
  Consolas: 3,
  "Placas de desarrollo": 6,
};

const expectedTypes = {
  "Escritorio gama alta": 3,
  "Escritorio gama media": 3,
  "Escritorio gama baja": 3,
  "Laptop gama alta": 3,
  "Laptop gama media": 3,
  "Laptop gama baja": 3,
  "Celular gama alta": 3,
  "Celular gama media": 3,
  "Celular gama baja": 3,
  "SSD SATA": 3,
  "SSD NVMe": 3,
  HDD: 3,
  "Unidad externa": 3,
  "Memoria RAM": 3,
  "CPU o microprocesador": 3,
  "GPU o tarjeta gráfica": 3,
  "Tarjeta madre": 3,
  Teclado: 3,
  Mouse: 3,
  "Monitor o pantalla": 3,
  Impresora: 3,
  Micrófono: 3,
  "Bocinas o altavoces": 3,
  Auriculares: 3,
  Smartwatch: 3,
  "Silla gamer": 3,
  Plotter: 3,
  Consola: 3,
  "Raspberry Pi": 3,
  Arduino: 3,
};

const errors = [];
const ids = new Set();

for (const product of products) {
  if (ids.has(product.id)) errors.push(`ID duplicado: ${product.id}`);
  ids.add(product.id);

  for (const field of ["category", "type", "brand", "model", "description", "recommendedUse"]) {
    if (!product[field]) errors.push(`${product.id}: falta ${field}`);
  }
  if (!Array.isArray(product.specs) || product.specs.length < 4 || product.specs.length > 14) {
    errors.push(`${product.id}: debe tener entre 4 y 14 características`);
  }
  if (!Array.isArray(product.advantages) || !product.advantages.length) errors.push(`${product.id}: faltan ventajas`);
  if (!Array.isArray(product.limitations) || !product.limitations.length) errors.push(`${product.id}: faltan limitaciones`);
  if (!Array.isArray(product.sources) || !product.sources.length) errors.push(`${product.id}: faltan fuentes`);
}

for (const [category, count] of Object.entries(expected)) {
  const actual = products.filter((product) => product.category === category).length;
  if (actual !== count) errors.push(`${category}: esperado ${count}, encontrado ${actual}`);
}

for (const [type, count] of Object.entries(expectedTypes)) {
  const actual = products.filter((product) => product.type === type).length;
  if (actual !== count) errors.push(`${type}: esperado ${count}, encontrado ${actual}`);
}

const summary = Object.fromEntries(
  Object.keys(expected).map((category) => [category, products.filter((product) => product.category === category).length])
);

const typeSummary = Object.fromEntries(
  Object.keys(expectedTypes).map((type) => [type, products.filter((product) => product.type === type).length])
);

console.log(JSON.stringify({ total: products.length, summary, typeSummary }, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
