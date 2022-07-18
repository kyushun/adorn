export type GetPostsResponse = {
  posts: {
    id: string;
    text: string;
    postedAt: Date;
    createdAt: Date;
    user: {
      id: string;
      name: string;
    };
    images: {
      url: string;
    }[];
  }[];
  cursor: string;
};
