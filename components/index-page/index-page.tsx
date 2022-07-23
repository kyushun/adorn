/* eslint-disable @next/next/no-img-element */
import { Switch } from "@headlessui/react";
import useEvent from "@react-hook/event";
import clsx from "clsx";
import { Loading } from "components/common/loading";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isAllImageViewEnabledAtom, isScrollFixedAtom } from "states/atoms";
import { throttle } from "throttle-debounce";
import { Image, Post } from "utils/type";

import { GalleryHeader } from "./gallery-header";
import { ImageItem } from "./image-item";
import { ImageModal } from "./image-modal";
import { useFetchPosts } from "./use-fetch-posts";

export const IndexPage = () => {
  const { bottomRef, data, error, isLoadingMore } = useFetchPosts();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const isAllImageViewEnabled = useAtomValue(isAllImageViewEnabledAtom);

  const setIsScrollFixed = useSetAtom(isScrollFixedAtom);

  const [selectedPostId, setSelectedPostId] = useState<Post["id"] | undefined>(
    undefined
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<
    Image["url"] | undefined
  >(undefined);

  const setSelectedImageItem = useCallback(
    (postId: Post["id"], imageUrl: Image["url"]) => {
      setSelectedPostId(postId);
      setSelectedImageUrl(imageUrl);
      setIsScrollFixed(true);
    },
    [setIsScrollFixed]
  );

  const resetSelectedImageItem = useCallback(() => {
    setSelectedPostId(undefined);
    setSelectedImageUrl(undefined);
    setIsScrollFixed(false);
  }, [setIsScrollFixed]);

  useEvent(typeof window !== "undefined" ? window : null, "keydown", (e) => {
    if (e.key === "Escape") {
      resetSelectedImageItem();
    }
  });

  const resizeAllGridItems = useCallback(() => {
    // https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
    const gridElement = wrapperRef.current;

    if (!gridElement) return;

    const resizeGridItem = (itemElement: HTMLElement) => {
      const gridElement = wrapperRef.current;
      const contentElement = itemElement.firstElementChild;

      if (!gridElement) return;
      if (!contentElement) return;

      const margin =
        parseInt(
          window.getComputedStyle(itemElement).getPropertyValue("margin")
        ) * 2;

      const rowSpan =
        Math.ceil(contentElement.getBoundingClientRect().height) + margin;

      itemElement.style.gridRowEnd = "span " + rowSpan;
    };

    Array.from(gridElement.children).forEach((element) => {
      resizeGridItem(element as HTMLElement);
    });
  }, []);

  const resizeThrottle = useMemo(
    () =>
      throttle(300, () => {
        resizeAllGridItems();
      }),
    [resizeAllGridItems]
  );

  useEffect(() => {
    resizeAllGridItems();

    window.addEventListener("resize", resizeThrottle);

    return () => {
      window.removeEventListener("resize", resizeThrottle);
    };
  }, [resizeThrottle, resizeAllGridItems]);

  useEffect(() => {
    resizeAllGridItems();
  }, [isAllImageViewEnabled, resizeAllGridItems]);

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

  return (
    <div>
      <GalleryHeader />

      <div
        ref={wrapperRef}
        className="mx-4 grid min-h-screen auto-rows-[1px] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      >
        {data.map(({ posts }) =>
          posts
            .filter((post) => post.images.length > 0)
            .map(({ images, ...post }) => {
              if (!isAllImageViewEnabled) {
                const image = images[0];

                return (
                  <ImageItem
                    key={image.url}
                    post={post}
                    image={image}
                    imageCount={images.length}
                    onClick={setSelectedImageItem}
                    onLoad={resizeThrottle}
                  />
                );
              }

              return images.map((image) => (
                <ImageItem
                  key={image.url}
                  post={post}
                  image={image}
                  onClick={setSelectedImageItem}
                  onLoad={resizeThrottle}
                />
              ));
            })
        )}
      </div>

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
