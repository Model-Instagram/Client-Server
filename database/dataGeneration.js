const config = require('./knexfile.js');

const env = 'development';
const knex = require('knex')(config[env]);

// 1-10M user ids
const dataGenerator = () => {
  const rows = [];
  let j = 10;
  let k = 1;

  for (let i = 1; i <= 10000000; i += 1) {
    const tempObj = {};

    tempObj.user_id = i;
    tempObj.next_post_index = j;
    j += 10;

    tempObj.next_ad_index = k;
    if (k < 10) {
      k += 1;
    } else {
      k = 1;
    }

    rows.push(tempObj);
  }

  return rows;
};

const rows = dataGenerator();
const chunkSize = 1000;

knex.batchInsert('feed_indices', rows, chunkSize)
  .returning('id')
  .then(() => {
    console.log('data entered');
  })
  .catch((error) => {
    console.log(error);
  });
