exports.up = (knex, Promise) => {
  return Promise.all([
    Promise.resolve(knex.schema.dropTableIfExists('feed_indices')),
    knex.schema.createTable('feed_indices', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('next_post_index');
      table.integer('next_ad_index');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('feed_indices'),
  ]);
};
