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
