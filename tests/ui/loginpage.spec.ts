import { test, expect } from "@playwright/test";
import {
  login,
  closeErrorAndCheckHidden,
  expectOnProductsPage,
} from "../helpers/login";

//1.Login page loads: title,username,password and login button are shown
//test('testtitle', async({page}) => { test steps here});
test("Verify login page loads successfully", async ({ page }) => {
  await page.goto("/");

  console.log("Page title is: ", await page.title());

  await expect(page).toHaveTitle("Swag Labs");
  await expect(page.getByPlaceholder("Username")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

//2. Valid login goes to Products page
test("Verify user can login successfully", async ({ page }) => {
  await login(page);
  await expectOnProductsPage(page);
});

//3. Verify the error for a locked out user
test("Verify error for locked out user", async ({ page }) => {
  await login(page, "locked_out_user");

  await expect(page.getByTestId("error")).toHaveText(
    "Epic sadface: Sorry, this user has been locked out.",
  );
  await expect(page).toHaveURL("/");

  await closeErrorAndCheckHidden(page);
});

//4. Verify the error with empty username
test("Verify error with empty username", async ({ page }) => {
  await login(page, "");

  await expect(page.getByTestId("error")).toHaveText(
    "Epic sadface: Username is required",
  );
  await expect(page).toHaveURL("/");

  await closeErrorAndCheckHidden(page);
});

//5. Verify the error with empty password
test("Verify error with empty password", async ({ page }) => {
  await login(page, "standard_user", "");

  await expect(page.getByTestId("error")).toHaveText(
    "Epic sadface: Password is required",
  );
  await expect(page).toHaveURL("/");

  await closeErrorAndCheckHidden(page);
});

//6. Verify the error with wrong password
test("Verify error with wrong password", async ({ page }) => {
  await login(page, "standard_user", "wrongpassword");

  await expect(page.getByTestId("error")).toHaveText(
    "Epic sadface: Username and password do not match any user in this service",
  );
  await expect(page).toHaveURL("/");

  await closeErrorAndCheckHidden(page);
});
