export interface TweetMedia {
  width: number;
  media_key: string;
  url: string;
  height: number;
  type: string;
}

export interface TwitterResponseData {
  data: Tweet[];
  includes: { media: TweetMedia | TweetMedia[] | any };
  meta: any;
}

export type Tweet = {
  edit_history_tweet_ids: EditHistoryTweetIds;
  author_id: string;
  attachments: Attachment;
  text: string;
  created_at: string;
  id: string;
};

export interface Attachment {
  media_keys: string[] | string | any;
}

type EditHistoryTweetIds = string[] | string | any;

export interface User {
  id: string;
  name: string;
  username: string;
}
