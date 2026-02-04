# 🚀 Easiest Way to Deploy (No Git Required)

Since you don't have Git installed, we will use the **Vercel Direct Uploader**. It's much simpler!

## Step 1: Open Terminal in the Right Folder
Make sure your terminal is inside the `frontend` folder.
Run this command:
```bash
cd frontend
```

## Step 2: Login to Vercel
Run this command to connect your computer to Vercel:
```bash
npx -y vercel login
```
1.  It will ask **"Log in to Vercel"**.
2.  Use your arrow keys to select **"Continue with GitHub"** (or Email).
3.  It will open your web browser. **Click "Login"** in the browser.
4.  Once it says "Success", go back to your terminal.

## Step 3: Configure Your Project
Now we tell Vercel about your app. Run:
```bash
npx -y vercel link
```
*   **Set up “frontend”?** → Press **Enter** (Yes)
*   **Which scope?** → Press **Enter** (your name)
*   **Link to existing project?** → Type **N** (No) then **Enter**.
*   **Project Name?** → Press **Enter** (defaults to `frontend`) or type `fin-advisor-pro`.
*   **In which directory is your code located?** → Press **Enter** (defaults to `.`)

## Step 4: Add Your Secrets (API Keys)
Vercel needs your keys.
1.  Run this command: 
    ```bash
    npx -y vercel env pull .env.local
    ```
    *(This ensures Vercel knows about your local keys)*

    **OR (Better Way):**
    Go to your [Vercel Dashboard](https://vercel.com/dashboard) in your browser:
    1.  Click on your new project `fin-advisor-pro`.
    2.  Go to **Settings** -> **Environment Variables**.
    3.  Copy-Paste the contents of your `.env.local` file here.

## Step 5: DEPLOY! 🚀
Run this magic command:
```bash
npx -y vercel --prod
```
*   It will upload your code.
*   It will build your site.
*   **Wait about 1-2 minutes.**
*   It will give you a **Production** URL (e.g., `https://fin-advisor-pro-tau.vercel.app`).

**That's it! Click the link and share it.** 🎉
