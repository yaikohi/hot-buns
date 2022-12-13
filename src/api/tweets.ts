import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

export const tweets = new Hono();

// Auth
const bearerToken = (process.env.HONO_TOKEN ||
  "honoiscoolbuttwitterisnt") as string;
tweets.use("/*", bearerAuth({ token: bearerToken }));

// twitter tokens
const twitterBearerToken = (Bun.env.TWITTER_API_BEARER_TOKEN ||
  process.env.TWITTER_API_BEARER) as string;

tweets.get("/", async (c) => {
  return c.json({
    message: "Tweet root! You can navigate to /api/tweets/:username!",
  });
});

tweets.get("/:username", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  saveToJson(tweets, "tweets");

  return c.json({ tweets });
});

tweets.get("/:username/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getTweetsFromUser(userId);
  const media = getMediaFromTweets(tweets);

  saveToJson(media, "media");

  return c.json({ media });
});

tweets.get("/:username/likes", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const tweets = await getLikedTweetsFromUser(userId); // = liked-tweets

  saveToJson(tweets, "liked-tweets");

  return c.json({ tweets });
});

// Endpoint for getting the media-attachments of the liked tweets of the user.
tweets.get("/:username/likes/media", async (c) => {
  const username = c.req.param().username;
  const userId = (await getTwitterUserId(username)) || "895181348176105472";
  const likedTweets = await getLikedTweetsFromUser(userId);
  const media = getMediaFromTweets(likedTweets);

  saveToJson(media, "liked-tweets-media");

  return c.json({ media });
});

const getTwitterUserId = async (username: string) => {
  const twitterHeader = {
    headers: {
      Authorization: `Bearer ${twitterBearerToken}`,
    },
  };
  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}`,
    twitterHeader
  );
  const data: User = ((await res.json()) as any).data;
  console.log("\ngetting the user...", data, "\n");
  return data.id;
};

const getLikedTweetsFromUser = async (userId: string) => {
  const twitterHeader = {
    headers: {
      Authorization: `Bearer ${twitterBearerToken}`,
    },
  };
  const url = `https://api.twitter.com/2/users/${userId}/liked_tweets?max_results=100&tweet.fields=attachments,author_id,created_at&expansions=attachments.media_keys&media.fields=url,height,width,preview_image_url,alt_text,public_metrics,type`;
  const res = await fetch(url, twitterHeader);
  console.log("\ngetting the user-tweets...", res, "\n");

  return (await res.json()) as TwitterResponseData;
};

const getTweetsFromUser = async (userId: string) => {
  const twitterHeader = {
    headers: {
      Authorization: `Bearer ${twitterBearerToken}`,
    },
  };
  const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=attachments,author_id,created_at&expansions=attachments.media_keys&media.fields=url,height,width,preview_image_url,alt_text,public_metrics,type`;
  const res = await fetch(url, twitterHeader);

  return (await res.json()) as TwitterResponseData;
};

const getMediaFromTweets = (tweets: TwitterResponseData): TweetMedia[] => {
  return tweets.includes.media;
};

interface TweetMedia {
  width: number;
  media_key: string;
  url: string;
  height: number;
  type: string;
}

interface TwitterResponseData {
  data: Tweet[];
  includes: { media: TweetMedia | TweetMedia[] | any };
  meta: any;
}

type Tweet = {
  edit_history_tweet_ids: EditHistoryTweetIds;
  author_id: string;
  attachments: Attachment;
  text: string;
  created_at: string;
  id: string;
};

interface Attachment {
  media_keys: string[] | string | any;
}

type EditHistoryTweetIds = string[] | string | any;

interface User {
  id: string;
  name: string;
  username: string;
}

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
