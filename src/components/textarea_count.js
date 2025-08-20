export function initCharCounters(selector = ".form-input--textarea") {
  document.querySelectorAll(selector).forEach((wrapper) => {
    const textarea = wrapper.querySelector(".form-input__field");
    const counter = wrapper.querySelector(".form-input__count");

    if (!textarea || !counter) return;

    const maxLength = textarea.getAttribute("maxlength") || 500;

    counter.textContent = `${textarea.value.length}/${maxLength}`;

    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length}/${maxLength}`;
    });
  });
}
