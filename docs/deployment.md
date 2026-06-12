# AFRIKA Deployment

## Hosting Split

- Web app: Vercel at `afrika.ng` and `www.afrika.ng`
- Admin app: Vercel at `admin.afrika.ng`
- API service: dedicated server
- AI service: dedicated server
- Ingestion service: dedicated server or worker host, usually private/internal

## Environment Variables

Use the root `.env.example` as the source of truth.

Important values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AI_URL`
- `NEXT_PUBLIC_INGESTION_URL`
- `WEB_APP_URL`
- `ADMIN_APP_URL`
- `ALLOWED_ORIGINS`

## Server Requirements

- enable CORS for `https://afrika.ng`, `https://www.afrika.ng`, and `https://admin.afrika.ng`
- expose HTTPS public endpoints
- keep service origins stable for frontend config

## Vercel Requirements

- set production and preview environment variables
- point web and admin deployments at the public server URLs
