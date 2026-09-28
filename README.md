# NexoTech

Sitio web estático de tecnología. Incluye catálogo, fichas detalladas, filtros, búsqueda, comparador de dos productos del mismo tipo, análisis breves, guía de conceptos, fuentes y modo presentación.

## Comandos

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

- `src/data/products.js`: fichas del catálogo. Aquí se editan productos, precios, fuentes, características e imágenes.
- `src/data/concepts.js`: guía de conceptos y análisis breves.
- `src/data/siteMeta.js`: título, lema, datos opcionales, avisos de precios e imágenes.
- `src/main.js`: construye las pantallas a partir de los datos.
- `src/styles.css`: diseño visual responsive.
- `public/images/product-placeholder.svg`: marcador usado cuando no hay fotografía con permiso verificado.
- `scripts/check-data.js`: valida cantidades, campos obligatorios y número de características.

## Editar datos opcionales

Abre `src/data/siteMeta.js` y cambia estos campos si más adelante quieres mostrarlos en alguna sección:

```js
academicFields: {
  universidad: "EDITAR: Nombre de la universidad",
  curso: "EDITAR: Nombre del curso",
  integrantes: "EDITAR: Integrante 1, Integrante 2, Integrante 3",
  fechaEntrega: "EDITAR: Fecha de entrega",
}
```

## Añadir o corregir un producto

1. Abre `src/data/products.js`.
2. Copia una ficha `p({ ... })` de la misma categoría o tipo.
3. Cambia `id`, `category`, `type`, `brand`, `model`, `description`, `specs`, `advantages`, `limitations`, `recommendedUse` y `sources`.
4. Mantén `specs` entre 4 y 6 filas.
5. Ejecuta `npm.cmd run check:data` para confirmar que no se rompen cantidades o campos.

## Cambiar precio o fuente

En la ficha, edita el bloque `price`.

Para precio referencial:

```js
price: refPrice("3,499", "GTQ", "Guatemala", "Nombre de tienda", "https://enlace-a-la-fuente")
```

Para dato pendiente:

```js
price: pendingPrice("Guatemala")
```

Agrega siempre la fuente también en `sources`.

## Cambiar imagen

Guarda la imagen permitida dentro de `public/images/`, idealmente optimizada en `.webp` o `.jpg`. Luego reemplaza el bloque `image` de la ficha:

```js
image: {
  src: "./images/nombre-del-archivo.webp",
  alt: "Foto del producto Marca Modelo",
  status: "verificada",
  credit: "Crédito o licencia de la imagen",
}
```

No uses fotografías sin permiso claro de reutilización.

## Publicar en GitHub Pages

1. Crea un repositorio en tu cuenta de GitHub.
2. En esta carpeta ejecuta:

```bash
git init
git add .
git commit -m "Crear NexoTech"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

3. En GitHub entra a `Settings > Pages`.
4. En `Build and deployment`, elige `GitHub Actions`.
5. El proyecto ya incluye `.github/workflows/deploy.yml`. Cuando hagas `push` a `main`, GitHub ejecutará `npm ci`, `npm run check:data`, `npm run build` y publicará `dist/`.

El proyecto usa `base: "./"` y rutas con hash (`#/catalogo`), por eso funciona aunque GitHub Pages lo sirva bajo `https://usuario.github.io/repositorio/`.

## Verificación local sugerida

```powershell
npm.cmd run check:data
npm.cmd run build
npm.cmd run preview
```

Después abre la URL que muestre Vite y revisa catálogo, filtros, fichas, comparador, presentación y vista móvil.
