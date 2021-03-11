// DOM Elements
var map = L.map("map-container");

//change pos
// map.setView([60.505, -10.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function setMapLocation(map, lat, lng) {
  map.setView([lat, lng], 13);
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
  console.log("");

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

  setMapLocation(map, lat, lng);
}

setTimeout(getIpData(), 1000);

// getOwnIp();

let ip_adress = "";

// async function getIpInformation() {
//   const dataFetch = await fetch(ipfy_fetch_link);
// }
