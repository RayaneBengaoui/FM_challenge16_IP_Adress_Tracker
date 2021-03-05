let api_key = process.env.IPFY_PRIVATE_KEY;
let ip_adress = "";
let ipfy_fetch_link = `
https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=8.8.8.8`;

// async function getIpInformation() {
//   const dataFetch = await fetch(ipfy_fetch_link);
// }

console.log(ipfy_fetch_link);
