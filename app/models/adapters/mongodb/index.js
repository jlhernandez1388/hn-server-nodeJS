const MongoClient = require('mongodb');

function MongoAdapter(options = {}) {
  let _db = null;
  let _connection = null;
  const _collections = {};

  const connect = () => {
    const { url, connectionOptions } = options;
    const connection = MongoClient.connect(url, connectionOptions)
      .then((db) => {
        if (!_db) {
          _db = db;
        }

        return db;
      });

    if (!_connection) {
      _connection = connection;
    }

    return connection;
  };

  const define = (name) => {
    let connection = null;

    if (_connection) {
      connection = Promise.resolve(_connection);
    } else {
      connection = connect();
    }

    return connection.then((db) => {
      const cachedCollection = _collections[name];

      if (cachedCollection) {
        return cachedCollection;
      }

      _collections[name] = db.collection(name);

      return _collections[name];
    });
  };

  const disconnect = () => _db.close();
  const getCollections = () => _collections;

  return {
    getCollections,
    connect,
    disconnect,
    define
  };
}

module.exports = MongoAdapter;
