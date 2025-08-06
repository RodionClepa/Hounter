export class CustomDropdown {
  constructor(dropdownEl) {
    this.dropdownEl = dropdownEl;
    this.button = dropdownEl.querySelector("button");
    this.optionsContainer = dropdownEl.querySelector("ul");
    this.options = [...this.optionsContainer.querySelectorAll("li")];
    this.focusedOption = 0;
    this.selectedOption = -1;
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this.zIndexOpenBtn = 20;
    this.zIndexOpenList = 19;

    this.init();
  }

  init() {
    this.button.addEventListener("click", () => this.toggle());
    this.button.addEventListener("keydown", (e) => this.handleKeyboard(e));
    this.optionsContainer.addEventListener("click", (e) =>
      this.handleOptionClick(e),
    );
  }

  focusSelected() {
    this.options[this.focusedOption].classList.add("highlight");
    this.button.setAttribute(
      "aria-activedescendant",
      this.options[this.focusedOption].id,
    );
  }

  isOpen() {
    return this.optionsContainer.classList.contains("active");
  }

  open() {
    this.optionsContainer.classList.add("active");
    this.focusedOption = this.selectedOption === -1 ? 0 : this.selectedOption;
    this.button.setAttribute("aria-expanded", true);
    this.focusSelected();
    this.button.style.zIndex = this.zIndexOpenBtn;
    this.optionsContainer.style.zIndex = this.zIndexOpenList;

    document.addEventListener("click", this.boundHandleOutsideClick);
  }

  close() {
    this.optionsContainer.classList.remove("active");
    this.focusedOption = 0;
    this.clearFocus();
    this.button.setAttribute("aria-expanded", false);
    this.button.setAttribute("aria-activedescendant", "");
    this.button.style.zIndex = "auto";
    this.optionsContainer.style.zIndex = "auto";

    document.removeEventListener("click", this.boundHandleOutsideClick);
  }

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  handleOutsideClick(e) {
    if (!this.dropdownEl.contains(e.target)) {
      this.close();
    }
  }

  clearFocus() {
    this.options.forEach((el) => el.classList.remove("highlight"));
  }

  updateLabel(index) {
    this.button.querySelector("span").textContent =
      this.options[index].innerText;
  }

  next() {
    this.focusedOption = (this.focusedOption + 1) % this.options.length;
    this.clearFocus();
    this.focusSelected();
  }

  prev() {
    this.focusedOption =
      (this.focusedOption - 1 + this.options.length) % this.options.length;
    this.clearFocus();
    this.focusSelected();
  }

  closeSelect() {
    this.selectOption(this.focusedOption);
    this.close();
  }

  handleKeyboard(e) {
    const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "];
    const { key, altKey } = e;
    if (key === "Tab") {
      return;
    }

    e.preventDefault();
    if (!this.isOpen() && openKeys.includes(key)) {
      return this.open();
    }

    if ((key === "ArrowUp" && altKey) || key === "Escape") {
      return this.close();
    } else if (key === "ArrowUp") {
      return this.prev();
    } else if (key === "ArrowDown") {
      return this.next();
    } else if (key === "Enter" || key === " ") {
      return this.closeSelect();
    }
  }

  handleOptionClick(e) {
    const li = e.target.closest("li");
    if (!li || !this.dropdownEl.contains(li)) return;

    const index = this.options.findIndex(
      (el) => el.dataset.id === li.dataset.id,
    );
    if (index !== -1) {
      this.selectOption(index);
      this.close();
    }
  }

  selectOption(index) {
    this.selectedOption = index;
    this.options.forEach((optionEl) =>
      optionEl.setAttribute("aria-selected", false),
    );
    this.options[this.selectedOption].setAttribute("aria-selected", true);
    this.updateLabel(index);
  }
}
