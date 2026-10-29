# Learning Log

Playwright + TypeScript, automating https://www.saucedemo.com
Udemy course + 12-week bootcamp plan. Started 12 Oct 2026.

---

## Week 1

### Mon 12 Oct – Setup

- Lecture 18. Installed Playwright, set baseURL and testIdAttribute: 'data-test' in the config.
- Wrote TC-01 and TC-02 (login page loads, valid login).
- Learned: `npx playwright test --ui` is the easiest way to watch tests run.

### Tue 13 Oct – Locators

- Lecture 19. Wrote TC-03 to TC-07 (login errors).
- Moved login steps into tests/helpers/login.ts so every test calls `await login(page)`.
- Learned: `page: Page` just tells TypeScript what kind of thing `page` is.
- Learned: default values (`username = 'standard_user'`) mean I only pass what is different.

### Wed 14 Oct – Cart basics and filter locators

- Lecture 20. Wrote TC-08 to TC-10 and TC-F01 to TC-F12 in inventorypage.spec.ts.
- TC-11 and TC-F13 went in a new cartpage.spec.ts.
- Learned: filter({ hasText }) narrows a list to the matching cards;
  filter({ has }) checks for an element inside; .and() means both must match.

### 15–25 Oct – Off sick

- Plan moved: Week 1 now ends Sun 1 Nov, Christmas week off, course ends 2 Jan.

### Tue 27 Oct – Products page, back after illness

- Cleaned the repo: ran Prettier, ignored .DS_Store, committed and pushed.
- Wrote TC-12 to TC-14.
- Decided to skip the CSS lab tests. getByRole and getByTestId cover what I need.
  CSS cheat sheet kept for later.
- Learned: a `for` loop over `cards.all()` checks every card with 4 lines instead of 24.
- Learned: save values with innerText(), then compare on the next page (TC-14).

### Wed 28 Oct – XPath, menu and Git workflow

- Wrote TC-15 (price by XPath, then by filter), TC-16 (price list) and TC-17 (logout).
- Made an XPath cheat sheet for SauceDemo. Watch out: some classes end with a hidden
  space, so use contains(@class, ...); prices are split in two, so use .= not text()=.
- First pull requests (#1 and #2): branch → push → PR → green CI → merge → git pull on main.
- Learned: `npx playwright test -g "TC-15|TC-16"` runs only tests whose title matches.
  | means OR. Keep the quotes and no spaces around |.

### Thu 29 Oct – End-to-end test and helpers

- Wrote TC-18: login → add 2 products → cart → checkout → details → overview → finish → back home → logout.
- New branch add-e2e-test.
- Learned helper-first thinking:
  1. Write the test line I wish existed, e.g. `await expectItemsListed(page, products)`.
  2. Ask: will I need it again? If yes, it's a helper.
  3. Write the checks as English comments, then turn each into code.
  4. Run it, then break it on purpose to prove it really checks something.
- Learned: only put a check inside a helper if it is true every time.
  addToCart and logout check inside; login and fillCheckoutInfo don't, because
  some tests expect them to fail (locked-out user, empty form).
- Learned: when a helper is used on a second page, check the name still fits.
  Renamed expectCartContains → expectItemsListed with F2.
- Learned: one test can't call another test. Share checks with a helper instead
  (expectOnProductsPage is used in both TC-02 and TC-18).
- Learned: [ ] is a list (many of the same thing, e.g. products);
  { } is a form (one thing with labelled details, e.g. a customer).
- Learned: count what I put in (products.length), never what the page shows.

---

## Reading a regular expression (TC-13 price check)

```ts
await expect(c.getByTestId("inventory-item-price")).toHaveText(
  /^\$\d+\.\d{2}$/,
);
```

In plain English: "this card's price must look like a dollar price, e.g. $29.99".
It checks the format, not the exact number.

Read the pattern between the / / one piece at a time:

| Piece   | Means                                       | Matches in $29.99 |
| ------- | ------------------------------------------- | ----------------- |
| `/ /`   | start and end of the pattern                |                   |
| `^`     | start of the text                           |                   |
| `\$`    | a real $ sign (\ because $ alone = "end")   | $                 |
| `\d+`   | one or more digits                          | 29                |
| `\.`    | a real dot (\ because . alone = "any char") | .                 |
| `\d{2}` | exactly two digits                          | 99                |
| `$`     | end of the text                             |                   |

Passes: $29.99, $7.99, $100.00
Fails: 29.99 (no $), $29.9 (one decimal), $29.99 USD (extra text after)

Remember:

- `\d` = a digit, `+` = one or more, `{2}` = exactly 2
- `\` in front of a symbol = "I mean the real symbol"
- `^` and `$` make it match the whole text, not just part of it
- Text in quotes = exact match: `toHaveText('$29.99')`
- Pattern in / / = any text with that shape: `toHaveText(/^\$\d+\.\d{2}$/)`

---

## My helpers

| Helper                                        | File         | What it does                               | Checks inside?                   |
| --------------------------------------------- | ------------ | ------------------------------------------ | -------------------------------- |
| login(page, user?, password?)                 | login.ts     | Logs in                                    | No                               |
| expectOnProductsPage(page)                    | login.ts     | URL and "Products" title                   | It is a check                    |
| logout(page)                                  | login.ts     | Menu → Logout, lands on Login page         | Yes                              |
| closeErrorAndCheckHidden(page)                | login.ts     | Closes the login error                     | Yes                              |
| getToProductCard(page, name)                  | inventory.ts | Finds one product card                     | No                               |
| addToCart(page, name)                         | inventory.ts | Adds one product                           | Yes, button turns to Remove      |
| addMoreProductsToCart(page, products)         | inventory.ts | Adds a list of products                    | Yes, via addToCart               |
| removeFromCart(page, name)                    | inventory.ts | Removes one product                        | Yes, button turns to Add to cart |
| expectCartCount(page, count)                  | cart.ts      | Badge shows count, hidden if 0             | It is a check                    |
| getItemRow(page, name)                        | cart.ts      | Finds one row on the cart or overview page | No                               |
| expectItemsListed(page, products)             | cart.ts      | Same items, exact names, quantity 1        | It is a check                    |
| goToCheckout(page)                            | cart.ts      | Clicks Checkout, lands on step one         | Yes                              |
| fillCheckoutInfo(page, first, last, postcode) | checkout.ts  | Fills the form, clicks Continue            | No                               |

---

## Mistakes and fixes

| Error                             | Cause                                                                 | Fix                                                         |
| --------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `Cannot find name 'card'`         | Copied answer code. My helper is called getToProductCard              | Use my own helper names                                     |
| Strict mode violation, 6 elements | URL changed before the page redrew, so the old list was still showing | Wait for something only the new page has (back-to-products) |
| Duplicate test title              | Two tests both called TC-12                                           | Every test title must be unique                             |
| `This expression is not callable` | Wrote products.length()                                               | length is a value, not an action: no ()                     |
| Red line under a helper name      | Forgot to import it                                                   | Add it to the import line at the top                        |
| -g "TC-08" found nothing          | Test title started with "Verify..."                                   | Start every title with its TC number                        |

---

## Questions to look up

- What is storageState and how does "log in once" work? (Week 5)
- When should helpers become page objects? (Week 4)
