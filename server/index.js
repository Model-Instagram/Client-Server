const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db');
const knex = require('../database/knexfile');
const dataGeneration = require('../database/dataGeneration');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// req.body

// Elena
  // Load new posts
  // Chadam
    // Load first ad
app.get(('/users/:user_id/feed'), (req, res) => {
  axios.get(`/users/${req.params.user_id}/post_feed/0`)
    .then((response) => {

    })
    .then((posts) => {
      axios.get(`/users/${req.params.user_id}/feed/0`)
        .then((response) => {

        })
        .catch(() => {

        });
    })
    .catch(() => {

    });
});

// Elena
  // Load more feed
  // Chadam
    // Load next ad
app.get(('/users/:userid/feed'), (req, res) => {
  axios.get(`/users/${req.params.user_id}/post_feed/:next_post_index`)
    .then((response) => {

    })
    .then((posts) => {
      axios.get(`/users/${req.params.user_id}/ad_feed/:next_ad_index`)
        .then((response) => {

        })
        .catch(() => {

        });
    })
    .catch(() => {

    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
