from .base import *
import environ

env = environ.Env()

DEBUG = False

SECRET_KEY = env("SECRET_KEY", default="django-insecure-prod-key-please-set-env-var-production-upb")

# Hosts permitidos (separados por coma en variable de entorno)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

# Base de datos en producción (PostgreSQL mediante DATABASE_URL)
DATABASES = {
    "default": env.db("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
}

# Configuración de Proxy SSL para Railway, Render y balanceadores
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=True)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=True)

# Orígenes confiables para CSRF (Django 4+ requiere protocolo https:// explícito)
CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=[
        "https://*.railway.app",
        "https://*.up.railway.app",
        "https://*.vercel.app",
    ]
)

# CORS para comunicación con el frontend
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "https://*.vercel.app",
    ]
)

# ISR Webhook hacia Vercel
FRONTEND_URL = env("FRONTEND_URL", default="")
REVALIDATE_SECRET = env("REVALIDATE_SECRET", default="")
