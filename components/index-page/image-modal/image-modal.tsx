import useEvent from "@react-hook/event";
import { CircleIcon } from "components/common/circle-icon";
import { useCallback, useRef, useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseFill,
} from "react-icons/ri";
import { Post } from "utils/type";
import { isomorphicWindow } from "utils/var";

const useImagePage = ({
  imageIndex,
  imageCount,
}: {
  imageIndex: number;
  imageCount: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(imageIndex);

  const onClickPrevImage = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      setCurrentIndex((prev) => {
        if (prev - 1 < 0) return prev;

        return prev - 1;
      });
    },
    []
  );

  const onClickNextImage = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      setCurrentIndex((prev) => {
        if (prev + 1 >= imageCount) return prev;

        return prev + 1;
      });
    },
    [imageCount]
  );

  return { currentIndex, onClickPrevImage, onClickNextImage };
};

const useImageResize = () => {
  const ref = useRef<HTMLImageElement>(null);

  const setImageSize = useCallback(() => {
    const imageElement = ref.current;
    if (!imageElement) return;

    const parentElement = imageElement.parentElement;
    if (!parentElement) return;

    const imageRatio = imageElement.naturalWidth / imageElement.naturalHeight;

    const clientRatio =
      document.documentElement.clientWidth /
      document.documentElement.clientHeight;

    if (clientRatio > imageRatio) {
      parentElement.style.width = "";
      parentElement.style.height = "100%";
    } else {
      parentElement.style.width = "100%";
      parentElement.style.height = "";
    }
  }, []);

  useEvent(ref, "load", setImageSize);
  useEvent(isomorphicWindow, "resize", setImageSize);

  return { imageRef: ref };
};

/* eslint-disable @next/next/no-img-element */
export const ImageModal = ({
  post,
  imageIndex,
  onClickClose,
}: {
  post: Post;
  imageIndex: number;
  onClickClose: () => void;
}) => {
  const { currentIndex, onClickPrevImage, onClickNextImage } = useImagePage({
    imageIndex,
    imageCount: post.images.length,
  });

  const { imageRef } = useImageResize();

  const imageUrl = post.images[currentIndex].url;

  return (
    <div
      className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/90"
      onClick={onClickClose}
    >
      <div className="relative">
        <img
          ref={imageRef}
          className="h-full w-full select-none"
          src={imageUrl}
          alt=""
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>

      {currentIndex > 0 && (
        <CircleIcon
          className="absolute top-1/2 left-4 -translate-y-1/2"
          icon={RiArrowLeftSLine}
          size="1.5rem"
          onClick={onClickPrevImage}
        />
      )}

      {currentIndex < post.images.length - 1 && (
        <CircleIcon
          className="absolute top-1/2 right-4 -translate-y-1/2"
          icon={RiArrowRightSLine}
          size="1.5rem"
          onClick={onClickNextImage}
        />
      )}

      <div className="absolute top-4 right-4 cursor-pointer rounded-full bg-gray-700/50 p-2 text-white transition-opacity hover:opacity-75">
        <RiCloseFill size="1.5rem" />
      </div>
    </div>
  );
};
