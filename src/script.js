const copy = document.querySelector(".hero__stat-list").cloneNode(true);
const parent = document.querySelector(".stat-carousel");
parent.appendChild(copy);
const tracks = parent.querySelectorAll(".carousel-track");
if (tracks) {
  tracks.forEach((track) => track.classList.add("animate"));
}
