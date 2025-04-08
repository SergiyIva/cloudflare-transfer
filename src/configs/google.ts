import config from "./config.ts";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

const credentials = JSON.parse(config.CREDENTIALS_GOOGLE);

// Инициализация аутентификации с использованием сервисного аккаунта
const auth = new GoogleAuth({
  // Путь к JSON-файлу сервисного аккаунта
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const authClient = await auth.getClient();
// @ts-ignore
export const sheets = google.sheets({ version: 'v4', auth: authClient });

export const spreadsheetIdUpdate = config.SHEET_FOR_UPDATE;
export const spreadsheetIdServer = config.SHEET_FOR_READ;