import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { bearerToken } from "../config";
import {
  getTwitterUserId,
  getTweetsFromUser,
  getMediaFromTweets,
  getLikedTweetsFromUser,
} from "./utils";

export const tweets = new Hono();

tweets.use("/*", bearerAuth({ token: bearerToken }));

tweets.get("/", async (c) => {
  return c.json({
    message: "Tweet root! You can navigate to /api/tweets/:username!",
  });
});

tweets.get("/:username", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  console.log("Retrieving tweets from ", username, "...");
  return c.json({ tweets });
});

tweets.get("/:username/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  const media = getMediaFromTweets(tweets);
  console.log("Retrieving tweets from ", username, " with media...");
  return c.json({ media });
});

tweets.get("/:username/likes", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  console.log("Retrieving liked tweets from ", username, "...");
  const tweets = await getLikedTweetsFromUser(userId); // = liked-tweets

  return c.json({ tweets });
});

// Endpoint for getting the media-attachments of the liked tweets of the user.
tweets.get("/:username/likes/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const likedTweets = await getLikedTweetsFromUser(userId);
  const media = getMediaFromTweets(likedTweets);
  console.log("Retrieving liked tweets from ", username, " with media ...");

  return c.json({ media });
});
