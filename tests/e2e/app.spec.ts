import { expect, test } from "@playwright/test";

test("smoke-tests the routed shell and auth entry routes", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "MPA Forge Blueprint" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Authentication unavailable|Sign in|Protected workspace/
    })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Runtime" })).toBeVisible();

  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", { name: /Sign in|Protected workspace/ })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Runtime" })).toBeVisible();

  await page.goto("/sign-up");

  await expect(
    page.getByRole("heading", { name: /Sign up|Protected workspace/ })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Runtime" })).toBeVisible();
});
