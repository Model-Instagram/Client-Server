const express = require('express');
const bodyParser = require('body-parser');
const knex = require('../database/db');
const axios = require('axios');
const documents = require('./routes/documents');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/documents', documents);


// load initial/refresh feed
app.get('/users/:user_id/initial_feed', (req, res) => {
  const userId = req.params.user_id;

  Promise.all([
    axios.get(`{get elenas ip address}/users/${userId}/post_feed/0`),
    axios.get(`{get chadams ip address}/users/${userId}/ad_feed/0`),
  ])
    .then((response) => {
      const { feed } = response[0];
      const { ad } = response[1];
      const nextPostIndex = response[0].next_post_index;
      const nextAdIndex = response[1].next_ad_index;

      // attach ad to feed
      feed.push(ad);

      // store indices in db
      knex('feed_indices')
        .where('user_id', '=', userId)
        .update({
          next_post_index: nextPostIndex,
          next_ad_index: nextAdIndex,
        })
        .then((results) => {
          console.log('update successful -->', results);
          res.send(feed);
        })
        .catch((error) => {
          console.log('insert error -->', error);
        });
    })
    .catch((error) => {
      console.log('initial load error -->', error);
    });
});


// load more feed
app.get('/users/:user_id/more_feed', (req, res) => {
  const userId = req.params.user_id;
  let nextPostIndex;
  let nextAdIndex;

  // go to db to get next post index
  knex('feed_indices').where('user_id', userId)
    .then((results) => {
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
      const { feed } = response[0];
      const { ad } = response[1];
      nextPostIndex = response[0].next_post_index;
      nextAdIndex = response[1].next_ad_index;

      // attach ad to feed
      feed.push(ad);

      // store indices in db
      knex('feed_indices')
        .where('user_id', '=', userId)
        .update({
          next_post_index: nextPostIndex,
          next_ad_index: nextAdIndex,
        })
        .then((results) => {
          console.log('update successful -->', results);
          res.send(feed);
        })
        .catch((error) => {
          console.log('insert error -->', error);
        });
    })
    .catch((error) => {
      console.log('load more error -->', error);
    });
});


// ad is liked
app.get('/feed/likes/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.get(`/likes/ads/${adId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('ad like error -->', error);
    });
});


// ad is viewed
app.get('feed/views/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.get(`/views/ads/${adId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('ad view error -->', error);
    });
});


// ad is clicked
app.get('feed/clicks/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.get(`feed/clicks/ads/${adId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('ad click error -->', error);
    });
});


app.post('/feed/posts/', (req, res) => {
  const userId = req.body.user_id;
  const profileImgUrl = req.body.profile_img_url;
  const imgUrl = req.body.img_url;
  const likeCount = req.body.like_count;
  const { username } = req.body;
  const { caption } = req.body;
  const { location } = req.body;

  axios.post('/posts/', {
    user_id: userId,
    profile_img_url: profileImgUrl,
    img_url: imgUrl,
    like_count: likeCount,
    username,
    caption,
    location,
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('post error -->', error);
    });
});


// post is liked
app.get('feed/likes/posts/:post_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const postId = req.params.post_id;

  axios.get(`/likes/posts/${postId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('post like error -->', error);
    });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));
