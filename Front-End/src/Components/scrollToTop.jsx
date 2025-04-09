import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // o "auto" si preferís instantáneo
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
