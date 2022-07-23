/* eslint-disable @next/next/no-img-element */
import { Image, Post } from "utils/type";

import { createTwitterProfileUrl } from "@/server/utils/url";

import { ImageCountBadge } from "./image-count-badge";

export const ImageItem = ({
  post,
  image,
  imageCount,
  onClick,
  onLoad,
}: {
  post: Omit<Post, "images">;
  image: Image;
  imageCount?: number;
  onClick: (postId: Post["id"], imageUrl: Image["url"]) => void;
  onLoad: () => void;
}) => {
  return (
    <div
      className="group relative m-1 cursor-pointer overflow-hidden rounded-xl"
      style={{ transform: "translate3d(0, 0, 0)" }}
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
          className="transition-opacity group-hover:opacity-80"
        />

        {imageCount && imageCount > 1 && (
          <div className="absolute top-2 right-2">
            <ImageCountBadge count={imageCount} />
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-gray-800/75 px-4 pt-8 pb-4 text-gray-50">
          <a
            href={createTwitterProfileUrl(post.user.id)}
            target="_blank"
            rel="noreferrer"
          >
            <p
              className="-mx-2 rounded px-2 text-sm font-bold transition-colors line-clamp-1 hover:bg-black/20"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {post.user.name}
            </p>
          </a>
          <p className="text-sm line-clamp-3">
            {post.text.replace(/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/, "")}
          </p>
        </div>
      </div>
    </div>
  );
};
