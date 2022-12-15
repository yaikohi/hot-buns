import { TwitterResponseData } from "./types";

/**
 * Takes a 'full' twitter api response.
 * 
 * 1. Adds the media objects to the tweet containing them;
 * 2. and then adds the tweets to the user that tweeted them;
 */
export const processTweets = (twitterResponse: TwitterResponseData) => {
  const users = twitterResponse.includes.users.map((user) => user);
  const tweets = twitterResponse.data.map((tweet) => tweet);
  const media = twitterResponse.includes.media.map((media) => media);

  const tweetsWithMedia = tweets.map((tweet) => {
    if (!tweet?.attachments?.media_keys) {
      return tweet;
    }

    if (tweet.attachments.media_keys.length > 1) {
      return {
        ...tweet,
        media: tweet.attachments.media_keys.filter((mkey) => {
          media.map((mediaItem) => mediaItem.media_key === mkey);
        }),
      };
    }

    if (tweet.attachments.media_keys.length === 1) {
      return {
        ...tweet,
        media: media.filter(
          (medium) => medium.media_key === tweet.attachments.media_keys[0]
        ),
      };
    }
    return {
      ...tweet,
      media: media.map(
        (thing) => thing.media_key === tweet?.attachments?.media_keys[0]
      ),
    };
  });

  return users.map((user) => ({
    ...user,
    tweets: tweetsWithMedia.filter((tweet) => tweet.author_id === user.id),
  }));
};
