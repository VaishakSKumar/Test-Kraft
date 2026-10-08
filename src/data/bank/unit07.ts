import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    37,
    [
      slide(
        "Assertions and auto-waiting",
        [
          "Web-first assertions like `toBeVisible()`, `toHaveText()` and `toHaveURL()` retry until they pass or time out (5s by default).",
          "Before actions, Playwright checks the element is attached, visible, stable, enabled and receiving events.",
          "Negate with `.not`: `await expect(spinner).not.toBeVisible();`",
          "`expect.soft()` records a failure but lets the test continue.",
        ],
        `await expect(page).toHaveURL(/dashboard/);
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByRole('listitem')).toHaveCount(3);
await expect.soft(page.getByText('Beta')).toBeVisible();
await expect(page.locator('.spinner')).not.toBeVisible({ timeout: 10_000 });`,
      ),
    ],
    [
      mcq(
        "What is the main advantage of `await expect(locator).toHaveText('Done')` over reading the text and comparing it?",
        ["It is shorter", "It retries until the text matches or times out", "It ignores case", "It doesn't need await"],
        1,
        "Web-first assertions auto-retry, so they handle elements that update asynchronously.",
      ),
      mcq(
        "What does `expect.soft()` do on failure?",
        ["Stops the test immediately", "Logs a warning only", "Marks the test failed but continues running it", "Retries the test"],
        2,
        "Soft assertions collect failures; the test still fails at the end.",
      ),
      fill(
        "Assert a loading spinner disappears:",
        "await expect(page.locator('.spinner'))___toBeVisible();",
        [".not."],
        "`.not` negates any matcher.",
        [".not.", ".never.", ".no.", ".false."],
      ),
      match(
        "Match the assertion to what it checks:",
        [
          ["toHaveURL()", "The page URL"],
          ["toHaveTitle()", "The document title"],
          ["toContainText()", "Element text includes a substring"],
          ["toHaveAttribute('href', '/x')", "An attribute value"],
        ],
        "Pick the most specific web-first assertion for the job.",
      ),
      order(
        "Arrange the lines to verify a successful search:",
        [
          "const search = page.getByRole('searchbox');",
          "await search.fill('shoes');",
          "await search.press('Enter');",
          "await expect(page).toHaveURL(/search\\?q=shoes/);",
        ],
        "Locate the box, type, submit, then assert the URL. The assertion retries until navigation finishes.",
      ),
    ],
  ),

  topic(
    38,
    [
      slide(
        "Cookies",
        [
          "Cookies belong to the BrowserContext, not the page.",
          "`context.cookies()` reads them; `context.addCookies([...])` sets them; `context.clearCookies()` removes them.",
          "A cookie needs a name, a value, and either a url or a domain plus path.",
          "`context.storageState({ path })` saves cookies and localStorage so you can reuse a login.",
        ],
        `await context.addCookies([
  { name: 'session', value: 'abc123', domain: 'shop.test', path: '/' },
]);
const cookies = await context.cookies();
expect(cookies.find(c => c.name === 'session')?.value).toBe('abc123');
await context.clearCookies();`,
      ),
    ],
    [
      mcq("Which object owns cookies in Playwright?", ["Page", "BrowserContext", "Browser", "Locator"], 1, "Cookies are stored per context, shared by all pages in it."),
      mcq(
        "What is the main benefit of saving `storageState` after logging in?",
        ["Smaller reports", "Reuse the authenticated session in other tests without logging in again", "Faster screenshots", "It encrypts passwords"],
        1,
        "Load the saved state with `use: { storageState: 'auth.json' }` to skip the UI login.",
      ),
      fill(
        "Remove all cookies from the current context:",
        "await ___.clearCookies();",
        ["context"],
        "clearCookies is a BrowserContext method.",
        ["context", "page", "browser", "request"],
      ),
      match(
        "Match the method to its effect:",
        [
          ["context.cookies()", "Read cookies"],
          ["context.addCookies()", "Set cookies"],
          ["context.clearCookies()", "Delete cookies"],
          ["context.storageState()", "Export cookies and local storage"],
        ],
        "These let you control sessions precisely.",
      ),
      order(
        "Arrange the lines to save a logged-in session:",
        [
          "await page.goto('/login');",
          "await page.getByRole('button', { name: 'Sign in' }).click();",
          "await expect(page).toHaveURL(/home/);",
          "await page.context().storageState({ path: 'auth.json' });",
        ],
        "Log in, confirm it worked, then save the state.",
      ),
    ],
  ),

  topic(
    39,
    [
      slide(
        "Local and session storage",
        [
          "Web storage lives in the page's JavaScript context; access it with `page.evaluate()`.",
          "`localStorage` persists across reloads and tabs on the same origin; `sessionStorage` lasts for one tab session.",
          "Values are always strings, so use `JSON.stringify` / `JSON.parse` for objects.",
          "`storageState()` captures localStorage (not sessionStorage) along with cookies.",
        ],
        `await page.evaluate(() => localStorage.setItem('theme', 'dark'));
const theme = await page.evaluate(() => localStorage.getItem('theme'));
expect(theme).toBe('dark');
await page.evaluate(() => sessionStorage.clear());`,
      ),
    ],
    [
      mcq(
        "How do you read localStorage in a Playwright test?",
        ["page.localStorage.get()", "page.evaluate(() => localStorage.getItem('k'))", "context.storage('k')", "page.getStorage('k')"],
        1,
        "page.evaluate runs code in the browser where localStorage exists.",
      ),
      mcq(
        "Which storage is cleared when the tab is closed?",
        ["localStorage", "sessionStorage", "Cookies with an expiry", "IndexedDB"],
        1,
        "sessionStorage is scoped to a single tab session.",
      ),
      fill(
        "Store an object in localStorage:",
        "await page.evaluate(() =>\n  localStorage.setItem('user', JSON.___({ id: 1 }))\n);",
        ["stringify"],
        "Web storage stores strings; JSON.stringify converts the object.",
        ["stringify", "parse", "toString", "encode"],
      ),
      match(
        "Match the call to its effect:",
        [
          ["localStorage.setItem(k, v)", "Save a value"],
          ["localStorage.getItem(k)", "Read a value"],
          ["localStorage.removeItem(k)", "Delete one key"],
          ["localStorage.clear()", "Delete all keys"],
        ],
        "The same API exists on sessionStorage.",
      ),
      order(
        "Arrange the lines to set a feature flag and reload:",
        [
          "await page.goto('/');",
          "await page.evaluate(() => localStorage.setItem('newCheckout', 'true'));",
          "await page.reload();",
          "await expect(page.getByText('New checkout')).toBeVisible();",
        ],
        "Open the origin first (storage is per origin), set the flag, reload to apply, assert.",
      ),
    ],
  ),

  topic(
    40,
    [
      slide(
        "Data-driven testing",
        [
          "Generate one test per data row by looping and calling `test()` inside the loop.",
          "Each generated test needs a unique title, usually built from the data.",
          "Import JSON directly; parse CSV with a library like csv-parse, and Excel with xlsx.",
          "Keep test data in a data/ folder, separate from test logic.",
        ],
        `import data from './data/logins.json';

for (const { user, pass, expected } of data) {
  test(\`login as \${user}\`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('User').fill(user);
    await page.getByLabel('Password').fill(pass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('alert')).toHaveText(expected);
  });
}`,
      ),
    ],
    [
      mcq(
        "Why must each generated test have a unique title?",
        ["For speed", "Playwright reports an error on duplicate titles in the same file", "Titles become file names", "It's only a convention"],
        1,
        "Duplicate test titles in the same scope cause an error.",
      ),
      mcq(
        "Which library is commonly used to read .xlsx files in Node?",
        ["xlsx (SheetJS)", "csv-parse", "fs-excel", "playwright-excel"],
        0,
        "SheetJS (xlsx) reads and writes Excel workbooks.",
      ),
      fill(
        "Generate one test per item in `cases`:",
        "___ (const c of cases) {\n  test(`search ${c.term}`, async ({ page }) => {\n    // ...\n  });\n}",
        ["for"],
        "A for...of loop around test() registers one test per row.",
        ["for", "while", "test.each", "map"],
      ),
      match(
        "Match the data source to how you read it:",
        [
          ["JSON", "import data from './data.json'"],
          ["CSV", "parse(fs.readFileSync(file), { columns: true })"],
          ["Excel", "XLSX.utils.sheet_to_json(sheet)"],
          ["Inline", "const rows = [{ a: 1 }, { a: 2 }]"],
        ],
        "All approaches end with an array of objects to loop over.",
      ),
      order(
        "Arrange the lines to run a test for each CSV row:",
        [
          "const records = parse(fs.readFileSync('data/users.csv'), { columns: true });",
          "for (const record of records) {",
          "  test(`user ${record.name}`, async ({ page }) => {",
          "    await page.getByLabel('Name').fill(record.name);",
          "  });",
          "}",
        ],
        "Parse the file first, then loop and declare a test per record.",
      ),
    ],
  ),

  topic(
    41,
    [
      slide(
        "Grouping, hooks, annotations and tags",
        [
          "`test.describe()` groups related tests; hooks can be scoped to a describe block.",
          "`beforeEach`/`afterEach` run around every test; `beforeAll`/`afterAll` once per worker.",
          "Annotations: `test.skip`, `test.only`, `test.fixme`, `test.fail`, `test.slow`.",
          "Tag tests with `{ tag: '@smoke' }` (or '@smoke' in the title) and filter with `--grep @smoke`.",
        ],
        `test.describe('cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart');
  });

  test('adds item', { tag: '@smoke' }, async ({ page }) => { /* ... */ });
  test.fixme('applies coupon', async ({ page }) => { /* known bug */ });
});
// npx playwright test --grep @smoke`,
      ),
    ],
    [
      mcq(
        "Which hook runs once per worker before all tests in its scope?",
        ["beforeEach", "beforeAll", "setup", "beforeSuite"],
        1,
        "beforeAll runs once per worker process for the scope.",
      ),
      mcq(
        "Which annotation marks a test as a known broken one to be fixed (and skips it)?",
        ["test.fail", "test.fixme", "test.slow", "test.only"],
        1,
        "test.fixme skips the test and marks it as needing a fix. test.fail expects it to fail and runs it.",
      ),
      fill(
        "Run only tests tagged @regression:",
        "npx playwright test ___ @regression",
        [["--grep", "-g"]],
        "--grep (or -g) filters tests by a pattern matched against titles and tags.",
        ["--grep", "--tag", "--only", "--filter"],
      ),
      match(
        "Match the annotation to its behavior:",
        [
          ["test.only", "Run only this test"],
          ["test.skip", "Do not run this test"],
          ["test.fail", "Expect this test to fail"],
          ["test.slow", "Triple the timeout"],
        ],
        "Remember to remove test.only before committing; use forbidOnly in CI.",
      ),
      order(
        "Arrange a describe block with a beforeEach hook and one test:",
        [
          "test.describe('profile', () => {",
          "  test.beforeEach(async ({ page }) => { await page.goto('/profile'); });",
          "  test('shows name', async ({ page }) => { await expect(page.getByText('Ana')).toBeVisible(); });",
          "});",
        ],
        "Open the describe, declare the hook, then the test, then close the block.",
      ),
    ],
  ),
];
