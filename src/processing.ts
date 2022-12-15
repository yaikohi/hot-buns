import { TwitterResponseData } from "./types";

/**
 * Takes a 'full' twitter api response.
 *
 * 1. Adds the media objects to the tweet containing them;
 * 2. and then adds the tweets to the user that tweeted them;
 */
export const processTweets = (twitterResponse: TwitterResponseData) => {
  const usersList = twitterResponse.includes.users.map((user) => user);
  const tweetsList = twitterResponse.data.map((tweet) => tweet);
  const mediaList = twitterResponse.includes.media.map((media) => media);

  const tweetsWithMedia = tweetsList.map((tweet) => {
    if (!tweet?.attachments?.media_keys) {
      return tweet;
    }

    if (tweet.attachments.media_keys.length > 1) {
      return {
        ...tweet,
        media: mediaList.filter((mediaItem) => {
          return tweet.attachments.media_keys.includes(mediaItem.media_key);
        }),
      };
    }

    if (tweet.attachments.media_keys.length === 1) {
      return {
        ...tweet,
        media: mediaList.filter(
          (mediaItem) => mediaItem.media_key === tweet.attachments.media_keys[0]
        ),
      };
    }
  });

  return usersList.map((user) => ({
    ...user,
    tweets: tweetsWithMedia.filter((tweet) => tweet.author_id === user.id),
  }));
};
