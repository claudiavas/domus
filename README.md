# Domus

Plataforma inmobiliaria que conecta oferta, demanda y agentes.

- `backend/` — API Express + MongoDB (Railway: domus-backend)
- `frontend/` — React + Vite + Material UI (Railway: domus-frontend)

## Desarrollo

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Deploy (Railway, proyecto "domus")

```bash
cd backend && railway up --ci    # servicio domus-backend
cd frontend && railway up --ci   # servicio domus-frontend
```
