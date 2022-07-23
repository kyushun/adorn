/* eslint-disable @next/next/no-img-element */
import useEvent from "@react-hook/event";
import clsx from "clsx";
import { Loading } from "components/common/loading";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { isScrollFixedAtom } from "states/atoms";
import { Image, Post } from "utils/type";
import { isomorphicWindow } from "utils/var";

import { Gallery } from "./gallery";
import { GalleryHeader } from "./gallery-header";
import { ImageModal } from "./image-modal";
import { useFetchPosts } from "./use-fetch-posts";

export const IndexPage = () => {
  const { bottomRef, data, error, isLoadingMore } = useFetchPosts();

  const setIsScrollFixed = useSetAtom(isScrollFixedAtom);

  const [selectedImage, setSelectedImage] = useState<{
    postId: Post["id"];
    imageIndex: number;
  }>();

  const setSelectedImageItem = useCallback(
    (postId: Post["id"], imageIndex: number) => {
      setSelectedImage({ postId, imageIndex });
      setIsScrollFixed(true);
    },
    [setIsScrollFixed]
  );

  const resetSelectedImageItem = useCallback(() => {
    setSelectedImage(undefined);
    setIsScrollFixed(false);
  }, [setIsScrollFixed]);

  useEvent(isomorphicWindow, "keydown", (e) => {
    if (e.key === "Escape") {
      resetSelectedImageItem();
    }
  });

  if (error) {
    return <div>An error has occurred.</div>;
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  const posts = data.map((v) => v.posts).flat();
  const selectedImageUrl = selectedImage
    ? posts.find((post) => post.id === selectedImage.postId)?.images[
        selectedImage.imageIndex
      ].url
    : undefined;

  return (
    <div>
      <GalleryHeader />

      <Gallery posts={posts} onSelectImage={setSelectedImageItem} />

      <div
        className={clsx(
          "my-8 text-center",
          isLoadingMore ? "opacity-100" : "opacity-0"
        )}
      >
        <Loading />
      </div>

      <div ref={bottomRef} className="h-[1px] w-[1px]" />

      {selectedImageUrl && (
        <ImageModal
          imageUrl={selectedImageUrl}
          onClickClose={resetSelectedImageItem}
        />
      )}
    </div>
  );
};
