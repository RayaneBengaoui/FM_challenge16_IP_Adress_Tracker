// DOM Elements
var map = L.map("map-container").setView([51.505, -0.09], 13);

//change pos
// map.setView([60.505, -10.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

async function getIpData() {
  //Get the IPFY API key from the token-hider file
  const tokenRequest = await fetch("/.netlify/functions/token-hider");
  const { key } = await tokenRequest.json();
  let ipfy_fetch_link = `
https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=8.8.8.8`;

  // Fetching the IPFY API with the given IP adress
  const ipfyRequest = await fetch(ipfy_fetch_link);
  const {
    location: { country, region, city, timezone },
    isp,
  } = await ipfyRequest.json();

  console.log(isp);
}

getIpData();

let ip_adress = "";

// async function getIpInformation() {
//   const dataFetch = await fetch(ipfy_fetch_link);
// }
