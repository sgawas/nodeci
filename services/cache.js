const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options ={}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};

mongoose.Query.prototype.exec = async function (){
    console.log('Im about to run a query');
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);
    if(!this.useCache){
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery(), 
    { collection: this.mongooseCollection.name}));
   
    //console.log(key);
    const cachedValue = await client.hget(this.hashKey, key);
    if(cachedValue){
        console.log('this is from redis');
        const doc = JSON.parse(cachedValue);
        
        return Array.isArray(doc) ?
            doc.map(d => new this.model(d))  // array of objects [{},{}]
            : new this.model(doc); // single object {}
    }

    const result = await exec.apply(this, arguments);  // executes the query taking the arguments passed with this-->Query
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
