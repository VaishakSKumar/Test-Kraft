import { fill, match, mcq, order, slide, topic } from "./helpers.ts";

export default [
  topic(
    47,
    [
      slide(
        "API testing basics",
        [
          "REST APIs use HTTP methods: GET reads, POST creates, PUT replaces, PATCH updates partially, DELETE removes.",
          "Status codes: 2xx success, 4xx client errors (400, 401, 404), 5xx server errors.",
          "Playwright's `request` fixture is an APIRequestContext that sends HTTP requests without a browser.",
          "Set `baseURL` and `extraHTTPHeaders` in config so tests use short paths.",
        ],
        `test('get users', async ({ request }) => {
  const res = await request.get('/api/users');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.length).toBeGreaterThan(0);
});`,
      ),
    ],
    [
      mcq("Which status code means 'resource not found'?", ["200", "201", "404", "500"], 2, "404 Not Found is a client error."),
      mcq(
        "Which fixture sends HTTP requests without opening a browser?",
        ["page", "request", "context", "http"],
        1,
        "The request fixture provides an APIRequestContext.",
      ),
      fill(
        "Assert the response succeeded (2xx):",
        "const res = await request.get('/health');\nexpect(res.___()).toBeTruthy();",
        ["ok"],
        "ok() is true for status codes 200 to 299.",
        ["ok", "status", "success", "passed"],
      ),
      match(
        "Match the HTTP method to its purpose:",
        [
          ["GET", "Read a resource"],
          ["POST", "Create a resource"],
          ["PUT", "Replace a resource"],
          ["DELETE", "Remove a resource"],
        ],
        "PATCH (partial update) completes the set.",
      ),
      order(
        "Arrange an API test that checks a user's name:",
        [
          "test('user 2', async ({ request }) => {",
          "  const res = await request.get('/api/users/2');",
          "  expect(res.status()).toBe(200);",
          "  expect((await res.json()).name).toBe('Janet');",
          "});",
        ],
        "Send the request, check the status, then check the body.",
      ),
    ],
  ),

  topic(
    48,
    [
      slide(
        "GET and POST requests",
        [
          "GET with query parameters: `request.get('/api/items', { params: { page: 2 } })`.",
          "POST a JSON body with `data`: `request.post('/api/users', { data: { name: 'Ana' } })`.",
          "Read the response with `status()`, `headers()` and `await json()`.",
          "A successful create usually returns 201 Created and the new resource with its id.",
        ],
        `const res = await request.post('/api/users', {
  data: { name: 'Ana', job: 'QA' },
});
expect(res.status()).toBe(201);
const user = await res.json();
expect(user).toMatchObject({ name: 'Ana', job: 'QA' });
expect(user.id).toBeTruthy();`,
      ),
    ],
    [
      mcq(
        "Which option sends a JSON body with `request.post`?",
        ["body", "json", "data", "payload"],
        2,
        "data accepts an object, which is serialized to JSON with the right content-type.",
      ),
      mcq("What status code usually indicates a resource was created?", ["200", "201", "204", "302"], 1, "201 Created is the conventional response for a successful POST."),
      fill(
        "Send GET /api/products?category=books:",
        "await request.get('/api/products', { ___: { category: 'books' } });",
        ["params"],
        "params builds the query string for you.",
        ["params", "query", "data", "search"],
      ),
      match(
        "Match the response method to what it returns:",
        [
          ["res.status()", "Numeric status code"],
          ["res.ok()", "true for 2xx"],
          ["await res.json()", "Parsed JSON body"],
          ["res.headers()", "Response headers object"],
        ],
        "json() and text() are async; status(), ok() and headers() are sync.",
      ),
      order(
        "Arrange the lines to create a user and verify it can be fetched:",
        [
          "const created = await request.post('/api/users', { data: { name: 'Ana' } });",
          "const { id } = await created.json();",
          "const fetched = await request.get(`/api/users/${id}`);",
          "expect((await fetched.json()).name).toBe('Ana');",
        ],
        "Create, read the id from the response, fetch by id, then assert.",
      ),
    ],
  ),

  topic(
    49,
    [
      slide(
        "PUT, PATCH and DELETE",
        [
          "PUT replaces the whole resource; send every field.",
          "PATCH updates only the fields you send.",
          "DELETE removes a resource and often returns 204 No Content (empty body).",
          "Chain create, update, delete in one test, or clean up in `afterEach`.",
        ],
        `const res = await request.patch('/api/users/7', { data: { job: 'Lead QA' } });
expect(res.status()).toBe(200);

const del = await request.delete('/api/users/7');
expect(del.status()).toBe(204);

const after = await request.get('/api/users/7');
expect(after.status()).toBe(404);`,
      ),
    ],
    [
      mcq(
        "Which method updates only the fields you send?",
        ["PUT", "PATCH", "POST", "GET"],
        1,
        "PATCH is a partial update; PUT replaces the entire resource.",
      ),
      mcq("What does 204 No Content mean after a DELETE?", ["Failure", "Success with no response body", "Resource moved", "Not authorized"], 1, "204 is a success status with an empty body."),
      fill(
        "Delete user 3 and assert the status:",
        "const res = await request.___('/api/users/3');\nexpect(res.status()).toBe(___);",
        ["delete", "204"],
        "Many APIs answer DELETE with 204 No Content.",
        ["delete", "204", "remove", "404"],
      ),
      match(
        "Match the scenario to the method:",
        [
          ["Change only the email", "PATCH"],
          ["Replace the full profile", "PUT"],
          ["Remove the account", "DELETE"],
          ["Register a new user", "POST"],
        ],
        "Choose the method that matches the intent.",
      ),
      order(
        "Arrange a full lifecycle test:",
        [
          "const { id } = await (await request.post('/api/notes', { data: { text: 'a' } })).json();",
          "await request.put(`/api/notes/${id}`, { data: { text: 'b' } });",
          "await request.delete(`/api/notes/${id}`);",
          "expect((await request.get(`/api/notes/${id}`)).status()).toBe(404);",
        ],
        "Create, update, delete, then confirm it's gone.",
      ),
    ],
  ),

  topic(
    50,
    [
      slide(
        "Schema testing, uploads and downloads",
        [
          "Schema validation checks the SHAPE of a response (fields, types, required keys), not just values.",
          "Use Ajv: compile a JSON Schema and run it against the response body.",
          "Upload files to an API with `multipart: { file: fs.createReadStream(path) }` (or a { name, mimeType, buffer } object).",
          "Download with `await res.body()` (a Buffer), and check the `content-type` header.",
        ],
        `import Ajv from 'ajv';
const ajv = new Ajv();
const schema = {
  type: 'object',
  required: ['id', 'name'],
  properties: { id: { type: 'number' }, name: { type: 'string' } },
};
const body = await (await request.get('/api/users/1')).json();
expect(ajv.validate(schema, body)).toBe(true);`,
      ),
    ],
    [
      mcq(
        "What does JSON schema validation verify?",
        ["Response time", "The structure and types of the JSON", "Only the status code", "The server's database"],
        1,
        "Schemas check required fields and their types, catching contract breaks.",
      ),
      mcq(
        "Which request option sends a file as multipart/form-data?",
        ["data", "multipart", "file", "form"],
        1,
        "multipart encodes fields and files as form-data.",
      ),
      fill(
        "Validate a body against a compiled schema:",
        "const validate = ajv.___(schema);\nexpect(validate(body)).toBe(___);",
        ["compile", "true"],
        "compile returns a validator function that returns true for valid data.",
        ["compile", "true", "parse", "false"],
      ),
      match(
        "Match the task to the code:",
        [
          ["Read binary download", "await res.body()"],
          ["Check file type", "res.headers()['content-type']"],
          ["Upload a file", "multipart: { file: fs.createReadStream(p) }"],
          ["Check required keys", "schema.required"],
        ],
        "Schema plus content checks make API tests robust.",
      ),
      order(
        "Arrange the lines to upload a file and verify the response:",
        [
          "const res = await request.post('/api/upload', {",
          "  multipart: { file: fs.createReadStream('data/avatar.png') },",
          "});",
          "expect(res.status()).toBe(200);",
        ],
        "Build the multipart request, then assert the status.",
      ),
    ],
  ),

  topic(
    51,
    [
      slide(
        "Mocking and network interception",
        [
          "`page.route(pattern, handler)` intercepts matching requests from the page.",
          "`route.fulfill({ json })` returns a mock response without hitting the server.",
          "`route.continue({ headers })` passes the request on (optionally modified); `route.abort()` blocks it.",
          "`route.fetch()` gets the real response so you can modify it before fulfilling.",
        ],
        `await page.route('**/api/products', route =>
  route.fulfill({ json: [{ id: 1, name: 'Mock Laptop' }] })
);
await page.route('**/*.{png,jpg}', route => route.abort());
await page.goto('/shop');
await expect(page.getByText('Mock Laptop')).toBeVisible();`,
      ),
    ],
    [
      mcq(
        "Which call returns a fake response without contacting the server?",
        ["route.continue()", "route.fulfill()", "route.abort()", "route.fetch()"],
        1,
        "fulfill responds directly with your mock data.",
      ),
      mcq(
        "When must `page.route()` be set up?",
        ["After the request is sent", "Before the page makes the request", "Only in config", "In afterEach"],
        1,
        "Routes only apply to requests made after they are registered.",
      ),
      fill(
        "Block all requests to analytics:",
        "await page.route('**/analytics/**', route => route.___());",
        ["abort"],
        "abort fails the request, which is useful to block third parties.",
        ["abort", "fulfill", "continue", "stop"],
      ),
      match(
        "Match the route method to its effect:",
        [
          ["fulfill", "Respond with mock data"],
          ["continue", "Send the request on, optionally modified"],
          ["abort", "Block the request"],
          ["fetch", "Get the real response to modify"],
        ],
        "Interception lets you test edge cases like errors and empty states.",
      ),
      order(
        "Arrange the lines to modify a real response:",
        [
          "await page.route('**/api/profile', async route => {",
          "  const response = await route.fetch();",
          "  const json = await response.json();",
          "  await route.fulfill({ response, json: { ...json, plan: 'Pro' } });",
          "});",
        ],
        "Fetch the real response, change the JSON, fulfill with the patched body.",
      ),
    ],
  ),

  topic(
    52,
    [
      slide(
        "API authentication",
        [
          "Basic auth: set `httpCredentials: { username, password }` in config or a new context.",
          "Bearer tokens: send `Authorization: Bearer <token>` via `headers` or `extraHTTPHeaders`.",
          "API keys usually go in a header such as `x-api-key`.",
          "Get tokens once (e.g. in a setup project or beforeAll) and keep secrets in environment variables.",
        ],
        `const login = await request.post('/api/login', {
  data: { user: process.env.API_USER, pass: process.env.API_PASS },
});
const { token } = await login.json();

const res = await request.get('/api/orders', {
  headers: { Authorization: \`Bearer \${token}\` },
});
expect(res.status()).toBe(200);`,
      ),
    ],
    [
      mcq(
        "Which header format is used for bearer token auth?",
        ["Token: abc", "Authorization: Bearer abc", "Auth: abc", "Bearer: abc"],
        1,
        "The Authorization header with the Bearer scheme is the standard.",
      ),
      mcq(
        "Where should API secrets live?",
        ["Hardcoded in tests", "In environment variables or a secrets manager", "In the HTML report", "In test titles"],
        1,
        "Never commit secrets; load them from the environment.",
      ),
      fill(
        "Send a bearer token on every request from the config:",
        "use: {\n  ___: { Authorization: `Bearer ${process.env.TOKEN}` },\n}",
        ["extraHTTPHeaders"],
        "extraHTTPHeaders adds headers to every request.",
        ["extraHTTPHeaders", "headers", "auth", "httpCredentials"],
      ),
      match(
        "Match the auth type to how you send it:",
        [
          ["Basic auth", "httpCredentials: { username, password }"],
          ["Bearer token", "Authorization: Bearer <token>"],
          ["API key", "x-api-key header"],
          ["Missing or invalid credentials", "Expect 401 Unauthorized"],
        ],
        "Test both the happy path and the unauthorized path.",
      ),
      order(
        "Arrange the lines to log in and call a protected endpoint:",
        [
          "const res = await request.post('/auth', { data: { user: 'qa', pass: process.env.PASS } });",
          "const { token } = await res.json();",
          "const me = await request.get('/me', { headers: { Authorization: `Bearer ${token}` } });",
          "expect(me.status()).toBe(200);",
        ],
        "Authenticate, read the token, call with it, assert.",
      ),
    ],
  ),
];
