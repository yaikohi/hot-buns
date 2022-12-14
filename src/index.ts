import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/serve-static.bun";
import { api } from "./api/root";

const port = parseInt(process.env.PORT) || 5000;

// adds `/api` route
const app = new Hono();
app.route("/api", api);

// logger
app.use("*", logger());

// favicon
app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));

// root route
app.get("/", (c) => {
  const url = c.req.url;
  return c.json({
    message:
      "Hello World! This is hono speaking. Hono means flame in Japanese.",
    routes: {
      api: {
        url: `${url}api`,
      },
    },
  });
});

console.log(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
