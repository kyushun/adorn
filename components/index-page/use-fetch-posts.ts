import { useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { GetPostsResponse } from "utils/type";

import { useScrollToBottom } from "./use-scroll-to-bottom";

export const useFetchPosts = () => {
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
    if (isLoadingInitialData || isLoadingMore) return;
    if (isReachingEndRef.current) return;

    setSize((size) => size + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottom]);

  return {
    bottomRef,
    data,
    error,
    isLoadingInitialData,
    isLoadingMore,
  };
};
