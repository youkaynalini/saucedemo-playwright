import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";
import {
  addToCart,
  getToProductCard,
  removeFromCart,
} from "../helpers/inventory";

test.beforeEach(async ({ page }) => {
  //login with the correct user and each test here shoudl start from Products page
  await login(page);
});
// TC-08 Add one product: find the Backpack card with filter, click Add to cart; that card's button reads Remove and the cart badge shows 1
test("Verify adding one product updates its button to Remove and the cart badge to 1", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
});

// TC-09 Add two products: add Backpack, then add Bike Light; cart badge shows 2
test("Verify adding Backpack and Bike Light shows 2 on the cart badge", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await addToCart(page, "Sauce Labs Bike Light");
  await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");
});

// TC-10 Remove from products page: add Backpack, click Remove on the same card; button reads Add to cart again and the cart badge is not visible
test('Verify removing the Backpack restores the "Add to cart" button and hides the cart badge', async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await removeFromCart(page, "Sauce Labs Backpack");
  await expect(page.getByTestId("shopping-cart-badge")).toBeHidden();
});

// TC-F01 filter({ hasText }), one product by name: filter cards by Sauce Labs Fleece Jacket, find its Add to cart button; button visible and card shows $49.99
test("Verify the Fleece Jacket card displays Add to cart and $49.99", async ({
  page,
}) => {
  const fleeceJacketCard = getToProductCard(page, "Sauce Labs Fleece Jacket");
  await expect(
    fleeceJacketCard.getByRole("button", { name: "Add to cart" }),
  ).toBeVisible();
  await expect(
    fleeceJacketCard.getByTestId("inventory-item-price"),
  ).toContainText("49.99");
});

// TC-F02 filter({ hasText }), products priced $15.99: filter cards by $15.99; count is 2
test("Verify filtering by $15.99 returns 2 products", async ({ page }) => {
  const cardByPrice = page
    .getByTestId("inventory-item-price")
    .filter({ hasText: "$15.99" });
  await expect(cardByPrice).toHaveCount(2);
});

// TC-F03 filter({ hasNotText }), products not priced $15.99: filter cards that do not contain $15.99; count is 4
test("Verify filtering out $15.99 products returns 4 products", async ({
  page,
}) => {
  const cardByPrice = page
    .getByTestId("inventory-item-price")
    .filter({ hasNotText: "$15.99" });
  await expect(cardByPrice).toHaveCount(4);
});
// TC-F04 hasText and hasNotText, products in and not in the cart: add Backpack and Onesie, filter cards by Remove, then by not containing Remove; 2 cards with Remove, 4 without

test("Verify products in the cart show Remove and products not in the cart do not, with counts 2 and 4 respectively", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Onesie");
  await addToCart(page, "Sauce Labs Backpack");
  const allCards = page.getByTestId("inventory-item");
  await expect(allCards.filter({ hasText: "Remove" })).toHaveCount(2);
  await expect(allCards.filter({ hasNotText: "Remove" })).toHaveCount(4);
});
// TC-F05 getByTestId, toContainText, product-specific test ids: click the button with test id add-to-cart-sauce-labs-backpack; remove-sauce-labs-backpack is visible and contains Remove, and the first product name contains Backpack
test("Verify Backpack shows Remove and the correct product name after adding", async ({
  page,
}) => {
  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();

  const removeButtonFprBackpack = page.getByTestId(
    "remove-sauce-labs-backpack",
  );
  await expect(removeButtonFprBackpack).toBeVisible();
  await expect(removeButtonFprBackpack).toContainText("Remove");
  await expect(page.getByTestId("inventory-item-name").first()).toContainText(
    "Backpack",
  );
});
// TC-F06 first(), last(), nth(), positions in the list: read product names with first(), last() and nth(2), count elements with data-test="inventory-item"; Backpack, Test.allTheThings() T-Shirt (Red), Bolt T-Shirt, count is 6
test("Verify the first, last, and nth product positions return the expected items, and the product count is 6", async ({
  page,
}) => {
  const allProductNames = page.getByTestId("inventory-item-name"); // all 6 names

  await expect(allProductNames.first()).toHaveText("Sauce Labs Backpack");
  await expect(allProductNames.last()).toHaveText(
    "Test.allTheThings() T-Shirt (Red)",
  );
  await expect(allProductNames.nth(2)).toHaveText("Sauce Labs Bolt T-Shirt");
  await expect(page.getByTestId("inventory-item")).toHaveCount(6);
});
// TC-F07 Chaining, the button inside one card: find the Fleece Jacket card, then every button inside it; 1 button, reading Add to cart
test("Verify the Fleece Jacket card contains a single Add to cart button", async ({
  page,
}) => {
  const fleeceJacketCardButtons = getToProductCard(
    page,
    "Sauce Labs Fleece Jacket",
  ).getByRole("button", { name: "Add to cart" });
  await expect(fleeceJacketCardButtons).toHaveCount(1);
  await expect(fleeceJacketCardButtons).toHaveText("Add to cart");
});
// TC-F08 Chaining, buttons left after adding two: add Backpack and Bike Light, count Add to cart and Remove buttons; 4 Add to cart, 2 Remove
test("Verify adding two products results in 4 Add to cart buttons and 2 Remove buttons", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await addToCart(page, "Sauce Labs Bike Light");
  const allCards = page.getByTestId("inventory-item");
  await expect(
    allCards.getByRole("button", { name: "Add to cart" }),
  ).toHaveCount(4);
  await expect(allCards.getByRole("button", { name: "Remove" })).toHaveCount(2);
});
// TC-F09 .and(), role and test id together: find the button named Add to cart that also has test id add-to-cart-sauce-labs-onesie, click it; exactly 1 match and the badge shows 1
test("F09 and(): Onesie button matched by role and test id together", async ({
  page,
}) => {
  const onesieButton = page
    .getByRole("button", { name: "Add to cart" })
    .and(page.getByTestId("add-to-cart-sauce-labs-onesie"));

  await expect(onesieButton).toHaveCount(1);
  await onesieButton.click();
  await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");
});

// TC-F10 .and(), Remove buttons by role and attribute: add 2 products, find buttons that also have a data-test starting with remove; count is 2
test("Verify two Remove buttons shown with a data-test id starting with remove", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await addToCart(page, "Sauce Labs Bike Light");

  const removeButtons = page
    .getByRole("button", { name: "Remove" })
    .and(page.locator('[data-test^="remove"]'));

  await expect(removeButtons).toHaveCount(2);
});
// TC-F11 filter({ has }), filter({ hasNot }), cards that contain a Remove button: add Backpack and Bolt T-Shirt, filter cards that have, then do not have, a Remove button; 2 with, 4 without
test("Verify two cards are with a Remove button, four without", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Backpack");
  await addToCart(page, "Sauce Labs Bolt T-Shirt");

  const allCards = page.getByTestId("inventory-item");
  const removeButton = page.getByRole("button", { name: "Remove" });

  await expect(allCards.filter({ has: removeButton })).toHaveCount(2);
  await expect(allCards.filter({ hasNot: removeButton })).toHaveCount(4);
});
// TC-F12 Combined filters, the T-shirt that is in the cart: add Bolt T-Shirt, filter cards by T-shirt, then by having a Remove button; 1 card, Sauce Labs Bolt T-Shirt
// TC-F12 Combined filters, the T-shirt that is in the cart
test("Verify with cmbined filters that the only T-shirt with Remove is the Bolt T-Shirt", async ({
  page,
}) => {
  await addToCart(page, "Sauce Labs Bolt T-Shirt");

  const tShirtInCart = getToProductCard(page, "T-Shirt").filter({
    has: page.getByRole("button", { name: "Remove" }),
  });

  await expect(tShirtInCart).toHaveCount(1);
  await expect(tShirtInCart).toContainText("Sauce Labs Bolt T-Shirt");
});

//**CSS selector exercise */
test("TC-12 six products shown", async ({ page }) => {
  await expect(page.getByTestId("inventory-item")).toHaveCount(6);
});

test("TC-12 six products shown, CSS version", async ({ page }) => {
  await expect(page.locator(".inventory_item")).toHaveCount(6);
});

test("TC-13 every product is complete", async ({ page }) => {
  const cards = page.getByTestId("inventory-item");
  await expect(cards).toHaveCount(6);
  for (const c of await cards.all()) {
    await expect(c.getByTestId("inventory-item-name")).toBeVisible();
    await expect(c.getByTestId("inventory-item-desc")).toBeVisible();
    await expect(c.getByRole("img")).toBeVisible();
    await expect(c.getByTestId("inventory-item-price")).toHaveText(
      /^\$\d+\.\d{2}$/,
    );
  }
});

test("TC-14 product page matches the list", async ({ page }) => {
  const backpack = getToProductCard(page, "Sauce Labs Backpack");
  const name = await backpack.getByTestId("inventory-item-name").innerText();
  const price = await backpack.getByTestId("inventory-item-price").innerText();

  await backpack.getByTestId("inventory-item-name").click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  //after the URL check that waits for something only the product page has, the “Back to products” button:
  await expect(page.getByTestId("back-to-products")).toBeVisible();
  await expect(page.getByTestId("inventory-item-name")).toHaveText(name);
  await expect(page.getByTestId("inventory-item-price")).toHaveText(price);

  await page.getByTestId("back-to-products").click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
});

test("TC-15 price by XPath, then by filter", async ({ page }) => {
  const byXPath = page.locator(
    "//div[text()='Sauce Labs Backpack']" +
      "/ancestor::div[contains(@class,'inventory_item_description')]" +
      "//div[contains(@class,'inventory_item_price')]",
  );
  await expect(byXPath).toHaveText("$29.99");

  const byFilter = getToProductCard(page, "Sauce Labs Backpack").getByTestId(
    "inventory-item-price",
  );
  await expect(byFilter).toHaveText("$29.99");
});

test("TC-16 price list", async ({ page }) => {
  await expect(page.getByTestId("inventory-item")).toHaveCount(6);
  const names = await page.getByTestId("inventory-item-name").allTextContents();
  const prices = await page
    .getByTestId("inventory-item-price")
    .allTextContents();

  expect(names).toHaveLength(6);
  expect(prices).toHaveLength(6);
  for (const p of prices) {
    expect(Number(p.replace("$", ""))).toBeGreaterThan(0);
  }
});
