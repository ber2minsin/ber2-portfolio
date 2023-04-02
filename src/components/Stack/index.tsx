import React, { useEffect, useState } from "react";

function Stack(props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function isElementOnScreen(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  }
  function getCurrentElement() {
    const elements = document.querySelectorAll("div[id^='page-']");
    for (let i = 0; i < elements.length; i++) {
      if (isElementOnScreen(elements[i])) {
        return elements[i];
      }
    }
    return null;
  }

  function removeScrollConstraints() {
    const parentElement = document.querySelector("div[scroll-lock]");
    (parentElement as HTMLElement).style.overflow = "none";
    const elements = document.querySelectorAll("div[id^='page-']");
    for (let i = 0; i < elements.length; i++) {
        // Set scroll-snap-align to none to remove the scroll constraints
        (elements[i] as HTMLElement).style.scrollSnapAlign = "none";
    }
  }

  function setScrollConstraints() {
    const parentElement = document.querySelector("div[scroll-lock]");
    (parentElement as HTMLElement).style.overflow = "scroll";
    const elements = document.querySelectorAll("div[id^='page-']");
    for (let i = 0; i < elements.length; i++) {
        // Set scroll-snap-align to none to remove the scroll constraints
        (elements[i] as HTMLElement).style.scrollSnapAlign = "start";
    }
  }

  const handleClick = () => {
    const pageHeight = window.innerHeight;
    const scrollTo = props.page * pageHeight;
    const parentElement = document.querySelector("div[scroll-lock]");
    const currentElement = getCurrentElement();
    const currentPage = (currentElement as HTMLElement).offsetTop / pageHeight;

    removeScrollConstraints();

    if (parentElement) {
        const start = (currentElement as HTMLElement).offsetTop;
        console.log("start", start);

        const change = scrollTo - start;
        const duration = (currentPage - props.page) * 500; // Change this value to adjust the duration of the scroll animation
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, change, duration);
            console.log("change requested", run);

            parentElement.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animateScroll);
            else {
                setScrollConstraints();
            }

        };

        requestAnimationFrame(animateScroll);
    }
};
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };


  return (
    <>
      <div
        className="bg-white min-w-[100px] h-6 rounded-full justify-self-end cursor-pointer"
        style={{
          transform: isMounted ? "translateY(0)" : "translateY(100px)",
          opacity: isMounted ? 1 : 0,
          transition: "transform 0.3s 0s, opacity 0.3s ease-in-out 0s"
        }}
        id={`stack-${props.page}`}
        onClick={handleClick}
      ></div>
    </>
  );
}

export default Stack;
