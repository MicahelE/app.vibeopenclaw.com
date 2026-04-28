from cryptography.fernet import Fernet
import base64
import hashlib
from config import get_settings

_settings = get_settings()

# Derive a 32-byte key from the configured encryption key
_key = base64.urlsafe_b64encode(
    hashlib.sha256(_settings.encryption_key.encode()).digest()
)
_fernet = Fernet(_key)

def encrypt(text: str) -> str:
    return _fernet.encrypt(text.encode()).decode()

def decrypt(token: str) -> str:
    return _fernet.decrypt(token.encode()).decode()
