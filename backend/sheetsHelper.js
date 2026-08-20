import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

let auth = null;

async function authorize() {
  if (auth) return auth;

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(
      "credentials.json not found. Please set up Google Sheets API credentials."
    );
    throw new Error("Google Sheets credentials not configured");
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
  } else {
    throw new Error(
      "Token not found. Run setup to authenticate with Google Sheets."
    );
  }

  auth = oAuth2Client;
  return auth;
}

export async function getPaymentUpdates(spreadsheetId, sheetName = "Sheet1") {
  try {
    const authClient = await authorize();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:C1000`, // Assuming: Column A=Member Name, Column B=Payment Status, Column C=Amount
    });

    const rows = response.data.values || [];
    return rows.map((row) => ({
      memberName: row[0] || "",
      paymentStatus: row[1] || "Pending", // Assuming "Paid" or "Pending"
      amount: row[2] || "0",
    }));
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
}

export async function getAuthUrl() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("credentials.json not found");
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function saveToken(code) {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("credentials.json not found");
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token saved to", TOKEN_PATH);
}
