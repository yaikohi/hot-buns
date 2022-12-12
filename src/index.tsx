import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static.bun";
import { apiTweets, apiBase } from "./api";
import { Top } from "./page";

const port = parseInt(process.env.PORT) || 3000;

const app = new Hono();
app.use("/api", cors());

const api = new Hono();
/**
 * API - Routing: `/api`
 */

api.get("/", (c) => {
  return c.json(apiBase);
});

api.get("/tweets", (c) => {
  return c.json(apiTweets);
});

type hackedBun = Record<string, Record<string, string>>;

api.get("/auth", async (c) => {
  const env = (Bun as unknown as hackedBun).env;

  const apiKey = `${env.TWITTER_API_KEY}`;
  const apiSecret = `${env.TWITTER_API_KEY_SECRET}`;
  const basicAuth = `${env.TWITTER_API_OAUTH2_CLIENT_ID}:${env.TWITTER_API_OAUTH2_CLIENT_SECRET}`;

  const myUserId = "895181348176105472";

  console.log(apiKey, apiSecret);
  console.log(basicAuth);
  const res = await fetch(
    `https://api.twitter.com/2/oauth2/token?grant_type=authorization_code?code_verifier=challenge?client_id=${myUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "x-www-form-urlencoded",
        // Authorization: "Basic " + basicAuth,
      },
    }
  );
  console.log(res);
  return c.json({ data: res });
});

app.route("/api", api);

/**
 * APP - Routing: `/`
 */
app.use("/favicon.ico", serveStatic({ path: "public/favicon.ico" }));
app.get("/", (c) => {
  const msgs = ["Yo!", "What's up?"];

  return c.html(<Top messages={msgs} />);
});
app.get("/:name", (c) => {
  const name = c.req.param("name");
  return c.json({ data: `Hello ${name}` });
});

console.log(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
