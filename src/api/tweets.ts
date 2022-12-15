import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { bearerToken } from "../config";
import {
  getTwitterUserId,
  getTweetsFromUser,
  getMediaFromTweets,
  getLikedTweetsFromUser,
} from "../utils";

export const tweets = new Hono();

// Adds basic auth with a bearer token
tweets.use("/*", bearerAuth({ token: bearerToken }));

/**
 * The 'root' 
 */
tweets.get("/", async (c) => {
  return c.json({
    message: "Tweet root! You can navigate to /api/tweets/:username!",
  });
});


/**
 * Exposes tweets of `:username`
 */
tweets.get("/:username", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  saveToJson(tweets, "tweets");

  console.log("Retrieving tweets from ", username, "...");
  return c.json({ tweets });
});


/**
 * Exposes media-`:username`'s tweets
 */
tweets.get("/:username/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  const media = getMediaFromTweets(tweets);

  saveToJson(media, "media");

  console.log("Retrieving media from tweets of ", username, "...");
  return c.json({ media });
});


/**
 * Exposes liked-tweets of `:username`
 */
tweets.get("/:username/likes", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  console.log("Retrieving liked tweets from ", username, "...");
  const tweets = await getLikedTweetsFromUser(userId);

  saveToJson(tweets, "liked-tweets");

  return c.json({ tweets });
});

/**
 * Exposes media from liked-tweets of `:username`
 */
tweets.get("/:username/likes/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const likedTweets = await getLikedTweetsFromUser(userId);
  const media = getMediaFromTweets(likedTweets);
  console.log("Retrieving liked tweets from ", username, " with media ...");

  saveToJson(media, "liked-tweets-media");

  return c.json({ media });
});

export const saveToJson = async (
  obj: any,
  partialFileName: string
): Promise<void> => {
  const uid = new Date()
    .toLocaleTimeString("nl-NL", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
    .split("-")
    .reverse()
    .join()
    .replace(/,/g, "")
    .replace(/:/g, "");

  await Bun.write(`${uid}-${partialFileName}.json`, JSON.stringify(obj));
};