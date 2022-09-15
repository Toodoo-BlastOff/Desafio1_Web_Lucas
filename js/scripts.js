const allContainer = document.querySelector(".all-container");
const buttonScrollDown = document.querySelector('.scroll-down-button')
const buttonsNavigation = document.querySelectorAll(".nav-list .nav-list-item");
const pagesNavigation = ["ships"];
buttonsNavigation.forEach((button) => {
  pagesNavigation.push(button.getAttribute("page"));
});

function navigateMenu(currentPage) {
  pagesNavigation.forEach((page) => {
    const oldPage = document.querySelector(`.all-container.${page}`);
    oldPage ? oldPage.classList.remove(page) : "";
  });
  allContainer.classList.add(currentPage);
}

function scrollToMain(){
  const top = document.querySelector('.main').offsetTop;
  window.scroll({
    top: top - 100,
    behavior: "smooth",
  })
}

buttonsNavigation.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const page = button.getAttribute("page");
    navigateMenu(page);
  });
});

buttonScrollDown.addEventListener('click', scrollToMain)
