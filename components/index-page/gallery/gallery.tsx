import useEvent from "@react-hook/event";
import { useAtomValue } from "jotai";
import { ComponentProps, useCallback, useEffect, useMemo, useRef } from "react";
import { isAllImageViewEnabledAtom } from "states/atoms";
import { throttle } from "throttle-debounce";
import { Image, Post } from "utils/type";
import { isomorphicWindow } from "utils/var";

import { ImageItem } from "./image-item";

type Props = {
  posts: Post[];
  onSelectImage: ComponentProps<typeof ImageItem>["onClick"];
};

export const Gallery = (props: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isAllImageViewEnabled = useAtomValue(isAllImageViewEnabledAtom);

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

  useEvent(isomorphicWindow, "resize", resizeThrottle);

  useEffect(() => {
    resizeAllGridItems();
  }, [isAllImageViewEnabled, resizeAllGridItems]);

  return (
    <div
      ref={wrapperRef}
      className="mx-4 grid min-h-screen auto-rows-[1px] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      {props.posts
        .filter((post) => post.images.length > 0)
        .map((post) => {
          if (!isAllImageViewEnabled) {
            return (
              <ImageItem
                key={post.images[0].url}
                post={post}
                imageIndex={0}
                isImageCountVisible
                onClick={props.onSelectImage}
                onLoad={resizeThrottle}
              />
            );
          }

          return post.images.map((image, index) => (
            <ImageItem
              key={image.url}
              post={post}
              imageIndex={index}
              onClick={props.onSelectImage}
              onLoad={resizeThrottle}
            />
          ));
        })}
    </div>
  );
};
