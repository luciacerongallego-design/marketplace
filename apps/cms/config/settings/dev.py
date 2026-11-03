from .base import *

DEBUG = True
SECRET_KEY = "django-insecure-dev-marketplace-key-upb"
ALLOWED_HOSTS = ["*"]

try:
    from .local import *
except ImportError:
    pass
