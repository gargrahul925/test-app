const redis = require('redis');
const config = require('config');

const client = redis.createClient({
    port: config.get('redis.port'),
    host: config.get('redis.host'),
});

exports.setValue = function setValue(key, value) {
    return new Promise((resolve) => {
        client.set(key, value, (err, val) => {
            if (err) {
                console.log(error)
            }
            resolve(val)
        });
    })
};

exports.getValue = function getValue(key) {
    return new Promise((resolve) => {
        client.get(key, (err, val) => {
            if (err) {
                console.log(error)
            }
            resolve(val)
        })
    })
};