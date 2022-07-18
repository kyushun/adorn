import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { isScrollFixedAtom } from "states/atoms";

export const useScrollFixed = () => {
  const isScrollFixed = useAtomValue(isScrollFixedAtom);

  useEffect(() => {
    document.body.style.overflow = isScrollFixed ? "hidden" : "";
  }, [isScrollFixed]);
};
