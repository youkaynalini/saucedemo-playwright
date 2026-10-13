import { Page, expect } from "@playwright/test";

export const PASSWORD = 'secret_sauce';

export async function login(page:Page, username = 'standard_user', password = PASSWORD){
await page.goto('/');
await page.getByPlaceholder('Username').fill(username);
await page.getByPlaceholder('Password').fill(password);
await page.getByRole('button', {name: 'Login'}).click();

}

export async function loginerror(page:Page){
await expect(page.getByTestId('error-button')).toBeVisible();
await page.getByTestId('error-button').click();
await expect(page.getByTestId('error-button')).toBeHidden();
}

