let mongoose = require('mongoose');
let redis = require('redis');
let util = require('util');
let keys = require('../config/keys');
//let redisUrl = 'redis://127.0.0.1:6379';
let client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

let exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  let key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  let cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    let doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }
  let result = await exec.apply(this, arguments);
  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
