import { RefCallback, useEffect, useState } from "react";

export const useScrollToBottom = <T extends Element>(): [
  RefCallback<T>,
  boolean
] => {
  const [isBottom, setIsBottom] = useState(false);
  const [node, setRef] = useState<any>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (node && node.parentElement) {
      observer = new IntersectionObserver(
        ([entry]) => setIsBottom(entry.isIntersecting),
        { root: null, rootMargin: "0px", threshold: 0 }
      );
      observer.observe(node);
    } else {
      setIsBottom(false);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [node]);

  return [setRef, isBottom];
};
