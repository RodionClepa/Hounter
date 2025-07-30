import { CustomDropdown } from "./components/custom-drop-down.js";
import { initCharCounters } from "./components/textarea_count.js";

const articleDropdown = new CustomDropdown(
  document.querySelector("#more-articles-drop"),
);

const articleDropdownWhite = new CustomDropdown(
  document.querySelector("#more-articles-drop-white"),
);

initCharCounters();
