import React, {useEffect, useState} from "react";
// import ReactDOM from "react-dom";
import StackScroll from "components/StackScroll";
import MyAsciiEffect from "components/MyAsciiEffect";

const MainPagePage: React.FC = () => {

  return (
  <>

  <StackScroll />
  <div>
    <div className="flex-col snap-y snap-mandatory h-screen w-full overflow-scroll scrollbar-hide" scroll-lock="">

        <div className="grid snap-start shrink-0 w-screen h-full place-items-center text-8xl" id="page-0">
            {/* <div className="w-full h-full z-1 text-white pointer-events-none">
              Hello, I am Arda
            </div> */}
            <div className="fill-gray_600 pointer-events-none">
              <MyAsciiEffect  />
            </div>
        </div>
        <div className="grid snap-start shrink-0 bg-blue-200 w-screen h-screen place-items-center text-8xl" id="page-1">1</div>
        <div className="grid snap-start shrink-0 bg-orange-200 w-screen h-screen place-items-center text-8xl" id="page-2">2</div>
        <div className="grid snap-start shrink-0 bg-green-200 w-screen h-screen place-items-center text-8xl" id="page-3">3</div>
        <div className="grid snap-start shrink-0 bg-pink-200 w-screen h-screen place-items-center text-8xl" id="page-4">4</div>
        <div className="grid snap-start shrink-0 bg-purple-500 w-screen h-screen place-items-center text-8xl" id="page-5">5</div>
        <div className="grid snap-start shrink-0 bg-red-200 w-screen h-screen place-items-center text-8xl" id="page-6">6</div>
        <div className="grid snap-start shrink-0 bg-sky-200 w-screen h-screen place-items-center text-8xl" id="page-7">7</div>

    </div>
  </div>
  </>
  );

};

export default MainPagePage;
