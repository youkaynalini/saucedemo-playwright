import { Page } from "@playwright/test";

export function getToCartItemCard(page: Page, cartItemName: string) {
  return page.getByTestId("inventory-item").filter({ hasText: cartItemName });
}
