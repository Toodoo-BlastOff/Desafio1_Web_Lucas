class AstronomyCard {
  constructor(image, type, name, id, date, status) {
    this.image = image;
    this.type = type;
    this.name = name;
    this.id = id;
    this.date = date;
    this.status = status;
  }
  insertEvents() {
    this.nodeCard.addEventListener("click", async (event) => {
      function select() {
        let selected;
        rocketInfo.forEach((element) => {
          element.rocket.id == +index + 1 ? (selected = element) : "";
        });
        return selected;
      }
      event.preventDefault();
      const index = this.nodeCard.getAttribute("rocketIndex");
      const selected = select();

      const rocketName = selected.rocket.rocket_id;
      const pageRocketInfo = selected.rocket.description;
      const pageRocketImgMain = selected.rocket.flickr_images[0];
      const pageRocketImg = selected.rocket.flickr_images[1];
      const pageRocketVideoId = selected.laucher.links.youtube_id;
      const pageRocketVideolink = selected.laucher.links.video_link;
      const pageRocketRedditlink = selected.laucher.links.article_link;
      const pageRocketDate = selected.laucher.launch_date_local.split(/[a-z]/i)[0];
      const pageRocketSite = selected.laucher.launch_site.site_name;
      const pageRocketStatus = selected.laucher.launch_success;
      const pageRocketType = selected.rocket.rocket_type;
      const pageRocketFirstStage = selected.laucher.rocket.first_stage.cores[0].core_serial;
      const pageRocketSecondStage = selected.laucher.rocket.second_stage.payloads[0].payload_mass_kg;
      const pageRocketDetails = selected.laucher.details;

      headerRocketImg.setAttribute("src", pageRocketImgMain);
      headerRocketName.innerText = rocketName || "foguete";
      mainRocketTitle.innerText = `Conheça o ${rocketName || "foguete"}`;
      mainRocketInfo.innerText = pageRocketInfo || "not found";
      mainRocketImg.setAttribute("src", pageRocketImg);
      tdDate.innerText = pageRocketDate || "not found";
      tdSite.innerText = pageRocketSite || "not found";
      tdStatus.innerText = pageRocketStatus ? "success" : "failure";
      pageRocketStatus ? tdStatus.classList.add("success") : tdStatus.classList.remove("success");
      tdType.innerText = pageRocketType || "not found";
      tdFirstStage.innerText = pageRocketFirstStage || "not found";
      tdSecondStage.innerText = pageRocketSecondStage ? `Payloads: ${pageRocketSecondStage}Kg` : "not found";
      tdDetails.innerText = pageRocketDetails || "not found";

      const videoContainer = `
      <div class="rocket-video">
              <iframe width="524" height="335px" src="https://www.youtube.com/embed/${pageRocketVideoId}" title="${rocketName}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
              </iframe>
              <figure class="video-paused"
              onclick="this.style = 'display: none;'">
                <img src="${pageRocketImg}" alt="${rocketName}">
                <figure class="play-button">
                </figure>
                <ul class="list-link">
                  <li>
                    <a href="${pageRocketVideolink}" target="__blank">
                      <figure class="youtube">
                        <img src="img/logo-youtube.png" alt="youtube">
                      </figure>
                      <p>ver pelo youtube</p>
                    </a>
                  </li>
                  <li>
                    <a href="${pageRocketRedditlink}" target="__blank">
                      <p>ver pelo reddit</p>
                      <figure class="reddit">
                        <img src="img/logo-reddit.png" alt="reddit">
                      </figure>
                    </a>
                  </li>
                </ul>
              </figure>
          </div>
      `;

      rocketVideoContainer.removeChild(
        rocketVideoContainer.querySelector(".rocket-video"),
      );
      rocketVideoContainer.insertAdjacentHTML("afterbegin", videoContainer);

      scrollToY(0);
      navigateMenu("ships");
    });
  }
  createLaucherCard() {
    const card = `
    <li class="last-release-item">
      <figure class="card-image">
        <img src="${this.image}" alt="${this.name}">
      </figure>
      <p class="ship-status">${this.type}</p>
      <p class="name">${this.name}</p>
      <p class="ship-info id">${this.id}</p>
      <p class="ship-info launch">${this.date}</p>
    </li>
    `;
    lastReleasesList.insertAdjacentHTML("beforeend", card);
  }
  createRocketsCard(index) {
    const card = `
    <li class="last-release-item ${
      this.status ? "" : "status-inactive"
    }" rocketIndex="${index}">
      <figure class="card-image">
        <img src="${this.image}" alt="${this.name}">
      </figure>
      <p class="ship-status">${this.type}</p>
      <p class="name">${this.name}</p>
      <a href="#" class="button status-inactive">Inactive</a>
      <a href="#" class="button status-active">Active</a>
    </li>
    `;
    releasesRocketList.insertAdjacentHTML("beforeend", card);
    this.nodeCard = document.querySelector(`[rocketIndex="${index}"]`);
    this.insertEvents();
  }
}

class RocketInfo {
  constructor(laucher, rocket) {
    this.rocket = rocket;
    this.laucher = laucher;
  }

  async showInfo() {}
}

const allContainer = document.querySelector(".all-container");
const buttonScrollDown = document.querySelector(".scroll-down-button");
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

function scrollToMain() {
  const top = document.querySelector(".main").offsetTop;
  window.scroll({
    top: top - 100,
    behavior: "smooth",
  });
}

buttonsNavigation.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const page = button.getAttribute("page");
    navigateMenu(page);
  });
});

buttonScrollDown.addEventListener("click", scrollToMain);


async function fetchLaunchers() {
  const url = "https://api.spacexdata.com/v3/launches";
  const data = await (await fetch(url)).json();
  for (let i = 11; i <= 14; i++) {
    const obj = data[data.length - i];
    const image = obj.links.mission_patch || obj.links.mission_patch;
    const name = obj.mission_name;
    const id = obj.launch_site.site_name;
    const date = obj.launch_date_local.split(/[a-z]/i)[0];
    const type = "launch";
    const card = new AstronomyCard(image, type, name, id, date);
    card.createLaucherCard();
  }
  fetchRockets(data);
}

async function fetchRockets(dataLaunchers) {
  function locateLaunch(objRocket, index) {
    let obj;
    for (let i = 0; i < dataLaunchers.length; i++) {
      if (objRocket.rocket_id == dataLaunchers[i].rocket.rocket_id) {
        obj = dataLaunchers[i];
        rocketInfo.push(new RocketInfo(dataLaunchers[i], objRocket));
        break;
      }
    }
    return obj;
  }
  const url = "https://api.spacexdata.com/v3/rockets";
  const data = await (await fetch(url)).json();
  for (let i = 0; i <= 2; i++) {
    const obj = data[i];
    const objLaunch = locateLaunch(obj, i);
    const image =
      objLaunch.links.mission_patch || objLaunch.links.mission_patch;
    const name = objLaunch.rocket.rocket_name;
    const type = obj.rocket_type;
    const status = obj.active;
    const id = obj.id;
    const card = new AstronomyCard(image, type, name, id, null, status);
    card.createRocketsCard(i);
  }
}

function scrollToY(y) {
  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}

const lastReleasesList = document.querySelector(".last-releases-list");
const releasesRocketList = document.querySelector(".releases-list");
const learnCards = document.querySelectorAll(".learn-cards-item .card-item-button");
const rocketInfo = [];

const headerRocketImg = document.querySelector(".ships-image img");
const headerRocketName = document.querySelector(".ships-info .title");
const mainRocketTitle = document.querySelector(".main-ships-container .title");
const mainRocketInfo = document.querySelector(".main-ships-container .text");
const mainRocketImg = document.querySelector(".main-ships-container .rocket-image img");
const tdDate = document.querySelector(".tr-content.launch-date .text");
const tdSite = document.querySelector(".tr-content.launch-site .text");
const tdStatus = document.querySelector(".tr-content.launch-status .text");
const tdType = document.querySelector(".tr-content.type .text");
const tdFirstStage = document.querySelector(".tr-content.first-stage .text");
const tdSecondStage = document.querySelector(".tr-content.second-stage .text");
const tdDetails = document.querySelector(".tr-content.details .text");

const rocketVideoContainer = document.querySelector(".rocket-video").parentNode;

console.log(rocketVideoContainer);

fetchLaunchers();

learnCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    navigateMenu(card.parentNode.getAttribute("page"));
    debugger;
    scrollToY(100);
  });
});
