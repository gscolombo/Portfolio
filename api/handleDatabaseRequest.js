const { MongoClient } = require("mongodb");
const queryDatabase = require("./queryDatabase");

module.exports = async (request, url) => {
  const { path, httpMethod, queryStringParameters, body } = request;
  const collection = path.substring(path.lastIndexOf("/") + 1);
  const client = new MongoClient(url);

  try {
    // Configure database and collection
    const database = client.db("personal_portfolio");
    const collectionInfo = {
      name: collection,
      collection: database.collection(collection),
    };

    // Process query and return response
    const response = await queryDatabase(
      collectionInfo,
      httpMethod,
      queryStringParameters,
      body
    );

    return response;
  } finally {
    await client.close(); // Close database connection
  }
};
