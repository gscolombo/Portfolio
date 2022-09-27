/**
 * Portfolio's server entrypoint
 */
const { MongoClient } = require("mongodb");
const handleDatabaseRequest = require("./handleDatabaseRequest");

const mongodb_url = `mongodb+srv://gscolombo:${process.env.MONGODB_PASSWORD}@personalportfolio.infvfkc.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async function (event) {
  const client = new MongoClient(mongodb_url);
  const dbResponse = await handleDatabaseRequest(event, client); // Process database request

  // Set content-type header to "application/json"
  dbResponse.headers = {
    "Content-Type": "application/json",
  };

  // Return response to client
  return dbResponse;
};
