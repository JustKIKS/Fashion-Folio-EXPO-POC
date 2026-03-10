from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):    # ce que l'user envoie
    message: str


class ChatResponse(BaseModel):   # ce que l'API return
    message: str
    outfit: dict | None
    out_of_scope: bool
