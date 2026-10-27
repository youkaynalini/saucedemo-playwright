import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';
import { addToCart,getToProductCard } from '../helpers/inventory';
import { getToCartItemCard } from '../helpers/cart';

test.beforeEach(async({page})=>{
//login with the correct user and each test here shoudl start from Products page
await login(page) ;   
});

// TC-11 Cart page shows the item: add Backpack, click the cart icon; URL ends /cart.html and Backpack is listed with quantity 1 and price $29.99
test('Verify the cart displays the added item with correct details.', async({page})=>{
await addToCart(page, 'Sauce Labs Backpack');
await page.getByTestId('shopping-cart-link').click();
await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
const cartItemCard = getToCartItemCard(page, 'Sauce Labs Backpack');
await expect(cartItemCard.getByTestId('item-quantity')).toHaveText('1');
await expect(cartItemCard.getByTestId('inventory-item-price')).toContainText('29.99');
});

// TC-F13 Combined scenario, cheapest product into the cart: read all prices, filter the card with the lowest price, add it, open the cart; cart shows that product at $7.99
test('Verify cheapest product filtered by price, added, shown in cart at $7.99', async ({ page }) => {
  // wait for the Products page to finish loading, because allTextContents() does not wait
  await expect(page.getByTestId('inventory-item')).toHaveCount(6);
 
  // read all prices and work out the lowest one
  const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
  const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
  const lowestPrice = `$${Math.min(...prices).toFixed(2)}`;
 
  // the helper filters cards by text, so the price works as the filter text
  const cheapestCard = getToProductCard(page, lowestPrice);
  const cheapestName = await cheapestCard.getByTestId('inventory-item-name').innerText();
  await cheapestCard.getByRole('button', { name: 'Add to cart' }).click();
 
  // open the cart and find that product's row
  await page.getByTestId('shopping-cart-link').click();
  const cartRow = getToCartItemCard(page, cheapestName);
 
  await expect(cartRow).toHaveCount(1);
  await expect(cartRow.getByTestId('inventory-item-price')).toHaveText('$7.99');
});
 
// TC-F14 Combined scenario, remove one item on the cart page: add Backpack and Bike Light, open the cart, filter the Bike Light row, click Remove; only Sauce Labs Backpack is left