// TODO:
// 1. Fetch my own tweets
// 2. Fetch the images

import { Hono } from "hono";

export const tweets = new Hono();

tweets.get("/", (c) => {
  return c.text("tweets-root!");
});
