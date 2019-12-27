const secure = require('./secure');
const db = require('./mongodb');
const chat = require('./chat');

const Models = {
   secure : secure,
   db : db,
   chat : chat
}

module.exports = Models