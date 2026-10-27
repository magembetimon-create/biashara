import ssl

import certifi
from django.core.mail.backends.smtp import EmailBackend as SMTPBackend


def email_ssl_context():
    return ssl.create_default_context(cafile=certifi.where())


class EmailBackend(SMTPBackend):
    """SMTP backend that uses certifi CAs (Windows Python often lacks a system bundle)."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('ssl_context', email_ssl_context())
        super().__init__(*args, **kwargs)
