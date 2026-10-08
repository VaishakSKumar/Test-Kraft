import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    53,
    [
      slide(
        "Accessibility and visual testing",
        [
          "Accessibility: `new AxeBuilder({ page }).analyze()` from @axe-core/playwright returns violations.",
          "Assert `results.violations` is empty, or scope checks with `.include()` and `.withTags(['wcag2a'])`.",
          "Visual: `await expect(page).toHaveScreenshot()` compares against a stored baseline image.",
          "Update baselines with `--update-snapshots`; tolerate noise with `maxDiffPixels` and `mask` dynamic areas.",
        ],
        `import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
expect(results.violations).toEqual([]);

await expect(page).toHaveScreenshot('home.png', {
  mask: [page.locator('.clock')],
  maxDiffPixels: 100,
});`,
      ),
    ],
    [
      mcq(
        "What happens the first time `toHaveScreenshot()` runs with no baseline?",
        ["It passes silently", "It writes the baseline and fails, asking you to review it", "It throws a syntax error", "It downloads a baseline"],
        1,
        "The first run creates the snapshot and reports a failure so you can review and commit it.",
      ),
      mcq(
        "Which package provides AxeBuilder for Playwright?",
        ["axe-playwright-core", "@axe-core/playwright", "playwright-a11y", "@playwright/axe"],
        1,
        "@axe-core/playwright integrates the axe engine.",
      ),
      fill(
        "Hide a changing timestamp from a visual comparison:",
        "await expect(page).toHaveScreenshot({ ___: [page.locator('.timestamp')] });",
        ["mask"],
        "mask covers the given locators with a box before comparing.",
        ["mask", "hide", "ignore", "exclude"],
      ),
      match(
        "Match the option to its purpose:",
        [
          ["--update-snapshots", "Accept new baseline images"],
          ["maxDiffPixels", "Allow small pixel differences"],
          ["withTags(['wcag2a'])", "Limit axe rules to a standard"],
          ["results.violations", "List of accessibility issues"],
        ],
        "Both kinds of testing catch regressions functional tests miss.",
      ),
      order(
        "Arrange an accessibility test:",
        [
          "test('home is accessible', async ({ page }) => {",
          "  await page.goto('/');",
          "  const results = await new AxeBuilder({ page }).analyze();",
          "  expect(results.violations).toEqual([]);",
          "});",
        ],
        "Navigate, scan, then assert there are no violations.",
      ),
    ],
  ),

  topic(
    54,
    [
      slide(
        "Database testing",
        [
          "Validate that UI or API actions produce the correct rows in the backend database.",
          "Use a Node driver such as mysql2 or pg to connect from the test.",
          "Use parameterized queries (`?` or `$1`) instead of string concatenation to avoid SQL injection.",
          "Read credentials from environment variables, and close connections after tests.",
        ],
        `import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: 'shop',
});
const [rows] = await db.execute('SELECT status FROM orders WHERE id = ?', [orderId]);
expect(rows[0].status).toBe('PAID');
await db.end();`,
      ),
    ],
    [
      mcq(
        "Why use `WHERE id = ?` with a values array instead of string concatenation?",
        ["It's faster to type", "It prevents SQL injection and quoting bugs", "MySQL requires it", "It returns more rows"],
        1,
        "Parameterized queries escape values safely.",
      ),
      mcq(
        "When is database validation most useful in UI tests?",
        ["To check CSS", "To confirm a UI action persisted the correct data", "To speed up page loads", "To replace assertions"],
        1,
        "DB checks prove the backend state, not just what the UI shows.",
      ),
      fill(
        "Close the MySQL connection after the test:",
        "test.___(async () => {\n  await db.___();\n});",
        ["afterAll", "end"],
        "Clean up connections in afterAll so workers exit cleanly.",
        ["afterAll", "end", "beforeAll", "close"],
      ),
      match(
        "Match the item to its role in DB testing:",
        [
          ["mysql2 / pg", "Database drivers"],
          ["Environment variables", "Hold credentials"],
          ["Parameterized query", "Safe value substitution"],
          ["Cleanup step", "Remove test data afterwards"],
        ],
        "Keep DB tests safe, isolated and repeatable.",
      ),
      order(
        "Arrange the lines to verify a new user row after signup:",
        [
          "await page.getByRole('button', { name: 'Sign up' }).click();",
          "await expect(page.getByText('Welcome')).toBeVisible();",
          "const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);",
          "expect(rows).toHaveLength(1);",
        ],
        "Submit, wait for confirmation in the UI, query the DB, assert.",
      ),
    ],
  ),

  topic(
    55,
    [
      slide(
        "Custom fixtures",
        [
          "`test.extend<{...}>({...})` creates a new `test` with extra fixtures.",
          "A fixture function sets up a value, passes it to `use(value)`, then runs teardown after use returns.",
          "Fixtures are lazy: they run only for tests that request them.",
          "Scopes: test-scoped (default) or `{ scope: 'worker' }`; `{ auto: true }` runs for every test.",
        ],
        `type Fixtures = { loginPage: LoginPage };

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);        // test runs here
    // teardown code goes after use()
  },
});

test('login', async ({ loginPage }) => { await loginPage.login('qa', 'pw'); });`,
      ),
    ],
    [
      mcq(
        "In a fixture, where does teardown code go?",
        ["Before use()", "After await use(value)", "In playwright.config.ts", "In a separate afterEach only"],
        1,
        "Everything after `await use()` runs once the test finishes.",
      ),
      mcq(
        "When does a non-auto fixture run?",
        ["For every test", "Only for tests that request it", "Once per project", "Only in CI"],
        1,
        "Fixtures are on-demand unless marked auto.",
      ),
      fill(
        "Create a test with a custom fixture:",
        "export const test = base.___<{ api: ApiClient }>({\n  api: async ({ request }, ___) => {\n    await use(new ApiClient(request));\n  },\n});",
        ["extend", "use"],
        "test.extend defines fixtures; the second parameter is the use callback.",
        ["extend", "use", "fixture", "done"],
      ),
      match(
        "Match the fixture option to its meaning:",
        [
          ["scope: 'test'", "New instance per test (default)"],
          ["scope: 'worker'", "Shared across tests in a worker"],
          ["auto: true", "Runs even if not requested"],
          ["await use(x)", "Hands x to the test"],
        ],
        "Fixtures replace most beforeEach/afterEach boilerplate.",
      ),
      order(
        "Arrange a fixture that creates and deletes test data:",
        [
          "todo: async ({ request }, use) => {",
          "  const todo = await (await request.post('/api/todos', { data: { title: 't' } })).json();",
          "  await use(todo);",
          "  await request.delete(`/api/todos/${todo.id}`);",
          "},",
        ],
        "Set up, hand to the test with use, then tear down.",
      ),
    ],
  ),
];
