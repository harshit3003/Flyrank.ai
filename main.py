from typing import Optional

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, StrictBool

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


class TaskUpdate(BaseModel):
    """Body for updating a task: send title, done, or both."""

    title: Optional[str] = None
    done: Optional[StrictBool] = None


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


@app.put("/tasks/{task_id}")
def update_task(task_id: int, body: TaskUpdate):
    """Update a task's title and/or done flag. 404 if unknown, 400 if the body is empty or invalid."""
    task = next((t for t in tasks if t["id"] == task_id), None)
    if task is None:
        return not_found(task_id)
    if body.title is None and body.done is None:
        return bad_request("send at least one of: title (non-empty string), done (true/false)")
    if body.title is not None:
        if not body.title.strip():
            return bad_request("title must be a non-empty string")
        task["title"] = body.title.strip()
    if body.done is not None:
        task["done"] = body.done
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    """Delete a task. Returns 204 with an empty body, or 404 if unknown."""
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            del tasks[i]
            return Response(status_code=204)
    return not_found(task_id)
