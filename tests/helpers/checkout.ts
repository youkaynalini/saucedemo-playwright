import { Page } from "@playwright/test";

export async function fillCheckoutInfo(
  page: Page,
  firstName: string,
  lastName: string,
  postcode: string,
) {
  await page.getByTestId("firstName").fill(firstName);
  await page.getByTestId("lastName").fill(lastName);
  await page.getByTestId("postalCode").fill(postcode);
  await page.getByTestId("continue").click();
}