export async function copyToClipboard(div_id, copy_img_id){
    let actual_div = document.getElementById(div_id);
    let popup_text = "";
    let success = false;
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        // Clipboard API not supported or writeText method not available
        popup_text = "Copy to clipboard: Ctrl+C";
    }else{
        try {
        await navigator.permissions.query({ name: "clipboard-write" });
        await navigator.clipboard.writeText(actual_div.innerText);
        popup_text = "Copied!";
        success = true;
        console.log("Text copied to clipboard");
        } catch (err) {
        console.error("Failed to copy text: ", err);
        popup_text = "Copy to clipboard: Ctrl+C, Enter";
        }
      }

    if (!success){
        // fallback if browser doesn't support clipboard API
        // select the text
        const range = document.createRange();
        range.selectNode(actual_div);
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        // copy text
        try{
            document.execCommand("copy");
            popup_text = "Copied!";
            window.getSelection().removeAllRanges();// to deselect
        }  catch(err) {
            console.error("Failed to copy text: ", err);
            success = false;
            popup_text = "Copy to clipboard: Ctrl+C";
        }

    }

    const copiedDiv = document.createElement("div");
    copiedDiv.textContent = popup_text;
    copiedDiv.style.position = "fixed";
    copiedDiv.style.top = "50%";
    copiedDiv.style.left = "50%";
    copiedDiv.style.zIndex = "40";
    copiedDiv.style.fontSize = "12px"; // set the font size
    copiedDiv.style.padding = "6px"; // set the padding
    copiedDiv.style.fontFamily = "Poppins, sans-serif";
    copiedDiv.style.borderRadius = "6px";
    copiedDiv.style.color = "white";

    document.body.appendChild(copiedDiv);

    let copy_img_div = document.getElementById(copy_img_id);
    let top = copy_img_div.offsetTop;
    let left = copy_img_div.offsetLeft;

    // make the copied divs position right at the center of copy_img_div but keep the width and height of the copied div same
    copiedDiv.style.top = top - ((copy_img_div.offsetHeight / 2) - (copiedDiv.offsetHeight / 2)) + "px";
    copiedDiv.style.left = left + (copy_img_div.offsetWidth / 2) - (copiedDiv.offsetWidth / 2) + "px";

    copiedDiv.style.textAlign = "center";

    copiedDiv.style.backgroundColor = "rgb(65,65,65)";
    // zindex to 40
    copiedDiv.style.opacity = 1;

    copiedDiv.style.userSelect = "none";
    // Gradually fade out the "Copied!" message
    const duration = 1500; // 2 seconds
    const start_time = performance.now();
    function updateOpacity(current_time) {
        const time_elapsed = current_time - start_time;
        const t = Math.min(1, time_elapsed / duration); // t is a value between 0 and 1 representing the percentage of time elapsed
        const opacity = 1 - t; // calculate the opacity based on t
        copiedDiv.style.opacity = opacity;
        if (t < 1) {
        requestAnimationFrame(updateOpacity); // request another animation frame if the animation is not finished
        } else {
        document.body.removeChild(copiedDiv); // remove the "Copied!" message from the body when the animation is finished
        }
    }

  requestAnimationFrame(updateOpacity); // start the animation
}


function getSelectedCategories(category_grid){
    let category_grid_div = document.getElementById(category_grid);
    let selected_categories = [];
    let categories = category_grid_div.querySelectorAll("div[data-category-id]");
    for(let i = 0; i < categories.length; i++){
        if (categories[i].getAttribute("selected") == "true"){
            selected_categories.push(categories[i].getAttribute("data-category-id"));
        }
    }
    return selected_categories;
}

export function search(search_bar_id, mat_grid_id, category_grid){
    let selected_categories = getSelectedCategories(category_grid);
    let search_bar = document.getElementById(search_bar_id);
    let search_query = search_bar.value;
    clearMaterials();
    let getMats = new XMLHttpRequest();
}

function clearMaterials(mat_grid_id){
    let mat_grid = document.getElementById(mat_grid_id);
    let mats = mat_grid.querySelectorAll("div[data-mat-id]");
    for(let i = 0; i < mats.length; i++){
        mat_grid.removeChild(mats[i]);
    }
}