import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';


//1.Login page loads: title,username,password and login button are shown
//test('testtitle', async({page}) => { test steps here});
test('Verify login page loads successfully', async ({ page }) => {

await page.goto('/');    

console.log('Page title is: ' , await page.title());

await expect(page).toHaveTitle('Swag Labs');
await expect(page.getByPlaceholder('Username')).toBeVisible();
await expect(page.getByPlaceholder('Password')).toBeVisible();
await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();
});

//2. Valid login goes to Products page
test('Verify user can login successfully', async ({ page }) => {
await login(page);

await expect(page).toHaveURL(/inventory\.html$/);
await expect(page.getByTestId('title')).toHaveText('Products');
});







