import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    30,
    [
      slide(
        "Handling dialogs",
        [
          "By default Playwright auto-dismisses alert, confirm and prompt dialogs.",
          "Register a handler BEFORE the action that opens the dialog: `page.once('dialog', ...)`.",
          "`dialog.accept(text?)` clicks OK (optionally typing into a prompt); `dialog.dismiss()` clicks Cancel.",
          "`dialog.type()` returns 'alert', 'confirm' or 'prompt'; `dialog.message()` returns its text.",
        ],
        `page.once('dialog', async (dialog) => {
  expect(dialog.type()).toBe('prompt');
  expect(dialog.message()).toContain('Enter your name');
  await dialog.accept('Ana');
});
await page.getByRole('button', { name: 'Prompt' }).click();
await expect(page.locator('#result')).toHaveText('Hello Ana');`,
      ),
    ],
    [
      mcq(
        "What does Playwright do with a dialog if you register no handler?",
        ["Waits forever", "Auto-dismisses it", "Accepts it", "Fails the test immediately"],
        1,
        "Dialogs are dismissed automatically unless you listen for the 'dialog' event.",
      ),
      mcq(
        "When must the dialog handler be registered?",
        ["After the click that opens it", "Before the action that triggers it", "In playwright.config.ts", "Any time during the test"],
        1,
        "The dialog appears during the action, so the listener must already exist.",
      ),
      fill(
        "Click OK on a confirm dialog:",
        "page.once('___', dialog => dialog.___());",
        ["dialog", "accept"],
        "Listen for 'dialog' and call accept() to confirm.",
        ["dialog", "accept", "alert", "dismiss"],
      ),
      match(
        "Match the dialog method to its effect:",
        [
          ["accept()", "Click OK"],
          ["dismiss()", "Click Cancel"],
          ["accept('text')", "Type into a prompt and click OK"],
          ["message()", "Read the dialog text"],
        ],
        "These four cover nearly every dialog scenario.",
      ),
      order(
        "Arrange the lines to dismiss a confirm dialog and check the result:",
        [
          "page.once('dialog', dialog => dialog.dismiss());",
          "await page.getByRole('button', { name: 'Delete' }).click();",
          "await expect(page.getByText('Cancelled')).toBeVisible();",
        ],
        "Register the handler, trigger the dialog, then assert the outcome.",
      ),
    ],
  ),

  topic(
    31,
    [
      slide(
        "Browser, context and emulation",
        [
          "Browser: one launched browser. Context: an isolated session (like an incognito profile) with its own cookies. Page: a tab.",
          "Each test gets its own context and page from fixtures, so tests are isolated.",
          "Built-in fixtures: `page`, `context`, `browser`, `browserName`, `request`.",
          "Emulate devices with `devices['iPhone 15']`, or set viewport, locale, timezone and geolocation.",
        ],
        `import { test, devices } from '@playwright/test';

test.use({ ...devices['iPhone 15'], locale: 'fr-FR' });

test('mobile menu', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
});`,
      ),
    ],
    [
      mcq(
        "What does a BrowserContext provide?",
        ["A new browser process", "An isolated session with its own cookies and storage", "A single DOM element", "A test report"],
        1,
        "Contexts are cheap, isolated sessions inside one browser.",
      ),
      mcq(
        "Which code emulates a Pixel 7 for tests in a file?",
        ["test.use({ ...devices['Pixel 7'] });", "page.emulate('Pixel 7');", "browser.device = 'Pixel 7';", "test.mobile('Pixel 7');"],
        0,
        "test.use applies options (like a device descriptor) to the tests in scope.",
      ),
      fill(
        "Create a new isolated context and a page in it:",
        "const context = await browser.___();\nconst page = await context.___();",
        ["newContext", "newPage"],
        "browser.newContext() creates the session and context.newPage() opens a tab.",
        ["newContext", "newPage", "launch", "open"],
      ),
      match(
        "Match the object to its role:",
        [
          ["Browser", "Launched browser instance"],
          ["BrowserContext", "Isolated session (cookies, storage)"],
          ["Page", "A single tab"],
          ["devices", "Predefined emulation profiles"],
        ],
        "Browser contains contexts, and each context contains pages.",
      ),
      order(
        "Arrange the lines to test with a geolocation in a manual context:",
        [
          "const context = await browser.newContext({ geolocation: { latitude: 51.5, longitude: -0.12 }, permissions: ['geolocation'] });",
          "const page = await context.newPage();",
          "await page.goto('/store-locator');",
          "await context.close();",
        ],
        "Create the context with options, open a page, use it, then close the context.",
      ),
    ],
  ),

  topic(
    32,
    [
      slide(
        "Tabs, uploads and downloads",
        [
          "A new tab opens a new Page: start `context.waitForEvent('page')` before the click, then await it.",
          "Upload with `setInputFiles(path)` on an `<input type=file>`, or an array of paths for several files.",
          "Download: start `page.waitForEvent('download')` before clicking, then `download.saveAs(path)`.",
          "`download.suggestedFilename()` gives the server-proposed name.",
        ],
        `const pagePromise = context.waitForEvent('page');
await page.getByRole('link', { name: 'Open docs' }).click();
const newTab = await pagePromise;
await expect(newTab).toHaveTitle(/Docs/);

await page.getByLabel('Upload').setInputFiles('tests/data/cv.pdf');

const downloadPromise = page.waitForEvent('download');
await page.getByText('Export CSV').click();
const download = await downloadPromise;
await download.saveAs('downloads/' + download.suggestedFilename());`,
      ),
    ],
    [
      mcq(
        "Why start `waitForEvent('page')` before clicking the link?",
        ["It is faster", "So the event is not missed if the tab opens quickly", "Because click() returns the page", "It's only a style preference"],
        1,
        "If you wait after the click, the event may already have fired.",
      ),
      mcq(
        "Which method uploads a file to `<input type=\"file\">`?",
        ["upload()", "setInputFiles()", "fill(path)", "attachFile()"],
        1,
        "setInputFiles sets one or more files (or clears with []).",
      ),
      fill(
        "Save a download:",
        "const dlPromise = page.waitForEvent('___');\nawait page.getByText('Download').click();\nconst dl = await dlPromise;\nawait dl.___('out/report.pdf');",
        ["download", "saveAs"],
        "Wait for the 'download' event, then saveAs to keep the file.",
        ["download", "saveAs", "page", "save"],
      ),
      match(
        "Match the task to the API:",
        [
          ["New tab opened by a click", "context.waitForEvent('page')"],
          ["Upload two files", "setInputFiles([a, b])"],
          ["Clear selected files", "setInputFiles([])"],
          ["Get download name", "download.suggestedFilename()"],
        ],
        "Event-based APIs need the promise started before the triggering action.",
      ),
      order(
        "Arrange the lines to handle a link that opens a new tab:",
        [
          "const tabPromise = context.waitForEvent('page');",
          "await page.getByText('Terms').click();",
          "const tab = await tabPromise;",
          "await expect(tab.getByRole('heading')).toHaveText('Terms of Service');",
        ],
        "Start waiting, click, await the new page, then assert on it.",
      ),
    ],
  ),

  topic(
    33,
    [
      slide(
        "Mouse and keyboard actions",
        [
          "`hover()`, `dblclick()`, and `click({ button: 'right' })` for context menus.",
          "`dragTo(target)` drags one locator onto another; `page.mouse` gives low-level move/down/up.",
          "`press('Enter')` on a locator, or `page.keyboard.press('Control+A')` for shortcuts.",
          "`page.keyboard.type()` types into the focused element; `down()`/`up()` hold keys.",
        ],
        `await page.getByText('Menu').hover();
await page.getByText('Item').dblclick();
await page.getByText('File').click({ button: 'right' });
await page.locator('#drag').dragTo(page.locator('#drop'));
await page.getByLabel('Notes').press('Control+A');
await page.keyboard.press('Delete');`,
      ),
    ],
    [
      mcq(
        "How do you right-click an element?",
        ["rightClick()", "click({ button: 'right' })", "contextMenu()", "click('right')"],
        1,
        "click accepts a button option: 'left', 'right' or 'middle'.",
      ),
      mcq(
        "Which call drags an element onto another?",
        ["source.dragTo(target)", "page.drag(source, target)", "source.moveTo(target)", "target.drop(source)"],
        0,
        "locator.dragTo(targetLocator) performs the full drag-and-drop.",
      ),
      fill(
        "Select all text in the focused field, then copy it:",
        "await page.keyboard.press('Control+___');\nawait page.keyboard.press('Control+___');",
        ["A", "C"],
        "Ctrl+A selects all and Ctrl+C copies (use Meta on macOS).",
        ["A", "C", "V", "X"],
      ),
      match(
        "Match the action to the API:",
        [
          ["Show a tooltip", "hover()"],
          ["Open with double-click", "dblclick()"],
          ["Press Tab key", "press('Tab')"],
          ["Low-level drag", "mouse.down() / mouse.move() / mouse.up()"],
        ],
        "High-level locator methods first; drop to page.mouse when you need precise control.",
      ),
      order(
        "Arrange a manual drag using the mouse API:",
        [
          "await page.locator('#card').hover();",
          "await page.mouse.down();",
          "await page.locator('#done-column').hover();",
          "await page.mouse.up();",
        ],
        "Hover the source, press, move to the target, release.",
      ),
    ],
  ),

  topic(
    34,
    [
      slide(
        "Scrolling techniques",
        [
          "Actions like `click()` auto-scroll the element into view first.",
          "`locator.scrollIntoViewIfNeeded()` scrolls explicitly when nothing else does.",
          "`page.mouse.wheel(0, 1000)` scrolls like a user's mouse wheel.",
          "Infinite scroll: loop scrolling until the item count stops growing or the target appears.",
        ],
        `let previous = 0;
while (true) {
  const count = await page.locator('.post').count();
  if (count === previous) break;
  previous = count;
  await page.mouse.wheel(0, 3000);
  await page.waitForLoadState('networkidle');
}`,
      ),
    ],
    [
      mcq(
        "Do you need to scroll before clicking an element below the fold?",
        ["Yes, always", "No, Playwright scrolls it into view automatically", "Only in Firefox", "Only for links"],
        1,
        "Actionability checks include scrolling the element into view.",
      ),
      mcq(
        "Which call scrolls down by 500 pixels like a mouse wheel?",
        ["page.scroll(500)", "page.mouse.wheel(0, 500)", "page.keyboard.scroll(500)", "page.mouse.move(0, 500)"],
        1,
        "mouse.wheel(deltaX, deltaY) dispatches a wheel event.",
      ),
      fill(
        "Scroll the footer into view:",
        "await page.locator('footer').___();",
        ["scrollIntoViewIfNeeded"],
        "scrollIntoViewIfNeeded scrolls only if the element is not visible.",
        ["scrollIntoViewIfNeeded", "scrollTo", "focus", "hover"],
      ),
      match(
        "Match the technique to its use:",
        [
          ["Auto-scroll on click", "Default behavior; no code needed"],
          ["scrollIntoViewIfNeeded()", "Bring an element into view for a screenshot"],
          ["mouse.wheel()", "Trigger scroll-based loading"],
          ["evaluate(() => window.scrollTo(0, document.body.scrollHeight))", "Jump to the bottom with JS"],
        ],
        "Pick the simplest technique that triggers the behavior you test.",
      ),
      order(
        "Arrange the lines to scroll until 'Item 50' appears:",
        [
          "const target = page.getByText('Item 50');",
          "while (!(await target.isVisible())) {",
          "  await page.mouse.wheel(0, 1000);",
          "}",
          "await expect(target).toBeVisible();",
        ],
        "Define the target, scroll while it's not visible, then assert.",
      ),
    ],
  ),

  topic(
    35,
    [
      slide(
        "Shadow DOM and SVG",
        [
          "Playwright's CSS and getBy* locators pierce OPEN shadow roots automatically.",
          "XPath does NOT pierce shadow DOM. Use CSS or role-based locators there.",
          "SVG elements live in a different namespace; in XPath use `//*[name()='svg']`.",
          "With CSS, `locator('svg')` or `locator('svg path')` works directly.",
        ],
        `// Shadow DOM: works without special syntax
await page.locator('my-app input#search').fill('playwright');

// SVG
await page.locator('svg[aria-label="Like"]').click();
const paths = page.locator("//*[name()='svg']//*[name()='path']");`,
      ),
    ],
    [
      mcq(
        "Which locator strategy does NOT pierce shadow DOM in Playwright?",
        ["getByRole", "CSS", "XPath", "getByText"],
        2,
        "XPath cannot cross shadow boundaries. CSS and getBy* locators can.",
      ),
      mcq(
        "Why does `//svg` often fail in XPath?",
        ["SVG is not part of the DOM", "SVG elements are in the SVG namespace", "XPath does not support lowercase tags", "Playwright blocks SVG"],
        1,
        "Namespaced elements need name() or local-name() in XPath.",
      ),
      fill(
        "XPath to select all svg elements:",
        "//*[___()='svg']",
        [["name", "local-name"]],
        "name() (or local-name()) compares the element name regardless of namespace.",
        ["name", "text", "tag", "contains"],
      ),
      match(
        "Match the situation to the right locator:",
        [
          ["Input inside an open shadow root", "page.locator('input#q')"],
          ["SVG icon via XPath", "//*[name()='svg']"],
          ["SVG icon via CSS", "page.locator('svg.icon')"],
          ["Button in shadow DOM", "getByRole('button', { name: 'Go' })"],
        ],
        "CSS and role locators are the safe choice for shadow DOM.",
      ),
      order(
        "Arrange the lines to click a shadow DOM button and verify the result:",
        [
          "const host = page.locator('todo-app');",
          "await host.getByRole('button', { name: 'Add' }).click();",
          "await expect(host.getByRole('listitem')).toHaveCount(1);",
        ],
        "Scope to the host element, click inside its shadow root, then assert.",
      ),
    ],
  ),

  topic(
    36,
    [
      slide(
        "Frames",
        [
          "Content inside an `<iframe>` is a separate document. Page locators don't reach inside it.",
          "`page.frameLocator('#editor')` returns a locator scope for the frame.",
          "`locator.contentFrame()` converts an iframe element locator into a frame scope.",
          "`page.frame({ name })` or `page.frames()` give Frame objects; nested frames chain frameLocators.",
        ],
        `const editor = page.frameLocator('#mce_0_ifr');
await editor.locator('body').fill('Hello from Playwright');

const inner = page.frameLocator('#outer').frameLocator('#inner');
await inner.getByRole('button', { name: 'Save' }).click();`,
      ),
    ],
    [
      mcq(
        "Why does `page.getByRole('button')` fail to find a button inside an iframe?",
        ["Buttons can't be in iframes", "The iframe is a separate document; you must scope into the frame", "Needs a longer timeout", "Iframes are always cross-origin"],
        1,
        "Use frameLocator or contentFrame to enter the frame.",
      ),
      mcq(
        "How do you reach a frame nested inside another frame?",
        ["page.frameLocator('#a #b')", "page.frameLocator('#a').frameLocator('#b')", "page.frames('#a', '#b')", "page.nestedFrame('#b')"],
        1,
        "Chain frameLocator calls for each level.",
      ),
      fill(
        "Type into an input inside the iframe with id 'payment':",
        "await page.___('#payment').getByLabel('Card').fill('4242');",
        ["frameLocator"],
        "frameLocator scopes subsequent locators into the iframe.",
        ["frameLocator", "frame", "locator", "iframe"],
      ),
      match(
        "Match the API to what it returns:",
        [
          ["page.frameLocator(sel)", "A FrameLocator scope"],
          ["page.frames()", "Array of all Frame objects"],
          ["page.frame({ name: 'x' })", "A Frame by name, or null"],
          ["locator.contentFrame()", "Frame scope for an iframe locator"],
        ],
        "FrameLocator is the modern, auto-waiting way to work with frames.",
      ),
      order(
        "Arrange the lines to fill a field inside an iframe:",
        [
          "const frame = page.locator('iframe[title=\"Login\"]').contentFrame();",
          "await frame.getByLabel('Email').fill('qa@test.io');",
          "await expect(frame.getByLabel('Email')).toHaveValue('qa@test.io');",
        ],
        "Get the frame scope, fill inside it, then assert inside it.",
      ),
    ],
  ),
];
