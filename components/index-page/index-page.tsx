import { useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { GetPostsResponse } from "utils/type";

import { useScrollToBottom } from "./use-scroll-to-bottom";

export const IndexPage = () => {
  const { data, error, size, setSize } = useSWRInfinite<GetPostsResponse>(
    (index, prev) => {
      if (prev && prev.posts.length === 0) return null;

      if (index === 0) return "/api/images";

      return `/api/images?cursor=${prev!.cursor}`;
    }
  );
  const [bottomRef, isBottom] = useScrollToBottom();

  const isReachingEndRef = useRef(false);
  isReachingEndRef.current =
    (data && data[data.length - 1].posts.length === 0) || false;

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");

  useEffect(() => {
    if (!isBottom) return;
    if (isReachingEndRef.current) return;

    setSize((size) => size + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottom]);

  if (error) {
    return <div>error</div>;
  }

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div className="m-4 columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {data.map((v) =>
          v.posts.map((post) =>
            post.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.url}
                src={image.url}
                alt=""
                className="mb-4 rounded-xl"
              />
            ))
          )
        )}
      </div>
      {isLoadingMore && <div className="text-center">Loading...</div>}

      <div ref={bottomRef} className="h-[1px] w-[1px]" />
    </div>
  );
};
