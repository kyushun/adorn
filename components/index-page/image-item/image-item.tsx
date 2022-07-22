/* eslint-disable @next/next/no-img-element */
import { Image, Post } from "utils/type";

export const ImageItem = ({
  post,
  image,
  onClick,
  onLoad,
}: {
  post: Omit<Post, "images">;
  image: Image;
  onClick: (postId: Post["id"], imageUrl: Image["url"]) => void;
  onLoad: () => void;
}) => {
  return (
    <div
      className="relative m-1 cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-80"
      style={{ transform: "translate3d(0, 0, 0)" }}
      onClick={() => {
        onClick(post.id, image.url);
      }}
    >
      <div>
        <img key={image.url} src={image.url} alt="" onLoad={onLoad} />

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-gray-800/75 px-4 pt-8 pb-4 text-gray-50">
          <p className="text-sm font-bold line-clamp-1">{post.user.name}</p>
          <p className="text-sm line-clamp-3">
            {post.text.replace(/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/, "")}
          </p>
        </div>
      </div>
    </div>
  );
};
