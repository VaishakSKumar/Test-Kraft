import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    23,
    [
      slide(
        "Input boxes and radio buttons",
        [
          "`fill(text)` clears the field and types the value in one step.",
          "`pressSequentially(text)` types key by key, for fields that react to each keystroke.",
          "`check()` selects a radio button; `isChecked()` returns its state.",
          "Assert with `toHaveValue()` for inputs and `toBeChecked()` for radios.",
        ],
        `const name = page.getByLabel('First name');
await name.fill('Ana');
await expect(name).toHaveValue('Ana');

await page.getByLabel('Female').check();
await expect(page.getByLabel('Female')).toBeChecked();`,
      ),
    ],
    [
      mcq(
        "Which method types text key by key, firing keyboard events for each character?",
        ["fill()", "pressSequentially()", "type('instant')", "setValue()"],
        1,
        "pressSequentially simulates individual key presses. fill sets the value at once.",
      ),
      mcq(
        "Which assertion verifies the current text inside an input field?",
        ["toHaveText()", "toHaveValue()", "toContainText()", "toBeFilled()"],
        1,
        "Inputs store their content in the value property, so use toHaveValue. toHaveText checks text content of non-input elements.",
      ),
      fill(
        "Select the 'Express' shipping radio button and verify it:",
        "const express = page.getByLabel('Express');\nawait express.___();\nawait expect(express).___();",
        ["check", "toBeChecked"],
        "check() selects the radio; toBeChecked() asserts its state.",
        ["check", "toBeChecked", "click", "toBeSelected"],
      ),
      match(
        "Match the method to its purpose:",
        [
          ["fill('x')", "Set an input's value"],
          ["clear()", "Empty an input"],
          ["inputValue()", "Read an input's current value"],
          ["isChecked()", "Read whether a radio or checkbox is selected"],
        ],
        "Use actions to change state and getters or assertions to verify it.",
      ),
      order(
        "Arrange the lines to update and verify a search box:",
        ["const search = page.getByPlaceholder('Search');", "await search.fill('laptop');", "await search.press('Enter');", "await expect(page).toHaveURL(/q=laptop/);"],
        "Locate, fill, submit with Enter, then assert the resulting URL.",
      ),
    ],
  ),

  topic(
    24,
    [
      slide(
        "Checkboxes and form validation",
        [
          "`check()` and `uncheck()` are idempotent: they only act if the state needs to change.",
          "`setChecked(true/false)` sets the state from a variable.",
          "Loop over checkbox locators with `.all()` to tick many at once.",
          "Validate forms by asserting error messages and `toBeDisabled()` / `toBeEnabled()` on submit buttons.",
        ],
        `const days = page.locator('input[type="checkbox"]');
for (const box of await days.all()) {
  await box.check();
}
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Email is required')).toBeVisible();`,
      ),
    ],
    [
      mcq(
        "What happens if you call `check()` on an already-checked checkbox?",
        ["It unchecks it", "It throws an error", "Nothing; it stays checked", "It clicks it twice"],
        2,
        "check() verifies the final state, so a checked box stays checked.",
      ),
      mcq(
        "Which call returns an array of locators you can loop over?",
        ["locator.count()", "locator.all()", "locator.each()", "locator.list()"],
        1,
        "all() returns Locator[] for each current match.",
      ),
      fill(
        "Tick the 'Terms' checkbox based on a boolean variable `accept`:",
        "await page.getByLabel('Terms').___(accept);",
        ["setChecked"],
        "setChecked(value) checks or unchecks depending on the boolean.",
        ["setChecked", "check", "toggle", "fill"],
      ),
      match(
        "Match the assertion to what it verifies:",
        [
          ["toBeChecked()", "Checkbox is ticked"],
          ["not.toBeChecked()", "Checkbox is not ticked"],
          ["toBeDisabled()", "Control cannot be used"],
          ["toBeEnabled()", "Control can be used"],
        ],
        "Use these to verify form state and validation rules.",
      ),
      order(
        "Arrange the lines to verify the submit button only enables after accepting terms:",
        [
          "const submit = page.getByRole('button', { name: 'Submit' });",
          "await expect(submit).toBeDisabled();",
          "await page.getByLabel('I accept the terms').check();",
          "await expect(submit).toBeEnabled();",
        ],
        "Assert disabled first, accept terms, then assert enabled.",
      ),
    ],
  ),

  topic(
    25,
    [
      slide(
        "Native dropdowns (select)",
        [
          "Use `selectOption()` on a `<select>` element.",
          "Select by value: `selectOption('in')`, by label: `selectOption({ label: 'India' })`, or by index: `{ index: 2 }`.",
          "Pass an array for multi-select: `selectOption(['red', 'blue'])`.",
          "Assert the selection with `toHaveValue()`, and count options with `locator('option')`.",
        ],
        `const country = page.locator('#country');
await country.selectOption({ label: 'India' });
await expect(country).toHaveValue('in');
await expect(country.locator('option')).toHaveCount(10);`,
      ),
    ],
    [
      mcq(
        "Which call selects the option whose visible text is 'Canada'?",
        ["selectOption('Canada')", "selectOption({ label: 'Canada' })", "selectOption({ text: 'Canada' })", "click('Canada')"],
        1,
        "{ label } matches visible text explicitly. A plain string matches value or label.",
      ),
      mcq(
        "How do you select two options in a multi-select?",
        ["Call selectOption twice", "selectOption(['a', 'b'])", "selectOption('a,b')", "selectOption({ multiple: ['a', 'b'] })"],
        1,
        "Pass an array to select several options at once; calling twice would replace the first selection.",
      ),
      fill(
        "Select the third option by index:",
        "await page.locator('#size').selectOption({ ___: 2 });",
        ["index"],
        "Indexes are zero-based, so index 2 is the third option.",
        ["index", "nth", "position", "value"],
      ),
      match(
        "Match the selectOption argument to how it selects:",
        [
          ["'us'", "By value (or label)"],
          ["{ label: 'USA' }", "By visible text"],
          ["{ index: 0 }", "By position"],
          ["['us', 'ca']", "Multiple options"],
        ],
        "selectOption is flexible; be explicit when values and labels differ.",
      ),
      order(
        "Arrange the lines to choose a color and verify it:",
        ["const color = page.getByLabel('Color');", "await color.selectOption('green');", "await expect(color).toHaveValue('green');"],
        "Locate the select, choose the option, assert the value.",
      ),
    ],
  ),

  topic(
    26,
    [
      slide(
        "Custom and auto-suggest dropdowns",
        [
          "Custom dropdowns are not `<select>`; click to open, then click the option.",
          "Auto-suggest: type into the input, wait for suggestions, then pick one by text.",
          "`allTextContents()` collects all option texts for verification.",
          "Use `getByRole('option')` or `getByRole('listbox')` when the widget has proper ARIA roles.",
        ],
        `await page.getByPlaceholder('From').pressSequentially('Del');
const options = page.getByRole('option');
await expect(options.first()).toBeVisible();
await options.filter({ hasText: 'Delhi' }).click();`,
      ),
    ],
    [
      mcq(
        "Why doesn't `selectOption()` work on most custom dropdowns?",
        ["They are inside iframes", "They are not <select> elements", "They need a mouse hover", "They are read-only"],
        1,
        "selectOption only works on native <select> elements. Custom widgets are divs or lists you click.",
      ),
      mcq(
        "Which method returns the text of every matched option as an array?",
        ["innerText()", "allTextContents()", "textContent()", "getAllText()"],
        1,
        "allTextContents() returns string[] for all matches without waiting for a count.",
      ),
      fill(
        "Pick the suggestion containing 'London':",
        "await page.getByRole('option').___({ hasText: 'London' }).click();",
        ["filter"],
        "filter narrows the options to the one containing the text.",
        ["filter", "find", "select", "nth"],
      ),
      match(
        "Match each dropdown type to how you automate it:",
        [
          ["Native <select>", "selectOption()"],
          ["Bootstrap dropdown", "Click toggle, then click item"],
          ["Auto-suggest input", "Type text, then choose a suggestion"],
          ["Hidden dropdown that closes on blur", "Inspect with Playwright Inspector or freeze DOM"],
        ],
        "Different widgets need different strategies.",
      ),
      order(
        "Arrange the lines to use an auto-suggest field:",
        [
          "const input = page.getByPlaceholder('Search city');",
          "await input.pressSequentially('Par');",
          "await page.getByRole('option', { name: 'Paris' }).click();",
          "await expect(input).toHaveValue('Paris');",
        ],
        "Type to trigger suggestions, click the right one, verify the input value.",
      ),
    ],
  ),

  topic(
    27,
    [
      slide(
        "Web tables, part 1",
        [
          "Rows: `table.locator('tbody tr')`; cells: `row.locator('td')`.",
          "`count()` gives the number of rows or columns.",
          "Find a row by content with `filter({ hasText })`, then read a specific cell with `nth()`.",
          "`allInnerTexts()` returns all cell texts for bulk checks.",
        ],
        `const rows = page.locator('#products tbody tr');
await expect(rows).toHaveCount(5);
const laptop = rows.filter({ hasText: 'Laptop' });
const price = await laptop.locator('td').nth(2).innerText();
console.log(price);`,
      ),
    ],
    [
      mcq(
        "Which locator returns all body rows of the table `#t`?",
        ["page.locator('#t th')", "page.locator('#t tbody tr')", "page.locator('#t td')", "page.locator('#t thead')"],
        1,
        "tbody tr are the data rows; th are header cells.",
      ),
      mcq(
        "How do you read the 2nd column of a row locator `row`?",
        ["row.locator('td').nth(1)", "row.locator('td').nth(2)", "row.column(2)", "row.locator('td:2')"],
        0,
        "nth is zero-based: nth(1) is the second td.",
      ),
      fill(
        "Assert the table has exactly 10 rows:",
        "await expect(page.locator('table tbody tr')).___(10);",
        ["toHaveCount"],
        "toHaveCount auto-waits until the number of matches equals the expected count.",
        ["toHaveCount", "toHaveLength", "toBe", "count"],
      ),
      match(
        "Match the table locator to what it selects:",
        [
          ["thead th", "Header cells"],
          ["tbody tr", "Data rows"],
          ["tr td:nth-child(3)", "Third cell of each row"],
          ["tr:has-text('Bob')", "Row containing Bob"],
        ],
        "Combine CSS, filter and nth to reach any cell.",
      ),
      order(
        "Arrange the lines to print every product name (column 1):",
        [
          "const rows = page.locator('table tbody tr');",
          "for (const row of await rows.all()) {",
          "  console.log(await row.locator('td').first().innerText());",
          "}",
        ],
        "Get rows, loop over them, read the first cell of each.",
      ),
    ],
  ),

  topic(
    28,
    [
      slide(
        "Dynamic and paginated tables",
        [
          "Dynamic tables change content; locate rows by text, not by fixed index.",
          "For pagination, loop over page links: click one, wait for the table to update, then read rows.",
          "Wait with an assertion (e.g. on the active page indicator), not with fixed timeouts.",
          "Collect data across pages into an array, then assert on the whole set.",
        ],
        `const pages = page.locator('#pagination a');
const total = await pages.count();
for (let i = 0; i < total; i++) {
  await pages.nth(i).click();
  await expect(pages.nth(i)).toHaveClass(/active/);
  const names = await page.locator('tbody tr td:first-child').allInnerTexts();
  console.log(i + 1, names);
}`,
      ),
    ],
    [
      mcq(
        "What is the most reliable way to wait for a table to refresh after clicking page 2?",
        ["page.waitForTimeout(3000)", "Assert on something that changes, like the active page link or first row text", "Reload the page", "Call click twice"],
        1,
        "Web-first assertions wait for the real condition. Fixed timeouts are slow and flaky.",
      ),
      mcq(
        "Why locate a row by text instead of `nth(3)` in a dynamic table?",
        ["nth is deprecated", "Row positions can change when data changes", "Text locators are faster", "nth only works on lists"],
        1,
        "Data can be sorted, added or removed, so positions are unstable.",
      ),
      fill(
        "Loop through every pagination link:",
        "const links = page.locator('.pagination a');\nfor (let i = 0; i < await links.___(); i++) {\n  await links.___(i).click();\n}",
        ["count", "nth"],
        "count() gives how many links; nth(i) picks each one.",
        ["count", "nth", "length", "get"],
      ),
      match(
        "Match the problem to the fix:",
        [
          ["Row order changes", "Filter rows by text"],
          ["Table loads slowly", "Use web-first assertions"],
          ["Data spans pages", "Loop pagination and collect"],
          ["Need all cell texts at once", "allInnerTexts()"],
        ],
        "Robust table tests depend on stable locators and proper waiting.",
      ),
      order(
        "Arrange the lines to find 'Zara' across pages:",
        [
          "let found = false;",
          "while (!found) {",
          "  found = (await page.getByRole('cell', { name: 'Zara' }).count()) > 0;",
          "  if (!found) await page.getByRole('link', { name: 'Next' }).click();",
          "}",
        ],
        "Check the current page; if not found, click Next and repeat.",
      ),
    ],
  ),

  topic(
    29,
    [
      slide(
        "Date pickers",
        [
          "If the date field is a plain input, `fill('2026-12-25')` is simplest.",
          "For calendar widgets: open it, loop clicking Next/Prev until the target month and year show, then click the day.",
          "Read the displayed month/year with `textContent()` inside the loop.",
          "Pick the day with an exact match so '1' does not also match '10' or '21'.",
        ],
        `await page.locator('#datepicker').click();
while (true) {
  const month = await page.locator('.ui-datepicker-month').textContent();
  const year = await page.locator('.ui-datepicker-year').textContent();
  if (month === 'December' && year === '2026') break;
  await page.locator('[title="Next"]').click();
}
await page.getByRole('link', { name: '25', exact: true }).click();`,
      ),
    ],
    [
      mcq(
        "When can you skip clicking through the calendar?",
        ["Never", "When the date field accepts typed input; just fill() it", "Only in Chromium", "When the calendar has a Today button"],
        1,
        "If the input accepts text, fill('YYYY-MM-DD') (or the expected format) is faster and more reliable.",
      ),
      mcq(
        "Why use `exact: true` when clicking day '5'?",
        ["To click faster", "So it doesn't also match '15' or '25'", "Days are case-sensitive", "It's required by getByRole"],
        1,
        "Without exact, name matching is a case-insensitive substring match.",
      ),
      fill(
        "Stop navigating once the target month is shown:",
        "while (true) {\n  const m = await page.locator('.month').textContent();\n  if (m === 'March') ___;\n  await page.locator('.next').___();\n}",
        ["break", "click"],
        "break exits the loop once the month matches; otherwise click Next.",
        ["break", "click", "continue", "return"],
      ),
      match(
        "Match the date picker step to the code:",
        [
          ["Open the calendar", "await dateInput.click()"],
          ["Read the shown month", "await monthLabel.textContent()"],
          ["Move forward", "await nextBtn.click()"],
          ["Pick the day", "getByRole('link', { name: '25', exact: true })"],
        ],
        "Calendar automation is a loop of read, compare, navigate, then select.",
      ),
      order(
        "Arrange the lines to set a date in a plain date input:",
        ["const date = page.locator('input[type=\"date\"]');", "await date.fill('2026-12-25');", "await expect(date).toHaveValue('2026-12-25');"],
        "Native date inputs accept the ISO format YYYY-MM-DD.",
      ),
    ],
  ),
];
