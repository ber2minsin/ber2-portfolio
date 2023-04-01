import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { Text, Img, Button, Input } from "components";
import { CloseSVG } from "../../assets/images";
import { copyToClipboard} from "./functions";
import fetch from "node-fetch";
import { gzip } from 'pako';

let timeoutId: NodeJS.Timeout;
let selection = [];
let selected_categories = [];

const MainPagePage: React.FC = () => {
  const [inputvalue, setInputvalue] = React.useState<string>("");
  const [mouseNearSearchBar, setMouseNearSearchBar] = useState(true);
  const [isSearchBarFocused , setIsSearchBarFocused] = useState(false);


  function Category(props) {
    if (props.checked == null) {
      props.checked = false;
    }

    if (props.checked && !props.silent) {
      refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", props.category_id, props.checked, true);
    }
    const [checked, setChecked] = useState(props.checked);

    function handleClick(categoryId) {
      console.log("Clicked and recieved: " + categoryId);

      if (!checked) {
        if (!selected_categories.includes(props.name)) {
          selected_categories.push(props.name);
        }
        refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", categoryId, !checked, true);
      }else{
        const index = selected_categories.indexOf(props.name);
        if (index > -1) {
          selected_categories.splice(index, 1);
        }

        console.log("Unchecking");
        refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", categoryId, !checked, true);
      }

      setChecked(!checked);

    }

    return (
      <div className="flex flex-row mt-1 gap-x-[10px] select-none cursor-pointer items-start justify-start md:w-[100%] w-[100%]" data-category-id={props.category_id} data-checked={checked} onMouseDown={()=>handleClick(props.category_id)}>
          {checked && (
          <Img
            src="images/img_checkmark.svg"
            className="h-[22px] w-[22px]"
            alt="checkmark"
            id="CategoryCheckmark"
          />) || (
          <Img
            src="images/img_no_checkmark.svg"
            className="h-[22px] w-[22px]"
            alt="checkmark"
            id="CategoryCheckmark"
          />)}

          <Text
            className="capitalize not-italic text-left text-white_A700 w-[auto]"
            as="h2"
            variant="h2"
            id="CategoryName"
          >
            {props.name}
          </Text>
      </div>
    );
  }

  function Material(props) {
    if (props.matcheck == null) {
      props.matcheck = false;
    }

    const [checked, setChecked] = useState(props.matcheck);
    const name = props.name;

    function handleMatClick() {
      console.log("Clicked");
      setChecked(!checked);
      if (!checked) {
        selection.push(props.name);
      }else{
        const index = selection.indexOf(props.name);
        if (index > -1) {
          selection.splice(index, 1);
        }
      }
      console.log(selection);
      setGeneratedText();
    }

    return (
      <div className="flex flex-1 flex-col gap-[51px] items-start justify-start md:mt-[0] mt-[28px] w-[100%]" data-material="">
        <div className="flex items-center justify-start md:w-[100%] w-[21%]">
          <div className="flex flex-col items-center w-[100%]">
            <div className="items-center hover:scale-110 duration-150">
              <div className="flex justify-center bg-gray_901 h-[285px] items-center p-[34px] sm:px-[20px] rounded-[20px] w-[285px] mix-blend-normal" id="MatImg" onMouseDown={handleMatClick}>
                  {checked && (<Img
                    src="images/Overlay.png"
                    className="justify-center select-none object-cover z-50 absolute bg-gray_901/10 backdrop-blur-sm rounded-[20px]"
                    alt="imageOne"
                  />)}
                  <Img
                    src={props.imgsrc}
                    className="h-[217px] object-cover rounded-[22px] select-none absolute"
                    alt="imageOne"
                  />
              </div>
              <div className="flex flex-col items-center justify-start pt-3">
                {checked && (<Text
                  className="capitalize not-italic text-center text-lime_custom"
                  as="h3"
                  variant="h3"
                  id="MatName"
                >
                  {props.name}
                </Text>) || <Text
                  className="capitalize not-italic text-center text-white_A700"
                  as="h3"
                  variant="h3"
                  id="MatName"
                >
                  {props.name}
                </Text>}
                <Text
                  className="capitalize not-italic text-center text-gray_600 w-[auto]"
                  as="h4"
                  variant="h4"
                >
                  {props.category}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  function refreshCategoryList(category_grid){
    // XMLHttpRequest

    let req = new XMLHttpRequest();
    let categories = [];
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        categories = JSON.parse(this.responseText);
        console.log(categories);
      }
    };

    req.open("GET", "http://192.168.168.14:8081/get_all_categories", true);
    req.send();

    req.onload = function() {

      console.log(categories);

      // let categories = [{name:"wood"}, {name:"steel"}, {name:"plastic"}, {name:"glass"}, {name:"ceramic"}, {name:"stone"}, {name:"concrete"}, {name:"fabric"}, {name:"leather"}, {name:"paper"}, {name:"rubber"}, {name:"other"}]
      let category_grid_div = document.getElementById(category_grid);

      while(category_grid_div.firstChild){
        category_grid_div.removeChild(category_grid_div.firstChild);
      }
      for(let i = 0; i < categories.length; i++){
        const category = categories[i];
        const needscheck = selected_categories.includes(category.category_name.toLowerCase());
        console.log(needscheck);

        const categoryElement = React.createElement(Category, { name: category.category_name, checked: needscheck, category_id: category.category_id, silent: true});
        const categoryContainer = document.createElement("div");

        ReactDOM.render(categoryElement, categoryContainer);
        category_grid_div.appendChild(categoryContainer);
      }
    }
  }
  // There has to be a way millions of times better than this
  function refreshMaterialList(material_grid, category_grid, search_bar, firedCategoryId, firedCategoryChecked, searchEnabled){
    // TODO request
    let getMaterials = new XMLHttpRequest();
    let materials = [];
    getMaterials.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        materials = JSON.parse(this.responseText);
        let material_grid_div = document.getElementById(material_grid);
        // Clear the material grid
        while(material_grid_div.firstChild){
          material_grid_div.removeChild(material_grid_div.firstChild);
        }
        console.log("Recieveed Materials", materials);
        for(let i = 0; i < materials.length; i++){
          const material = materials[i];
          var needscheck = false;
          if (selection.includes(material.material_name)) {
            needscheck = true;
          }else{
            needscheck = false;
          }

          const materialElement = React.createElement(Material, { name: material.material_name, matcheck: needscheck, category: material.category, imgsrc: "mat_images/" + material.material_name + ".png"});


          const materialContainer = document.createElement("div");

          ReactDOM.render(materialElement, materialContainer);
          material_grid_div.appendChild(materialContainer);
        }
      }
    };

    let category_grid_div = document.getElementById(category_grid);
    let search_bar_div = document.getElementById(search_bar);

    // Get the selected category_id from the state of CategoryList component
    const categoryListElement = document.getElementById(category_grid);
    const selectedCategoryElements = document.querySelectorAll("[data-category-id][data-checked=true]");

    var selectedCategoryIds = [];
    for (let i = 0; i < selectedCategoryElements.length; i++) {
      let selectedCategoryId = (selectedCategoryElements[i] as HTMLDivElement).dataset.categoryId;
      selectedCategoryIds.push(selectedCategoryId);
    }

    if (firedCategoryId !== undefined && !selectedCategoryIds.includes(firedCategoryId) && firedCategoryChecked) {
      // Add the category to the list
      selectedCategoryIds.push(firedCategoryId);
    }

    if (firedCategoryId !== undefined && !firedCategoryChecked) {
      // Remove the category from the list
      const index = selectedCategoryIds.indexOf(String(firedCategoryId));
      if (index > -1) {
        selectedCategoryIds.splice(index, 1);
      }

    }
    try{

      var searchBarValue = (search_bar_div as HTMLInputElement).value;
      selectedCategoryIds = selectedCategoryIds.map((value) => parseInt(value));
    }catch(e){
      console.log(e);
      var searchBarValue = '';
    }



    if (searchBarValue === '' || !searchEnabled) {
      getMaterials.open("POST", "http://192.168.168.14:8081/get_material_by_categories", true);
      getMaterials.setRequestHeader("Content-Type", "application/json");
      getMaterials.send(JSON.stringify(selectedCategoryIds));
    }
    if (searchBarValue !== '' && searchEnabled){
      console.log("Search bar value", searchBarValue);

      getMaterials.open("POST", "http://192.168.168.14:8081/search_mat_filtered_by_categories?search_term=" + searchBarValue, true);
      getMaterials.setRequestHeader("Content-Type", "application/json");
      getMaterials.send(JSON.stringify(selectedCategoryIds));
    }
    // Turn the arrays values into int

    // // let materials = [{name:"wood", category:"wood"}, {name:"steel", category:"steel"}, {name:"plastic", category:"plastic"}, {name:"glass", category:"glass"}, {name:"ceramic", category:"ceramic"}, {name:"stone", category:"stone"}, {name:"concrete", category:"concrete"}, {name:"fabric", category:"fabric"}, {name:"leather", category:"leather"}, {name:"paper", category:"paper"}, {name:"rubber", category:"rubber"}, {name:"other", category:"other"}]


  }

  function makeAllMatsSelected(material_grid){
    let material_grid_div = document.getElementById(material_grid);
    let materialElements = document.querySelectorAll("#MatName");


    let allChecked = [...materialElements].every((element: HTMLElement) => {
      let materialName = element.innerText.toLowerCase();
      console.log("Material name", materialName);

      if (!selection.includes(materialName)){
        return false;
      }

      return true;
    });

    if (allChecked === false) {
      materialElements.forEach((element: HTMLElement) => {
        let materialName = element.innerText.toLowerCase();
        console.log("Material name", materialName);

        if (!selection.includes(materialName)){
          selection.push(materialName);
        }
      });
    }else{
      materialElements.forEach((element: HTMLElement) => {
        let materialName = element.innerText.toLowerCase();
        console.log("Material name", materialName);

        if (selection.includes(materialName)){
          selection.splice(selection.indexOf(materialName), 1);
        }
      });
    }

    refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", null, null, true);
    setGeneratedText();
  }

  function setGeneratedText(){
    let generatedText = document.getElementById("generatedString");
    let garbledText = garbleText(selection.join(","));
    generatedText.innerHTML = garbledText;
  }

  function selectAllCategories(category_grid){
    let category_grid_div = document.getElementById(category_grid);
    let categoryElements = category_grid_div.querySelectorAll("[data-category-id]");

    let allChecked = [...categoryElements].every((element: HTMLElement) => {
      let checked = element.dataset.checked;
      if (checked === "false"){
        return false;
      }
      return true;
    });


    if (allChecked === false) {
      categoryElements.forEach((element: HTMLElement) => {
        let category_name = String(element.innerText.toLowerCase());

        if (!selected_categories.includes(category_name)){
          selected_categories.push(category_name);
        }
      });
    }else{
      categoryElements.forEach((element: HTMLElement) => {
        let category_name = String(element.innerText.toLowerCase());

        if (selected_categories.includes(category_name)){
          const index = selected_categories.indexOf(category_name);
          if (index > -1) {
            selected_categories.splice(index, 1);
          }
        }
      });
    }
    refreshCategoryList("CategoryGrid");
    // set timeout to wait for the category list to be refreshed
    // Just ew
    setTimeout(() => {
      refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", null, null, true);
    }
    , 1000);

  }

  function garbleText(text){
    // const compressedData = gzip(text);

    // const compressedString = btoa(String.fromCharCode.apply(null, new Uint8Array(compressedData)));
    // const encodedString = encodeURIComponent(compressedString);
    const encodedString = btoa(text)
    console.log(encodedString);
    return encodedString;
  }

  useEffect(() => {
    refreshCategoryList("CategoryGrid");
    // selectAllCategories("CategoryGrid");

  }, []);

    function handleMouseLeave() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMouseNearSearchBar(false);
      }, 1500);
    }
    function handleMouseEnter() {
      clearTimeout(timeoutId);
      setMouseNearSearchBar(true);
    }


  return (
  <>
    <div
      className="font-poppins w-[100%] min-h-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('images/img_mainpage.svg')" }}
    >
      <div className="flex md:flex-col flex-row md:gap-[40px] gap-[78px] items-start justify-start md:px-[20px] md:w-[100%] w-[96%]" id="Main Background">
        <aside className="bg-gray_900 flex flex-col min-h-screen w-[19%] fixed z-30 " id="LeftNavBackground">
          <Text
            className="capitalize md:ml-[0] mt-[25px] not-italic text-center text-white_A700 w-[auto]"
            as="h1"
            variant="h1"
          >
            Capoom
          </Text>
          <div className="flex flex-col items-center justify-start md:ml-[0] mr-[23px] mt-10 w-[85%]">
            <div className="flex items-center justify-start w-[100%]">
              <div className="h-[60px] relative w-[100%] cursor-pointer" onClick={()=>selectAllCategories("CategoryGrid")}>

                <Img
                  src="images/img_material_groups.svg"
                  className="h-[28px] ml-[26px] my-[auto] relative top-[27%] w-[28px]"
                  alt="settings"
                />
                <Button className="absolute capitalize font-normal h-[100%] inset-[0] justify-center leading-[normal] m-[auto] not-italic py-[18px] rounded-bl-[0] rounded-tl-[11px] rounded-tr-[11px] text-[18px] text-left text-white_A700 w-[auto] ml-16 mb-[8px]">
                  Material Groups
                </Button>
                <div className="flex items-start ml-16 mt-[0.4rem]">
                  <Img
                    src="images/img_select_all.svg"
                    className="absolute capitalize font-normal justify-center mt-[2px] "
                  />
                  <Button className="absolute capitalize font-normal justify-center ml-4  text-lime_custom text-[12px]">
                    Select All
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex p-[26px]  rounded-bl-[10px] rounded-br-[10px] rounded-tl-[0] rounded-tr-[0] w-[100%] ">
              <div className="grid row-end-auto grid-cols-1 gap-y-5 w-[100%] items-start" id="CategoryGrid">
              {/* <Category name="Wood" /> */}
            </div>
            </div>
          </div>
          <div className="flex flex-col ml-[6%] mr-[30px] w-[85%] mt-auto mb-[10%]">
            <div className="flex items-center w-[100%] ml-auto rounded-t-[7px] h-9 bg-gray_select">
              <Text
                className="capitalize not-italic text-center ml-4 text-white_A700 w-[auto] text-[12px] font-medium"
                as="h2"
                variant="h2"
              >
                Generated String
              </Text>
              <div className="animate-pulse ml-auto mr-3" onClick={()=>copyToClipboard("generatedString", "CopyImg")}>
                <Img
                  src="images/img_save.svg"
                  className="h-[18px] w-[auto] block  align-right cursor-pointer"
                  alt="save"
                  id="CopyImg"
                />
              </div>
            </div>
            <div className="bg-bluegray_900 flex justify-start p-[15px] rounded-b-[7px] w-[100%] h-28">
              <Text
                className="capitalize my-[2px] not-italic overflow-hidden break-all text-left text-white_A700 w-[100%] h-[100%] cursor-pointer"
                as="h4"
                variant="h4"
                id="generatedString"
                onMouseDown={()=>copyToClipboard("generatedString", "generatedString")}
              >
                Select materials to text to appear
              </Text>
            </div>
          </div>
        </aside>
        <header className={`flex justify-end w-[78%] fixed top-5 right-5 z-40 ${mouseNearSearchBar || isSearchBarFocused ? 'opacity-100' : 'opacity-30'} transition-opacity ease-in-out duration-300`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} id="Searchbar">
          <Input
            value={inputvalue}
            onChange={(e) => {setInputvalue(e?.target?.value); refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", null, null, true)}}
            wrapClassName="bg-bluegray_901 border-[2px] border-gray_800 border-solid flex md:flex-1 pl-[18px] pr-[11px] py-[10px] rounded-bl-[0] rounded-br-[0] rounded-tl-[6px] rounded-tr-[6px] md:w-[100%] w-[75%]"
            className="capitalize font-normal leading-[normal] not-italic p-[0] placeholder:text-white text-[15px] text-left text-white_A700 w-[100%]"
            id="SearchBarInput"
            name="searchbar"
            placeholder="Search materials"
            onFocus={() => {setIsSearchBarFocused(true)}} onBlur={() => {setIsSearchBarFocused(false)}}
            prefix={
              <div className="h-[23px] mt-[1px] mr-[20px] w-[23px]">
                <Img
                  src="images/img_search.svg"
                  className="cursor-pointer my-[auto]"
                  alt="search"
                />
              </div>
            }
            suffix={
              <CloseSVG
                className="cursor-pointer my-[auto]"
                onClick={(e) => {setInputvalue(""); refreshMaterialList("MatGrid", "CategoryGrid", "SearchBarInput", null, null, false)}}
                fillColor="#ffffff"
                style={{
                  visibility:
                    inputvalue?.length <= 0 ? "hidden" : "visible",
                }}
                height={23}
                width={23}
                viewBox="0 0 23 23"
              />
            }
          ></Input>
          <Button className="bg-bluegray_901 border-[2px] border-gray_800 border-solid capitalize cursor-pointer font-normal leading-[normal] min-w-[190px] md:ml-[0] ml-[13px] not-italic py-[11px] rounded-[6px] text-[15px] text-center text-white_A700 w-[auto]">
            Import String
          </Button>
          <Button className="bg-bluegray_901 border-[2px] border-gray_800 border-solid capitalize cursor-pointer font-normal leading-[normal] min-w-[132px] md:ml-[0] ml-[13px] not-italic py-[11px] rounded-[6px] text-[15px] text-center text-white_A700 w-[auto] hover:text-lime_custom" onClick={() => {makeAllMatsSelected("MatGrid")}}>
            Select All
          </Button>
        </header>
        <main className="flex flex-col items-start justify-start md:mt-[0] mt-[80px] w-[100%]">
          <div className="grid row-end-auto grid-cols-4 gap-x-60 pl-[30%]" id="MatGrid">
          </div>
        </main>

      </div>
    </div>

  </>

  );
};

export default MainPagePage;
