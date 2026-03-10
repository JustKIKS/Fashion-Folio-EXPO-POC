from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: int
    email: str
    password_hash: str
    username: str
    avatar: str | None
    created_at: str
