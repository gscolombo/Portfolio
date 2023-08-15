const { ObjectId } = require('mongodb');
const crud = require('./crud');

module.exports = async (collectionInfo, method = 'GET', queryObject, data) => {
  const { name, collection } = collectionInfo;
  let response = { statusCode: null, body: {} }; // Define response object

  // Set ObjectID instance with ID received
  if (queryObject._id) queryObject._id = new ObjectId(queryObject._id);

  /**
   * Identify the request method and send a response accordingly
   */
  try {
    let queryResult = {};
    switch (method) {
      case 'GET':
        queryResult = await crud.get(collection, queryObject);
        break;
      case 'POST':
        queryResult = await crud.post(collection, data);
        break;
      case 'PATCH':
        queryResult = await crud.patch(name, collection, queryObject, data);
        break;
      case 'DELETE':
        queryResult = await crud.delete(name, collection, queryObject);
        break;
    }
    if (queryResult.documents.length > 0) {
      response.body = JSON.stringify(queryResult);
      response.statusCode = 200;
      return response;
    } else {
      const error = new Error('No works were found.');
      error.name = 'SearchError';
      throw new Error('No works were found');
    }
  } catch (error) {
    response.statusCode = error.name == 'SearchError' ? 404 : 500;

    // Set error message to client in response object
    response.body = JSON.stringify({
      error: `Error during database querying: ${error.message}`,
    });
    return response;
  }
};
