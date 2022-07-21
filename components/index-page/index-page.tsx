/* eslint-disable @next/next/no-img-element */
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isScrollFixedAtom } from "states/atoms";
import { throttle } from "throttle-debounce";
import { Image, Post } from "utils/type";

import { ImageItem } from "./image-item";
import { ImageModal } from "./image-modal";
import { useFetchPosts } from "./use-fetch-posts";

export const IndexPage = () => {
  const { bottomRef, data, error, isLoadingMore } = useFetchPosts();

  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const resizeAllGridItems = useCallback(() => {
    const gridElement = wrapperRef.current;

    if (!gridElement) return;

    const resizeGridItem = (itemElement: HTMLElement) => {
      const gridElement = wrapperRef.current;
      const contentElement = itemElement.firstElementChild;

      if (!gridElement) return;
      if (!contentElement) return;

      const rowSpan = Math.ceil(contentElement.getBoundingClientRect().height);

      itemElement.style.gridRowEnd = "span " + rowSpan;
    };

    Array.from(gridElement.children).forEach((element) => {
      resizeGridItem(element as HTMLElement);
    });
  }, []);

  const onLoadImage = useMemo(
    () =>
      throttle(300, () => {
        resizeAllGridItems();
      }),
    [resizeAllGridItems]
  );

  useEffect(() => {
    resizeAllGridItems();

    window.addEventListener("resize", resizeAllGridItems);

    return () => {
      window.removeEventListener("resize", resizeAllGridItems);
    };
  }, [resizeAllGridItems]);

  if (error) {
    return <div>error</div>;
  }

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div
        ref={wrapperRef}
        className="m-4 grid min-h-screen auto-rows-[1px] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      >
        {data.map(({ posts }) =>
          posts.map(({ images, ...post }) =>
            images.map((image) => (
              <ImageItem
                key={image.url}
                post={post}
                image={image}
                onClick={onClickImageItem}
                onLoad={onLoadImage}
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
