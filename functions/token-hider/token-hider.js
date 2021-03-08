const process = require("process");

const handler = async function (event) {
  const { IPFY_PRIVATE_KEY } = process.env;

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ key: IPFY_PRIVATE_KEY }),
    };
  } catch (error) {
    const { status, statusText, headers, data } = error.response;
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};

module.exports = { handler };
