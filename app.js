let ipfyKey;

async function getIpfyKey() {
  const result = await fetch("/.netlify/functions/token-hider");
  const { key } = await result.json();
  let ipfy_fetch_link = `
https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=8.8.8.8`;
  console.log(ipfy_fetch_link);
}

getIpfyKey();

let ip_adress = "";

// async function getIpInformation() {
//   const dataFetch = await fetch(ipfy_fetch_link);
// }
