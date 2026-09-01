import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (!state?.scrollToEvents) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, state]);

  return null;
}
