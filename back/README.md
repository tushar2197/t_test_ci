# testing-aws-auth

Express JWT API with dummy users, plus a Next.js client in `web/` that consumes it.

## Projects

| App | Path | Port | Command |
| --- | --- | --- | --- |
| API | repo root | `3000` | `npm run dev` |
| Web | `web/` | `3001` | `npm run dev:web` |

Run both in separate terminals.

## API setup

```bash
npm install
cp .env.example .env   # a .env with a random JWT_SECRET is already generated
npm run dev
```

### Dummy users

Both accounts share the password `Passw0rd!`.

| Email | Role |
| --- | --- |
| `admin@example.com` | admin |
| `user@example.com` | user |

### Routes

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/public/health` | none |
| `GET` | `/api/public/info` | none |
| `GET` | `/api/public/products` | none |
| `POST` | `/api/auth/login` | none |
| `GET` | `/api/auth/me` | token |
| `POST` | `/api/auth/logout` | token |
| `GET` | `/api/protected/profile` | token |
| `GET` / `POST` | `/api/protected/orders` | token |
| `GET` | `/api/protected/admin/users` | admin |
| `DELETE` | `/api/protected/admin/users/:id` | admin |

`npm run smoke` asserts the API status codes without needing the web app.

## Next.js client

```bash
cd web
npm install
cp .env.example .env.local   # already points at http://localhost:3000
npm run dev
```

Or from the repo root: `npm run dev:web`.

Open [http://localhost:3001](http://localhost:3001). Sign in with a dummy user to exercise public, protected, and admin routes from the dashboard.

`NEXT_PUBLIC_API_URL` in `web/.env.local` must match the Express origin.

## Notes before deploying

- Set a real `JWT_SECRET` in the API environment.
- CORS is open in `src/app.js` for local testing.
- The web app stores the JWT in `localStorage` for demo convenience only.
