
exports.up = (knex, Promise) => {
  return knex.schema.table('feed_indices', (t) => {
    t.index(['user_id']);
  });
};

exports.down = (knex, Promise) => {
  knex.schema.table('feed_indices', (t) => {
    t.dropIndex(['user_id']);
  });
};
