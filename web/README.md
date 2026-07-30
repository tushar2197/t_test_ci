# Signal (Next.js client)

Frontend for the Express JWT auth API in the parent folder.

## Run

1. Start the API on port 3000 from the repo root (`npm run dev`).
2. From this folder:

```bash
npm install
npm run dev
```

App: [http://localhost:3001](http://localhost:3001)

Configure the API base URL with `NEXT_PUBLIC_API_URL` (see `.env.example`).

## Screens

- `/` — branded entry
- `/login` — posts to `POST /api/auth/login`
- `/dashboard` — calls health, products, profile, orders, and the admin users route
