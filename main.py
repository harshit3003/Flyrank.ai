from typing import Optional

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Task API", version="1.0")

# In-memory "database": a plain list. It is wiped every time the server restarts.
tasks = [
    {"id": 1, "title": "Learn HTTP", "done": True},
    {"id": 2, "title": "Build a CRUD API", "done": False},
    {"id": 3, "title": "Push to GitHub", "done": False},
]


class TaskIn(BaseModel):
    """Body for creating a task."""

    title: Optional[str] = None


def bad_request(message: str) -> JSONResponse:
    return JSONResponse(status_code=400, content={"error": message})


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    """Turn FastAPI's default 422 into the 400 + JSON error this API promises."""
    def where(loc) -> str:
        names = [str(x) for x in loc[1:] if not isinstance(x, int)]
        return ".".join(names) or "body"

    return bad_request(
        "Invalid request: " + "; ".join(f"{where(e['loc'])}: {e['msg']}" for e in exc.errors())
    )


def next_id() -> int:
    return max((t["id"] for t in tasks), default=0) + 1


def not_found(task_id: int) -> JSONResponse:
    return JSONResponse(status_code=404, content={"error": f"Task {task_id} not found"})


@app.get("/")
def root():
    """Describe the API."""
    return {"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]}


@app.get("/health")
def health():
    """Check that the server is alive."""
    return {"status": "ok"}


@app.get("/tasks")
def list_tasks():
    """Return all tasks."""
    return tasks


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    """Return one task by id, or 404 if it does not exist."""
    for task in tasks:
        if task["id"] == task_id:
            return task
    return not_found(task_id)


@app.post("/tasks", status_code=201)
def create_task(body: TaskIn):
    """Create a task from {"title": "..."}. New tasks start with done=false."""
    if body.title is None or not body.title.strip():
        return bad_request("title is required and must be a non-empty string")
    task = {"id": next_id(), "title": body.title.strip(), "done": False}
    tasks.append(task)
    return task
