class AstronomyCard {
  constructor(image, type, name, id, date, status) {
    this.image = image;
    this.type = type;
    this.name = name;
    this.id = id;
    this.date = date;
    this.status = status;
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
  createRocketsCard() {
    const card = `
    <li class="last-release-item ${this.status ? "" : "status-inactive"}">
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
  }
}
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
  function locateLaunch(rocketId) {
    let obj;
    for (let i = 0; i < dataLaunchers.length; i++) {
      if (rocketId == dataLaunchers[i].rocket.rocket_id) {
        obj = dataLaunchers[i];
        break;
      }
    }
    return obj;
  }
  const url = "https://api.spacexdata.com/v3/rockets";
  const data = await (await fetch(url)).json();
  for (let i = 0; i <= 2; i++) {
    const obj = data[i];
    const objLaunch = locateLaunch(obj.rocket_id);
    const image = objLaunch.links.mission_patch || objLaunch.links.mission_patch;
    const name = objLaunch.rocket.rocket_name;
    const type = obj.rocket_type;
    const status = obj.active;
    const id = obj.id;
    const card = new AstronomyCard(image, type, name, id, null, status);
    card.createRocketsCard();
  }
}

const lastReleasesList = document.querySelector(".last-releases-list");
const releasesRocketList = document.querySelector(".releases-list");

fetchLaunchers();
