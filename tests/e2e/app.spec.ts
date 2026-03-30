import { expect, test } from "@playwright/test";

test("renders the frontend shell", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "MPA Forge Blueprint" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Protected profile" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Missing configuration" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Authentication not configured. Set a real Clerk publishable key to exercise the protected API flow."
    )
  ).toBeVisible();
});
