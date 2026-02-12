# Fix Bug Plan: Production Image Loading (Mixed Content)

## Problem

Pest images are linked to external HTTP sources (e.g., `http://www.knowledgebank.irri.org/`). Modern browsers block "Mixed Content" (loading HTTP resources on an HTTPS site), causing images to fail in production (Vercel/HTTPS).

## Proposed Solution

Download all external images and serve them locally from `public/images/`.

## Steps

1. **Create Directories**:
    - `public/images/pests/`
    - `public/images/plants/`
2. **Download Images**:
    - Manually download or script download images from URLs in `prisma/seed.ts`.
    - Save with consistent filenames (e.g., `golden-apple-snail.jpg`).
3. **Update `prisma/seed.ts`**:
    - Change `imageUrl` to local paths (e.g., `/images/pests/golden-apple-snail.jpg`).
4. **Database Update**:
    - Run `npx prisma db seed` to update existing records.

## Verification

- Run `npm run dev`.
- Check Network tab for successful 200 OK responses on images.
- Deploy and verify on HTTPS production URL.
