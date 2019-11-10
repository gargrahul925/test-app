const defer = require('config/defer').deferConfig;
const p = require('./../package.json');

module.exports = {
    app: {
        name: p.name,
        description: p.description,
    },
    api: {
        ROOT_URI: '',
        BASE_URI: defer(cfg => `${cfg.api.ROOT_URI}/`),
        protocols: ['http'],
        defaultProtocol: 'http',
        host: 'localhost:3000',
    },
    env: {
        mode: process.env.NODE_ENV,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
    },
    logger: {
        correlationIdIdentifier: 'x-correlation-id',
        logDestination: 'file',
        accessLog: {
            format: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status '
                + ':res[content-length] ":referrer" ":user-agent" ":req[x-correlation-id]" :response-time ',
            fileParams: {
                fileName: 'access.log', // can be a full qualified file path
            }
        },
        eventLog: {
            fileParams: {
                fileName: 'sig.log', // can be a full qualified file path
                fileRotation: false,
                interval: '1d',
                maxFiles: 14,
            }
        }
    },
    DB: {
        url: 'mongodb://mongodb:27017/app',
    },
    redis: {
        host: 'local_redis',
        port: 6379
    }
};
