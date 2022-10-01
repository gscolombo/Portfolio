/**
 * Portfolio's server entrypoint
 */
const { MongoClient } = require('mongodb');
const zlib = require('zlib');
const handleDatabaseRequest = require('./handleDatabaseRequest');

const mongodb_url = `mongodb+srv://gscolombo:${process.env.MONGODB_PASSWORD}@personalportfolio.infvfkc.mongodb.net/?retryWrites=true&w=majority`;

exports.handler = async function (event) {
  const client = new MongoClient(mongodb_url);
  const response = await handleDatabaseRequest(event, client); // Process database request

  // Set response headers
  response.headers = {
    'Content-Type': 'application/json; charset=utf-8', // Set content-type header to "application/json"
    'Content-Encoding': 'br', // Set content-encoding header to Brotli algorithm
  };

  // Enable base64 response encoding
  response.isBase64Encoded = true;

  // Compress response body
  response.body = zlib.brotliCompressSync(response.body).toString('base64');

  return response;
};
