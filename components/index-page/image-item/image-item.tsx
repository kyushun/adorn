/* eslint-disable @next/next/no-img-element */
import { Image, Post } from "utils/type";

export const ImageItem = ({
  post,
  image,
  onClick,
}: {
  post: Omit<Post, "images">;
  image: Image;
  onClick: (postId: Post["id"], imageUrl: Image["url"]) => void;
}) => {
  return (
    <div
      className="relative mb-4 cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-75"
      onClick={() => {
        onClick(post.id, image.url);
      }}
    >
      <img key={image.url} src={image.url} alt="" />

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-8 pt-8 pb-4 text-gray-50">
        <p className="font-bold line-clamp-1">{post.user.name}</p>
        <p className="text-sm line-clamp-3">{post.text}</p>
      </div>
    </div>
  );
};
