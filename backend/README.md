# Krittika's Portfolio Backend 🐶

Node.js + Express + MongoDB backend for my portfolio.

| Route | What it does |
| --- | --- |
| `GET /api/health` | Server and database status |
| `GET /api/stats` | `{ visits, pets }` |
| `POST /api/visit` | +1 visitor |
| `POST /api/simba/pet` | +1 Simba pet |
| `POST /api/contact` | Saves `{ name, email, message }` |

## Run on your computer
```bash
npm install
# copy .env.example → .env and paste your MongoDB Atlas link
npm run dev
```
Open http://localhost:5000/api/health → should show `"db":"connected"`.

## Deploy on Render (free)
1. Push this folder to a new GitHub repo: `portfolio-backend`
2. render.com → New → Web Service → pick the repo
3. Build command: `npm install` · Start command: `npm start`
4. Environment variables: `MONGODB_URI` and `ALLOWED_ORIGINS` (same as your .env)
5. Copy the `https://….onrender.com` link into `js/api.js` in the portfolio

Free Render servers sleep after 15 minutes without visitors, so the first request can take up to a minute.

## See your messages
MongoDB Atlas → Database → Browse Collections → `portfolio` → `messages`
