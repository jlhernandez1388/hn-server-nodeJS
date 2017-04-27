const get = require('lodash/get');
const isArray = require('lodash/isArray');
const { ObjectId } = require('mongodb');

function isObjectId(oid) {
  return oid instanceof ObjectId;
}

function toObjectId(oid) {
  if (isObjectId(oid)) {
    return oid;
  }

  if (ObjectId.isValid(oid)) {
    return new ObjectId(oid);
  }

  return oid;
}

function ModelFactory(Adapter) {
  const Model = (name, methods = {}) => {
    const adapter = Adapter.define(name);

    const modelMethods = {
      adapter,

      beforeCreate(data) {
        const now = new Date();
        const timestamp = { createdAt: now, updatedAt: now };
        const obj = Object.assign({}, data, timestamp);

        if (methods.beforeCreate) {
          return methods.beforeCreate(obj);
        }

        return Promise.resolve(obj);
      },

      beforeUpdate(data) {
        const now = new Date();
        const timestamp = { updatedAt: now };
        const obj = Object.assign({}, data, timestamp);

        if (methods.beforeUpdate) {
          return methods.beforeUpdate(obj);
        }

        return Promise.resolve(obj);
      },

      create(data) {
        return adapter.then((collection) => {
          return modelMethods.beforeCreate(data)
            .then((results) => collection.insertOne(results))
            .then((inserted) => inserted.ops[0]);
        });
      },

      find(query = {}, options = {}) {
        return adapter.then((collection) => {
          const projection = get(options, 'projection', {});
          let cursor = collection.find(query, projection);

          if (options.limit) {
            cursor = cursor.limit(options.limit);
          }

          if (options.skip) {
            cursor = cursor.skip(options.skip);
          }

          if (options.sort) {
            cursor = cursor.sort(options.sort);
          }

          return cursor.toArray();
        });
      },

      findOne(query) {
        if (query._id) {
          query._id = toObjectId(query._id);
        }

        return adapter.then((collection) => {
          return collection.find(query).limit(1).toArray()
            .then((results) => results[0]);
        });
      },

      findById(id) {
        return modelMethods.findOne({ _id: id });
      },

      findOrCreate(query, data) {
        return adapter.then((collection) => {
          return modelMethods.beforeCreate(data)
            .then((results) => {
              return collection.findAndModify(
                query,
                [],
                { $setOnInsert: results },
                { new: true, upsert: true }
              );
            });
        });
      },

      updateOne(query, data) {
        return adapter.then((collection) => {
          return modelMethods.beforeUpdate(data)
            .then((results) => {
              const update = { $set: results };
              const options = { returnOriginal: false };

              if (query._id) {
                query._id = toObjectId(query._id);
              }

              return collection.findOneAndUpdate(query, update, options)
                .then((r) => r.value);
            });
        });
      },

      updateById(id, data) {
        const query = { _id: id };
        return modelMethods.updateOne(query, data);
      },

      update(query, data) {
        return new Promise((resolve, reject) => {
          return adapter.then((collection) => {
            const q = Object.assign({}, query);

            if (isArray(q._id)) {
              q._id = { $in: q._id.map((id) => toObjectId(id)) };
            } else {
              q._id = toObjectId(q._id);
            }

            const update = { $set: data };

            return collection.updateMany(q, update)
              .then((r) => {
                if (r.result.ok === 1) {
                  resolve();
                } else {
                  reject();
                }
              })
              .catch((err) => reject(err));
          });
        });
      },

      removeById(id) {
        const query = { _id: id };
        return modelMethods.remove(query, { single: true });
      },

      remove(query = {}, options = {}) {
        if (query._id) {
          query._id = toObjectId(query._id);
        }

        return new Promise((resolve, reject) => {
          return adapter.then((collection) => {
            return collection.remove(query, options)
              .then((r) => {
                if (r.result.ok === 1 && r.result.n > 0) {
                  resolve();
                } else {
                  reject();
                }
              })
              .catch((err) => reject(err));
          });
        });
      },

      count(query) {
        return adapter.then((collection) => {
          return collection.count(query);
        });
      }
    };

    return Object.assign({}, modelMethods, methods);
  };

  return Model;
}

module.exports = ModelFactory;
