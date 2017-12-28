process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 8080;

// const apm = require('elastic-apm-node').start({
//   appName: 'model-instagram',
// });

const express = require('express');
// const cluster = require('cluster');
const responseTime = require('response-time');
const compression = require('compression');
const axios = require('axios');
const bodyParser = require('body-parser');
const knex = require('../database/db');
const documents = require('./routes/documents');
// const os = require('os');

// // Code to run if we're in the master process
// if (cluster.isMaster) {
//   // Count the machine's CPUs
//   const cpuCount = os.cpus().length;

//   // Create a worker for each CPU
//   for (let i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }

// // Code to run if we're in a worker process
// } else {
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/documents', documents);
app.use(responseTime());
app.use(compression());


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
            .then((dbResults) => {
              console.log('update successful -->', dbResults);
              res.send(feed);
            })
            .catch((error) => {
              console.log('insert error -->', error);
            });
        })
        .catch((error) => {
          console.log('load more error -->', error);
        });
    })
    .catch((error) => {
      console.log('select error -->', error);
    });
});


// ad is liked
app.post('/feed/likes/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.post(`/likes/ads/${adId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('ad like error -->', error);
    });
});


// ad is viewed
app.post('feed/views/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.post(`/views/ads/${adId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('ad view error -->', error);
    });
});


// ad is clicked
app.post('feed/clicks/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const adId = req.params.ad_id;

  axios.post(`/clicks/ads/${adId}/users/${userId}`)
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

  axios.post('/posts', {
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
app.post('feed/likes/posts/:post_id/users/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const postId = req.params.post_id;

  axios.post(`/likes/posts/${postId}/users/${userId}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('post like error -->', error);
    });
});


app.get('/test', (req, res) => {
  const userId = 1;
  const nextPostIndex = 9;
  const nextAdIndex = 9;
  console.log('here');

  knex('feed_indices')
    .where('user_id', '=', userId)
    .update({
      next_post_index: nextPostIndex,
      next_ad_index: nextAdIndex,
    })
    .then((results) => {
      console.log('update successful -->', results);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('insert error -->', error);
    });
});

/* test routes */

app.get('/', (req, res) => {
  res.send('Hello Mars');
});

const postTest = (userId, nextPostIndex) => {
  const result = {
    user_id: userId,
    next_post_index: nextPostIndex,
    feed: [
      {
        post_id: 10,
        user_id: 99,
        username: 'conker',
        profile_img_url: 'https://storage.model-instagram',
        img_url: 'https://storage.model-instagram',
        caption: 'It’s Fred Friday at Hack Reactor',
        location: 'San Francisco',
        like_count: 81,
        friend_likes: [
          { user_id: 99, username: 'brandon' },
        ],
      },
    ],
  };

  return result;
};

const adTest = (userId, nextAdIndex) => {
  const result = {
    user_id: userId,
    next_ad_index: nextAdIndex,
    ad: {
      ad_id: 10,
      advertiser_name: 'Hack Reactor',
      url: 'http://hackreactor.com',
      img_url: 'https://storage.model-instagram',
      caption: 'It’s Fred Friday at Hack Reactor SF!',
      like_count: 81,
      friend_likes: [
        { user_id: 100, username: 'Tom_Door_Ants' },
      ],
    },
  };

  return result;
};

app.get('/test/users/1/more_feed', (req, res) => {
  const userId = 1;
  let nextPostIndex;
  let nextAdIndex;

  // go to db to get next post index
  knex('feed_indices').where('user_id', userId)
    .then((results) => {
      nextPostIndex = results[0].next_post_index;
      nextAdIndex = results[0].next_ad_index;

      Promise.all([
        postTest(userId, nextPostIndex),
        adTest(userId, nextAdIndex),
      ])
        .then((response) => {
          const { feed } = response[0];
          const { ad } = response[1];
          nextPostIndex = response[0].next_post_index;
          nextAdIndex = response[1].next_ad_index;

          // attach ad to feed
          feed.push(ad);
          res.send(feed);
          // store indices in db
          knex('feed_indices')
            .where('user_id', '=', userId)
            .update({
              next_post_index: nextPostIndex,
              next_ad_index: nextAdIndex,
            })
            .then((dbResults) => {
              console.log('update successful -->', dbResults);
              // res.send(feed);
            })
            .catch((error) => {
              console.log('insert error -->', error);
            });
        })
        .catch((error) => {
          console.log('load more error -->', error);
        });
    })
    .catch((error) => {
      console.log('select error -->', error);
    });
});

const server = app.listen(port, () => console.log(`Listening on port ${port}!`));

// console.log('Worker %d running!', cluster.worker.id);
module.exports = server;
// }
