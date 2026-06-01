Main Server (gateway)

This simple Express-based gateway validates requests using an HMAC signature and proxies them to two downstream services:

- /api/mf -> MF_URL (mutual funds service)
- /api/stocks -> STOCKS_URL (stocks service)

Environment variables (see .env.example):

- MAIN_PORT (default 4000)
- MF_URL (default http://localhost:3001)
- STOCKS_URL (default http://localhost:3000)
- MAIN_HMAC_SECRET (shared secret for HMAC)
- REDIS_URL (optional; enables Redis-backed rate limiting)
- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (optional; enable audit log storage)

Development:

1. Copy `.env.example` to `.env` and set MAIN_HMAC_SECRET.
2. Set REDIS_URL if you want shared rate limiting across gateway instances.
3. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to store audit logs in Supabase.
4. Install and run:

```powershell
cd main_server
npm install
npm run dev
```

HMAC protocol (simple):

- Client must send header `Authorization: HMAC <hex-signature>` and `X-Timestamp: <unix-seconds>`.
- Signature is HMAC-SHA256 over the string: `<timestamp>:<method>:<originalUrl>:<rawBody>` using `MAIN_HMAC_SECRET`.
