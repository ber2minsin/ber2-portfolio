import React, {useEffect, useState} from "react";
// import ReactDOM from "react-dom";
import StackScroll from "components/StackScroll";

const MainPagePage: React.FC = () => {

  return (
  <>
  <StackScroll />
  <body>
    <div className="flex-col snap-y snap-mandatory h-screen w-full overflow-scroll scrollbar-hide">
        <div className="grid snap-start shrink-0 bg-amber-200 w-screen h-full place-items-center text-8xl">0</div>
        <div className="grid snap-start shrink-0 bg-blue-200 w-screen h-screen place-items-center text-8xl">1</div>
        <div className="grid snap-start shrink-0 bg-orange-200 w-screen h-screen place-items-center text-8xl">2</div>
        <div className="grid snap-start shrink-0 bg-green-200 w-screen h-screen place-items-center text-8xl">3</div>
        <div className="grid snap-start shrink-0 bg-pink-200 w-screen h-screen place-items-center text-8xl">4</div>
        <div className="grid snap-start shrink-0 bg-purple-500 w-screen h-screen place-items-center text-8xl">5</div>
        <div className="grid snap-start shrink-0 bg-red-200 w-screen h-screen place-items-center text-8xl">6</div>
        <div className="grid snap-start shrink-0 bg-sky-200 w-screen h-screen place-items-center text-8xl">7</div>

    </div>
  </body>
  </>
  );
};

export default MainPagePage;
