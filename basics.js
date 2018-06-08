/* global __dirname */
/* jshint ignore:start */
'use strict';

const exec = require('child_process').exec,
        dateFormat = require('dateformat'),
        fs = require('fs'),
        path = require('path');

/**
 * Clase con recursos básicos.
 * 
 * @class Basics
 */
class Basics {

    /**
     * Constant: SECOND (one second, in milliseconds)
     * 
     * @readonly
     * @static
     * @returns {Number}
     */
    static get SECOND() {
        return 1000;
    }

    /**
     * Get configuration
     * 
     * @static
     * @returns {Object}
     */
    static getConfiguration() {
        let configPath = __dirname + path.sep + 'config';
        let mainConf = JSON.parse(fs.readFileSync(path.join(configPath, 'main.json'), 'utf8'));

        mainConf.environment = process.argv[2] || process.env.NODE_ENV;

        let envs = ['development', 'integration', 'production'];

        if (envs.indexOf(mainConf.environment) === -1) {
            console.log('Ambiente incorrecto! Posibles: ' + envs.join(', '));
            process.exit();
        }

        let envConf = JSON.parse(fs.readFileSync(path.join(configPath, `environments/${mainConf.environment}.json`), 'utf8'));
        let conf = Object.assign(mainConf, envConf);
        return conf;
    }

    /**
     * Is JSON?
     * 
     * @param {String} str String
     * @returns {Boolean}
     */
    static isJson(str) {
        try {
            let item = JSON.parse(str);

            if (typeof item === "object" && item !== null) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Execute command
     * 
     * @static
     * @param {String} command Command
     * @returns {Promise}
     */
    static exec(command) {
        return new Promise((resolve, reject) => {
            exec(command, {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
                if (error !== null) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    /**
     * Is defined?
     * 
     * @static
     * @param {Object} o Object
     * @returns {Boolean}
     */
    static isDefined(o) {
        return (typeof (o) === 'undefined' || (o) === null) ? false : true;
    }

    /**
     * Is empty string?
     * 
     * @static
     * @param {Object} o Object
     * @returns {Boolean}
     */
    static isEmpty(o) {
        return !Basics.isDefined(o) || o === '';
    }

    /**
     * Sleep
     * 
     * @static
     * @param {Number} ms Milliseconds
     * @returns {Promise}
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Var dump
     * 
     * Basics.var_dump(obj1 [, obj2, ..., objN); 
     * Basics.var_dump(msg [, subst1, ..., substN);
     * 
     * @param {Object} objN Args
     * @returns {undefined}
     */
    static var_dump(...objN) {
        console.log(objN);
        process.exit();
    }

    /**
     * Get timestamp
     * 
     * @param {Date} d [Date=new Date()]
     * @returns {String}
     */
    static timestamp(d = new Date()) {
        return dateFormat(d, 'yyyymmddHHMMssl');
    }

    /**
     * Get datetime
     * 
     * @param {Date} d [Date=new Date()]
     * @returns {String}
     */
    static datetime(d = new Date()) {
        return dateFormat(d, 'yyyy-mm-dd HH:MM:ss');
    }

    /**
     * mkdir
     * 
     * @param {String} path Path to create
     * @returns {Boolean}
     */
    static async createDir(path) {
        try {
            await Basics.exec('mkdir -p ' + path);
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Get datetime
     * 
     * @param {Date} d [Date=new Date()]
     * @returns {String}
     */
    static datetimeArg(d = new Date()) {
        return dateFormat(d, 'dd/mm/yyyy HH:MM:ss');
    }

}

module.exports = Basics;
/* jshint ignore:end */