import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    18,
    [
      slide(
        "Playwright kick start",
        [
          "Scaffold a project with `npm init playwright@latest`. It creates playwright.config.ts, a tests/ folder and an example test.",
          "Run tests with `npx playwright test`; add `--headed` to see the browser or `--ui` for UI mode.",
          "`npx playwright codegen <url>` records your clicks into test code.",
          "Each test receives fixtures such as `page`, a fresh isolated browser page.",
        ],
        `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'https://demo.playwright.dev', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});`,
      ),
    ],
    [
      mcq(
        "Which command runs tests with the browser window visible?",
        ["npx playwright test --headed", "npx playwright show", "npx playwright test --visible", "npx playwright open"],
        0,
        "--headed runs browsers with a visible window. Headless is the default.",
      ),
      mcq(
        "What does `npx playwright codegen https://example.com` do?",
        ["Generates a config file", "Records your interactions and writes test code", "Installs browsers", "Opens the HTML report"],
        1,
        "codegen opens a browser plus an inspector that turns your actions into test code.",
      ),
      fill(
        "Use the `page` fixture inside a test:",
        "test('loads', async ({ ___ }) => {\n  await page.goto('/');\n});",
        ["page"],
        "Fixtures are destructured from the test function's first argument.",
        ["page", "browser", "this", "context"],
      ),
      match(
        "Match the command to its purpose:",
        [
          ["npx playwright test", "Run all tests"],
          ["npx playwright test --ui", "Open interactive UI mode"],
          ["npx playwright show-report", "Open the HTML report"],
          ["npx playwright install", "Download browser binaries"],
        ],
        "These four commands cover most daily Playwright CLI use.",
      ),
      order(
        "Order the steps to get a new Playwright project running:",
        ["npm init playwright@latest", "Write a test in tests/example.spec.ts", "npx playwright test", "npx playwright show-report"],
        "Scaffold, write a test, run it, then view the report.",
      ),
    ],
  ),

  topic(
    19,
    [
      slide(
        "Built-in locators",
        [
          "Prefer user-facing locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`.",
          "`getByRole('button', { name: 'Sign in' })` matches by ARIA role and accessible name.",
          "`getByTestId('submit')` uses `data-testid` by default; good for stable hooks.",
          "Locators are lazy and strict: an action fails if the locator matches more than one element.",
        ],
        `await page.getByLabel('Email').fill('qa@test.io');
await page.getByPlaceholder('Password').fill('secret');
await page.getByRole('button', { name: 'Sign in' }).click();
await expect(page.getByText('Welcome back')).toBeVisible();`,
      ),
    ],
    [
      mcq(
        "Which locator is recommended first because it mirrors how users and assistive tech see the page?",
        ["page.locator('//div[3]/button')", "page.getByRole()", "page.locator('.btn-primary')", "page.$('button')"],
        1,
        "getByRole is based on accessibility roles and names, so it is resilient and user-centric.",
      ),
      mcq(
        "What happens when you click a locator that matches 3 elements?",
        ["It clicks the first one", "It clicks all three", "It throws a strict mode violation", "It clicks a random one"],
        2,
        "Locators are strict for actions. Narrow them down or use .first()/.nth() deliberately.",
      ),
      fill(
        "Click the button whose accessible name is 'Add to cart':",
        "await page.getByRole('___', { ___: 'Add to cart' }).click();",
        ["button", "name"],
        "getByRole takes the role and an options object with the accessible name.",
        ["button", "name", "text", "label"],
      ),
      match(
        "Match the HTML to the best locator:",
        [
          ["<label for=e>Email</label><input id=e>", "getByLabel('Email')"],
          ["<input placeholder='Search'>", "getByPlaceholder('Search')"],
          ["<img alt='Logo'>", "getByAltText('Logo')"],
          ["<div data-testid='cart'>", "getByTestId('cart')"],
        ],
        "Pick the locator that matches how the element is identified to users.",
      ),
      order(
        "Arrange a login test using built-in locators:",
        [
          "await page.goto('/login');",
          "const user = page.getByLabel('Username');",
          "await user.fill('admin');",
          "await page.getByRole('button', { name: 'Log in' }).click();",
          "await expect(page.getByText('Dashboard')).toBeVisible();",
        ],
        "Navigate, define the locator before using it, fill, submit, then assert.",
      ),
    ],
  ),

  topic(
    20,
    [
      slide(
        "Filtering locators",
        [
          "`locator.filter({ hasText: 'Pro' })` keeps elements containing that text.",
          "`filter({ has: page.getByRole('button') })` keeps elements containing a matching child.",
          "`hasNot` and `hasNotText` exclude elements.",
          "`.first()`, `.last()`, `.nth(i)` pick by position; chain locators to scope searches.",
        ],
        `const row = page.getByRole('listitem').filter({ hasText: 'Product 2' });
await row.getByRole('button', { name: 'Add to cart' }).click();

const inStock = page.locator('.card').filter({ hasNotText: 'Sold out' });
await expect(inStock).toHaveCount(4);`,
      ),
    ],
    [
      mcq(
        "Which filter keeps only list items that contain a 'Delete' button?",
        ["filter({ hasText: 'button' })", "filter({ has: page.getByRole('button', { name: 'Delete' }) })", "filter({ nth: 'Delete' })", "filter('Delete')"],
        1,
        "`has` takes a locator that must match inside each element.",
      ),
      mcq("`page.getByRole('row').nth(2)` selects:", ["The second row", "The third row", "Rows 0 to 2", "The last row"], 1, "nth is zero-based, so nth(2) is the third match."),
      fill(
        "Keep only cards that do NOT contain the text 'Out of stock':",
        "page.locator('.card').filter({ ___: 'Out of stock' })",
        ["hasNotText"],
        "hasNotText excludes elements containing the text.",
        ["hasNotText", "hasText", "has", "not"],
      ),
      match(
        "Match the filter option to its meaning:",
        [
          ["hasText", "Contains the text"],
          ["hasNotText", "Does not contain the text"],
          ["has", "Contains a matching child locator"],
          ["hasNot", "Does not contain a matching child locator"],
        ],
        "Combine these to precisely target dynamic lists.",
      ),
      order(
        "Arrange the lines to delete the row for 'John':",
        [
          "const rows = page.getByRole('row');",
          "const john = rows.filter({ hasText: 'John' });",
          "await john.getByRole('button', { name: 'Delete' }).click();",
          "await expect(john).toHaveCount(0);",
        ],
        "Get all rows, filter to John's row, click its Delete button, then assert it is gone.",
      ),
    ],
  ),

  topic(
    21,
    [
      slide(
        "CSS locators",
        [
          "`#id`, `.class`, `tag` and attribute selectors like `[type=\"email\"]`.",
          "Partial attribute matches: `^=` starts with, `$=` ends with, `*=` contains.",
          "`div > a` selects direct children; `div a` selects any descendant.",
          "Playwright adds pseudo-classes like `:has-text(\"Login\")` and `:visible`.",
        ],
        `page.locator('#username');
page.locator('input[type="password"]');
page.locator('a[href^="/products"]');       // href starts with
page.locator('ul.menu > li:nth-child(2)');
page.locator('button:has-text("Login")');`,
      ),
    ],
    [
      mcq("Which CSS selector matches an element with id 'email'?", [".email", "#email", "[email]", "email#"], 1, "# targets id; . targets class."),
      mcq(
        "`a[href$='.pdf']` matches links whose href:",
        ["Starts with .pdf", "Ends with .pdf", "Contains .pdf anywhere", "Equals .pdf"],
        1,
        "$= means 'ends with'. ^= is starts with and *= is contains.",
      ),
      fill(
        "Select inputs whose name attribute contains 'phone':",
        "page.locator('input[name___\"phone\"]')",
        ["*="],
        "*= matches when the attribute value contains the substring.",
        ["*=", "^=", "$=", "~"],
      ),
      match(
        "Match the CSS selector to what it targets:",
        [
          ["form > input", "input that is a direct child of form"],
          ["form input", "input anywhere inside form"],
          [".btn.primary", "Element with both classes"],
          ["li:nth-child(3)", "The third li among its siblings"],
        ],
        "Combinators and pseudo-classes give precise control.",
      ),
      order(
        "Arrange the lines to fill and verify the email field using a CSS locator:",
        ["const email = page.locator('input#email');", "await email.fill('qa@test.io');", "await expect(email).toHaveValue('qa@test.io');"],
        "Create the locator, fill it, then assert the value.",
        ["await page.locator('email').fill('qa@test.io');"],
      ),
    ],
  ),

  topic(
    22,
    [
      slide(
        "XPath locators",
        [
          "Relative XPath starts with `//`; absolute XPath starts at `/html` and is brittle.",
          "`//input[@id='email']` matches by attribute; `//button[text()='Save']` by exact text.",
          "`contains()` and `starts-with()` match partially; combine conditions with `and` / `or`.",
          "Axes navigate relationships: `parent::`, `following-sibling::`, `ancestor::`.",
        ],
        `page.locator("//input[@name='q']");
page.locator("//a[contains(@href, 'cart')]");
page.locator("//button[starts-with(@id, 'save') and @type='submit']");
page.locator("//td[text()='John']/following-sibling::td[1]");`,
      ),
    ],
    [
      mcq(
        "Why is relative XPath (`//`) preferred over absolute XPath (`/html/body/...`)?",
        ["It is faster to type", "It breaks less when page structure changes", "Absolute XPath is not supported", "Relative XPath ignores attributes"],
        1,
        "Absolute paths depend on the entire DOM structure and break on small layout changes.",
      ),
      mcq(
        "Which XPath finds a td that comes after the td with text 'Alice' in the same row?",
        ["//td[text()='Alice']/parent::td", "//td[text()='Alice']/following-sibling::td", "//td[text()='Alice']/ancestor::td", "//td[@text='Alice']/td"],
        1,
        "following-sibling:: selects siblings after the current node.",
      ),
      fill(
        "Match a link whose href contains 'logout':",
        "//a[___(@href, 'logout')]",
        ["contains"],
        "contains(attribute, substring) does a partial match.",
        ["contains", "starts-with", "text", "has"],
      ),
      match(
        "Match the XPath piece to its meaning:",
        [
          ["@class", "An attribute"],
          ["text()", "The element's text node"],
          ["parent::", "Move up one level"],
          ["ancestor::", "Any element above in the tree"],
        ],
        "XPath combines attributes, text and axes.",
      ),
      order(
        "Build the XPath for 'the Edit button in the row containing Bob' (arrange the parts):",
        ["//td[text()='Bob']", "/parent::tr", "//button[text()='Edit']"],
        "Find the cell, go up to its row, then search down for the button.",
      ),
    ],
  ),
];
