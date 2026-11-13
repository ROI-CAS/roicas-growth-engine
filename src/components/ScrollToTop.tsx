import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash.length > 1) {
      let fragment = hash.slice(1);
      try {
        fragment = decodeURIComponent(fragment);
      } catch {
        // A malformed escape can still be part of a literal element ID.
      }
      const target = document.getElementById(fragment);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
}

