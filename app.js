// DOM Elements
var map = L.map("map-container");

const ipText = document.querySelector(".ip");
const locationText = document.querySelector(".location");
const timezoneText = document.querySelector(".timezone");
const ispText = document.querySelector(".isp");

const ipInput = document.querySelector("input");
const searchButton = document.querySelector("button");

searchButton.addEventListener("click", () => {
  getIpData(ipInput.value);
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function setMapLocation(map, lat, lng) {
  map.setView([lat, lng], 13);
}

function updateInfo(ip, country, region, city, timezone, isp) {
  ipText.textContent = ip;
  locationText.textContent = `${country}, ${region}, ${city}`;
  timezoneText.textContent = timezone;
  ispText.textContent = isp;
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

async function getIpData(ip) {
  const key = await getToken();

  if (ip === undefined) {
    ip = await getOwnIp();
  }

  let ipfy_fetch_link = `https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=${ip}`;

  // Fetching the IPFY API with the given IP adress
  const ipfyRequest = await fetch(ipfy_fetch_link);
  const {
    location: { country, region, city, timezone, lat, lng },
    isp,
  } = await ipfyRequest.json();

  // Updating UI
  setMapLocation(map, lat, lng);
  updateInfo(ip, country, region, city, timezone, isp);

  ipInput.value = "";
}

// setTimeout(getIpData(), 1000);
