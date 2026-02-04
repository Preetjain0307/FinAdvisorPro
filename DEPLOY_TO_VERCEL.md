# 🚀 How to Deploy Fin Advisor Pro to Vercel

Since we reorganized your project, deploying is slightly different but very easy. Follow these exact steps.

## Phase 1: Push to GitHub
Vercel needs your code to be on GitHub first.

1.  **Initialize Git** (If you haven't already):
    *   Open your terminal in `d:\FinAdvisorProTeam`.
    *   Run: `git init`
    *   Run: `git add .`
    *   Run: `git commit -m "Final V1 Build"`

2.  **Create a Repo on GitHub**:
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `fin-advisor-pro`.
    *   **Do NOT** check "Add README" or "Add .gitignore".
    *   Click **Create repository**.

3.  **Push Code**:
    *   Copy the commands GitHub gives you under "…or push an existing repository from the command line".
    *   Paste them into your VS Code terminal and press Enter.

## Phase 2: Deploy on Vercel
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  **Import** your `fin-advisor-pro` repository.

## Phase 3: ⚠️ CRITICAL CONFIGURATION ⚠️
**Do NOT click Deploy yet!** You must change one setting because we moved everything into the `frontend` folder.

1.  Look for **"Framework Preset"**. It should say `Next.js`.
2.  Look for **"Root Directory"**.
    *   Click **Edit**.
    *   Select `frontend`.
    *   Click **Continue**. **(This is the most important step!)**

## Phase 4: Environment Variables
Vercel needs your API keys to work.

1.  Click **"Environment Variables"** to expand it.
2.  Open your local `.env.local` file (inside `frontend/`).
3.  Copy and paste **ALL** the keys one by one.
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `ALPHA_VANTAGE_API_KEY`
    *   `TEXTBEE_API_KEY`
    *   `TEXTBEE_DEVICE_ID`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `NEXT_PUBLIC_SITE_URL` (Set this to your Vercel URL later, or just `https://your-project.vercel.app`)

## Phase 5: Launch! 🚀
1.  Click **Deploy**.
2.  Wait ~1 minute.
3.  🎉 **Success!** Your app is now live on the internet.

**Note on TextBee:**
Since TextBee runs on your phone, it will still work even when deployed! Just keep your phone connected to the internet.
