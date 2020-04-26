/**
 *
 *
 * @author atifcppprogrammer
 */

// Importing all required node modules.
const colors = require('colors');

/**
 *
 * Exporting object literal housing messages that need to
 * be thrown on console when certain events occur.
 *
 * @constant
 * @exports
 */
exports.messages = {
  'onMongoConnectFailure':'CONNECTION TO MONGO ATLAS SERVER COULD NOT BE ESTABLISHED'.bold.red,
  'onMongoConnectSuccess':'CONNECTION TO MONGO ATLAS SERVER ESTABLISHED'.bold.green
}

/**
 * Exporting method that will ensure that the data sent by
 * client respects that the format required by mongodb.
 */
exports.ensureIntegrity = (body)=>{
  body.score = parseInt(body.score);
}

/**
 * Exporting method that sends a server response to client
 * carrying some data.
 *
 * @function
 * @exports
 */
exports.sendSuccess = (res,data)=>{
  res.status(200).type('application/json');
  res.send({'error':null,'data':data});
}

/**
 * Exporting method returns the given mongod doc with the
 * _id property removed.
 *
 * @function
 * @exports
 */
exports.filterMongoDoc = (doc)=>{
  delete doc._id;
  return doc;
}
