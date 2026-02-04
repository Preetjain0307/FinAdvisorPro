# 🖱️ Manual Deployment Guide (No Commands)

Since commands are failing, we will use a **Visual Tool** to do this. This is the standard "Manual" way to deploy professional apps.

## Step 1: Get the Tool
1.  Download **[GitHub Desktop](https://desktop.github.com/)** and install it.
2.  Open it and sign in with your GitHub account.

## Step 2: Upload Your Code (Visually)
1.  Open GitHub Desktop.
2.  Open your File Explorer to `D:\FinAdvisorProTeam`.
3.  **Drag and Drop** the `FinAdvisorProTeam` folder directly onto the GitHub Desktop window.
4.  It will say "This directory does not appear to be a Git repository. Would you like to create one?" -> Click **Create a Repository**.
5.  Click **Create Repository** button again (defaults are fine).
6.  Click **Publish repository** (Blue button at top).
    *   Name: `fin-advisor-pro`
    *   Uncheck "Keep this code private" (if you want it public) or keep it checked.
    *   Click **Publish Repository**.
7.  *Wait a moment... Your code is now sending to GitHub.*

## Step 3: Connect Vercel to GitHub
1.  Open your web browser and go to **[vercel.com/new](https://vercel.com/new)**.
2.  Under **"Import Git Repository"**, you should now see `fin-advisor-pro`.
    *   *If not, click "Adjust GitHub App Permissions" and select the new repo.*
3.  Click **Import**.

## Step 4: The Critical "Frontend" Setting
**STOP! Do not click Deploy yet.**

1.  Look for **Root Directory**.
2.  Click **Edit**.
3.  Select the `frontend` folder.
4.  Click **Continue**.

## Step 5: Add Keys & Deploy
1.  Click **Environment Variables**.
2.  Manually Copy-Paste your keys from `frontend/.env.local` file:
    *   `NEXT_PUBLIC_SUPABASE_URL` = (your value)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your value)
    *   etc...
3.  Click **Deploy**.

## 🎉 Done!
Watch the build logs. In 2 minutes, you will get a green **Congratulations!** screen with your website link.
