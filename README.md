# KyyDL - All Downloader & Scraper

Anime Dark Mode Cyberpunk themed all-in-one media downloader and scraper web app.

## Project Structure

```
kyydl/
├── backend/          # Express API (Railway)
│   ├── server.js     # Main server file
│   ├── package.json
│   └── .env.example
│
└── frontend/         # React App (Vercel)
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── index.css
    │   ├── lib/api.ts       # API client
    │   ├── components/      # UI components
    │   ├── sections/        # Page sections
    │   └── pages/           # Route pages
    ├── public/mascot.png
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## Features

### Downloader (17+ Platforms)
- YouTube, TikTok, Instagram, Facebook, Twitter/X
- Reddit, SoundCloud, Bilibili, Dailymotion
- Pinterest, Vimeo, Twitch, Spotify
- GitHub, Bandcamp, Rumble, Streamable

### Scraper
- YouTube video search
- GitHub repository search
- Wikipedia article search
- Pinterest pin download

### Tools
- URL Shortener
- QR Code Generator
- Website Screenshot
- Text Translator

## Deployment Guide

### Backend to Railway

1. **Push backend folder to GitHub:**
```bash
cd backend
git init
git add .
git commit -m "KyyDL backend"
git remote add origin https://github.com/YOUR_USERNAME/kyydl-backend.git
git push -u origin main
```

2. **Connect to Railway:**
- Go to [railway.app](https://railway.app)
- Click "New Project" > "Deploy from GitHub repo"
- Select your `kyydl-backend` repo
- Railway auto-detects Node.js
- Go to Settings > Generate Domain
- Copy your backend URL (e.g., `https://kyydl-api.up.railway.app`)

### Frontend to Vercel

1. **Push frontend folder to GitHub:**
```bash
cd frontend
git init
git add .
git commit -m "KyyDL frontend"
git remote add origin https://github.com/YOUR_USERNAME/kyydl-frontend.git
git push -u origin main
```

2. **Deploy to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project" > Import Git Repository
- Select your `kyydl-frontend` repo
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - Key: `VITE_API_URL`
  - Value: `https://your-backend.up.railway.app` (from Railway)
- Click "Deploy"

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/info?url=URL` | Get video info |
| GET | `/api/download?url=URL&format=mp4` | Get download link |
| GET | `/api/search/youtube?q=QUERY` | YouTube search |
| GET | `/api/search/github?q=QUERY` | GitHub repo search |
| GET | `/api/search/wiki?q=QUERY` | Wikipedia search |
| GET | `/api/tools/shorturl?url=URL` | Shorten URL |
| GET | `/api/tools/screenshot?url=URL` | Website screenshot |
| GET | `/api/tools/translate?text=TEXT&to=LANG` | Translate text |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, react-icons, sonner
- **Backend:** Node.js 20, Express, Axios, Cheerio, CORS
- **APIs:** Cobalt API, Y2Mate, SSSTik, Invidious, GitHub API, Wikipedia API, MyMemory Translate

## License

MIT
