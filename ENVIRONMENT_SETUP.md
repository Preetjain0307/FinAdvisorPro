# 📋 Environment Variables Setup

## Required API Keys

### Alpha Vantage (Live Market Data)

**To Get Your API Key:**

1. Go to: https://www.alphavantage.co/support/#api-key
2. Fill in your details (email, etc.)
3. Click "GET FREE API KEY"
4. Copy the API key provided

**Add to `.env.local`:**

```env
# Alpha Vantage API Key (for live stock prices)
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

**Note:** Free tier includes:
- 500 API calls per day
- 5 calls per minute
- Real-time and historical data

---

### Supabase (Already Configured)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## How to Add Environment Variables

1. **Create `.env.local`** file in project root (if it doesn't exist)
2. **Add the variables** as shown above
3. **Restart dev server** for changes to take effect:
   ```bash
   npm run dev
   ```

---

## Verifying Setup

After adding the API key, test it:

1. Run the app: `npm run dev`
2. Go to: `http://localhost:3000/api/market-data?symbol=AAPL`
3. You should see live price data for Apple stock

If you see an error about "API key not configured", double-check:
- File is named exactly `.env.local` (not `.env` or `env.local`)
- Variable name is exactly `ALPHA_VANTAGE_API_KEY`
- No quotes around the API key value
- Server was restarted after adding the variable

---

## Security Notes

- ✅ `.env.local` is already in `.gitignore` (won't be committed)
- ✅ Never share your API keys publicly
- ✅ Don't hardcode keys in your code
- ✅ For production, add keys to your hosting platform (Vercel, etc.)
