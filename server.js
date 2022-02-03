require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const myApp = require('./myApp');
const Joi = require('@hapi/joi');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use(express.urlencoded({ extended: true }));
// when url is posted, we check if it's already saved either we save it in db
app.post('/api/shorturl', async (req, res) => {
  try {
    console.log(req.body.url);
    await Joi.attempt(req.body.url, Joi.string().uri({scheme: [/^https?/]}));
  } catch (e) {
    return res.send({error: 'invalid url'});
  }

  const link = 
    await myApp.ShortLink.findOne({link: req.body.url}) ||
    await myApp.createAndSaveShortLink(req.body.url)
  ;
  res.json({
    original_url: req.body.url,
    short_url: link._id
  });
});

// we retrieve url using sent id, and redirect client
app.get('/api/shorturl/:id', async (req, res) => {
  const shortLink = await myApp.ShortLink.findById(req.params.id);

  res.redirect(shortLink.link);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
