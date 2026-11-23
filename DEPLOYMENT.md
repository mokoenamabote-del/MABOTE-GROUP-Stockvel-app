# Deployment preparation

This project supports a Render static frontend + Render backend setup, or a Vercel frontend + Render backend setup.

## 1) Frontend deploy (Render)

- Apply the `render.yaml` Blueprint in Render or sync the existing Blueprint.
- Render creates the `mabote-group-stockvel-app` static site from the repository root.
- The site builds with `npm ci && npm run build` and publishes `dist`.
- The frontend API URL is configured as `https://mabote-group-api.onrender.com`.
- If `VITE_API_URL` is set in the Render dashboard, use that same API URL; Vite embeds it in the static build, so redeploy the frontend after changing it. The legacy `mabote-group-api-backend.onrender.com` hostname has a CORS configuration issue.
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
  - `CORS_ORIGIN=https://mabote-group-stockvel-app.onrender.com,https://www.mabote-group.co.za,https://mabote-group.co.za,https://your-vercel-domain.vercel.app,capacitor://localhost,https://localhost,http://localhost:5173`
  - `DATABASE_PATH=/var/data/mabote.sqlite`
  - `GOOGLE_SHEETS_ID=<optional>`
  - `GOOGLE_SHEETS_NAME=Sheet1`
  - `SMTP_USER=info@mabote-group.co.za`
  - `SMTP_APP_PASSWORD=<mailbox SMTP credential>`
  - `SMTP_FROM=info@mabote-group.co.za` (optional; defaults to `SMTP_USER`)
  - `SMTP_HOST=smtp.office365.com` (optional; this is the default)
  - `SMTP_PORT=587` (optional; this is the default)
  - `PAYFAST_MERCHANT_ID=<PayFast merchant ID>`
  - `PAYFAST_MERCHANT_KEY=<PayFast merchant key>`
  - `PAYFAST_PASSPHRASE=<PayFast passphrase, if configured>`
  - `PAYFAST_MODE=sandbox` (change to `live` only after merchant activation)
  - `API_BASE_URL=https://mabote-group-api.onrender.com`
  - `APP_BASE_URL=https://www.mabote-group.co.za`

- Enable authenticated SMTP for the mailbox in Microsoft 365. Keep the SMTP credential in the local `backend/.env` or the deployment secret settings; never commit it. The configured tenant must allow SMTP AUTH for this mailbox.

- Signed-in members can change their password from the client portal, and staff can change theirs in Settings. Users who are signed out can reset their password with a one-time email verification code. Configure SMTP variables above for this flow.
- Existing account passwords are no longer overwritten when the backend starts. `DEFAULT_ADMIN_PASSWORD` and `DEFAULT_MANAGEMENT_PASSWORD` are used only when provisioning those accounts on a new database.

## 3) Final checks

- Ensure the frontend points to the deployed backend URL via `VITE_API_URL`.
- Validate that the backend CORS allows the frontend domain and the Capacitor origins `capacitor://localhost` and `https://localhost` for native builds.
- Test login, registration, and dashboard access from the deployed app.
- Confirm the database persists on Render using the mounted disk path.

## 4) Optional production polish

- Replace placeholder contact details if needed.
- Add real Google Sheets credentials if payment sync is required.
- Connect the live domain to your custom website URL.

## Mobile store builds

- Install dependencies and run `npm run mobile:sync` to build the web app and sync it into the Android and iOS projects.
- Open Android Studio with `npm run mobile:android`; Android Studio and the Android SDK are required to build and sign the Android release.
- On macOS, open the iOS project with `npm run mobile:ios`; Xcode and Apple signing credentials are required to build and submit it.
- Keep the configured application ID `za.co.mabotegroup.stockvel` stable after publishing.
- Complete each store's organization verification, privacy disclosures, financial-features declarations where applicable, store listing, and review requirements before release.
