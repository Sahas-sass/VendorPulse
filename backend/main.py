"""
VendorPulse - FastAPI Main Application Entrypoint
ModelX 2.0 | Team Nexio | IEEE CIS Student Chapter, IIT
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment configuration
load_dotenv()

from backend.app.api.endpoints import router as api_router

app = FastAPI(
    title="VendorPulse Early-Warning Intelligence API",
    version="2.0.0",
    description="Predictive multi-modal early-warning platform for hyper-local informal vendor liquidity shielding.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Vite development and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Core API routes
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "platform": "VendorPulse (ModelX 2.0)",
        "team": "Nexio (IEEE CIS Student Chapter, IIT & University of Moratuwa)",
        "author": "Sahas Abeygunarathne",
        "status": "Online",
        "api_documentation": "/docs",
        "core_endpoints": [
            "/api/health",
            "/api/zones",
            "/api/predictions",
            "/api/dispatch/authorize",
            "/api/dispatches",
            "/api/evaluation"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
