const Compiler = require('knex/lib/dialects/postgres/query/compiler');
const types = require('pg').types;

Compiler.prototype.forUpdate = function forUpdate() {
  console.warn('table lock is not supported by cockroachdb/postgres dialect');
  return '';
};

/**
 * Required because postgres returns int as string and
 * knex checks for isLocked are evaluating to true all the time
 */
types.setTypeParser(20, function(val) {
  return parseInt(val);
});

module.exports = {
  development: {
    client: 'postgresql',
    version: '7.2',
    debug: true,
    connection: {
      database: 'webstore',
      port: '26257',
      user: 'maxroach',
      password: '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      disableTransactions: true,
      tableName: 'knex_migrations',
    },
  },
  test: {
    client: 'postgresql',
    version: '7.2',
    debug: true,
    connection: {
      database: 'test_webstore',
      port: '26257',
      user: 'maxroach',
      password: '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      disableTransactions: true,
      tableName: 'knex_migrations',
    },
  },
};
