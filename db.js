/**
 * Module to handle connection and queries to MongoDB Atlas cloud database
 */
const { MongoClient, ObjectId } = require("mongodb");
const getMessageBody = require("./handleRequestBody");

const uri = `mongodb+srv://gscolombo:${process.env.MONGODB_PASSWORD}@personalportfolio.infvfkc.mongodb.net/?retryWrites=true&w=majority`;

module.exports = async function (request, uri) {
  const collection = uri.pathname.substring(uri.pathname.lastIndexOf("/") + 1);
  const method = request.method;
  const query = Object.fromEntries(uri.searchParams);
  const postData = await getMessageBody(request);

  const dbResponse = await connect(collection, method, query, postData);
  return dbResponse;
};

async function connect(collection, method, queryObject, data) {
  const client = new MongoClient(uri);

  try {
    // Configure database and collection
    const database = client.db("personal_portfolio");
    const collectionInfo = {
      name: collection,
      collection: database.collection(collection),
    };

    // Process query and return response
    const response = await query(collectionInfo, method, queryObject, data);
    return response;
  } finally {
    await client.close(); // Close database connection
  }
}

async function query(collectionInfo, method = "GET", queryObject, data) {
  const { name, collection } = collectionInfo;
  let response = { message: "", [name]: {} }; // Define response object

  // Set ObjectID instance with ID received
  if (queryObject._id) queryObject._id = new ObjectId(queryObject._id);

  try {
    /**
     * Simple CRUD functions
     * Identify the request method and send a response accordingly
     */
    switch (method) {
      case "GET":
        response = getDocument(name, collection, queryObject, response);
        break;
      case "POST":
        response = createDocument(name, collection, data, response);
        break;
      case "PATCH":
        response = updateDocument(
          name,
          collection,
          queryObject,
          data,
          response
        );
        break;
      case "DELETE":
        response = deleteDocument(name, collection, queryObject, response);
        break;
    }
  } catch (error) {
    response.error = `Error during database querying: ${error.message}`; // Set error message to client in response object
  } finally {
    return response;
  }
}

async function getDocument(name, collection, query, response) {
  const documents = await collection.find(query).toArray();
  response.message =
    documents.length > 0
      ? "Documents retrieved succesfully."
      : "No document were found";
  if (documents.length) {
    response.message = "Documents retrieved succesfully.";
    response[name].documents = documents;
  } else {
    response.message = "No documents were found";
    delete response[name];
  }
  return response;
}

async function createDocument(name, collection, data, response) {
  const id = await collection.insertOne(data);
  response.message = "Document created succesfully.";
  response[name].id = id;

  return response;
}

async function updateDocument(name, collection, query, data, response) {
  const updatedDocument = await collection.findOneAndUpdate(
    query,
    {
      $set: data,
      $currentDate: { lastModified: true },
    },
    { returnDocument: "after" }
  );
  if (updatedDocument.value) {
    response.message = `Document with ID ${query._id} from ${name} collection updated succesfully`;
    response[name].updatedDocuments = updatedDocument.value;
  } else {
    response.message = `No document with ID ${query._id} from ${name} collection exists`;
    delete response[name];
  }

  return response;
}

async function deleteDocument(name, collection, query, response) {
  if (Object.keys(query).length) {
    await collection.deleteOne(query);
  } else {
    await collection.drop();
    response.message = `All documents from ${name} collection deleted successfully`;
    delete response[name];

    return response;
  }

  const remainingDocuments = await collection.find({}).toArray();
  if (remainingDocuments.length) {
    response.message = `Document with ID ${query._id} from ${name} collection deleted successfully`;
    response[name].remainingDocuments = remainingDocuments;
  } else {
    response.message = `No document with ID ${query._id} from ${name} collection exists`;
    delete response[name];
  }

  return response;
}
