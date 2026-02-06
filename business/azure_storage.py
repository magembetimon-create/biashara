import os
from storages.backends.azure_storage import AzureStorage

AZURE_ACCOUNT_KEY1='6Yy2WwCSORV3m3twcW3uMr/Uei+sjIP0egWW+EWIZ5kPF/PyY+WyhlQ5dxdNzz6ubdfcGS4x8tVK+AStRwDvVA=='


class AzureMediaStorage(AzureStorage):
    account_name = 'fanyabiashara'
    account_key = AZURE_ACCOUNT_KEY1
    azure_container = 'media'
    expiration_secs = None


class AzureStaticStorage(AzureStorage):
    account_name = 'fanyabiashara'
    account_key = AZURE_ACCOUNT_KEY1
    azure_container = 'static'
    expiration_secs = None