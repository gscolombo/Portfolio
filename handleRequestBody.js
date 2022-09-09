/**
 * Module to handle POST requests
 */
module.exports = async (request) => {
  // let data = "";
  // request.on("data", (chunk) => (data += chunk));
  // request.on("end", () => JSON.parse(data));
  const buffers = [];
  for await (const chunk of request) {
    buffers.push(chunk);
  }

  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};
