/* eslint-disable @next/next/no-img-element */
import { Image, Post, User } from "utils/type";

import { createTwitterProfileUrl } from "@/server/utils/url";

import { ImageCountBadge } from "./image-count-badge";

const ImageInformation = (props: {
  userId: User["id"];
  username: User["name"];
  text: Post["text"];
}) => (
  <div className="w-full bg-gradient-to-b from-transparent to-gray-800/75 px-4 pt-8 pb-4 text-gray-50">
    <a
      href={createTwitterProfileUrl(props.userId)}
      target="_blank"
      rel="noreferrer"
    >
      <p
        className="-mx-2 rounded px-2 text-sm font-bold transition-colors line-clamp-1 hover:bg-black/20"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.username}
      </p>
    </a>
    <p className="text-sm line-clamp-3">
      {props.text.replace(/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/, "")}
    </p>
  </div>
);

type Props = {
  post: Post;
  imageIndex: number;
  isImageCountVisible?: boolean;
  onClick: (postId: Post["id"], imageIndex: number) => void;
  onLoad: () => void;
};

export const ImageItem = (props: Props) => {
  const image = props.post.images[props.imageIndex];
  const imageCount = props.post.images.length;

  if (!image) return null;

  return (
    <div
      className="group relative m-1 cursor-pointer overflow-hidden rounded-xl"
      style={{ transform: "translate3d(0, 0, 0)" }}
      onClick={() => {
        props.onClick(props.post.id, props.imageIndex);
      }}
    >
      <div>
        <img
          key={image.url}
          src={`${image.url}?type=thumb`}
          alt=""
          onLoad={props.onLoad}
          className="w-full transition-opacity group-hover:opacity-80"
        />

        {props.isImageCountVisible && imageCount > 1 && (
          <div className="absolute top-2 right-2">
            <ImageCountBadge count={imageCount} />
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full">
          <ImageInformation
            userId={props.post.user.id}
            username={props.post.user.name}
            text={props.post.text}
          />
        </div>
      </div>
    </div>
  );
};
