# SoccerDadHQ Directory Expansion (Scaffold)

This repository now includes a mobile-first scaffold for:
- Nationwide club directory
- Nationwide coach directory
- Club/coach submissions (pending review)
- Club/coach claims (pending/approved/rejected)
- Anonymous reviews with moderation queue
- Admin moderation interface
- Advertising placeholders
- Payment placeholder for yearly club claim fee

## Structure

- `backend/schema.sql` — normalized schema for clubs, coaches, claims, reviews, ads.
- `public/` — static app pages and shared JS/CSS.
- `data/seed.js` — starter in-memory data consumed by frontend.

## Run locally

Because this is framework-agnostic and static, open `public/index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8080 -d public
```

Then visit `http://localhost:8080`.
