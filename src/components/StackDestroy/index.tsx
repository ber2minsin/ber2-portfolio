import React, { useEffect, useState } from "react";

function StackDestroy(props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isTransitionEnded, setIsTransitionEnded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsTransitionEnded(true);
    };
    const element = document.querySelector(".stack-destroy");

    if (element) {
      element.addEventListener("transitionend", handleTransitionEnd);
      return () => {
        element.removeEventListener("transitionend", handleTransitionEnd);
      };
    }
  }, []);

  if (isTransitionEnded) {
    return null;
  }

  return (
    <>
      <div
        className="bg-white min-w-[100px] h-6 rounded-full justify-self-end stack-destroy"
        style={{
          transform: isMounted ? "translateX(-100px)" : "translateX(0px)",
          opacity: isMounted ? 0.3 : 1,
          transition: "transform 0.3s 0s, opacity 0.3s ease-in-out 0s"
        }}
      ></div>
    </>
  );
}

export default StackDestroy;
