import { test, expect } from '@playwright/test';



//To open the page before each test
test.beforeEach(async ({ page }) => {
await page.goto('/');
});

//1. Test to verify the login page loads and verify title displayed is correct
//test('testtitle', async({page}) => { test steps here});
test('Verify login page loads successfully', async ({ page }) => {
const heading:string = await page.title();
console.log('Page title is: ' , heading)
await expect(page).toHaveTitle('Swag Labs');
});

//go to / , enter username,enter password, click login
//verify url ends with /inventory.html;page heading reads products
test('Verify user can login successfully', async ({ page }) => {
await page.getByPlaceholder("Username").fill("standard_user");
await page.getByPlaceholder("Password").fill("secret_sauce");
await page.getByRole('button',{ name: 'Login' }).click();
});







