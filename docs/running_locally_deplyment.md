# Running Locally For Development & Deployment Guide

## Backend 

Perform all cli commands in root dir in terminal i.e aix:

-  Rename `.env.example` to `.env`, add Environment Variables & Ensure you have docker installed and running.

### 1. To Run Fast Server:

Ensure your have poetry installed `pip install poetry` and then in terminal run:

```
docker compose -f docker-compose-dev.yml up
```

Now Visit

- http:localhost:8000
- http:localhost:8000/docs

Any changes in backend code are reflected live as reloading is enabled.

### 2. After making any changes to database run migrations

```
docker compose -f docker-compose-dev.yml exec fastapi_server alembic revision --autogenerate

docker compose -f docker-compose-dev.yml exec fastapi_server alembic upgrade head
```

### 3. Google Run Deployment

1. In core > config.py update the MODE to production and ensure you have added ASYNC_DATABASE_URI in .env

- Build

`docker buildx build --platform linux/amd64 --no-cache -t mjunaidca/aix_fastapi_server:latest -f backend/Dockerfileprod .`

- Run Locally for Testing

`docker run --env-file .env -d --name aix -p 8000:8000  mjunaidca/aix_fastapi_server:latest  `

- Push to DockerHub & Deploy on Google Run

`docker push mjunaidca/aix_fastapi_server:latest`

## Frontend

Go to frontend dir. i.e: cd frontend

### Running Locally

-  Rename `.env.example` to `.env`, add Environment Variables

- Run pnpm install

- Run pnpm dev

### Deploy to Vercel

The easiest way is Deploy to vercel or else you dockarize the frontend and deploy to cloud of your choice.

