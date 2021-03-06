// DOM Elements
var map = L.map("map-container", {
  zoomControl: false,
});

const ipText = document.querySelector(".ip");
const locationText = document.querySelector(".location");
const timezoneText = document.querySelector(".timezone");
const ispText = document.querySelector(".isp");

const errorContainer = document.querySelector(".error-container");
const info_boxes = document.querySelectorAll(".info-container__box");

const ipInput = document.querySelector("input");
const searchButton = document.querySelector("button");

const loaderSection = document.querySelector(".loader-container");
const mapSection = document.querySelector("#map-container");

// Variables
let isLoading = true;

// Event Listeners
searchButton.addEventListener("click", () => {
  isLoading = true;

  getIpData(ipInput.value);
});

window.addEventListener("load", () => {
  getIpData();
});

// Map Initialization
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

// Functions
function setMapLocation(map, lat, lng) {
  map.setView([lat, lng], 13);
  setTimeout(function () {
    map.invalidateSize();
  }, 100);

  var marker = L.marker([lat, lng]).addTo(map);
}

function isValidIpv4Addr(ip) {
  return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(
    ip
  );
}

function isValidDomainName(name) {
  return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(name);
}

function updateInfo(ip, country, city, timezone, isp) {
  ipText.textContent = ip;
  locationText.textContent = `${country},  ${city}`;
  timezoneText.textContent = timezone;
  ispText.textContent = isp;
}

function resetInfo() {
  ipText.textContent = "";
  locationText.textContent = "";
  timezoneText.textContent = "";
  ispText.textContent = "";
}

function setLoader(isLoading) {
  if (isLoading) {
    loaderSection.style.display = "flex";
    mapSection.style.display = "none";
  } else {
    loaderSection.style.display = "none";
    mapSection.style.display = "block";
  }
}

function resetError() {
  errorContainer.classList.remove("active-error");
  info_boxes.forEach((box) => {
    box.style.display = "flex";
  });
}

async function getToken() {
  //Get the IPFY API key from the token-hider file
  const tokenRequest = await fetch("/.netlify/functions/token-hider");
  const { key } = await tokenRequest.json();

  return key;
}

async function getOwnIp() {
  const fetch_link = `https://api.ipify.org?format=json`;
  const response = await fetch(fetch_link);
  const { ip } = await response.json();
  return ip;
}

async function getIpData(input) {
  let ip_search;
  let domain;
  let ipfy_fetch_link;

  resetInfo();
  resetError();
  setLoader(isLoading);

  const key = await getToken();

  if (input === undefined) {
    ip_search = await getOwnIp();
    ipfy_fetch_link = `https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=${ip_search}`;
  } else {
    if (isValidIpv4Addr(input)) {
      ip_search = input;
      ipfy_fetch_link = `https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=${ip_search}`;
    } else {
      if (isValidDomainName(input)) {
        domain = input;
        ipfy_fetch_link = `https://geo.ipify.org/api/v1?apiKey=${key}&domain=${domain}`;
      } else {
        loaderSection.style.display = "none";
        mapSection.style.display = "none";
        errorContainer.classList.add("active-error");

        info_boxes.forEach((box) => {
          box.style.display = "none";
        });

        return;
      }
    }
  }

  // Fetching the IPFY API with the given IP adress
  const ipfyRequest = await fetch(ipfy_fetch_link);
  const {
    ip,
    location: { country, city, timezone, lat, lng },
    isp,
  } = await ipfyRequest.json();

  // Updating UI
  setMapLocation(map, lat, lng);
  updateInfo(ip, country, city, timezone, isp);

  ipInput.value = "";
  isLoading = false;

  setLoader(isLoading);
}
