from typing import Optional

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, StrictBool

app = FastAPI(
    title="Task API",
    version="1.0",
    description="A tiny to-do list API with full CRUD on an in-memory list (no database).",
)

def seed_tasks() -> list:
    return [
        {"id": 1, "title": "Learn HTTP", "done": True},
        {"id": 2, "title": "Build a CRUD API", "done": False},
        {"id": 3, "title": "Push to GitHub", "done": False},
    ]


# In-memory "database": a plain list. It is wiped every time the server restarts.
tasks = seed_tasks()


class Task(BaseModel):
    id: int
    title: str
    done: bool


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


class Error(BaseModel):
    error: str


ERR_404 = {404: {"model": Error, "description": "No task with that id"}}
ERR_400 = {400: {"model": Error, "description": "Invalid request body"}}


def next_id() -> int:
    return max((t["id"] for t in tasks), default=0) + 1


def not_found(task_id: int) -> JSONResponse:
    return JSONResponse(status_code=404, content={"error": f"Task {task_id} not found"})


@app.get("/", summary="API info", tags=["meta"])
def root():
    """Describe the API."""
    return {"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]}


@app.get("/health", summary="Health check", tags=["meta"])
def health():
    """Check that the server is alive."""
    return {"status": "ok"}


@app.get("/tasks", summary="List all tasks", tags=["tasks"], response_model=list[Task])
def list_tasks(done: Optional[bool] = None, search: Optional[str] = None):
    """Return all tasks. Optional filters: `?done=true` and `?search=milk` (case-insensitive title match)."""
    result = tasks
    if done is not None:
        result = [t for t in result if t["done"] == done]
    if search:
        result = [t for t in result if search.lower() in t["title"].lower()]
    return result


@app.get("/tasks/{task_id}", summary="Get one task", tags=["tasks"], responses=ERR_404, response_model=Task)
def get_task(task_id: int):
    """Return one task by id, or 404 if it does not exist."""
    for task in tasks:
        if task["id"] == task_id:
            return task
    return not_found(task_id)


@app.post("/tasks", status_code=201, summary="Create a task", tags=["tasks"], responses=ERR_400, response_model=Task)
def create_task(body: TaskIn):
    """Create a task from {"title": "..."}. New tasks start with done=false."""
    if body.title is None or not body.title.strip():
        return bad_request("title is required and must be a non-empty string")
    task = {"id": next_id(), "title": body.title.strip(), "done": False}
    tasks.append(task)
    return task


@app.put("/tasks/{task_id}", summary="Update a task", tags=["tasks"], responses={**ERR_400, **ERR_404}, response_model=Task)
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


@app.delete("/tasks/{task_id}", status_code=204, summary="Delete a task", tags=["tasks"], responses=ERR_404)
def delete_task(task_id: int):
    """Delete a task. Returns 204 with an empty body, or 404 if unknown."""
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            del tasks[i]
            return Response(status_code=204)
    return not_found(task_id)


@app.get("/stats", summary="Task statistics", tags=["extras"])
def stats():
    """Count total, done and open tasks."""
    done = sum(1 for t in tasks if t["done"])
    return {"total": len(tasks), "done": done, "open": len(tasks) - done}


@app.post("/reset", summary="Restore the 3 example tasks", tags=["extras"])
def reset():
    """Replace all tasks with the original 3 examples (handy for demos)."""
    tasks[:] = seed_tasks()
    return {"status": "reset", "total": len(tasks)}


def custom_openapi():
    """FastAPI documents a 422 for bad input; this API returns 400 instead, so drop 422 from the docs."""
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title=app.title, version=app.version, description=app.description, routes=app.routes)
    for methods in schema["paths"].values():
        for op in methods.values():
            op["responses"].pop("422", None)
    schema.get("components", {}).get("schemas", {}).pop("HTTPValidationError", None)
    schema.get("components", {}).get("schemas", {}).pop("ValidationError", None)
    app.openapi_schema = schema
    return schema


app.openapi = custom_openapi
