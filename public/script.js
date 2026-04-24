const moreBtn = document.getElementById("moreBtn");
const menu = document.getElementById("moreMenu");

moreBtn.onclick = () => {
  menu.classList.toggle("show");
};

document.addEventListener("click", (e) => {
  if (!moreBtn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("show");
  }
});
