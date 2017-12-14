const express = require('express');
const bodyParser = require('body-parser');
const knex = require('../database/db');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// load initial/refresh feed
app.get(('/users/:user_id/initial_feed'), (req, res) => {
  const userId = req.params.user_id;
  console.log('userId--->', userId);

  Promise.all([
    axios.get(`{get elenas ip address}/users/${userId}/post_feed/0`),
    axios.get(`{get chadams ip address}/users/${userId}/ad_feed/0`),
  ])
    .then((response) => {
      // stitch together feed
    })
    .catch((error) => {
      console.log('initial load error -->', error);
    });
});


// load more feed
app.get(('/users/:user_id/more_feed'), (req, res) => {
  console.log(req.params);
  const userId = req.params.user_id;
  let nextPostIndex;
  let nextAdIndex;

  // go to db to get next post index
  knex('feed_indices').where('user_id', userId)
    .then((results) => {
      console.log('select results -->', results);
      nextPostIndex = results[0].next_post_index;
      nextAdIndex = results[0].next_ad_index;
    })
    .catch((error) => {
      console.log('select error -->', error);
    });

  Promise.all([
    axios.get(`{get elenas ip address}/users/${userId}/post_feed/${nextPostIndex}`),
    axios.get(`{get chadams ip address}/users/${userId}/ad_feed/${nextAdIndex}`),
  ])
    .then((response) => {
      // stitch together feed
    })
    .catch((error) => {
      console.log('load more error -->', error);
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
