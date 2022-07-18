export type Image = {
  url: string;
};

export type User = {
  id: string;
  name: string;
};

export type Post = {
  id: string;
  text: string;
  postedAt: Date;
  createdAt: Date;
  user: User;
  images: Image[];
};

export type GetPostsResponse = {
  posts: Post[];
  cursor: string;
};
