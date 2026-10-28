import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

test("TC-17 logout", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
