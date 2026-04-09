# --- BASE STAGE ---
FROM python:3.13-slim AS base

# Forces Python output straight to the terminal
ENV PYTHONUNBUFFERED=1
# Prevents Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Put the virtual environment in a standard location
ENV UV_PROJECT_ENVIRONMENT="/opt/venv"
# Add the virtual environment's bin directory to PATH
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# --- DEV STAGE ---
FROM base AS development

# Install all dependencies
RUN uv sync

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# --- PROD STAGE ---
FROM base AS production

# Install only production dependencies
RUN uv sync --no-dev --no-install-project

# Copy the rest of the application code
COPY . .

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]
