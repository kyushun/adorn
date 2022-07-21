import { useCallback, useState } from "react";

export const useLoadImage = (imageCount: number) => {
  const [loadedCount, setLoadedCount] = useState(0);

  const isLoaded = loadedCount === imageCount;

  const onCompleteRequest = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  return {
    isAllImagesLoaded: isLoaded,
    onCompleteImageRequest: onCompleteRequest,
  };
};
