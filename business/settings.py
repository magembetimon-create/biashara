"""
Django settings for business project.
Imerekebishwa kwa ajili ya GCP Compute Engine na .env
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# 1. Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Pakia .env kutoka BASE_DIR
load_dotenv(BASE_DIR / '.env')

# 3. Security Settings
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key-bad-for-prod')

# Muhimu: Hakikisha DEBUG ni Boolean halisi (True/False)
DEBUG = os.getenv('DEBUG', 'False').strip().lower() in ('1', 'true', 'yes', 'on')

# Safisha ALLOWED_HOSTS ili kuondoa nafasi nyeupe (spaces)
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', '').split(',') if host]

CSRF_TRUSTED_ORIGINS = [
    'https://fanyabiashara.com',
    'http://fanyabiashara.com',
    'https://104.197.123.120',
    'http://104.197.123.120'
]

# 4. Application definition
INSTALLED_APPS = [
    'management.apps.ManagementConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'storages',  # Inahitajika kwa ajili ya GCP Storage
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Inapendekezwa kwa static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'business.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'business.wsgi.application'

# 5. Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# 6. Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 7. Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# 8. Static & Media Files (GCP vs Local)

if not DEBUG:
    # --- PRODUCTION (GCP BUCKET) ---
    GS_BUCKET_NAME = 'fbiashara'
    
    from google.oauth2 import service_account
    key_path = os.path.join(BASE_DIR, 'secrets', 'gcp-storage.json')
    if os.path.exists(key_path):
        GS_CREDENTIALS = service_account.Credentials.from_service_account_file(key_path)
    
    DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
    STATICFILES_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

    GS_MEDIA_LOCATION = 'media'
    GS_STATIC_LOCATION = 'static'

    MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/{GS_MEDIA_LOCATION}/'
    STATIC_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/{GS_STATIC_LOCATION}/'
    
    GS_QUERYSTRING_AUTH = False  # Muhimu ili kuruhusu ufikiaji bila token
    GS_DEFAULT_ACL = None       # Inategemea mipangilio ya bucket yako
else:
    # --- LOCAL DEVELOPMENT ---
    STATIC_URL = '/static/'
    STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 9. External Services
GCP_JSON_KEY_PATH = os.path.join(BASE_DIR, 'secrets', 'gcp-vision-key.json')
if os.path.exists(GCP_JSON_KEY_PATH):
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GCP_JSON_KEY_PATH

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'fanyabiasharaapp@gmail.com'
EMAIL_HOST_PASSWORD = 'whrzddczljnprbyy'

# Message Tags
from django.contrib.messages import constants as message_constants
MESSAGE_TAGS = {
    message_constants.DEBUG: 'debug',
    message_constants.INFO: 'info',
    message_constants.SUCCESS: 'success',
    message_constants.WARNING: 'warning',
    message_constants.ERROR: 'danger',
}