const queryDatabase = require('./queryDatabase');

module.exports = async (request, client) => {
  const { path, httpMethod, queryStringParameters, body } = request;
  const collection = path.substring(path.lastIndexOf('/') + 1);

  try {
    // Configure database and collection
    const database = client.db('personal_portfolio');
    const collectionInfo = {
      name: collection,
      collection: database.collection(collection),
    };

    // Process query and return response
    let response = await queryDatabase(
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
