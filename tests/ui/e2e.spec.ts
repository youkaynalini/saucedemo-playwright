import { test, expect } from "@playwright/test";
import { expectOnProductsPage, login, logout } from "../helpers/login";
import { addMoreProductsToCart } from "../helpers/inventory";
import {
  expectCartCount,
  expectItemsListed,
  goToCheckout,
} from "../helpers/cart";
import { fillCheckoutInfo } from "../helpers/checkout";

test("TC-18 full purchase end to end", async ({ page }) => {
  const products = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];
  const customer = {
    firstName: "Nalini",
    lastName: "Test",
    postcode: "G72 1AA",
  };

  //1. Verify a standard user can log in successfully and is redirected to the Products page.
  await login(page);
  await expectOnProductsPage(page);

  // 2. Verify a standard user can add Backpack and Bike Light to the cart and the cart badge updates to show 2 items.
  await addMoreProductsToCart(page, products);
  await expectCartCount(page, products.length);

  // 3. Verify clicking the cart icon displays both selected items with quantity 1 each in the cart.
  await page.getByTestId("shopping-cart-link").click();
  await expect(page).toHaveURL(/cart\.html$/);
  await expectItemsListed(page, products);
  // Verify clicking Checkout navigates the user to the checkout information page (/checkout-step-one.html).
  await goToCheckout(page);

  // 4. Verify entering valid customer details and clicking Continue navigates to the checkout overview page (/checkout-step-two.html).
  await fillCheckoutInfo(
    page,
    customer.firstName,
    customer.lastName,
    customer.postcode,
  );
  await expect(page).toHaveURL(/checkout-step-two\.html$/);
  await expect(page.getByTestId("title")).toHaveText("Checkout: Overview");

  //5. Verify the checkout overview displays both items and an item total of $39.98.
  await expectItemsListed(page, products);
  await expect(page.getByTestId("subtotal-label")).toContainText("$39.98");

  //6. Verify clicking Finish completes the order and displays the "Thank you for your order!" confirmation message.
  await page.getByTestId("finish").click();
  await expect(page).toHaveURL(/checkout-complete\.html$/);
  await expect(page.getByTestId("complete-header")).toHaveText(
    "Thank you for your order!",
  );
  await expectCartCount(page, 0);

  //7. Verify clicking Back Home returns the user to the Products page and clears the cart badge from the header.
  await page.getByTestId("back-to-products").click();
  await expectOnProductsPage(page);
  await expectCartCount(page, 0);
  //8. Verify a logged-in user can log out from the menu and is redirected to the Login page.
  await logout(page);
});
