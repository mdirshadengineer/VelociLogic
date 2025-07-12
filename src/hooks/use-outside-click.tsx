import { useEffect, RefObject } from "react";

/**
 * useOutsideClick
 * Calls the callback when a click or touch event occurs outside the referenced element.
 * @param ref - React ref to the target element
 * @param callback - Function to call on outside click
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
