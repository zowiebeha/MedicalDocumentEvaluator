# Cloudflare Worker Deployment Instructions

## Prerequisites
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`
3. Set up your Gemini API key as a secret

## Deployment Steps

### 1. Set up the Gemini API Key
```bash
wrangler secret put GEMINI_API_KEY
```
When prompted, enter your Gemini API key: `AIzaSyCGbhBAkpaMbcCzHDMQ3Ds5teSG4PXLTw4`

### 2. Deploy the Worker
```bash
wrangler deploy
```

### 3. Test the Deployment
After deployment, you can test the API endpoint:
```bash
curl -X POST https://mde-prod.your-subdomain.workers.dev/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test healthcare claim", "mlaCitations": false}'
```

## File Structure
- `worker.js` - Main Cloudflare Worker entry point with event handlers
- `wrangler.toml` - Cloudflare Worker configuration
- `src/App.js` - Updated React app that calls the worker API

## How It Works
1. The Cloudflare Worker handles all requests
2. API calls to `/api/analyze` are processed by the worker using Gemini API
3. All other requests serve the React app
4. The React app makes API calls to the worker instead of directly to Gemini

## Troubleshooting
- If you get "no registered event handlers" error, make sure `worker.js` is the main file in `wrangler.toml`
- If API calls fail, check that the `GEMINI_API_KEY` secret is set correctly
- Check the Cloudflare Worker logs in the dashboard for debugging
