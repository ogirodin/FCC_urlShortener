require('dotenv').config();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

try {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, function(err) {
    if (err) console.log({err});
  });
  
  const connection = mongoose.createConnection(process.env.MONGO_URI);
  autoIncrement.initialize(connection);
} catch (e) {
  console.log(e);
}

const Schema = mongoose.Schema;

const ShortLinkSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    link: {
      type: String,
      required: true,
    }
}, {
    versionKey: false,
    collection: 'shortLinks'
});

ShortLinkSchema.plugin(autoIncrement.plugin, {
    model: 'shortLinks',
    field: '_id'
});

// Compile model from schema
let ShortLink = mongoose.model('ShortLink', ShortLinkSchema);

async function createAndSaveShortLink(link) {
  const shortLink = new ShortLink({link});
  try {
    return await shortLink.save();
  } catch(err) {
    throw err;
  }
};

module.exports = {
  ShortLink: ShortLink,
  createAndSaveShortLink: createAndSaveShortLink,
}