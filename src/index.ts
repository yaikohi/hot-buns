import { Hono } from "hono";
import { serveStatic } from 'hono/serve-static.bun';

const port = parseInt(process.env.PORT) || 3000;

const app = new Hono();

app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));

app.get("/", (c) => {
  return c.json({ message: "Hello World! This is hono speaking. Hono means flame in Japanese." });
});

app.get("/:name", (c) => {
  const name = c.req.param('name')
  return c.json({ data: `Hello ${name}`})
})
console.log(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch
};
