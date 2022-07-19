import { useEffect, useRef } from "react";

/* eslint-disable @next/next/no-img-element */
export const ImageModal = (props: {
  onClickClose: () => void;
  imageUrl: string;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const imageElement = imageRef.current;

    const setImageSize = () => {
      if (!imageElement) return;

      const imageRatio = imageElement.naturalWidth / imageElement.naturalHeight;

      const clientRatio =
        document.documentElement.clientWidth /
        document.documentElement.clientHeight;

      if (clientRatio > imageRatio) {
        imageElement.style.width = "";
        imageElement.style.height = "100%";
      } else {
        imageElement.style.width = "100%";
        imageElement.style.height = "";
      }
    };

    imageElement.addEventListener("load", setImageSize);

    window.addEventListener("resize", setImageSize);

    return () => {
      imageElement.removeEventListener("load", setImageSize);
      window.addEventListener("resize", setImageSize);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/90"
      onClick={props.onClickClose}
    >
      <img
        ref={imageRef}
        className="max-h-full max-w-full select-none"
        src={props.imageUrl}
        alt=""
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
