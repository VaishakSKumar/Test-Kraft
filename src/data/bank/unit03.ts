import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    15,
    [
      slide(
        "Readonly, optional properties and overloading",
        [
          "`readonly` properties can be set once and then never reassigned.",
          "Optional properties use `?`: `timeout?: number` may be missing (undefined).",
          "Overloads declare several call signatures above one implementation.",
          "Utility types: `Partial<T>` makes all props optional; `Readonly<T>` makes all readonly.",
        ],
        `interface TestConfig {
  readonly baseUrl: string;
  retries?: number;
}
const cfg: TestConfig = { baseUrl: 'https://qa.io' };
// cfg.baseUrl = 'x';  // Error: readonly

function format(v: string): string;
function format(v: number): string;
function format(v: string | number): string { return String(v); }`,
      ),
    ],
    [
      mcq(
        "What is the type of `cfg.retries` if declared as `retries?: number`?",
        ["number", "number | undefined", "number | null", "any"],
        1,
        "An optional property may be absent, so its type includes undefined.",
      ),
      mcq(
        "Which utility type makes every property of `User` optional?",
        ["Readonly<User>", "Required<User>", "Partial<User>", "Pick<User>"],
        2,
        "Partial<T> marks every property optional, which is handy for update payloads.",
      ),
      fill(
        "Make `id` impossible to reassign and `nickname` optional:",
        "interface Account {\n  ___ id: number;\n  nickname___: string;\n}",
        ["readonly", "?"],
        "readonly prevents reassignment; ? marks a property optional.",
        ["readonly", "?", "const", "!"],
      ),
      match(
        "Match each feature to its purpose:",
        [
          ["readonly", "Prevents reassignment after creation"],
          ["prop?", "Property may be omitted"],
          ["Overload signatures", "Several ways to call one function"],
          ["Readonly<T>", "Makes all properties readonly"],
        ],
        "These features express intent and catch mistakes at compile time.",
      ),
      order(
        "Arrange the lines so run({}) prints the default timeout 3000:",
        [
          "interface Opts { timeout?: number }",
          "function run(opts: Opts) {",
          "  const t = opts.timeout ?? 3000;",
          "  console.log(t);",
          "}",
          "run({});",
        ],
        "timeout is optional, so {} is a valid Opts. `??` falls back to 3000 when it is undefined.",
      ),
    ],
  ),

  topic(
    16,
    [
      slide(
        "Classes and inheritance",
        [
          "A class bundles data (properties) and behavior (methods).",
          "`extends` creates a subclass; `super(...)` calls the parent constructor.",
          "Subclasses can override methods. `protected` members are visible to subclasses, `private` only inside the class.",
          "This is the basis of the BasePage pattern in Page Object Models.",
        ],
        `class BasePage {
  constructor(protected page: Page) {}
  async open(path: string) { await this.page.goto(path); }
}

class LoginPage extends BasePage {
  async login(user: string) {
    await this.open('/login');
    await this.page.getByLabel('User').fill(user);
  }
}`,
      ),
    ],
    [
      mcq(
        "In a subclass constructor, what must you call before using `this`?",
        ["this.init()", "super()", "parent()", "base()"],
        1,
        "A derived class must call super(...) before accessing this.",
      ),
      mcq(
        "Which modifier allows access from the class AND its subclasses, but not from outside?",
        ["public", "private", "protected", "readonly"],
        2,
        "protected members are accessible in the class and subclasses only.",
      ),
      fill(
        "Make `AdminPage` inherit from `BasePage`:",
        "class AdminPage ___ BasePage {\n  constructor(page: Page) {\n    ___(page);\n  }\n}",
        ["extends", "super"],
        "extends sets up inheritance; super(page) runs the parent constructor.",
        ["extends", "super", "implements", "this"],
      ),
      match(
        "Match each term to its meaning:",
        [
          ["extends", "Inherit from a parent class"],
          ["super", "Refers to the parent class"],
          ["override", "Replace a parent method in a subclass"],
          ["abstract", "Class that cannot be instantiated directly"],
        ],
        "These are the core OOP inheritance keywords.",
      ),
      order(
        "Arrange a subclass that overrides greet():",
        ["class Animal { greet() { return 'hi'; } }", "class Dog extends Animal {", "  override greet() { return 'woof'; }", "}", "console.log(new Dog().greet());"],
        "Define the parent first, then the subclass that overrides, then call it. Prints 'woof'.",
      ),
    ],
  ),

  topic(
    17,
    [
      slide(
        "Interfaces and modules",
        [
          "An interface describes the shape of an object: property names and types.",
          "Classes can `implements` an interface; interfaces can `extends` other interfaces.",
          "Each file is a module: `export` what others need, `import` what you use.",
          "Named exports use braces on import; a default export does not.",
        ],
        `// models.ts
export interface Credentials { user: string; pass: string; }
export default function loginUrl() { return '/login'; }

// test.ts
import loginUrl, { Credentials } from './models';
const admin: Credentials = { user: 'admin', pass: 'secret' };`,
      ),
    ],
    [
      mcq(
        "How do you import a NAMED export `Credentials` from './models'?",
        ["import Credentials from './models';", "import { Credentials } from './models';", "require Credentials from './models';", "import * Credentials from './models';"],
        1,
        "Named exports are imported with braces.",
      ),
      mcq(
        "Which keyword makes a class promise to follow an interface?",
        ["extends", "implements", "satisfies", "inherits"],
        1,
        "Classes use implements for interfaces and extends for classes.",
      ),
      fill(
        "Export the interface so other files can use it:",
        "___ interface Product {\n  id: number;\n  name: string;\n}",
        ["export"],
        "Without export, the interface is private to the module.",
        ["export", "public", "module", "import"],
      ),
      match(
        "Match the syntax to its purpose:",
        [
          ["export default", "The module's main export"],
          ["export const", "A named export"],
          ["import * as utils", "Import everything as a namespace"],
          ["interface B extends A", "Interface inheritance"],
        ],
        "Modules keep test code organized and reusable.",
      ),
      order(
        "Arrange the lines to define and implement an interface:",
        ["interface Clickable { click(): void }", "class Button implements Clickable {", "  click() { console.log('clicked'); }", "}", "new Button().click();"],
        "Declare the interface, then a class that implements its method, then use it.",
      ),
    ],
  ),
];
