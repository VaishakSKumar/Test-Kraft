import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    42,
    [
      slide(
        "Screenshots, videos, traces and flaky tests",
        [
          "`page.screenshot({ path, fullPage: true })` captures the page; `locator.screenshot()` captures one element.",
          "In config, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'` and `trace: 'on-first-retry'` capture evidence automatically.",
          "Open traces with `npx playwright show-trace trace.zip` to see each action, DOM snapshot and network call.",
          "Flaky tests come from timing, shared state or test order. Fix the cause; use `retries` only as a safety net.",
        ],
        `// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});`,
      ),
    ],
    [
      mcq(
        "Which trace setting records a trace only when a failed test is retried?",
        ["'on'", "'off'", "'on-first-retry'", "'always'"],
        2,
        "on-first-retry keeps overhead low and still captures traces for failures.",
      ),
      mcq(
        "What is the best long-term fix for a flaky test?",
        ["Increase retries to 5", "Add waitForTimeout(5000)", "Find and fix the root cause, e.g. a missing web-first assertion or shared state", "Delete the test"],
        2,
        "Retries hide flakiness. Root-cause fixes make the suite trustworthy.",
      ),
      fill(
        "Take a screenshot of the whole scrollable page:",
        "await page.screenshot({ path: 'home.png', ___: true });",
        ["fullPage"],
        "fullPage: true captures beyond the viewport.",
        ["fullPage", "full", "entire", "scroll"],
      ),
      match(
        "Match the artifact to when it helps most:",
        [
          ["Screenshot", "See the final visual state"],
          ["Video", "Watch the whole run"],
          ["Trace", "Step through actions, DOM and network"],
          ["Retries", "Detect flaky tests in reports"],
        ],
        "Traces are the most powerful debugging artifact.",
      ),
      order(
        "Order the steps to debug a failed CI test with a trace:",
        ["Set trace: 'on-first-retry' in config", "Run the tests in CI", "Download the trace.zip artifact", "npx playwright show-trace trace.zip"],
        "Enable traces, run, download, then open in the Trace Viewer.",
      ),
    ],
  ),

  topic(
    43,
    [
      slide(
        "Reporters and Allure",
        [
          "Built-in reporters: list, line, dot, html, json, junit, blob.",
          "Configure one or many: `reporter: [['list'], ['html', { open: 'never' }]]`.",
          "`npx playwright show-report` opens the HTML report.",
          "Allure: install allure-playwright, add it as a reporter, then `allure generate` and `allure open`.",
        ],
        `// playwright.config.ts
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'results/junit.xml' }],
  ['allure-playwright'],
],
// npx allure generate allure-results --clean && npx allure open`,
      ),
    ],
    [
      mcq(
        "Which reporter produces XML that CI servers like Jenkins understand natively?",
        ["dot", "junit", "line", "html"],
        1,
        "JUnit XML is a widely supported test result format.",
      ),
      mcq(
        "Which folder does allure-playwright write raw results to by default?",
        ["playwright-report", "allure-results", "test-results", "reports/allure"],
        1,
        "Raw results go to allure-results; `allure generate` builds the HTML report.",
      ),
      fill(
        "Open the last HTML report:",
        "npx playwright ___",
        ["show-report"],
        "show-report serves the HTML report locally.",
        ["show-report", "report", "open-report", "show-trace"],
      ),
      match(
        "Match the reporter to its output:",
        [
          ["list", "One line per test in the terminal"],
          ["dot", "A dot per test, compact"],
          ["html", "Interactive web report"],
          ["json", "Machine-readable results file"],
        ],
        "Combine a terminal reporter with a file reporter.",
      ),
      order(
        "Order the steps to produce an Allure report:",
        ["npm install -D allure-playwright allure-commandline", "Add ['allure-playwright'] to reporter in config", "npx playwright test", "npx allure generate allure-results --clean", "npx allure open"],
        "Install, configure, run tests, generate, then open.",
      ),
    ],
  ),

  topic(
    44,
    [
      slide(
        "Page Object Model",
        [
          "A page object is a class representing one page or component.",
          "It stores locators (usually in the constructor) and exposes user-level actions such as `login()`.",
          "Tests call page object methods instead of raw locators, so a UI change is fixed in one place.",
          "Keep assertions in tests (or in clearly named verify methods), not hidden in actions.",
        ],
        `export class LoginPage {
  readonly user: Locator;
  readonly pass: Locator;
  readonly submit: Locator;

  constructor(private page: Page) {
    this.user = page.getByLabel('Username');
    this.pass = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Login' });
  }

  async login(u: string, p: string) {
    await this.user.fill(u);
    await this.pass.fill(p);
    await this.submit.click();
  }
}`,
      ),
    ],
    [
      mcq(
        "What is the main benefit of the Page Object Model?",
        ["Tests run faster", "Locators and actions are reused, so UI changes are fixed in one place", "No assertions are needed", "It replaces fixtures"],
        1,
        "POM centralizes page knowledge and improves maintainability.",
      ),
      mcq(
        "Where are locators typically defined in a Playwright page object?",
        ["In each test", "In the constructor as readonly properties", "In playwright.config.ts", "In a global variable"],
        1,
        "Locators are lazy, so creating them in the constructor is cheap and clear.",
      ),
      fill(
        "Use the page object in a test:",
        "test('login', async ({ page }) => {\n  const login = ___ LoginPage(page);\n  await login.___('admin', 'secret');\n});",
        ["new", "login"],
        "Instantiate with new, passing the page, then call its action method.",
        ["new", "login", "create", "this"],
      ),
      match(
        "Match the POM element to its responsibility:",
        [
          ["Constructor", "Receive page and define locators"],
          ["Action method", "Perform a user flow, like login()"],
          ["Test file", "Arrange, act and assert using page objects"],
          ["BasePage", "Shared helpers inherited by pages"],
        ],
        "Clear responsibilities keep the framework scalable.",
      ),
      order(
        "Arrange a page object class:",
        [
          "export class SearchPage {",
          "  readonly box: Locator;",
          "  constructor(private page: Page) { this.box = page.getByRole('searchbox'); }",
          "  async search(term: string) { await this.box.fill(term); await this.box.press('Enter'); }",
          "}",
        ],
        "Class, property declaration, constructor, action method, close.",
      ),
    ],
  ),

  topic(
    45,
    [
      slide(
        "Playwright MCP",
        [
          "MCP (Model Context Protocol) is an open standard that lets AI assistants call external tools.",
          "Playwright MCP (`@playwright/mcp`) is an MCP server exposing browser tools such as navigate, click, type and snapshot.",
          "It uses accessibility snapshots (structured page data) by default instead of screenshots, so it is fast and deterministic.",
          "Add it to an MCP client (VS Code, Claude Code, Cursor...), then ask the AI to explore a site or write tests.",
        ],
        `// MCP client config (e.g. .vscode/mcp.json or claude mcp add)
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}`,
      ),
    ],
    [
      mcq(
        "What does Playwright MCP use by default to describe the page to the AI?",
        ["Screenshots and OCR", "Accessibility snapshots", "Raw HTML only", "Video recordings"],
        1,
        "Accessibility snapshots give structured, compact page data the model can act on reliably.",
      ),
      mcq(
        "What is an MCP server?",
        ["A web server that hosts tests", "A program exposing tools an AI client can call through the Model Context Protocol", "A CI runner", "A proxy for network mocking"],
        1,
        "MCP servers provide tools and resources; MCP clients (AI apps) call them.",
      ),
      fill(
        "Start the Playwright MCP server with npx:",
        "npx ___",
        [["@playwright/mcp@latest", "@playwright/mcp"]],
        "The package is @playwright/mcp.",
        ["@playwright/mcp@latest", "playwright mcp", "@playwright/test", "mcp-playwright"],
      ),
      match(
        "Match the concept to its description:",
        [
          ["MCP client", "AI app that calls tools (e.g. VS Code, Claude)"],
          ["MCP server", "Exposes tools, e.g. @playwright/mcp"],
          ["browser_snapshot", "Returns the page's accessibility tree"],
          ["Human review", "Checking AI-generated tests before committing"],
        ],
        "AI can drive the browser, but you remain responsible for test quality.",
      ),
      order(
        "Order the mini-project workflow:",
        [
          "Add the Playwright MCP server to your AI client",
          "Ask the AI to explore the app's checkout flow",
          "Ask it to write a Playwright test for the flow",
          "Run the test with npx playwright test and review it",
        ],
        "Configure, explore, generate, then verify.",
      ),
    ],
  ),

  topic(
    46,
    [
      slide(
        "Playwright Agents: planner, generator, healer",
        [
          "`npx playwright init-agents --loop=vscode` (or claude, opencode) adds agent definitions to your project.",
          "Planner explores the app and writes a Markdown test plan (in specs/).",
          "Generator turns the plan into Playwright test files, verifying selectors live.",
          "Healer runs failing tests, inspects the UI, and patches locators or waits until they pass.",
        ],
        `# set up agents for your AI loop
npx playwright init-agents --loop=claude

# typical flow
# 1. planner   -> specs/checkout.md
# 2. generator -> tests/checkout.spec.ts
# 3. healer    -> fixes failing steps
# A seed test (tests/seed.spec.ts) sets up the environment the agents start from.`,
      ),
    ],
    [
      mcq(
        "Which agent produces a human-readable Markdown test plan?",
        ["Generator", "Healer", "Planner", "Reporter"],
        2,
        "The planner explores and writes the plan; the generator writes code.",
      ),
      mcq(
        "What does the healer agent do?",
        ["Writes the test plan", "Runs failing tests and repairs them", "Deploys the app", "Generates reports"],
        1,
        "The healer replays failures, inspects the current UI and suggests fixes.",
      ),
      fill(
        "Initialize Playwright agents for Claude Code:",
        "npx playwright ___ --loop=claude",
        ["init-agents"],
        "init-agents generates the agent definitions for your chosen AI loop.",
        ["init-agents", "agents", "codegen", "init"],
      ),
      match(
        "Match the agent to its output:",
        [
          ["Planner", "Markdown test plan"],
          ["Generator", "Playwright .spec.ts files"],
          ["Healer", "Patched, passing tests"],
          ["Seed test", "Starting state and fixtures for the agents"],
        ],
        "The agents form a plan, generate, heal loop.",
      ),
      order(
        "Order the agent loop:",
        ["Planner explores the app", "Planner writes specs/plan.md", "Generator creates tests from the plan", "Healer fixes any failing tests"],
        "Plan, then generate, then heal.",
      ),
    ],
  ),
];
