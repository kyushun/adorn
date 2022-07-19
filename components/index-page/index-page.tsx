/* eslint-disable @next/next/no-img-element */
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { isScrollFixedAtom } from "states/atoms";
import { Image, Post } from "utils/type";

import { ImageItem } from "./image-item";
import { ImageModal } from "./image-modal";
import { useFetchPosts } from "./use-fetch-posts";

export const IndexPage = () => {
  const { bottomRef, data, error, isLoadingMore } = useFetchPosts();

  const setIsScrollFixed = useSetAtom(isScrollFixedAtom);

  const [selectedPostId, setSelectedPostId] = useState<Post["id"] | undefined>(
    undefined
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<
    Image["url"] | undefined
  >(undefined);

  const onClickImageItem = useCallback(
    (postId: Post["id"], imageUrl: Image["url"]) => {
      console.log(postId, imageUrl);

      setSelectedPostId(postId);
      setSelectedImageUrl(imageUrl);
      setIsScrollFixed(true);
    },
    [setIsScrollFixed]
  );

  const onClickResetSelect = useCallback(() => {
    setSelectedPostId(undefined);
    setSelectedImageUrl(undefined);
    setIsScrollFixed(false);
  }, [setIsScrollFixed]);

  if (error) {
    return <div>error</div>;
  }

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div className="m-4 columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {data.map(({ posts }) =>
          posts.map(({ images, ...post }) =>
            images.map((image) => (
              <ImageItem
                key={image.url}
                post={post}
                image={image}
                onClick={onClickImageItem}
              />
            ))
          )
        )}
      </div>
      {isLoadingMore && <div className="text-center">Loading...</div>}

      <div ref={bottomRef} className="h-[1px] w-[1px]" />

      {selectedImageUrl && (
        <ImageModal
          imageUrl={selectedImageUrl}
          onClickClose={onClickResetSelect}
        />
      )}
    </div>
  );
};
