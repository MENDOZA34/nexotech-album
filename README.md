# NexoTech

NexoTech es una web estática con Vite y JavaScript para explorar, entender y comparar tecnología. Incluye catálogo, fichas detalladas, búsqueda, filtros combinables, comparador, análisis, guía de conceptos, fuentes, modo presentación y una lista local de productos guardados.

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
│   └── images/              Fotografías enlazadas y marcador visual.
├── scripts/
│   └── check-data.js        Valida cantidades, tipos y campos obligatorios.
├── src/
│   ├── data/
│   │   ├── concepts.js      Guía de conceptos y análisis.
│   │   ├── products.js      Catálogo editable de productos.
│   │   └── siteMeta.js      Nombre, lema y avisos generales.
│   ├── main.js              Renderiza rutas, navegación, filtros, listas y comparador.
│   └── styles.css           Diseño responsive de NexoTech.
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Navegación

La cabecera muestra seis accesos principales:

- Inicio
- Productos
- PCs
- Listas
- Marcas
- Más

El menú Más contiene Comparador, Análisis, Guía, Fuentes y Presentación. Funciona con clic, toque, teclado, Escape y cierre al pulsar fuera.

## Cómo funciona el catálogo

Los productos están en `src/data/products.js` como objetos JavaScript. `src/main.js` importa ese arreglo, aplica búsqueda y filtros, agrupa resultados por categoría y genera tarjetas, fichas, fuentes y comparaciones.

El catálogo completo se abre en `#/catalogo`. La vista `#/pcs` reutiliza el catálogo filtrado por computadoras de escritorio e incluye accesos a Escritorio y Laptops. La vista `#/marcas` genera las marcas reales desde el catálogo y enlaza a `#/catalogo?marca=...`.

## Listas

La sección `#/listas` guarda favoritos en `localStorage` usando solo identificadores de producto. Si un identificador ya no existe, se ignora. Desde Listas se pueden comparar dos productos guardados cuando pertenecen al mismo tipo.

## Agregar o modificar productos

1. Abre `src/data/products.js`.
2. Copia una ficha `p({ ... })` de una categoría parecida.
3. Cambia `id`, `category`, `type`, `brand`, `model`, `range`, `description`, `specs`, `advantages`, `limitations`, `recommendedUse` y `sources`.
4. Mantén `specs` entre 4 y 6 características.
5. Ejecuta `npm.cmd run check:data`.

El proyecto espera 93 productos exactos.

## Precios y fuentes

Para cambiar un precio, edita el bloque `price` de la ficha.

```js
price: refPrice("4,999", "GTQ", "Guatemala", "Nombre de tienda", "https://enlace-real")
price: pendingPrice("Guatemala")
```

La fecha de consulta se controla con la constante `checked` al inicio de `src/data/products.js`. Agrega fuentes reales en `sources`; no inventes enlaces, precios ni especificaciones.

## Imágenes

Las imágenes se guardan en `public/images/`. El campo `image.status` distingue:

- `verificada`: foto con fuente y permiso documentado.
- `enlazada pendiente de permiso`: foto local enlazada, pero con permiso/fuente pendiente.
- `pendiente de verificación`: se muestra el visual por categoría, no una fotografía del producto.

No uses fotografías de otro modelo ni imágenes generadas como si fueran fotos reales.

## GitHub Pages

El proyecto usa rutas hash (`#/catalogo`) y `base: "./"` en `vite.config.js`, por lo que la compilación funciona dentro de una ruta de repositorio como `/nexotech-album/`.

No ejecutes `git push` hasta revisar los cambios.
