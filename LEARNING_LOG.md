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

---

## Reading a regular expression (TC-13 price check)

```ts
await expect(c.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
```

In plain English: "this card's price must look like a dollar price, e.g. $29.99".
It checks the format, not the exact number.

Read the pattern between the / / one piece at a time:

| Piece   | Means                                         | Matches in $29.99 |
| ------- | --------------------------------------------- | ----------------- |
| `/ /`   | start and end of the pattern                  |                   |
| `^`     | start of the text                             |                   |
| `\$`    | a real $ sign (\ because $ alone = "end")     | $                 |
| `\d+`   | one or more digits                            | 29                |
| `\.`    | a real dot (\ because . alone = "any char")   | .                 |
| `\d{2}` | exactly two digits                            | 99                |
| `$`     | end of the text                               |                   |

Passes: $29.99, $7.99, $100.00
Fails: 29.99 (no $), $29.9 (one decimal), $29.99 USD (extra text after)

Remember:
- `\d` = a digit, `+` = one or more, `{2}` = exactly 2
- `\` in front of a symbol = "I mean the real symbol"
- `^` and `$` make it match the whole text, not just part of it
- Text in quotes = exact match: `toHaveText('$29.99')`
- Pattern in / / = any text with that shape: `toHaveText(/^\$\d+\.\d{2}$/)`

---

## Mistakes and fixes

| Error | Cause | Fix |
| --- | --- | --- |
| `Cannot find name 'card'` | Copied answer code. My helper is called getToProductCard | Use my own helper names |
| Strict mode violation, 6 elements | URL changed before the page redrew, so the old list was still showing | Wait for something only the new page has (back-to-products) |
| Duplicate test title | Two tests both called TC-12 | Every test title must be unique |

---

## Questions to look up
-
