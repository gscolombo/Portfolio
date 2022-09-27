/**
 * Simple CRUD functions
 */
let response = {}; // Initialize CRUD response object

module.exports = {
  /** Retrieve documents **/
  get: async (collection, query) => {
    const documents = await collection.find(query).toArray();

    if (documents.length) {
      return {
        message: "Documents retrieved succesfully.",
        documents: documents,
      };
    } else {
      return {
        message: "No document were found",
      };
    }
  },

  /** Create documents **/
  post: async (collection, data) => {
    const result = await collection.insertOne(JSON.parse(data));

    return {
      message: "Document created successfully",
      id: result.insertedId,
    };
  },

  /** Update documents **/
  patch: async (name, collection, query, data) => {
    const updatedDocument = await collection.findOneAndUpdate(
      query,
      {
        $set: JSON.parse(data),
        $currentDate: { lastModified: true },
      },
      { returnDocument: "after" }
    );

    if (updatedDocument.value) {
      return {
        message: `Document with ID ${query._id} from ${name} collection updated succesfully`,
        updatedDocument: updatedDocument.value,
      };
    } else {
      return {
        message: `No document with ID ${query._id} from ${name} collection exists`,
      };
    }
  },

  /** Delete documents **/
  delete: async (name, collection, query) => {
    if (Object.keys(query).length) {
      await collection.deleteOne(query);
    } else {
      await collection.drop();
      return {
        message: `All documents from ${name} collection deleted successfully`,
      };
    }

    const remainingDocuments = await collection.find({}).toArray();
    if (remainingDocuments.length) {
      return {
        message: `Document with ID ${query._id} from ${name} collection deleted successfully`,
        remainingDocuments: remainingDocuments,
      };
    } else {
      return {
        message: `No document with ID ${query._id} from ${name} collection exists`,
      };
    }
  },
};
