# Google Sheets Payment Sync Setup Guide

This guide will help you connect your Google Sheets tracker to the MABOTE GROUP PTY(LTD) Stockvel App for automatic payment status updates.

## Overview

The app now includes a backend server that syncs payment statuses from a Google Sheets spreadsheet every 5 seconds. When you mark a payment as "Paid" in your tracker, it will automatically update in the app.

## Step 1: Set Up Google Cloud Project

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "MABOTE Stockvel")
3. Enable the Google Sheets API:
   - Click on "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 1.2 Create Service Account Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the service account details:
   - Service account name: `mabote-sheets-sync`
   - Click "Create and Continue"
4. On the next page, click "Create Key" → "JSON"
5. Download the JSON file and rename it to `credentials.json`
6. Place it in the `backend/` folder

### 1.3 Enable Sheets API for the Service Account
- In the Google Cloud Console, note the service account email
- Go to your Google Sheets tracker
- Share it with the service account email address (give it "Viewer" access)

## Step 2: Set Up Your Google Sheets Tracker

Create a Google Sheets spreadsheet with the following structure:

```
| Column A | Column B | Column C |
|----------|----------|----------|
| Name | Payment Status | Amount |
| John Doe | Paid | R250 |
| Jane Smith | Pending | R250 |
| Bob Johnson | Paid | R250 |
```

**Important:** 
- Row 1 should contain headers (Name, Payment Status, Amount)
- Data starts from Row 2
- Column A: Member Name (must match names in the app)
- Column B: Payment Status ("Paid" or "Pending")
- Column C: Amount (e.g., "R250")

## Step 3: Configure Environment Variables

### 3.1 Create `.env` file in the `backend/` folder
```bash
cp backend/.env.example backend/.env
```

### 3.2 Edit `backend/.env` and add:
```
PORT=5000
GOOGLE_SHEETS_ID=your-spreadsheet-id-here
GOOGLE_SHEETS_NAME=Sheet1
CORS_ORIGIN=http://localhost:5173
```

**How to find your Spreadsheet ID:**
- Open your Google Sheets tracker
- The URL will look like: `https://docs.google.com/spreadsheets/d/1abc123...xyz/edit`
- Copy the part between `/d/` and `/edit` - that's your spreadsheet ID

## Step 4: Install and Run Backend

### 4.1 Install Dependencies
```bash
cd backend
npm install
```

### 4.2 Authenticate with Google Sheets (One-time setup)
```bash
# Start the backend
npm run dev

# In another terminal, get the auth URL
curl http://localhost:5000/api/auth/google-sheets-url

# Visit the URL in your browser
# Copy the authorization code from the URL after redirect
# Send it to the backend:
curl -X POST http://localhost:5000/api/auth/google-sheets-callback \
  -H "Content-Type: application/json" \
  -d '{"code":"your-auth-code-here"}'
```

A `token.json` file will be created in the `backend/` folder.

### 4.3 Start Backend Server
```bash
npm run dev
# or
npm start
```

The backend should now be running on `http://localhost:5000`

## Step 5: Verify Sync

### 5.1 Test the sync endpoint
```bash
curl http://localhost:5000/api/payments/sync
```

You should see a JSON response with payment data from your Google Sheets.

### 5.2 Check the app
1. Keep the backend running
2. Make sure the frontend is also running (`npm run dev` in the root directory)
3. Navigate to the Member Dashboard
4. You should see a sync status indicator showing "✓ Synced" with a timestamp
5. Update a payment status in Google Sheets and watch it sync to the app within 5 seconds!

## Troubleshooting

### "credentials.json not found"
- Make sure you downloaded the Google Cloud credentials file
- Place it in the `backend/` folder and rename it to `credentials.json`

### "Token not found"
- Run the authentication steps again in Step 4.2
- Make sure you received the authorization code and sent it to the callback endpoint

### No sync happening
- Check that the backend is running (`http://localhost:5000/api/health`)
- Verify your GOOGLE_SHEETS_ID is correct in `.env`
- Check browser console for errors
- Make sure your Google Sheets structure matches the expected format

### "Permission denied" error
- Go back to your Google Sheets spreadsheet
- Share it with the service account email address from credentials.json
- Grant at least "Viewer" access

## File Structure

```
MABOTE-GROUP-Stockvel-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── sheetsHelper.js
│   ├── .env                    (create this)
│   ├── .env.example
│   ├── credentials.json        (download from Google Cloud)
│   └── token.json              (auto-generated after auth)
├── src/
│   ├── hooks/
│   │   └── usePaymentSync.js
│   ├── pages/
│   │   └── MemberDashboard.jsx
│   └── ...
└── ...
```

## How It Works

1. **Frontend** (`usePaymentSync` hook) - Calls the backend every 5 seconds
2. **Backend** (`/api/payments/sync`) - Fetches data from Google Sheets API
3. **Google Sheets** - Your tracker with payment statuses
4. **Update Loop** - Payment statuses are displayed with a sync timestamp

The sync indicator in the Contribution History section shows:
- ✓ Synced [timestamp] - Successful sync
- ❌ Sync Error - Connection or authentication issue
- Syncing... - Currently fetching data

## Running Both Frontend and Backend

You need two terminal windows:

**Terminal 1 (Frontend):**
```bash
cd MABOTE-GROUP-Stockvel-app
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 (Backend):**
```bash
cd MABOTE-GROUP-Stockvel-app/backend
npm run dev
# Runs on http://localhost:5000
```

## Next Steps

- Monitor the Contribution History section for automatic updates
- Add more members to Google Sheets - they'll sync automatically
- Customize the sync interval by changing the parameter in `usePaymentSync(5000)` (time in milliseconds)
- Extend the backend to write changes back to Google Sheets (write permissions needed)

## Support

For issues or questions:
1. Check the browser console for errors (F12)
2. Check the backend console for API errors
3. Verify credentials and environment variables are set correctly
4. Ensure Google Sheets is properly shared with the service account
