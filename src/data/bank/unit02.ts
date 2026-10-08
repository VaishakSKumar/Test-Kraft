import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    8,
    [
      slide(
        "Functions, part 1",
        [
          "Declare with `function name(param: Type): ReturnType { ... }`.",
          "Arrow functions are shorter: `const add = (a: number, b: number): number => a + b;`",
          "`void` means the function returns nothing useful.",
          "Parameter types are required in strict mode; return types are usually inferred.",
        ],
        `function buildUrl(path: string): string {
  return 'https://example.com' + path;
}

const log = (msg: string): void => console.log('[test] ' + msg);
log(buildUrl('/login'));`,
      ),
    ],
    [
      mcq(
        "What does the return type `void` mean?",
        ["The function returns null", "The function does not return a meaningful value", "The function never finishes", "The function returns any type"],
        1,
        "`void` indicates no useful return value. `never` is the type for functions that never return.",
      ),
      mcq(
        "Which is a valid arrow function that doubles a number?",
        ["const double = (n: number) => n * 2;", "const double => (n: number) n * 2;", "function => double(n) { n * 2 }", "const double = n: number => n * 2;"],
        0,
        "Parameters go in parentheses (required when typed), followed by `=>` and the expression.",
      ),
      fill(
        "Complete the function signature:",
        "function getTitle(page: string)___ string {\n  return 'Title of ' + page;\n}",
        [":"],
        "A colon after the parameter list declares the return type.",
        [":", "=>", "->", "as"],
      ),
      match(
        "Match each snippet to what it is:",
        [
          ["function f() {}", "Function declaration"],
          ["const f = () => {}", "Arrow function"],
          ["const f = function () {}", "Function expression"],
          ["f()", "Function call"],
        ],
        "All three definitions create callable functions. f() invokes one.",
      ),
      order(
        "Arrange an arrow function that returns the sum and then logs sum(2, 3):",
        ["const sum = (a: number, b: number): number => {", "  return a + b;", "};", "console.log(sum(2, 3));"],
        "Define the function before calling it, since a const binding cannot be used before its declaration.",
      ),
    ],
  ),

  topic(
    9,
    [
      slide(
        "Functions, part 2: params and async",
        [
          "Optional parameter: `name?: string`. Default value: `retries = 3`.",
          "Rest parameters collect extra args into an array: `...tags: string[]`.",
          "An `async` function always returns a Promise; `await` pauses until a Promise settles.",
          "Every Playwright action returns a Promise, so you `await` each call.",
        ],
        `async function login(user: string, pass = 'secret', ...roles: string[]) {
  await page.getByLabel('User').fill(user);
  await page.getByLabel('Password').fill(pass);
  console.log('roles:', roles.join(','));
}`,
      ),
    ],
    [
      mcq(
        "What does an async function always return?",
        ["undefined", "A Promise", "A callback", "Whatever value is returned, unwrapped"],
        1,
        "async functions wrap their return value in a Promise.",
      ),
      mcq(
        "What happens if you forget `await` on `page.click()`?",
        ["Nothing, Playwright waits anyway", "The test may continue before the click completes", "TypeScript refuses to compile", "The click runs twice"],
        1,
        "Without await, the next line can run before the click finishes, causing flaky tests. Lint rules like no-floating-promises catch this.",
      ),
      fill(
        "Make `browser` optional and give `timeout` a default value of 5000:",
        "function launch(browser___: string, timeout ___ 5000) {}",
        ["?", "="],
        "`?` marks an optional parameter; `= value` gives a default.",
        ["?", "=", "!", ":"],
      ),
      match(
        "Match the syntax to its meaning:",
        [
          ["name?: string", "Optional parameter"],
          ["retries = 3", "Default parameter"],
          ["...ids: number[]", "Rest parameter"],
          ["await", "Wait for a Promise to settle"],
        ],
        "These parameter features make helper functions flexible.",
      ),
      order(
        "Arrange an async helper that navigates and returns the title:",
        ["async function getTitle(url: string): Promise<string> {", "  await page.goto(url);", "  return await page.title();", "}"],
        "Navigate first, then read the title. Both are awaited because they return Promises.",
      ),
    ],
  ),

  topic(
    10,
    [
      slide(
        "Arrays",
        [
          "Typed arrays: `string[]` or `Array<string>`.",
          "Index from 0: `arr[0]`; `arr.length` is the count.",
          "`push`/`pop` add/remove at the end; `unshift`/`shift` at the start.",
          "`readonly string[]` prevents modification.",
        ],
        `const browsers: string[] = ['chromium', 'firefox'];
browsers.push('webkit');           // ['chromium','firefox','webkit']
const first = browsers[0];         // 'chromium'
const last = browsers[browsers.length - 1];`,
      ),
    ],
    [
      mcq(
        "Given `const a = [10, 20, 30];` what is `a[a.length - 1]`?",
        ["10", "20", "30", "undefined"],
        2,
        "length is 3, so index 2 is the last element: 30.",
      ),
      mcq(
        "Which method removes the FIRST element of an array?",
        ["pop()", "shift()", "unshift()", "splice(-1)"],
        1,
        "shift() removes from the start; pop() removes from the end.",
      ),
      fill(
        "Declare an array of numbers two ways:",
        "const a: ___[] = [1, 2];\nconst b: Array<___> = [3, 4];",
        ["number", "number"],
        "`number[]` and `Array<number>` are equivalent.",
        ["number", "string", "int", "any[]"],
      ),
      match(
        "Match the method to its effect:",
        [
          ["push", "Add to the end"],
          ["pop", "Remove from the end"],
          ["unshift", "Add to the start"],
          ["shift", "Remove from the start"],
        ],
        "push/pop work at the end, unshift/shift at the start.",
      ),
      order(
        "Arrange the lines so the output is ['b', 'c']:",
        ["const items: string[] = ['a', 'b'];", "items.push('c');", "items.shift();", "console.log(items);"],
        "Start with ['a','b'], push 'c' to get ['a','b','c'], shift removes 'a'.",
      ),
    ],
  ),

  topic(
    11,
    [
      slide(
        "Array methods, part 1",
        [
          "`forEach` runs a function per element and returns nothing.",
          "`map` returns a NEW array of transformed values.",
          "`filter` returns a new array of elements that pass a test.",
          "`find` returns the first match (or undefined); `includes` returns true or false.",
        ],
        `const prices = [10, 25, 40];
const withTax = prices.map(p => p * 1.1);
const expensive = prices.filter(p => p > 20);   // [25, 40]
const first = prices.find(p => p > 20);         // 25
prices.includes(40);                            // true`,
      ),
    ],
    [
      mcq("Which method returns a new array with every element transformed?", ["forEach", "map", "find", "includes"], 1, "map returns a new array of the same length with transformed values."),
      mcq(
        "`[5, 8, 12].find(n => n > 6)` returns:",
        ["[8, 12]", "8", "true", "1"],
        1,
        "find returns the first matching element, not an array.",
      ),
      fill(
        "Keep only the names that start with 'test':",
        "const tests = names.___(n => n.startsWith('test'));",
        ["filter"],
        "filter keeps elements where the callback returns true.",
        ["filter", "map", "find", "forEach"],
      ),
      match(
        "Match the method to its return value:",
        [
          ["forEach", "undefined"],
          ["map", "A new array, same length"],
          ["findIndex", "Index of first match, or -1"],
          ["includes", "true or false"],
        ],
        "Knowing return types prevents common bugs.",
      ),
      order(
        "Arrange the lines to print the lengths of the long names:",
        ["const names = ['ab', 'abcd', 'abcdef'];", "const long = names.filter(n => n.length > 3);", "const lengths = long.map(n => n.length);", "console.log(lengths);"],
        "Filter first, then map the filtered array. Output: [4, 6].",
      ),
    ],
  ),

  topic(
    12,
    [
      slide(
        "Array methods, part 2",
        [
          "`reduce` folds an array into one value: `nums.reduce((acc, n) => acc + n, 0)`.",
          "`some` is true if any element passes; `every` is true only if all pass.",
          "`sort` mutates; pass a comparator for numbers: `(a, b) => a - b`.",
          "`slice` copies a portion (non-mutating); `splice` removes/inserts in place.",
        ],
        `const durations = [120, 45, 300];
const total = durations.reduce((sum, d) => sum + d, 0);  // 465
const anySlow = durations.some(d => d > 200);            // true
const sorted = [...durations].sort((a, b) => a - b);     // [45, 120, 300]`,
      ),
    ],
    [
      mcq(
        "What does `[10, 1, 2].sort()` return (no comparator)?",
        ["[1, 2, 10]", "[1, 10, 2]", "[10, 2, 1]", "[2, 1, 10]"],
        1,
        "Default sort compares as strings: '1' < '10' < '2'. Use (a, b) => a - b for numeric order.",
      ),
      mcq(
        "Which method does NOT modify the original array?",
        ["splice", "sort", "slice", "reverse"],
        2,
        "slice returns a copy. splice, sort and reverse mutate in place.",
      ),
      fill(
        "Sum all values starting from 0:",
        "const total = nums.___((acc, n) => acc + n, ___);",
        ["reduce", "0"],
        "reduce takes a reducer and an initial accumulator value.",
        ["reduce", "0", "map", "1"],
      ),
      match(
        "Match the call to its result for `const a = [2, 4, 6]`:",
        [
          ["a.every(n => n % 2 === 0)", "true"],
          ["a.some(n => n > 5)", "true, because of 6"],
          ["a.slice(1)", "[4, 6]"],
          ["a.join('-')", "'2-4-6'"],
        ],
        "every checks all, some checks any, slice copies, join builds a string.",
      ),
      order(
        "Arrange the lines to print the largest number:",
        ["const nums = [3, 9, 4];", "const max = nums.reduce((m, n) => (n > m ? n : m), nums[0]);", "console.log(max);"],
        "Declare, reduce to the max starting from the first element, print 9.",
      ),
    ],
  ),

  topic(
    13,
    [
      slide(
        "Strings",
        [
          "Template literals use backticks and `${}`: `` `Hello ${name}` ``.",
          "Strings are immutable; methods return new strings.",
          "Common: `trim`, `toLowerCase`, `includes`, `startsWith`, `split`, `replace`, `slice`.",
          "Useful in tests for normalizing text before asserting.",
        ],
        `const raw = '  Order #1234 Confirmed  ';
const text = raw.trim();                       // 'Order #1234 Confirmed'
const id = text.split(' ')[1].replace('#', ''); // '1234'
const msg = \`Order \${id} is done\`;`,
      ),
    ],
    [
      mcq("What does `'a,b,c'.split(',')` return?", ["'abc'", "['a', 'b', 'c']", "['a,b,c']", "3"], 1, "split breaks a string into an array using the separator."),
      mcq(
        "`'Playwright'.slice(0, 4)` returns:",
        ["'Play'", "'Playw'", "'wright'", "'ayw'"],
        0,
        "slice(start, end) excludes the end index: characters 0 to 3.",
      ),
      fill(
        "Build a URL with a template literal:",
        "const url = ___https://shop.com/item/${id}___;",
        ["`", "`"],
        "Template literals are wrapped in backticks, which allows ${} interpolation.",
        ["`", "'", "\"", "$"],
      ),
      match(
        "Match the method to its result for `' Hi There '`:",
        [
          ["trim()", "'Hi There'"],
          ["toUpperCase()", "' HI THERE '"],
          ["includes('There')", "true"],
          ["length", "10"],
        ],
        "' Hi There ' has a leading and trailing space: 10 characters.",
      ),
      order(
        "Arrange the lines to extract the number from 'Total: $45':",
        ["const label = 'Total: $45';", "const value = label.split('$')[1];", "const amount = Number(value);", "console.log(amount + 5);"],
        "Split on $, take the second part '45', convert to a number, then add. Prints 50.",
      ),
    ],
  ),

  topic(
    14,
    [
      slide(
        "Objects",
        [
          "Object literals group related data: `{ name: 'admin', role: 'qa' }`.",
          "Describe the shape with a type alias: `type User = { name: string; age: number };`",
          "Destructuring pulls out properties: `const { name } = user;`",
          "`Object.keys/values/entries` turn objects into arrays for looping.",
        ],
        `type User = { name: string; email: string; active: boolean };
const user: User = { name: 'Ana', email: 'ana@qa.io', active: true };
const { email } = user;
const copy = { ...user, active: false };
Object.keys(user);   // ['name', 'email', 'active']`,
      ),
    ],
    [
      mcq(
        "What does `const { name } = user;` do?",
        ["Creates a new object", "Copies user.name into a const named name", "Deletes user.name", "Renames user to name"],
        1,
        "Object destructuring extracts properties into variables with the same name.",
      ),
      mcq(
        "`Object.entries({ a: 1, b: 2 })` returns:",
        ["['a', 'b']", "[1, 2]", "[['a', 1], ['b', 2]]", "{ a: 1, b: 2 }"],
        2,
        "entries returns [key, value] pairs.",
      ),
      fill(
        "Create a copy of `config` with `headless` set to false:",
        "const debug = { ___config, headless: false };",
        ["..."],
        "Spread copies all properties; later keys override earlier ones.",
        ["...", "&", "*", "@"],
      ),
      match(
        "Match the expression to its result for `const o = { x: 1, y: 2 }`:",
        [
          ["o.x", "1"],
          ["o['y']", "2"],
          ["Object.values(o)", "[1, 2]"],
          ["'z' in o", "false"],
        ],
        "Dot and bracket access read properties; `in` checks for a key.",
      ),
      order(
        "Arrange the lines to print each key and value:",
        ["const env = { url: 'qa.io', port: 443 };", "for (const [key, value] of Object.entries(env)) {", "  console.log(key, value);", "}"],
        "Object.entries gives [key, value] pairs to destructure in for...of.",
      ),
    ],
  ),
];
