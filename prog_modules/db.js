/**
 * Script defines the db module, module allows app to connect
 * to the snakeDB housed on local or remote server and obtain
 * an instance of scores collection contained therein.
 *
 * @author atifcppprogrammer
 */

// Importing all required node modules.
const mongoClient = require('mongodb').MongoClient;

// Defining connection URI to mongo atlas cluster.
const url = process.env.mongoConnectionURI;

// Definining database and collection names.
const collection = process.env.dbCollectionName;
const database = process.env.dbName;

/**
 *  Exporting method that connects to the mongodb server
 *  and obtains an instance of the snakeDB.scores collection.
 *
 * @function
 * @exports
 */
exports.connect = async function(){
  // Connecting to server.
  const options = {'useUnifiedTopology':true};
  const client = await mongoClient.connect(url,options);
  // Obtaining instance of snakeDB.scores collection.
  const db = client.db(database);
  exports.scores  = db.collection(collection);
}

/**
 * Instance of the snakeDB.scores collection exported by
 * this module.
 *
 * @constant
 * @exports
 */
exports.scores = undefined;
