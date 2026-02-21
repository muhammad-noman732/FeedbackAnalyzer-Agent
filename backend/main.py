import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
from app.controllers import auth_controller, feedback_controller, analytics_controller

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(
    title="Feedback Analyzer API",
    description="AI-powered product feedback analyzer that converts customer reviews into actionable insights",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = traceback.format_exc()
    logger.error(f"Global exception caught:\n{error_msg}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "message": str(exc),
            "traceback": error_msg
            if logging.getLogger().getEffectiveLevel() <= logging.DEBUG
            else None,
        },
    )


app.include_router(auth_controller.router)
app.include_router(feedback_controller.router)
app.include_router(analytics_controller.router)


@app.get("/")
def root():
    return {
        "message": "Feedback Analyzer API is running",
        "status": "ok",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth/*",
            "analyze": "/analyze/*",
            "analytics": "/analytics/*",
        },
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
