export const twitterLikedTweetsURL = (userId: string) =>
  `https://api.twitter.com/2/users/${userId}/liked_tweets?max_results=100&tweet.fields=attachments,author_id,created_at&expansions=attachments.media_keys,author_id&media.fields=url,height,width,preview_image_url,alt_text,public_metrics,type&user.fields=name,username,location,protected,verified,url,public_metrics`;

export const twitterTweetsURL = (userId: string) =>
  `https://api.twitter.com/2/users/tweets?${userId}/max_results=100&tweet.fields=attachments,author_id,created_at&expansions=attachments.media_keys,author_id&media.fields=url,height,width,preview_image_url,alt_text,public_metrics,type&user.fields=name,username,location,protected,verified,url,public_metrics`;

// Auth
export const bearerToken = (process.env.HONO_TOKEN ||
  "honoiscoolbuttwitterisnt") as string;

// twitter bearer tokens
export const twitterBearerToken = (Bun.env.TWITTER_API_BEARER_TOKEN ||
  process.env.TWITTER_API_BEARER) as string;
