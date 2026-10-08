export interface Unit {
  id: number;
  title: string;
}

export interface Topic {
  id: number;
  unit: number;
  title: string;
  /** What the topic covers. Used for the topic sheet and to ground AI generation. */
  focus: string;
  xp: number;
}

export const COURSE_TITLE = "Playwright with TypeScript (Web & API Testing)";

export const UNITS: Unit[] = [
  { id: 1, title: "TypeScript Foundations" },
  { id: 2, title: "TypeScript Functions & Collections" },
  { id: 3, title: "TypeScript OOP" },
  { id: 4, title: "Playwright Locators" },
  { id: 5, title: "Playwright Actions & UI Components" },
  { id: 6, title: "Browser, Pages & Advanced UI" },
  { id: 7, title: "Assertions, Storage & Test Design" },
  { id: 8, title: "Reporting, POM & AI Tooling" },
  { id: 9, title: "API Testing" },
  { id: 10, title: "Specialized Testing & Fixtures" },
  { id: 11, title: "AI Framework & CI/CD" },
];

export const TOPICS: Topic[] = [
  { id: 1, unit: 1, xp: 50, title: "Introduction", focus: "What test automation is, why Playwright, how the course is structured, test pyramid, Playwright vs Selenium/Cypress" },
  { id: 2, unit: 1, xp: 50, title: "Introduction to TypeScript & Setup Environment", focus: "Node.js, npm, VS Code, installing TypeScript, tsc compiler, tsconfig.json, ts-node/tsx, running a .ts file" },
  { id: 3, unit: 1, xp: 50, title: "TypeScript Variables", focus: "let vs const vs var, block scope, hoisting, type annotations, type inference, naming rules" },
  { id: 4, unit: 1, xp: 50, title: "Data Types in TypeScript", focus: "string, number, boolean, null, undefined, any, unknown, never, void, union types, literal types, tuples, enums" },
  { id: 5, unit: 1, xp: 50, title: "Operators in TypeScript", focus: "arithmetic, assignment, comparison (== vs ===), logical, ternary, nullish coalescing ??, optional chaining ?., typeof" },
  { id: 6, unit: 1, xp: 75, title: "Conditional Statements", focus: "if/else, else if, switch, truthy/falsy values, ternary for simple branching" },
  { id: 7, unit: 1, xp: 75, title: "Loops in TypeScript", focus: "for, while, do-while, for...of vs for...in, break and continue, iterating arrays of test data" },
  { id: 8, unit: 2, xp: 75, title: "Functions - Part1", focus: "function declarations, parameter and return types, arrow functions, void return, function expressions" },
  { id: 9, unit: 2, xp: 75, title: "Functions - Part 2", focus: "optional and default parameters, rest parameters, callbacks, async functions, Promises, async/await" },
  { id: 10, unit: 2, xp: 75, title: "Arrays in TypeScript", focus: "typed arrays string[] and Array<T>, index access, length, push/pop/shift/unshift, multi-dimensional arrays, readonly arrays" },
  { id: 11, unit: 2, xp: 75, title: "Array Methods- Part1", focus: "forEach, map, filter, find, findIndex, includes, indexOf" },
  { id: 12, unit: 2, xp: 75, title: "Array Methods-Part2", focus: "reduce, some, every, sort with comparator, slice vs splice, concat, join, flat, spread" },
  { id: 13, unit: 2, xp: 50, title: "Strings", focus: "template literals, length, toUpperCase/toLowerCase, trim, includes, startsWith, split, replace, substring, slice" },
  { id: 14, unit: 2, xp: 75, title: "Objects", focus: "object literals, type aliases for objects, property access, destructuring, spread, Object.keys/values/entries, nested objects" },
  { id: 15, unit: 3, xp: 100, title: "Read Only, Optional Properties & Overloading", focus: "readonly modifier, optional ? properties, function overload signatures, Partial and Readonly utility types" },
  { id: 16, unit: 3, xp: 100, title: "Inheritance", focus: "classes, constructors, extends, super, method overriding, public/private/protected, abstract classes" },
  { id: 17, unit: 3, xp: 100, title: "Interface and Modules", focus: "interface declarations, implements, extending interfaces, interface vs type, ES modules import/export, default vs named exports" },
  { id: 18, unit: 4, xp: 100, title: "Playwright Kick Start", focus: "npm init playwright@latest, project structure, playwright.config.ts, test and expect, page fixture, npx playwright test, --headed, --ui, codegen" },
  { id: 19, unit: 4, xp: 100, title: "Playwright locators", focus: "getByRole, getByText, getByLabel, getByPlaceholder, getByAltText, getByTitle, getByTestId, page.locator, strictness" },
  { id: 20, unit: 4, xp: 100, title: "Filtering locators", focus: "locator.filter({ hasText, has, hasNot, hasNotText }), nth, first, last, chaining locators, and/or" },
  { id: 21, unit: 4, xp: 100, title: "Locating Elements using CSS Locators", focus: "tag, #id, .class, attribute selectors [attr=value], ^= $= *=, descendant vs child, :nth-child, :has-text pseudo-class" },
  { id: 22, unit: 4, xp: 125, title: "Locating Elements using XPath, Operators and functions in XPath", focus: "absolute vs relative XPath, //tag[@attr], text(), contains(), starts-with(), and/or, axes (parent, following-sibling, ancestor)" },
  { id: 23, unit: 5, xp: 100, title: "Playwright Actions-Input Box & Radio buttons", focus: "fill, pressSequentially, clear, inputValue, check on radio buttons, isChecked, toHaveValue, toBeChecked" },
  { id: 24, unit: 5, xp: 100, title: "Handle checkboxes & Form validations", focus: "check, uncheck, setChecked, isChecked, toBeChecked, looping over checkboxes, validation messages, toBeEnabled/toBeDisabled" },
  { id: 25, unit: 5, xp: 100, title: "Handle Dropdowns -Part 1", focus: "selectOption by value, label and index, toHaveValue on select, counting options, multi-select dropdowns" },
  { id: 26, unit: 5, xp: 100, title: "Handle Dropdowns- Part 2", focus: "custom (non-select) dropdowns, auto-suggest/autocomplete dropdowns, bootstrap dropdowns, clicking option by text, allTextContents" },
  { id: 27, unit: 5, xp: 125, title: "Handle Web table-Part1", focus: "table rows and columns locators, count rows, read cell text, locate a row by text with filter, allInnerTexts" },
  { id: 28, unit: 5, xp: 125, title: "Handle Web table-2 Dynamic & Pagination Tables", focus: "dynamic tables, looping rows, clicking pagination links, collecting data across pages, waiting for table refresh" },
  { id: 29, unit: 5, xp: 125, title: "Handling Date Pickers (Customized Elements)", focus: "filling date inputs directly, navigating calendar widgets (next/prev month), selecting a day, loops until target month/year" },
  { id: 30, unit: 6, xp: 100, title: "Handling Dialogs", focus: "alert, confirm and prompt dialogs, page.on('dialog') / page.once, dialog.accept(text), dialog.dismiss(), dialog.message(), dialog.type()" },
  { id: 31, unit: 6, xp: 150, title: "Browser context,Fixtures & Emulation", focus: "browser vs context vs page, browser.newContext(), isolation, built-in fixtures (page, context, browser, request), devices emulation, viewport, locale, geolocation" },
  { id: 32, unit: 6, xp: 125, title: "Handle multiple tabs, File upload and download", focus: "context.waitForEvent('page'), Promise.all with click, setInputFiles, page.waitForEvent('download'), download.saveAs, suggestedFilename" },
  { id: 33, unit: 6, xp: 100, title: "Handling Mouse and Keyboard actions", focus: "hover, dblclick, click({ button: 'right' }), dragTo, mouse.move/down/up, keyboard.press, keyboard.type, shortcuts like Control+A" },
  { id: 34, unit: 6, xp: 100, title: "Scrolling techniques", focus: "scrollIntoViewIfNeeded, mouse.wheel, page.evaluate(window.scrollTo), infinite scroll loops, auto-scrolling on actions" },
  { id: 35, unit: 6, xp: 150, title: "Handle Shadow DOM & SVG Eelements", focus: "Playwright CSS pierces open shadow roots by default, XPath does not pierce shadow DOM, locating svg elements with *[name()='svg'] or locator('svg')" },
  { id: 36, unit: 6, xp: 125, title: "Handle frames", focus: "page.frameLocator, locator.contentFrame, page.frame({ name, url }), page.frames(), nested iframes" },
  { id: 37, unit: 7, xp: 125, title: "Assertions and Autowaiting", focus: "web-first assertions (toBeVisible, toHaveText, toHaveURL, toHaveTitle, toHaveCount), negation with .not, soft assertions, actionability checks, timeouts" },
  { id: 38, unit: 7, xp: 100, title: "Cookies Storage", focus: "context.cookies(), context.addCookies(), context.clearCookies(), cookie properties, storageState save and reuse for login" },
  { id: 39, unit: 7, xp: 100, title: "Local & session Storage", focus: "page.evaluate with localStorage/sessionStorage getItem/setItem/clear, storageState, persistence differences" },
  { id: 40, unit: 7, xp: 150, title: "Parameterization ( Data Driven Testing with JSON, CSV & Excel Files)", focus: "looping test() over data arrays, importing JSON test data, reading CSV with csv-parse, reading Excel with xlsx, unique test titles" },
  { id: 41, unit: 7, xp: 125, title: "Grouping Tests, Hooks, Annotations & Tagging Tests", focus: "test.describe, beforeEach/afterEach/beforeAll/afterAll, test.only, test.skip, test.fixme, test.fail, test.slow, tags with @smoke and --grep" },
  { id: 42, unit: 8, xp: 125, title: "Capture screenshots, videos, trace files and handle flaky tests", focus: "page.screenshot, fullPage, locator screenshot, config screenshot/video/trace options, npx playwright show-trace, retries, flaky test causes" },
  { id: 43, unit: 8, xp: 125, title: "Playwright Reports & Allure Reports", focus: "list, line, dot, html, json, junit reporters, multiple reporters in config, npx playwright show-report, allure-playwright, allure generate/open" },
  { id: 44, unit: 8, xp: 150, title: "Page Object Model", focus: "page classes with locators in constructor, action methods, using page objects in tests, benefits: reuse and maintainability" },
  { id: 45, unit: 8, xp: 175, title: "Working with Playwright MCP (Model Context Protocol) - Mini Project", focus: "what MCP is, @playwright/mcp server, configuring it in an AI client, accessibility snapshots, letting an AI agent drive the browser, generating tests from exploration" },
  { id: 46, unit: 8, xp: 175, title: "Working with Playwright Agents (Planner, Generator & Healer) -Mini Project", focus: "npx playwright init-agents, planner creates a Markdown test plan, generator turns plans into tests, healer runs and fixes failing tests, seed tests" },
  { id: 47, unit: 9, xp: 125, title: "API Testing basics", focus: "REST concepts, HTTP methods, status codes, headers, JSON bodies, request fixture, APIRequestContext, baseURL" },
  { id: 48, unit: 9, xp: 125, title: "Working with Post and Get Http requests", focus: "request.get with params, request.post with data, response.status(), response.ok(), response.json(), asserting response bodies" },
  { id: 49, unit: 9, xp: 125, title: "Working with Patch, Put & Delete requests", focus: "request.put for full update, request.patch for partial update, request.delete, chaining create-update-delete, 200/204/404 checks" },
  { id: 50, unit: 9, xp: 150, title: "Schema testing, File upload & Download", focus: "JSON schema validation with ajv, multipart uploads in API requests, downloading files via response.body(), content-type checks" },
  { id: 51, unit: 9, xp: 175, title: "Mocking and Network interception", focus: "page.route, route.fulfill with mock JSON, route.continue with overrides, route.abort to block resources, page.waitForResponse, modifying responses" },
  { id: 52, unit: 9, xp: 150, title: "API Authentications", focus: "basic auth, bearer tokens, API keys in headers, extraHTTPHeaders, httpCredentials, OAuth token retrieval before tests" },
  { id: 53, unit: 10, xp: 150, title: "Accessibility Testing & Visual Testing Playwright", focus: "@axe-core/playwright AxeBuilder analyze, violations, toHaveScreenshot, baseline snapshots, --update-snapshots, maxDiffPixels, masking dynamic areas" },
  { id: 54, unit: 10, xp: 150, title: "Database Testing (Validating backend Database)", focus: "connecting to MySQL/Postgres from tests (mysql2, pg), running queries, validating UI/API actions against DB rows, cleanup, keeping credentials in env" },
  { id: 55, unit: 10, xp: 175, title: "Playwright Custom Fixtures", focus: "test.extend, fixture setup/teardown with use(), page-object fixtures, worker-scoped vs test-scoped fixtures, auto fixtures" },
  { id: 56, unit: 11, xp: 175, title: "Exploring AI Agents & Getting started with framework", focus: "what AI agents are, LLMs plus tools, agents for test generation and maintenance, prompts, risks and human review" },
  { id: 57, unit: 11, xp: 175, title: "Framework Powered by AI - Part1 (Introduction and framework components)", focus: "framework folder structure, config, page objects, fixtures, test data, utilities, env management, where AI fits" },
  { id: 58, unit: 11, xp: 175, title: "Framework Powered by AI -Part 2 (Generating Automation tests)", focus: "prompting AI to generate Playwright tests, giving context (page objects, conventions), reviewing and refactoring generated code, avoiding flaky AI output" },
  { id: 59, unit: 11, xp: 200, title: "Framework Powered by AI -Part 3 ( Git, GitHub & GitHub Actions )", focus: "git init/add/commit/push, branches and pull requests, .github/workflows yml, actions/checkout, setup-node, npx playwright install --with-deps, uploading reports as artifacts" },
  { id: 60, unit: 11, xp: 200, title: "Docker Integration", focus: "Dockerfile with mcr.microsoft.com/playwright image, docker build/run, volumes for reports, docker-compose, running tests in containers" },
  { id: 61, unit: 11, xp: 200, title: "Jenkins-CI-CD-Creating Pipeline", focus: "Jenkinsfile declarative pipeline, agent, stages and steps, npm ci, running playwright tests, publishing HTML reports, triggers and parameters" },
];

export const PASS_PERCENT = 80;

export function getTopic(id: number): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
