import {Tweet, UserInfo,} from "@/type/Content";

export interface Api<T> {
  code: number
  message: string
  query?: string
  version: 'album' | 'online'
  data: T
}

export interface ApiUserInfo extends Api<UserInfo> {
}

export interface ApiTweets extends Api<{
  bottom_tweet_id: string
  hasmore: boolean
  rss_mode: boolean
  top_tweet_id: string
  tweets: Tweet[]
}> {
}
