import { Page, expect } from "@playwright/test";

export const PASSWORD = "secret_sauce";

export async function login(
  page: Page,
  username = "standard_user",
  password = PASSWORD,
) {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

export async function expectOnProductsPage(page: Page) {
  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.getByTestId("title")).toHaveText("Products");
}

export async function closeErrorAndCheckHidden(page: Page) {
  await expect(page.getByTestId("error-button")).toBeVisible();
  await page.getByTestId("error-button").click();
  await expect(page.getByTestId("error-button")).toBeHidden();
}

export async function logout(page: Page) {
  // open the menu
  // click Logout
  // we're on the Login page
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
}
