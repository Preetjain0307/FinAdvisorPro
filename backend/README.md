# Backend Architecture

Since this project uses **Next.js**, the "Backend" is integrated directly into the Frontend application via **Server Actions** and **API Routes**.

## Where is the code?
You can find the backend logic in the `frontend` folder:
- **Server Actions:** `frontend/src/app/actions.ts` (and other `actions.ts` files).
- **Database Connection:** `frontend/src/lib/supabase`.
- **API Routes:** `frontend/src/app/api`.

This modern "Serverless" architecture means you don't need to run a separate backend server (like Express or Python). Everything runs together!
