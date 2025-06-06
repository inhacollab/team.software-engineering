from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os
from dotenv import load_dotenv
from .api import endpoints

load_dotenv()
app = FastAPI()

# Mount API routers
app.include_router(endpoints.router, prefix="/endpoints", tags=["endpoints"])

# Get base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Serve static files and templates
app.mount(
    "/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static"
)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


# Home route
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("user_form.html", {"request": request})


# For local development
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="localhost", port=10002, reload=True)
