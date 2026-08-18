import { test, expect } from "@playwright/test";

test("la page d'accueil répond et affiche la marque", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("réparation vélo");
});

test("la sonde de santé confirme l'accès à la base", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ status: "ok", database: "up" });
});
