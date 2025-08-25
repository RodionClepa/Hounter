export function initButtonCookie() {
  const cookieBanner = document.querySelector(".cookie");
  const closeBtn = document.querySelector(".cookie__close");

  closeBtn.addEventListener("click", function () {
    cookieBanner.classList.add("hidden");
  });
}
