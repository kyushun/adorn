export const createImageUrl = (id: string) => `/media/${id}`;

export const createTwitterProfileUrl = (id: string) =>
  `https://twitter.com/i/user/${id}`;

export const createAPIUrl = (path: string) =>
  new URL(path, "http://localhost:3000").href;
