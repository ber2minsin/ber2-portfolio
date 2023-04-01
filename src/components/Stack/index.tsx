import React, { useEffect, useState } from "react";

function Stack(props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div
        className="bg-white min-w-[100px] h-6 rounded-full justify-self-end"
        style={{
          transform: isMounted ? "translateY(0)" : "translateY(100px)",
          opacity: isMounted ? 1 : 0,
          transition: "transform 0.3s 0s, opacity 0.3s ease-in-out 0s"
        }}
      ></div>
    </>
  );
}

export default Stack;
