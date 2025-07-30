export class CustomDropdown {
  constructor(dropdownEl) {
    this.dropdownEl = dropdownEl;
    this.button = dropdownEl.querySelector("button");
    this.optionsContainer = dropdownEl.querySelector("ul");
    this.options = [...this.optionsContainer.querySelectorAll("li")];
    this.focusedOption = 0;
    this.selectedOption = -1;

    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);

    this.init();
  }

  init() {
    this.button.addEventListener("click", () => this.toggle());
    this.button.addEventListener("keydown", (e) => this.handleKeyboard(e));
    this.dropdownEl.addEventListener("click", (e) => this.handleOptionClick(e));
  }

  focusSelected() {
    this.options[this.focusedOption].classList.add("selected");
  }

  open() {
    this.optionsContainer.classList.add("active");
    this.focusedOption = this.selectedOption === -1 ? 0 : this.selectedOption;
    this.focusSelected();

    document.addEventListener("click", this.boundHandleOutsideClick);
  }

  close() {
    this.optionsContainer.classList.remove("active");
    this.focusedOption = 0;
    this.clearFocus();

    document.removeEventListener("click", this.boundHandleOutsideClick);
  }

  toggle() {
    const isActive = this.optionsContainer.classList.contains("active");
    isActive ? this.close() : this.open();
  }

  handleOutsideClick(e) {
    if (!this.dropdownEl.contains(e.target)) {
      this.close();
    }
  }

  clearFocus() {
    this.options.forEach((el) => el.classList.remove("selected"));
  }

  updateLabel(index) {
    this.button.querySelector("span").textContent =
      this.options[index].innerText;
  }

  handleKeyboard(e) {
    const key = e.code;

    if (key === "Tab") {
      this.close();
      return;
    }

    e.preventDefault();

    if (key === "Enter") {
      this.toggle();
      return;
    }

    if (!this.optionsContainer.classList.contains("active")) return;

    if (key === "ArrowDown") {
      this.focusedOption = (this.focusedOption + 1) % this.options.length;
    } else if (key === "ArrowUp") {
      this.focusedOption =
        this.focusedOption === 0
          ? this.options.length - 1
          : this.focusedOption - 1;
    } else if (key === "Space") {
      this.selectOption(this.focusedOption);
      this.close();
      return;
    }

    this.clearFocus();
    this.focusSelected();
  }

  handleOptionClick(e) {
    const li = e.target.closest("li");
    if (!li || !this.dropdownEl.contains(li)) return;

    const index = this.options.findIndex(
      (el) => el.dataset.id === li.dataset.id,
    );
    if (index === -1) return;

    this.selectOption(index);
    this.close();
  }

  selectOption(index) {
    this.selectedOption = index;
    this.updateLabel(index);
  }
}
