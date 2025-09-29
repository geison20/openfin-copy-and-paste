import { APIRequestContext, Browser, BrowserContext, Page, chromium, request } from "@playwright/test";

export type AppWorld = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  apiContext: APIRequestContext;
  baseUrl: string;
  apiBaseUrl: string;
};

export async function createWindowContext(): Promise<AppWorld> {
  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const apiBaseUrl = process.env.API_BASE_URL ?? baseUrl;
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
  const context = await browser.newContext();
  const page = await context.newPage();
  const apiContext = await request.newContext({ baseURL: apiBaseUrl });

  return {
    browser,
    context,
    page,
    apiContext,
    baseUrl,
    apiBaseUrl,
  };
}
