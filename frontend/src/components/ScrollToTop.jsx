import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Force scroll restoration to manual to prevent browser from being "helpful"
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // If there's a hash, we want to scroll to the element
    if (hash) {
      const id = hash.replace("#", "");
      // Small timeout to ensure the element is rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // On pathname change, scroll to top immediately
    // We use requestAnimationFrame to ensure it happens after the DOM has updated
    const scroll = () => {
      window.scrollTo(0, 0);
      // Double check in case of layout shifts
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    requestAnimationFrame(scroll);
  }, [pathname, hash]);

  return null;
}