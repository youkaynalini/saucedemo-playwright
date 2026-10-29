import { test, expect } from "@playwright/test";
import { login, logout } from "../helpers/login";

test("TC-17 logout", async ({ page }) => {
  await login(page);
  await logout(page);
});
