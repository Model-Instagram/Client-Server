module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'insta_dev',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'insta_dev_test',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  },
};
