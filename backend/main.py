"""
Oracle: The Autonomous Gamified Learning Planner - FastAPI Application Server
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes import auth, campaigns, calendar, diagnostic, gamification, remedial, simulation
from store import store

app = FastAPI(
    title="Oracle: Autonomous Gamified Learning Planner",
    description="Full-stack autonomous agent engine with closed-loop diagnostic replanning and LifeRPG gamification.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router)
app.include_router(campaigns.router)
app.include_router(calendar.router)
app.include_router(diagnostic.router)
app.include_router(gamification.router)
app.include_router(remedial.router)
app.include_router(simulation.router)

@app.get("/api/health")
def health():
    return {"status": "healthy"}

# Serve frontend build static files & SPA fallback for Combined URL
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or swagger documentation
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            return None
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
