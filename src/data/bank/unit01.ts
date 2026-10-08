import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    1,
    [
      slide(
        "Why automate tests with Playwright?",
        [
          "Test automation runs repeatable checks by code, so regressions are caught on every change.",
          "Playwright drives Chromium, Firefox and WebKit with one API, for UI and API tests.",
          "It auto-waits for elements to be ready, which removes most manual sleeps and flakiness.",
          "The test pyramid: many fast unit tests, fewer API tests, and a focused set of end-to-end UI tests.",
        ],
        `import { test, expect } from '@playwright/test';

test('home page has title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});`,
      ),
    ],
    [
      mcq(
        "Which browser engines can Playwright automate out of the box?",
        ["Only Chromium", "Chromium, Firefox and WebKit", "Chrome and Internet Explorer", "Only browsers with a WebDriver binary"],
        1,
        "Playwright ships its own builds of Chromium, Firefox and WebKit (the Safari engine) and controls them with one API.",
      ),
      mcq(
        "In the test pyramid, which layer should have the FEWEST tests?",
        ["Unit tests", "API / integration tests", "End-to-end UI tests", "All layers should be equal"],
        2,
        "End-to-end UI tests are the slowest and most expensive, so the pyramid keeps them few and focused.",
      ),
      fill(
        "Complete the import used at the top of every Playwright test file:",
        "import { test, ___ } from '@playwright/test';",
        ["expect"],
        "`test` declares tests and `expect` provides assertions. Both come from @playwright/test.",
        ["expect", "assert", "should", "verify"],
      ),
      match(
        "Match each term with its meaning:",
        [
          ["Regression", "A previously working feature breaks"],
          ["Auto-waiting", "Playwright waits for elements to be actionable"],
          ["Headless", "Browser runs without a visible window"],
          ["Assertion", "A check that the actual result matches the expected one"],
        ],
        "These terms come up constantly in automation work.",
      ),
      order(
        "Arrange the lines to form a minimal Playwright test:",
        [
          "import { test, expect } from '@playwright/test';",
          "test('has title', async ({ page }) => {",
          "  await page.goto('https://playwright.dev');",
          "  await expect(page).toHaveTitle(/Playwright/);",
          "});",
        ],
        "Import first, then declare the test with the page fixture, navigate, and assert.",
      ),
    ],
  ),

  topic(
    2,
    [
      slide(
        "Setting up TypeScript",
        [
          "Install Node.js (LTS). It includes npm, the package manager.",
          "Add TypeScript to a project with `npm install -D typescript`, then create a config with `npx tsc --init`.",
          "`tsc` compiles .ts files to JavaScript; tsconfig.json controls the target and strictness.",
          "Tools like `npx tsx file.ts` run TypeScript directly without a separate compile step.",
        ],
        `// hello.ts
const greeting: string = 'Hello, TestKraft!';
console.log(greeting);

// terminal
// npx tsc hello.ts   -> creates hello.js
// node hello.js`,
      ),
    ],
    [
      mcq(
        "Which command creates a tsconfig.json file?",
        ["npm init", "npx tsc --init", "npx playwright init", "node --config"],
        1,
        "`npx tsc --init` generates a tsconfig.json with commented defaults.",
      ),
      mcq(
        "What does the TypeScript compiler (tsc) output?",
        ["Machine code", "Java bytecode", "JavaScript", "WebAssembly"],
        2,
        "TypeScript is a superset of JavaScript; tsc type-checks and emits plain JavaScript.",
      ),
      fill(
        "Install TypeScript as a dev dependency:",
        "npm install ___ typescript",
        [["-D", "--save-dev"]],
        "`-D` (or `--save-dev`) records the package under devDependencies.",
        ["-D", "-g", "--prod", "-x"],
      ),
      match(
        "Match each tool to its role:",
        [
          ["Node.js", "Runs JavaScript outside the browser"],
          ["npm", "Installs and manages packages"],
          ["tsc", "Compiles TypeScript to JavaScript"],
          ["tsconfig.json", "Compiler options for the project"],
        ],
        "Node runs code, npm manages packages, tsc compiles, tsconfig configures.",
      ),
      order(
        "Order the steps to run a TypeScript file with tsc:",
        ["npm install -D typescript", "npx tsc --init", "npx tsc app.ts", "node app.js"],
        "Install the compiler, create a config, compile, then run the emitted JavaScript.",
      ),
    ],
  ),

  topic(
    3,
    [
      slide(
        "Variables: let, const and types",
        [
          "`const` creates a binding that cannot be reassigned. Prefer it by default.",
          "`let` is block-scoped and can be reassigned. Avoid `var` (function-scoped, hoisted).",
          "Annotate a type with a colon: `let count: number = 0;`",
          "TypeScript infers types from initial values: `const url = 'https://...'` is a string.",
        ],
        `const baseUrl: string = 'https://example.com';
let retries = 0;          // inferred as number
retries = retries + 1;    // OK
// baseUrl = 'other';     // Error: cannot assign to a const`,
      ),
    ],
    [
      mcq(
        "Which keyword should you use for a value that is never reassigned?",
        ["var", "let", "const", "static"],
        2,
        "`const` prevents reassignment and signals intent clearly.",
      ),
      mcq(
        "What is the inferred type of `retries` in `let retries = 3;`?",
        ["any", "number", "string", "unknown"],
        1,
        "TypeScript infers `number` from the initial value 3.",
      ),
      fill(
        "Declare a reassignable variable with an explicit string type:",
        "___ browserName___ string = 'chromium';",
        ["let", ":"],
        "Use `let` for reassignable values and a colon before the type annotation.",
        ["let", "const", ":", "=>", "as"],
      ),
      match(
        "Match the keyword to its behavior:",
        [
          ["const", "Block-scoped, cannot be reassigned"],
          ["let", "Block-scoped, can be reassigned"],
          ["var", "Function-scoped and hoisted"],
        ],
        "Modern TypeScript code uses const and let; var is legacy.",
      ),
      order(
        "Arrange the lines so the code compiles and prints 2:",
        ["let attempts: number = 0;", "attempts += 2;", "console.log(attempts);"],
        "Declare with let (a const could not be reassigned), add 2, then print.",
        ["const attempts = 0;"],
      ),
    ],
  ),

  topic(
    4,
    [
      slide(
        "TypeScript data types",
        [
          "Primitives: `string`, `number`, `boolean`, `null`, `undefined`.",
          "`any` turns off checking; `unknown` is the safe alternative: you must narrow it before use.",
          "Union types allow several types: `let id: string | number;`",
          "Tuples have fixed positions (`[string, number]`) and enums name a set of constants.",
        ],
        `type Browser = 'chromium' | 'firefox' | 'webkit';  // literal union
let id: string | number = 101;
const user: [string, number] = ['admin', 30];       // tuple
enum Env { Dev, Staging, Prod }
const target: Env = Env.Staging;`,
      ),
    ],
    [
      mcq(
        "Which type forces you to narrow (check) a value before using it?",
        ["any", "unknown", "never", "void"],
        1,
        "`unknown` accepts any value but you must check its type before operating on it, unlike `any`.",
      ),
      mcq(
        "What is the type of `const pair: [string, number] = ['a', 1];`?",
        ["An array of strings", "An object", "A tuple", "An enum"],
        2,
        "`[string, number]` is a tuple: a fixed-length array with a type for each position.",
      ),
      fill(
        "Allow `id` to be a string or a number:",
        "let id: string ___ number;",
        ["|"],
        "The pipe `|` creates a union type.",
        ["|", "&", "||", ","],
      ),
      match(
        "Match each type to an example value:",
        [
          ["boolean", "true"],
          ["number", "3.14"],
          ["string", "'webkit'"],
          ["undefined", "a declared variable with no value"],
        ],
        "Each primitive type has its own literal form.",
      ),
      order(
        "Arrange the lines to declare and use an enum:",
        ["enum Env { Dev, Prod }", "function deploy(env: Env) {", "  console.log(Env[env]);", "}", "deploy(Env.Prod);"],
        "Declare the enum, define a function that takes it, then call it with a member. Env[env] maps a numeric enum back to its name.",
      ),
    ],
  ),

  topic(
    5,
    [
      slide(
        "Operators",
        [
          "Arithmetic: `+ - * / %` and `**` for powers. `+` also concatenates strings.",
          "Use strict equality `===` and `!==`; `==` converts types first (`'5' == 5` is true).",
          "Logical: `&&`, `||`, `!`. The ternary `cond ? a : b` picks one of two values.",
          "`??` (nullish coalescing) falls back only on null/undefined; `?.` (optional chaining) stops on null/undefined.",
        ],
        `const timeout = config.timeout ?? 30000;   // default only when null/undefined
const city = user?.address?.city;           // undefined instead of a crash
const status = passed ? 'PASS' : 'FAIL';
console.log(10 % 3);                        // 1`,
      ),
    ],
    [
      mcq("What does `'5' === 5` evaluate to?", ["true", "false", "TypeError", "undefined"], 1, "`===` compares type and value. A string is never strictly equal to a number."),
      mcq(
        "`const t = 0 ?? 5000;` What is `t`?",
        ["0", "5000", "undefined", "null"],
        0,
        "`??` only falls back on null or undefined. 0 is a real value, so t is 0. (`0 || 5000` would give 5000.)",
      ),
      fill(
        "Read a nested property safely, getting undefined if `user` is null:",
        "const name = user___name;",
        ["?."],
        "Optional chaining `?.` short-circuits to undefined if the left side is null or undefined.",
        ["?.", "??", "!.", "&&"],
      ),
      match(
        "Match the operator to its purpose:",
        [
          ["%", "Remainder of division"],
          ["===", "Strict equality"],
          ["&&", "Logical AND"],
          ["? :", "Ternary conditional"],
        ],
        "These operators appear constantly in test logic.",
      ),
      order(
        "Arrange the lines to print PASS when score is 80 or more:",
        ["const score = 85;", "const result = score >= 80 ? 'PASS' : 'FAIL';", "console.log(result);"],
        "Declare the score, compute the result with a ternary, then print it.",
      ),
    ],
  ),

  topic(
    6,
    [
      slide(
        "Conditional statements",
        [
          "`if / else if / else` runs the first branch whose condition is truthy.",
          "Falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Everything else is truthy.",
          "`switch` compares one value against several `case`s. Use `break` to stop fall-through.",
          "Use a ternary only for short, single-value decisions.",
        ],
        `const browser = 'firefox';
switch (browser) {
  case 'chromium': console.log('Blink'); break;
  case 'firefox':  console.log('Gecko'); break;
  default:         console.log('WebKit');
}`,
      ),
    ],
    [
      mcq("Which value is truthy?", ["0", "''", "'false'", "null"], 2, "Any non-empty string is truthy, including the string 'false'."),
      mcq(
        "What happens if a `case` in a switch has no `break`?",
        ["Syntax error", "Execution falls through to the next case", "The switch exits", "The default case runs only"],
        1,
        "Without break, execution continues into the next case's code (fall-through).",
      ),
      fill(
        "Complete the conditional:",
        "if (status === 200) {\n  console.log('OK');\n} ___ (status === 404) {\n  console.log('Not found');\n} ___ {\n  console.log('Other');\n}",
        ["else if", "else"],
        "Chain extra conditions with `else if` and catch everything else with `else`.",
        ["else if", "else", "elif", "then"],
      ),
      match(
        "Match the value to whether it is truthy or falsy:",
        [
          ["[] (empty array)", "Truthy"],
          ["NaN", "Falsy"],
          ["'0' (string)", "Truthy, non-empty string"],
          ["undefined", "Falsy, no value"],
        ],
        "Empty arrays and objects are truthy. Only the six falsy values are falsy.",
      ),
      order(
        "Arrange a switch that logs 'Smoke' for tag '@smoke':",
        ["switch (tag) {", "  case '@smoke':", "    console.log('Smoke');", "    break;", "}"],
        "switch opens the block, case matches, the body runs, and break ends it.",
      ),
    ],
  ),

  topic(
    7,
    [
      slide(
        "Loops",
        [
          "`for (let i = 0; i < n; i++)` when you need an index.",
          "`for...of` iterates values of arrays and strings; `for...in` iterates object keys.",
          "`while` repeats while a condition is true; `do...while` runs at least once.",
          "`break` exits a loop; `continue` skips to the next iteration.",
        ],
        `const users = ['alice', 'bob', 'carol'];
for (const user of users) {
  if (user === 'bob') continue;   // skip bob
  console.log(user);
}`,
      ),
    ],
    [
      mcq(
        "Which loop iterates over the VALUES of an array?",
        ["for...in", "for...of", "do...while", "forEach...in"],
        1,
        "`for...of` gives values. `for...in` gives keys (indices as strings for arrays).",
      ),
      mcq("Which loop always runs its body at least once?", ["for", "while", "do...while", "for...of"], 2, "do...while checks the condition after the body runs."),
      fill(
        "Print 0, 1, 2:",
        "for (let i = 0; i ___ 3; i++) {\n  console.log(i);\n}",
        ["<"],
        "`i < 3` stops before 3, so 0, 1, 2 are printed.",
        ["<", "<=", ">", "=="],
      ),
      match(
        "Match the keyword to its effect inside a loop:",
        [
          ["break", "Exit the loop immediately"],
          ["continue", "Skip to the next iteration"],
          ["for...in", "Iterate over object keys"],
        ],
        "break stops, continue skips, for...in walks keys.",
      ),
      order(
        "Arrange a while loop that prints Attempt 1, Attempt 2, Attempt 3:",
        ["let attempt = 1;", "while (attempt <= 3) {", "  console.log(`Attempt ${attempt}`);", "  attempt++;", "}"],
        "Start at 1, loop while attempt <= 3, and print before incrementing so the first line is Attempt 1.",
      ),
    ],
  ),
];
