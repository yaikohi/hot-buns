// TODO:
// 1. Fetch my own tweets
// 2. Fetch the images

import { Hono } from "hono";
import { env } from "process";

export const tweets = new Hono();

tweets.get("/", async (c) => {
  const token = Bun.env.TWITTER_API_BEARER_TOKEN as string; // works
  const username = "hhhghq0";
  const url = `https://api.twitter.com/2/users/by/username/${username}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = ((await res.json()) as any).data;

  console.log(data);

  return c.json({ data });
});

// export const getMyOwnTweets = () => {}

// const token = `${Bun.env}`
//--header 'Authorization: Bearer XXXXXX'
