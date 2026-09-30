# NexoTech

NexoTech es un sitio web estático para el trabajo universitario **Álbum Tecnológico Comparativo**. Incluye catálogo, fichas detalladas, búsqueda, filtros combinables, comparador, comparaciones educativas, guía de conceptos, fuentes y modo presentación.

## Requisitos

- Node.js 20 o superior.
- npm.
- Un navegador moderno.

## Comandos locales

```bash
npm install
npm run dev
npm run check:data
npm run build
npm run preview
```

En Windows PowerShell, si `npm` está bloqueado por la política de scripts, usa:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run check:data
npm.cmd run build
npm.cmd run preview
```

## Estructura principal

```text
nexotech-album/
├── public/
│   └── images/              Imágenes verificadas o marcadores visuales.
├── scripts/
│   └── check-data.js        Valida cantidades, tipos y campos obligatorios.
├── src/
│   ├── data/
│   │   ├── concepts.js      Guía de conceptos y comparaciones preparadas.
│   │   ├── products.js      Catálogo editable de productos.
│   │   └── siteMeta.js      Datos generales y campos académicos editables.
│   ├── main.js              Renderiza vistas, rutas, filtros y comparador.
│   └── styles.css           Diseño responsive de NexoTech.
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Cómo funciona

Los productos están en `src/data/products.js` como objetos JavaScript. `src/main.js` importa ese arreglo, lo filtra según la búsqueda o los selectores, y convierte cada producto en tarjetas del catálogo. Cuando se abre una ficha, la ruta `#/producto/id-del-producto` busca el producto por `id` y muestra sus características, precio, ventajas, limitaciones, uso recomendado y fuentes.

## Agregar o modificar productos

Para agregar un producto:

1. Abre `src/data/products.js`.
2. Copia una ficha `p({ ... })` de una categoría parecida.
3. Cambia `id`, `category`, `type`, `brand`, `model`, `range`, `description`, `specs`, `advantages`, `limitations`, `recommendedUse` y `sources`.
4. Mantén `specs` entre 4 y 6 características.
5. Ejecuta `npm.cmd run check:data`.

Para eliminar un producto, borra su bloque `p({ ... })` y revisa si la categoría queda incompleta. El proyecto espera 93 productos exactos.

Para corregir una característica, edita el arreglo `specs` dentro de la ficha:

```js
specs: [
  ["Procesador", "Dato corregido"],
  ["Memoria", "Dato corregido"],
]
```

## Precios y fuentes

Para cambiar un precio, edita el bloque `price` de la ficha en `src/data/products.js`.

Precio referencial:

```js
price: refPrice("4,999", "GTQ", "Guatemala", "Nombre de tienda", "https://enlace-real")
```

Precio pendiente:

```js
price: pendingPrice("Guatemala")
```

La fecha de consulta se controla con la constante `checked` al inicio de `src/data/products.js`. Si solo una ficha necesita otra fecha, puedes añadirla directamente dentro del objeto `price`.

Para agregar o corregir una fuente, edita `sources`:

```js
sources: [
  source("Fabricante - página oficial", "https://enlace-real"),
  source("Tienda - precio consultado", "https://enlace-real", "Precio local")
]
```

## Imágenes

Guarda imágenes verificadas en `public/images/`. Luego edita el bloque `image` del producto:

```js
image: {
  src: "./images/nombre-del-archivo.jpg",
  alt: "Foto del producto Marca Modelo",
  status: "verificada",
  credit: "Crédito o fuente de imagen",
}
```

Si no hay una imagen verificable, deja el marcador pendiente. No uses fotografías de otro modelo ni imágenes sin permiso claro.

## Datos académicos

Edita `src/data/siteMeta.js` para cambiar universidad, curso, docente, integrantes, carnés y fecha de entrega. Esos campos aparecen en la página de inicio.

## GitHub Pages

El proyecto usa rutas hash (`#/catalogo`) y `base: "./"` en `vite.config.js`, por lo que la compilación funciona dentro de una ruta de repositorio como `/nexotech-album/`.

Para publicar posteriormente, puedes usar una de estas opciones:

1. Compilar localmente con `npm run build` y publicar `dist/` con la configuración que prefieras.
2. Crear después un workflow de GitHub Actions que ejecute `npm ci`, `npm run check:data` y `npm run build`, y publique `dist/`.

## Subir cambios a GitHub

Cuando ya revises el proyecto local, los comandos habituales serían:

```bash
git status
git add .
git commit -m "Completar álbum tecnológico comparativo"
git push
```

No ejecutes `git push` hasta revisar los cambios.
