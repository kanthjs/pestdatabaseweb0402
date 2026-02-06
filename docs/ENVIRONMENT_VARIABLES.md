# Environment Variables

This project uses the following environment variables. Copy this file to `.env.local` and fill in your values.

## Required Variables

### Database
```
DATABASE_URL="postgresql://username:password@localhost:5432/pestdatabase"
```
PostgreSQL connection string for Prisma.

### Supabase Auth
```
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```
Get these from your Supabase project settings.

## Optional Variables

### Security
```
ALLOWED_ORIGIN="https://yourdomain.com"
```
CORS allowed origin for API routes. Defaults to "*" in development.

### Rate Limiting (Future)
```
REDIS_URL="redis://localhost:6379"
```
For distributed rate limiting in production.

## Development

Create `.env.local`:
```bash
cp .env.example .env.local
```

Never commit `.env.local` to git - it's already in `.gitignore`.

## Production

In production (Vercel, Railway, etc.), set these via the platform's dashboard rather than `.env` files.

## Verification

Test your setup:
```bash
npm run dev
# Check if database connects without errors
```
