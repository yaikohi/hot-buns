import {
  twitterBearerToken,
  twitterLikedTweetsURL,
  twitterTweetsURL,
} from "./config";
import { User, TwitterResponseData, TweetMedia } from "./types";

export const getTwitterUserId = async (username: string) => {
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
  console.log("\ngetting the data of ", data.username, "... \n");
  return data.id;
};

export const getLikedTweetsFromUser = async (userId: string) => {
  const twitterHeader = {
    headers: {
      Authorization: `Bearer ${twitterBearerToken}`,
    },
  };
  const url = twitterLikedTweetsURL(userId);
  const res = await fetch(url, twitterHeader);
  const data = (await res.json()) as TwitterResponseData;

  return data;
};

export const getTweetsFromUser = async (userId: string) => {
  const twitterHeader = {
    headers: {
      Authorization: `Bearer ${twitterBearerToken}`,
    },
  };
  const url = twitterTweetsURL(userId);
  const res = await fetch(url, twitterHeader);
  const data = (await res.json()) as TwitterResponseData;

  return data;
};

export const getMediaFromTweets = (
  tweets: TwitterResponseData
): TweetMedia[] => {
  return tweets.includes.media;
};

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
