import { Page, expect } from "@playwright/test";

export function getItemRow(page: Page, cartItemName: string) {
  return page.getByTestId("inventory-item").filter({ hasText: cartItemName });
}

export async function expectCartCount(page: Page, count: number) {
  const badge = page.getByTestId("shopping-cart-badge");
  //await expect(badge).toHaveText(String(count));

  //what does SauceDemo show when the cart is empty?
  if (count === 0) {
    // the badge should be gone
    await expect(badge).toBeHidden();
  } else {
    // the badge should show the number
    await expect(badge).toHaveText(String(count));
  }
}

export async function expectItemsListed(page: Page, products: string[]) {
  // same number of rows as products
  await expect(page.getByTestId("inventory-item")).toHaveCount(products.length);

  // each product appears once, with quantity 1
  for (const name of products) {
    const row = getItemRow(page, name);
    await expect(row).toHaveCount(1);
    await expect(row.getByTestId("inventory-item-name")).toHaveText(name);
    await expect(row.getByTestId("item-quantity")).toHaveText("1");
  }
}

export async function goToCheckout(page: Page) {
  // click Checkout
  await page.getByTestId("checkout").click();
  // check the URL
  await expect(page).toHaveURL(/checkout-step-one\.html$/);
  // check the title
  await expect(page.getByTestId("title")).toHaveText(
    "Checkout: Your Information",
  );
}
