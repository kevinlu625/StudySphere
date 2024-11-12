from fastapi import APIRouter, HTTPException

function_router = APIRouter(
    prefix="/global",
    tags=["global"],
)