import { expect } from "@playwright/test";
import { chromium } from "playwright";
import "dotenv/config";

const {
  USER: user,
  PASSWORD: password,
  BROWSERS_TO_OPEN: browsersToOpen = 10,
  URL_TO_OPEN: url,
} = process.env;

(async () => {
  const profiles = Array.from(
    { length: browsersToOpen },
    (_, i) => `./profile-${i}`,
  );

  await Promise.all(
    profiles.map(async (profilePath) => {
      const context = await chromium.launchPersistentContext(profilePath, {
        headless: false,
        args: ["--no-sandbox"],
      });

      const page = await context.newPage();
      await page.goto("https://www.puntoticket.com/Account/SignIn");
      await page.locator("#username").fill(user);
      await page.locator("#password").fill(password);
      await page.locator("#btn-login").click();
      // Anade un tiempo de espera para que la pagina cargue
      await page.waitForTimeout(5000);
      await page.goto(url);
      expect(1).toBe(1);
    }),
  );
})();
