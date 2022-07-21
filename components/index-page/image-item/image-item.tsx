/* eslint-disable @next/next/no-img-element */
import { Image, Post } from "utils/type";

export const ImageItem = ({
  post,
  image,
  onClick,
  onLoad,
  onError,
}: {
  post: Omit<Post, "images">;
  image: Image;
  onClick: (postId: Post["id"], imageUrl: Image["url"]) => void;
  onLoad: () => void;
  onError: () => void;
}) => {
  return (
    <div
      className="relative m-1 cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-75"
      onClick={() => {
        onClick(post.id, image.url);
      }}
    >
      <div>
        <img
          key={image.url}
          src={image.url}
          alt=""
          onLoad={onLoad}
          onError={onError}
        />

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-8 pt-8 pb-4 text-gray-50">
          <p className="font-bold line-clamp-1">{post.user.name}</p>
          <p className="text-sm line-clamp-3">{post.text}</p>
        </div>
      </div>
    </div>
  );
};
