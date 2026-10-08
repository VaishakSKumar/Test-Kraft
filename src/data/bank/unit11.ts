import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    56,
    [
      slide(
        "AI agents for testing",
        [
          "An AI agent is an LLM that can use tools (browser, file system, terminal) in a loop to reach a goal.",
          "In QA, agents can explore apps, draft test plans, generate tests and suggest fixes.",
          "Agents need good context: app URLs, conventions, page objects and clear acceptance criteria.",
          "Always review agent output. Agents can hallucinate locators or assert the wrong thing.",
        ],
        `// A typical agent loop
// 1. Goal:    "Write a test for adding an item to the cart"
// 2. Observe: read page snapshot via a browser tool
// 3. Act:     click, type, navigate
// 4. Produce: tests/cart.spec.ts
// 5. Verify:  run npx playwright test, then fix if failing`,
      ),
    ],
    [
      mcq(
        "What makes an AI system an 'agent' rather than a chatbot?",
        ["It is larger", "It can take actions with tools in a loop toward a goal", "It only answers questions", "It runs offline"],
        1,
        "Agents observe, decide and act through tools repeatedly.",
      ),
      mcq(
        "What is the biggest risk of trusting AI-generated tests without review?",
        ["They are too short", "They may assert wrong behavior or use non-existent locators", "They can't run in CI", "They are always slow"],
        1,
        "Generated tests can pass while checking the wrong thing.",
      ),
      fill(
        "Complete the agent loop:",
        "Observe -> ___ -> Verify",
        [["Act", "act"]],
        "Agents observe state, take an action, then verify the result.",
        ["Act", "Sleep", "Deploy", "Report"],
      ),
      match(
        "Match the agent ingredient to its role:",
        [
          ["LLM", "Reasons and decides the next step"],
          ["Tools", "Let the agent act (browser, files, shell)"],
          ["Context", "Project conventions and app knowledge"],
          ["Human review", "Final quality gate"],
        ],
        "All four are needed for useful, safe automation.",
      ),
      order(
        "Order a safe AI-assisted test workflow:",
        ["Describe the scenario and acceptance criteria", "Let the agent generate the test", "Run the test locally", "Review and refactor before committing"],
        "Specify, generate, run, then review.",
      ),
    ],
  ),

  topic(
    57,
    [
      slide(
        "Framework components",
        [
          "Typical layout: tests/, pages/ (page objects), fixtures/, utils/, test-data/, and playwright.config.ts.",
          "Environment config (.env files, baseURL per environment) keeps tests portable.",
          "Custom fixtures wire page objects and API clients into tests.",
          "AI fits in as a helper for generation and maintenance, guided by the framework's conventions.",
        ],
        `framework/
├─ tests/            # specs grouped by feature
├─ pages/            # page objects
├─ fixtures/         # test.extend definitions
├─ utils/            # helpers (dates, random data, api)
├─ test-data/        # json / csv
├─ .env.qa           # environment variables
└─ playwright.config.ts`,
      ),
    ],
    [
      mcq(
        "Where should reusable page interactions live in the framework?",
        ["tests/", "pages/", "test-data/", "node_modules/"],
        1,
        "Page objects in pages/ hold locators and actions.",
      ),
      mcq(
        "Why keep environment-specific values in .env files?",
        ["To make tests slower", "To run the same tests against QA, staging or prod without code changes", "Playwright requires it", "To hide test names"],
        1,
        "Config by environment makes the suite portable.",
      ),
      fill(
        "Load the base URL from an environment variable in config:",
        "use: { baseURL: process.___.BASE_URL }",
        ["env"],
        "process.env exposes environment variables in Node.",
        ["env", "config", "vars", "argv"],
      ),
      match(
        "Match the folder to its contents:",
        [
          ["tests/", "Spec files"],
          ["pages/", "Page objects"],
          ["fixtures/", "test.extend definitions"],
          ["test-data/", "JSON / CSV inputs"],
        ],
        "A predictable structure helps humans and AI navigate the framework.",
      ),
      order(
        "Order how a test uses the framework layers:",
        ["Test imports the custom test from fixtures/", "Fixture creates the page object from pages/", "Test calls page object methods", "Test asserts the expected result"],
        "Fixtures provide page objects; tests act and assert.",
      ),
    ],
  ),

  topic(
    58,
    [
      slide(
        "Generating tests with AI",
        [
          "Give the AI context: the page objects, fixtures, naming rules and an example test.",
          "Ask for one scenario at a time with clear steps and expected results.",
          "Require web-first assertions and role-based locators; forbid waitForTimeout.",
          "Run, review and refactor generated tests just like a teammate's pull request.",
        ],
        `Prompt template:
"Using our LoginPage and CartPage objects (attached) and the custom
'test' from fixtures/index.ts, write a Playwright TypeScript test:
 - Log in as standard_user
 - Add 'Backpack' to the cart
 - Assert the cart badge shows 1
Use getByRole locators and web-first assertions. No hard waits."`,
      ),
    ],
    [
      mcq(
        "Which prompt detail most improves AI-generated test quality?",
        ["Asking it to be creative", "Providing existing page objects and conventions as context", "Using all caps", "Asking for many tests at once"],
        1,
        "Context about your framework makes the output match your codebase.",
      ),
      mcq(
        "A generated test contains `await page.waitForTimeout(5000)`. What should you do?",
        ["Keep it for safety", "Replace it with a web-first assertion on the expected state", "Increase it to 10000", "Remove all assertions"],
        1,
        "Hard waits are slow and flaky; assert on the real condition instead.",
      ),
      fill(
        "Replace the hard wait with a web-first assertion:",
        "// await page.waitForTimeout(3000);\nawait ___(page.getByText('Order placed')).___();",
        ["expect", "toBeVisible"],
        "expect(...).toBeVisible() waits only as long as needed.",
        ["expect", "toBeVisible", "wait", "toExist"],
      ),
      match(
        "Match the prompt ingredient to its benefit:",
        [
          ["Example test", "Matches style and structure"],
          ["Page objects", "Reuses existing locators"],
          ["Explicit steps", "Covers the intended scenario"],
          ["Rules (no hard waits)", "Avoids flaky patterns"],
        ],
        "Good prompts read like good test specifications.",
      ),
      order(
        "Order the AI test generation workflow:",
        ["Write a prompt with context and steps", "Generate the test", "Run it with npx playwright test", "Fix issues and refactor", "Open a pull request for review"],
        "Treat AI output as a draft that goes through normal quality gates.",
      ),
    ],
  ),

  topic(
    59,
    [
      slide(
        "Git, GitHub and GitHub Actions",
        [
          "Git basics: `git init`, `git add`, `git commit -m`, `git push`; work on branches and open pull requests.",
          "GitHub Actions workflows live in `.github/workflows/*.yml`.",
          "A Playwright job: checkout, setup-node, `npm ci`, `npx playwright install --with-deps`, `npx playwright test`.",
          "Upload playwright-report as an artifact so you can inspect failures.",
        ],
        `name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: lts/* }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with: { name: playwright-report, path: playwright-report/ }`,
      ),
    ],
    [
      mcq(
        "Where do GitHub Actions workflow files go?",
        [".github/actions/", ".github/workflows/", "workflows/", ".ci/"],
        1,
        "GitHub reads YAML workflows from .github/workflows/.",
      ),
      mcq(
        "Why run `npx playwright install --with-deps` in CI?",
        ["To install npm packages", "To download browsers and their OS dependencies", "To generate tests", "To open the report"],
        1,
        "CI machines start clean, so browsers and system libraries must be installed.",
      ),
      fill(
        "Stage all changes and commit:",
        "git ___ .\ngit ___ -m \"Add login tests\"",
        ["add", "commit"],
        "git add stages changes; git commit records them.",
        ["add", "commit", "push", "stage"],
      ),
      match(
        "Match the workflow step to its purpose:",
        [
          ["actions/checkout", "Get the repository code"],
          ["actions/setup-node", "Install Node.js"],
          ["npm ci", "Install exact dependencies from the lockfile"],
          ["actions/upload-artifact", "Save the report for download"],
        ],
        "These steps form almost every Playwright CI job.",
      ),
      order(
        "Order the steps in a Playwright CI job:",
        ["uses: actions/checkout@v5", "uses: actions/setup-node@v5", "run: npm ci", "run: npx playwright install --with-deps", "run: npx playwright test"],
        "Code, Node, dependencies, browsers, then tests.",
      ),
    ],
  ),

  topic(
    60,
    [
      slide(
        "Docker integration",
        [
          "Docker packages tests with their exact OS, browsers and dependencies for consistent runs.",
          "Start from the official image `mcr.microsoft.com/playwright:<version>-noble`, which already has browsers.",
          "Build with `docker build -t pw-tests .`, run with `docker run --rm pw-tests`.",
          "Mount a volume (`-v`) to get reports out of the container.",
        ],
        `FROM mcr.microsoft.com/playwright:v1.56.0-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]

# docker build -t pw-tests .
# docker run --rm -v $(pwd)/playwright-report:/app/playwright-report pw-tests`,
      ),
    ],
    [
      mcq(
        "Why use the official Playwright Docker image as a base?",
        ["It's smaller than Alpine", "It already includes browsers and their system dependencies", "It runs tests faster than any machine", "It includes your tests"],
        1,
        "The image bundles browsers and OS libraries matching a Playwright version.",
      ),
      mcq(
        "How do you get the HTML report out of a container?",
        ["It's emailed automatically", "Mount a volume with -v", "docker export", "It can't be done"],
        1,
        "A bind mount maps a container folder to your machine.",
      ),
      fill(
        "Build and run the image:",
        "docker ___ -t pw-tests .\ndocker ___ --rm pw-tests",
        ["build", "run"],
        "docker build creates the image; docker run starts a container from it.",
        ["build", "run", "start", "create"],
      ),
      match(
        "Match the Dockerfile instruction to its purpose:",
        [
          ["FROM", "Base image"],
          ["WORKDIR", "Set the working directory"],
          ["COPY", "Copy files into the image"],
          ["CMD", "Default command when the container starts"],
        ],
        "These four instructions cover most test images.",
      ),
      order(
        "Order the Dockerfile for good layer caching:",
        ["FROM mcr.microsoft.com/playwright:v1.56.0-noble", "WORKDIR /app", "COPY package*.json ./", "RUN npm ci", "COPY . .", "CMD [\"npx\", \"playwright\", \"test\"]"],
        "Copy package files and install before copying source, so dependency layers are cached between builds.",
      ),
    ],
  ),

  topic(
    61,
    [
      slide(
        "Jenkins pipeline",
        [
          "A Jenkinsfile defines a declarative pipeline: `pipeline { agent ...; stages { stage { steps } } }`.",
          "Use a Docker agent with the Playwright image, or install browsers on the agent.",
          "Steps: checkout, `npm ci`, `npx playwright test`; publish results in `post { always { ... } }`.",
          "Publish JUnit results and the HTML report (HTML Publisher plugin); add triggers or parameters as needed.",
        ],
        `pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.56.0-noble' } }
  stages {
    stage('Install') { steps { sh 'npm ci' } }
    stage('Test')    { steps { sh 'npx playwright test' } }
  }
  post {
    always {
      junit 'results/junit.xml'
      publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright'])
    }
  }
}`,
      ),
    ],
    [
      mcq(
        "What file defines a Jenkins pipeline as code?",
        ["pipeline.yml", "Jenkinsfile", "jenkins.json", ".jenkins/config"],
        1,
        "Jenkins reads the Jenkinsfile from the repository.",
      ),
      mcq(
        "Why publish reports in `post { always { ... } }`?",
        ["So they only publish on success", "So results are published even when tests fail", "It's required syntax", "To run tests again"],
        1,
        "always runs regardless of the build result, which is exactly when you need the report.",
      ),
      fill(
        "Run a shell command in a stage:",
        "stage('Test') {\n  ___ {\n    ___ 'npx playwright test'\n  }\n}",
        ["steps", "sh"],
        "steps contains the commands; sh runs a shell command (bat on Windows agents).",
        ["steps", "sh", "run", "script"],
      ),
      match(
        "Match the Jenkinsfile block to its role:",
        [
          ["agent", "Where the pipeline runs"],
          ["stages", "Ordered list of stages"],
          ["steps", "Commands inside a stage"],
          ["post", "Actions after the run"],
        ],
        "Declarative pipelines follow this structure.",
      ),
      order(
        "Arrange the skeleton of a declarative pipeline:",
        ["pipeline {", "  agent any", "  stages {", "    stage('Test') { steps { sh 'npx playwright test' } }", "  }", "}"],
        "pipeline wraps agent and stages; each stage has steps.",
      ),
    ],
  ),
];
