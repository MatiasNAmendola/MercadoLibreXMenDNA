"use strict";
/* jshint ignore:start */

// Include Express
const express = require('express');

// Include the DNA manager
const Genoma = require('./genoma');

// Include the basic resources
const Basics = require('./basics');

// Include the basic resources
const Connections = require('./connections');

const conf = Basics.getConfiguration();

const connections = new Connections(conf);

var database;
var redisMaster;
var redisSlave;

var router = express.Router();

// Include the body parser module
var bodyParser = require('body-parser');

// create application/json parser
//var jsonParser = bodyParser.json({ type: 'application/*+json' });
var jsonParser = bodyParser.json();

// Add a basic route – index page
router.get('/', (req, res) => {
    res.send('Mercado Libre | XMen DNA detector!');
});

// server-sent event stream
router.get('/ping', function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    // send a ping approx every 2 seconds
    var timer = setInterval(() => {
        res.write('data: ping\n\n');

        // !!! this is the important part
        res.flush();
    }, 2000);

    res.on('close', function () {
        clearInterval(timer);
    });
});

router.post('/mutant/', jsonParser, async (req, res) => {
    const statusError = 403;

    if (!req.body || req.body['dna'] === undefined) {
        res.status(statusError).send('Defina las secuencias de DNA');
        return;
    }

    let error;
    let isMutant = false;

    try {
        let genoma = new Genoma();
        isMutant = genoma.isMutant(req.body['dna']);
    } catch (e) {
        error = e;
    }

    if (isMutant || !(error instanceof Error)) {
        if (database === undefined) {
            database = await connections.getMySQL();
        }

        await database.execute('INSERT INTO `dnas` (`dna`, `mutant`) VALUES (?, ?);', [JSON.stringify(req.body['dna']), isMutant]);
        
        if (redisMaster === undefined) {
            redisMaster = await connections.redis(false);
        }

        const [rows] = await database.execute('SELECT COUNT(1) `total`, sum(mutant = 0) `humans`, sum(mutant = 1) `mutants` FROM `dnas`;');
        redisMaster.hmset('STATS', rows[0]);
    }

    if (isMutant) {
        res.status(200).send('Es un mutante');
    } else {
        let errorMessage = (error instanceof Error) ? error.message : 'No es un mutante';
        res.status(statusError).send(errorMessage);
    }
});

router.get('/stats', async (req, res) => {
    if (redisSlave === undefined) {
        redisSlave = await connections.redis(true);
    }

    redisSlave.hgetall('STATS', async (err, result) => {
        if ((result.total === undefined) || (result.humans === undefined) || (result.mutants === undefined)) {
            if (database === undefined) {
                database = await connections.getMySQL();
            }

            if (redisMaster === undefined) {
                redisMaster = await connections.redis(false);
            }

            const [rows] = await database.execute('SELECT COUNT(1) `total`, sum(mutant = 0) `humans`, sum(mutant = 1) `mutants` FROM `dnas`;');
            redisMaster.hmset('STATS', rows[0]);
            result = rows;
        }
        
        res.status(200).json({count_mutant_dna: parseInt(result.mutants), count_human_dna: parseInt(result.humans), ratio:parseInt(result.mutants) / parseInt(result.total)});
      });
});

module.exports = router;
/* jshint ignore:end */