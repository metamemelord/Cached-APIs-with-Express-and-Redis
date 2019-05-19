const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const client = redis.createClient({
  host: "redis",
  port: 6379
});
client.on("ready", () => {
  console.log("Connected to redis");
});

client.on("error", err => {
  console.error("Error while connecting to redis", err);
  process.exit(1);
});
client.hget = util.promisify(client.hget);

// Backup original exec fn
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
  this.useCache = true;
  this.hashKey = JSON.stringify("CACHE-REDIS");
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    // Call exec supplied with mongoose
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    ...this.options,
    collection: this.mongooseCollection.name
  });
  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result));
  console.log(`Cached value: ${JSON.stringify(result)} with key: ${key}`);
  return result;
};

module.exports = { mongoose, redisClient: client };
