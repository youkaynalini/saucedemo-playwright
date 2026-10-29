import { Page, expect } from "@playwright/test";

export function getToProductCard(page: Page, productName: string) {
  return page.getByTestId("inventory-item").filter({ hasText: productName });
}

export async function addToCart(page: Page, productName: string) {
  const productCard = getToProductCard(page, productName);
  await productCard.getByRole("button", { name: "Add to cart" }).click();
  await expect(
    productCard.getByRole("button", { name: "Remove" }),
  ).toBeVisible();
}

//helper to add more products to cart
export async function addMoreProductsToCart(page: Page, products: string[]) {
for (const name of products) {
  await addToCart(page, name);
}
}



export async function removeFromCart(page: Page, productName: string) {
  const productCard = getToProductCard(page, productName);
  await productCard.getByRole("button", { name: "Remove" }).click();
  await expect(
    productCard.getByRole("button", { name: "Add to cart" }),
  ).toBeVisible();
}
