@echo off
echo Starting Oracle Backend & Frontend...
start "Oracle Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
start "Oracle Frontend" cmd /k "cd frontend && npm run dev"
echo Servers started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
