from fastapi import APIRouter
from .function_router import function_router
router = APIRouter(responses={404: {"description": "Not found"}})

router.include_router(function_router)

@function_router.post("/hello-world/")
async def query_model_action(request_data: dict):
    pass