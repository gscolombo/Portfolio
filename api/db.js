/**
 * Portfolio's server entrypoint
 */
const handleDatabaseRequest = require("./handleDatabaseRequest");
const mongodb_url = `mongodb+srv://gscolombo:${process.env.MONGODB_PASSWORD}@personalportfolio.infvfkc.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async function (event) {
  const dbResponse = await handleDatabaseRequest(event, mongodb_url); // Process database request

  // Set content-type header to "application/json"
  dbResponse.headers = {
    "Content-Type": "application/json",
  };

  // Return response to client
  return dbResponse;
};
