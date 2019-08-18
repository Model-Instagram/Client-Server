const dataGenerator = () => {
  const rows = [];
  let j = 10;
  let k = 1;

  for (let i = 1; i <= 20; i += 1) {
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

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('feed_indices').del()
    .then(() => {
      // Inserts seed entries
      return knex('feed_indices').insert(rows);
    });
};
