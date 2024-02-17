from passlib.hash import sha256_crypt

def hash_password(password: str) -> sha256_crypt:
    return sha256_crypt.using(rounds=5000).hash(password)

def verify_hash(password: str, hashed: sha256_crypt) -> bool:
    return sha256_crypt.verify(password, hashed)