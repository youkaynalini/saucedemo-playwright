import { test, expect, Locator } from '@playwright/test';

let username: Locator;
let password: Locator;
let loginButton: Locator;


//To open the page before each test
test.beforeEach(async ({ page }) => {
await page.goto('/');
username = page.getByPlaceholder('Username');
password = page.getByPlaceholder('Password');
loginButton = page.getByRole('button', { name: 'Login' });
});

//1. Test to verify the login page loads and verify title,username password login button displayed is correct
//test('testtitle', async({page}) => { test steps here});
test('Verify login page loads successfully', async ({ page }) => {

const heading:string = await page.title();
console.log('Page title is: ' , heading)

await expect(page).toHaveTitle('Swag Labs');
await expect(username).toBeVisible();
await expect(password).toBeVisible();
await expect(loginButton).toBeVisible();
});

//2. go to / , enter username,enter password, click login and
//verify url ends with /inventory.html;page heading reads products
test('Verify user can login successfully', async ({ page }) => {
await username.fill('standard_user');
await password.fill('secret_sauce');
await loginButton.click();

await expect(page).toHaveURL(/inventory\.html$/);
await expect(page.getByTestId('title')).toHaveText('Products');
});







