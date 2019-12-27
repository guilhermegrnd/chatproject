const secure = require('./secure');
const chat = require('./chat');

module.exports.set = (app) => {
   // your routes here

   // let "secure.js" set other routes
   secure.set(app);
   chat.set(app);
}