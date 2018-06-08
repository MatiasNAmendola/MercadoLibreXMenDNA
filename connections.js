"use strict";
/* global __dirname */
/* jshint ignore:start */
const mysql = require('mysql2/promise'),
        Redis = require('ioredis');

/**
 * Clase de manejo de conexiones.
 * 
 * @class Connections
 */
class Connections {

    /**
     * Creates an instance of Connections.
     * 
     * @param {Object} conf Configuration
     * @returns {nm$_connections.Connections}
     */
    constructor(conf = {}) {
        this.conf = conf;
    }

    /**
     * Start redis connection
     * 
     * @param {boolean} [isSlave=false]  isSlave Is slave?
     * @returns {Promise}
     */
    async redis(isSlave = false) {
        let conn = {
            host: '127.0.0.1',
            port: 6379,
            family: 4, // 4 (IPv4) or 6 (IPv6)
            db: 0,
            showFriendlyErrorStack: false,
            retryStrategy: () => {
                return false;
            }
        };

        let redis_conf = this.conf.redis_conf;
        
        if (redis_conf.use === false) {
            return null;
        }

        if (isSlave === true) {
            conn.host = redis_conf.slave.host || conn.host;
            conn.port = redis_conf.slave.port || conn.port;
        } else {
            conn.host = redis_conf.master.host || conn.host;
            conn.port = redis_conf.master.port || conn.port;
        }

        let redis = new Redis(conn);

        return new Promise((resolve, reject) => {
            redis.on('ready', () => {
                resolve(redis);
            });

            redis.on('error', error => {
                reject(error);
            });
        });
    }

    /**
     * Start MySQL connection
     *
     * @returns Database
     */
    async getMySQL() {
        let dsn = this.conf.dsn;

        let conn = {
            host: dsn.host || 'localhost',
            port: dsn.port || 3306,
            user: dsn.user || 'root',
            password: dsn.password || '',
            database: dsn.database || 'xmendna'
        };

        return await mysql.createConnection(conn);
    }
}

module.exports = Connections;
/* jshint ignore:end */