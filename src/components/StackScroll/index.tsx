import React, {useState, useRef} from "react";
import Stack from "components/Stack";
import StackDestroy from "components/StackDestroy";


var currentPos = 0;
function StackScroll(props){
    const [stacks, setStacks] = useState(new Array());
    const [removedStacks, setRemovedStacks] = useState(new Array());

    function captureScroll(e){
        // let scrollAmount = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (!e || !e.srcElement){
            return;
        }
        let scrollAmount = e.srcElement.scrollTop;

        // Get current window size
        let windowSize = window.innerHeight;
        // console.log("CurrentPage", scrollAmount, "screenHeight", window.screen.availHeight, "scrollAmount", scrollAmount);
        if (scrollAmount%windowSize === 0){

            let position = scrollAmount/windowSize;

            console.log("currentPos", currentPos, "position", position);
            if(position - currentPos > 0){
                let addAmount = position - currentPos;
                const newStacks = new Array(addAmount).fill(null).map((_, i) => (
                    <Stack key={Date.now() + i} page={position} onClick/>
                ));
                setStacks((stacks) => [...stacks, ...newStacks]);
                currentPos = position;
              }
              else if (position - currentPos < 0){
                let removeAmount = currentPos - position;
                const newRemovedStacks = new Array(removeAmount).fill(null).map((_, i) => (
                    <StackDestroy key={Date.now() + i}/>
                  ));
                setStacks((stacks) => [...stacks.slice(0, -removeAmount)]);
                setRemovedStacks((removedStacks) => [...removedStacks, ...newRemovedStacks]);
                currentPos = position;
              }

        }
    }

    React.useEffect(() => {
        window.addEventListener('scroll', captureScroll, true);
        return () => {
            window.removeEventListener('scroll', captureScroll);
        }
    }, []);

    return (
        <>
            <div className="flex absolute w-[10%] min-w-[100px] h-screen bottom-3 right-0 items-end justify-center" id="stack-scroll">
                <div className="grid relative gap-y-1 items-center-x " style={{ transform:"rotate(180deg)"}}>
                    <Stack page={0} />
                    {stacks}
                    {removedStacks}
                </div>
            </div>
        </>
    );
}

export default StackScroll;