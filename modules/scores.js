/**
 * Script defines scores module, module exports methods that
 * allow the client to obtain docs housed inside snakeDB.scores
 * collection and to submit docs housing a high score to the
 * server.
 *
 * @author atifcppprogrammer
 */

// Importing all required programmer defined modules.
const helpers = require('./helpers.js');
const db = require('./db.js');

// Storing some helpful constants.
const messages = helpers.messages;

// Defining maxium number of docs that will be housed
// in scoresDB.scores collection.
const count = 5;

/**
 * Connecting to mongodb server, reporting error if connection
 * could not be established.
 *
 * @promise
 * @exports
 */
exports.connection = db.connect();

/**
 * Exporting method that accepts json doc housing a score that
 * play.js client side script has determined is high enough to
 * warrant inclusion into snakeDB.scores collection.
 *
 * @function
 * @exports
 */
exports.submitScore = async function(req,res){
  // Obtaining mongo docs once connection made.
  await exports.connection;
  const cursor = db.scores.find().sort({'score':-1});
  const scores = await cursor.toArray();
  // Ensuring integrity of json sent by client.
  helpers.ensureIntegrity(req.body);
  // Condition on scores.length to replace/insert doc.
  let json = null;
  if(scores.length >= count){
      const filter = {'_id':scores.pop()._id};
      json = await db.scores.replaceOne(filter,req.body);
  }
  else json = await db.scores.insertOne(req.body);
  // Serving response to client.
  responseData = helpers.filterMongoDoc(json.ops);
  helpers.sendSuccess(res,responseData);
}

/**
 * Exporting method that serves all mongo docs inside  scores
 * collection in response to GET request made by client.
 *
 * @function
 * @exports
 */
exports.getScores = async function(req,res){
  // Obtaining mongo docs once connection made.
  await exports.connection;
  const cursor = db.scores.find().sort({'score':-1});
  const scores = await cursor.toArray();
  // Filtering _id's and serving docs to client.
  const responseData = scores.map(helpers.filterMongoDoc);
  helpers.sendSuccess(res,responseData);
}
