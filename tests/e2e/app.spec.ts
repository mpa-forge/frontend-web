import { expect, test } from "@playwright/test";

test("renders the frontend shell", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "MPA Forge Blueprint" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Missing configuration" })
  ).toBeVisible();
});
