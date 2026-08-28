import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import loadingAnimation from "../assets/animations/loading-animation.json";

export default function LoadingState({ message = "Indlæser..." }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Lottie
        className="loading-state__animation"
        src={loadingAnimation}
        autoplay
        loop
        aria-hidden="true"
      />

      <p>{message}</p>
    </div>
  );
}
