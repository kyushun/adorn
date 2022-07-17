import dayjs from "dayjs";
import { TweetV1, TwitterApi } from "twitter-api-v2";

export class Tweet {
  private static twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY!,
    appSecret: process.env.TWITTER_APP_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  }).readOnly;

  constructor(private status: TweetV1) {}

  static async getTweet(id: string) {
    const status = await this.twitterClient.v1.singleTweet(id, {
      tweet_mode: "extended",
    });

    return new Tweet(status);
  }

  get imageUrls() {
    return this.status.extended_entities?.media?.map(
      (v) => v.media_url_https + ":orig"
    );
  }

  get hasImage() {
    return this.imageUrls && this.imageUrls.length > 0;
  }

  get url() {
    return `https://twitter.com/${this.status.user.id}/status/${this.status.id}`;
  }

  get id() {
    return this.status.id_str;
  }

  get text() {
    return this.status.full_text;
  }

  get postDate() {
    return dayjs(this.status.created_at).toDate();
  }

  get userId() {
    return this.status.user.id_str;
  }

  get username() {
    return this.status.user.name;
  }

  get profileImageUrl() {
    return this.status.user.profile_image_url_https;
  }
}
