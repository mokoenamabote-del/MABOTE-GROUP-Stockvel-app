# Deployment preparation

This project supports a Render static frontend + Render backend setup, or a Vercel frontend + Render backend setup.

## 1) Frontend deploy (Render)

- Apply the `render.yaml` Blueprint in Render or sync the existing Blueprint.
- Render creates the `mabote-group-stockvel-app` static site from the repository root.
- The site builds with `npm ci && npm run build` and publishes `dist`.
- The frontend API URL is configured as `https://mabote-group-api.onrender.com`.
- To use the live site, add `mabote-group.co.za` and `www.mabote-group.co.za` under the static site's Custom Domains. Set the DNS records at the domain provider to the exact values Render displays.

## Alternative: Frontend deploy (Vercel)

- Import the repository into Vercel.
- Set the project root to the repository root.
- Set the build command to: `npm run build`
- Set the output directory to: `dist`
- Add environment variable:
  - `VITE_API_URL=https://your-render-backend-url.onrender.com`
- For the live site, connect the custom domain: `https://www.mabote-group.co.za`

## 2) Backend deploy (Render)

- Import the repository into Render.
- Choose the `backend` directory as the service root.
- Use the existing `render.yaml` file if available.
- Add environment variables:
  - `JWT_SECRET=<long-random-secret>`
  - `CORS_ORIGIN=https://mabote-group-stockvel-app.onrender.com,https://www.mabote-group.co.za,https://mabote-group.co.za,https://your-vercel-domain.vercel.app,http://localhost:5173`
  - `DATABASE_PATH=/var/data/mabote.sqlite`
  - `GOOGLE_SHEETS_ID=<optional>`
  - `GOOGLE_SHEETS_NAME=Sheet1`

## 3) Final checks

- Ensure the frontend points to the deployed backend URL via `VITE_API_URL`.
- Validate that the backend CORS allows the frontend domain.
- Test login, registration, and dashboard access from the deployed app.
- Confirm the database persists on Render using the mounted disk path.

## 4) Optional production polish

- Replace placeholder contact details if needed.
- Add real Google Sheets credentials if payment sync is required.
- Connect the live domain to your custom website URL.
