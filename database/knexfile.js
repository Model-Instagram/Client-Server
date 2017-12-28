module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'insta_dev',
    },
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/insta_dev_test',
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  },
};
