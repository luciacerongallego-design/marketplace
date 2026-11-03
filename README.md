# PRODUCTO COMERCIAL — Marketplace UPB

Plataforma web de tipo marketplace para la asignatura **Producto Comercial** de la Universidad Pontificia Bolivariana. Reúne las marcas de vestuario y diseño de los estudiantes en un único espacio digital editorial y contemporáneo.

---

## Estructura del Proyecto

```
marketplace/
├── apps/
│   ├── cms/          ← Django 5.2 + Wagtail 7.4 (CMS headless)
│   └── web/          ← Next.js 15 + Tailwind CSS 3 (Frontend)
├── .gitignore
└── README.md
```

---

## Arranque Rápido en Local

### 1. Prerequisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 22 LTS o superior |
| Python | 3.12 o superior |
| Git | 2.40+ |

---

### 2. CMS (Django + Wagtail)

```powershell
# Desde la raíz del proyecto:
cd apps/cms

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate       # Windows PowerShell
# source .venv/bin/activate  # macOS / Linux

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones y crear base de datos SQLite
python manage.py migrate

# Crear estructura inicial de páginas
python manage.py seed_marketplace

# Crear superusuario administrador
python manage.py createsuperuser
# → elige usuario, email y contraseña

# Iniciar servidor del CMS
python manage.py runserver 8000
```

- **Panel de administración Wagtail:** http://localhost:8000/admin/
- **API de páginas:** http://localhost:8000/api/v2/pages/
- **API de categorías:** http://localhost:8000/api/v2/categories/

---

### 3. Frontend (Next.js)

```powershell
# En otra terminal, desde la raíz del proyecto:
cd apps/web

# Copiar variables de entorno
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # macOS / Linux

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

- **Sitio web:** http://localhost:3000
- **Directorio de marcas:** http://localhost:3000/marcas
- **Catálogo general:** http://localhost:3000/productos

> **Nota:** Si el CMS no está corriendo, el frontend carga automáticamente datos de demostración (mock) para que puedas ver la interfaz funcionando.

---

## Variables de Entorno

### `apps/web/.env.local`

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del frontend | `http://localhost:3000` |
| `CMS_API_URL` | URL base del CMS Wagtail | `http://localhost:8000` |
| `REVALIDATE_SECRET` | Secreto compartido para ISR | *(generar propio en producción)* |

### `apps/cms/.env` (crear a mano en producción)

| Variable | Descripción |
|---|---|
| `SECRET_KEY` | Clave secreta de Django (generar con `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`) |
| `DEBUG` | `True` en dev, `False` en producción |
| `ALLOWED_HOSTS` | Hosts permitidos (e.g. `tudominio.com,localhost`) |
| `DATABASE_URL` | URL de base de datos (SQLite local o Postgres en producción) |
| `FRONTEND_URL` | URL del frontend para el webhook ISR |
| `REVALIDATE_SECRET` | Mismo secreto que en el frontend |

---

## Administración de Contenido en Wagtail

### Estructura de páginas

```
Raíz
└── Producto Comercial (HomePage)
    ├── 134340 (BrandPage)
    │   ├── Blusa Hydra (ProductPage)
    │   ├── Falda Orion (ProductPage)
    │   └── ...
    ├── ALDA (BrandPage)
    │   └── ...
    └── NUEVA MARCA (BrandPage)
        └── ...
```

### Cómo agregar una nueva marca

1. Ingresar al panel: http://localhost:8000/admin/
2. **Páginas → Producto Comercial → Añadir página hijo → Marca**
3. Rellenar: nombre, slug, descripción, banners, logos, Instagram, revista, fichas técnicas
4. Publicar → la página `/marcas/[slug]` se genera automáticamente

### Cómo agregar un producto

1. **Páginas → [Marca] → Añadir página hijo → Producto / Prenda**
2. Rellenar: nombre, categoría, precio, descripción, foto sobre modelo, foto flotante, galería adicional
3. Publicar → aparece en `/productos` y en `/marcas/[slug]` automáticamente

### Cómo crear una nueva categoría

1. **Snippets → Categorías de productos → Añadir**
2. Escribir nombre y slug
3. Guardar → disponible en el filtro del catálogo inmediatamente

---

## Rutas del Frontend

| Ruta | Descripción |
|---|---|
| `/` | Home con slider, presentación editorial y marcas destacadas |
| `/marcas` | Directorio de todas las marcas participantes |
| `/marcas/[slug]` | Página individual de cada marca (banner, identidad, catálogo) |
| `/productos` | Catálogo general con filtros interactivos |
| `/productos/[slug]` | Página de detalle de producto con galería y carrito |

---

## Sistema ISR (Actualización Automática)

Cuando publicas o modificas contenido en Wagtail:

1. Wagtail envía un webhook firmado con HMAC-SHA256 a `/api/revalidate`
2. Next.js invalida las etiquetas de caché correspondientes (`brands`, `products`, etc.)
3. La próxima visita regenera la página estática con el contenido actualizado

Como red de seguridad, **todas las páginas se regeneran cada hora** aunque el webhook no llegue.

---

## Carrito Demostrativo

El carrito es **solo ilustrativo** — no hay integración de pagos real.

- Persiste entre recargas usando `localStorage`
- Permite agregar, eliminar y modificar cantidades
- Calcula un subtotal estimado en COP
- Muestra un banner aclaratorio de propósito académico

---

## Despliegue en Producción

| Capa | Servicio recomendado |
|---|---|
| Frontend Next.js | **Vercel** |
| CMS Django/Wagtail | **Railway** o cualquier servicio con Python |
| Base de datos | **PostgreSQL** (Railway, Supabase, Neon) |
| Imágenes / Media | **Cloudflare R2** o **AWS S3** (con `django-storages`) |

Para Postgres, agregar en `requirements.txt`:
```
psycopg[binary]>=3.1
```

---

## Créditos

Proyecto académico — Asignatura **Producto Comercial**  
Facultad de Diseño de Vestuario · Universidad Pontificia Bolivariana  
Medellín, Colombia
