import { Hono } from "hono";
// import { cors } from "hono/cors";
import { tweets } from "./tweets";

export const api = new Hono();

// adds the `/tweets` route to the `/api` route --> `/api/tweets`
api.route("/tweets", tweets);

// CORS
// api.use("/*", cors());
// api.use(
//   "/test",
//   cors({
//     origin: ["*", "http://localhost:*"],
//     allowHeaders: ["*"],
//     allowMethods: ["/*"],
//     maxAge: 600,
//     credentials: true,
//   })
// );

api.all("/test", (c) => {
  return c.json({ success: "true!" });
});

api.get("/", async (c) => {
  const url = c.req.url;
  return c.json({
    message: "Hello! Welcome. This is the api-root-route.",
    routes: {
      tweets: {
        root: `${url}/tweets`,
        description:
          "replace the ':username' with the username of the user you want to get data from",
        routes: [
          {
            params: ":username",
            url: `${url}/tweets/:username`,
            description: "tweets of a user",
          },

          {
            params: ":username/media",
            url: `${url}/tweets/:username/media`,
            description: "the media/ attachments of the tweets of the user",
          },

          {
            params: ":username/likes",
            url: `${url}/tweets/:username/likes`,
            description: "the liked tweets of the user",
          },

          {
            params: ":username/likes/media",
            url: `${url}/tweets/:username/likes/media`,
            description: "the media of the liked tweets of the user",
          },
        ],
      },
    },
  });
});
