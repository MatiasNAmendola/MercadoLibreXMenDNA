"use strict";

require('dotenv').config();

// Include the cluster module
const cluster = require('cluster');

// Include the cluster module
const router = require('./router');

// Code to run if we're in the master process
if (cluster.isMaster) {

  console.log(`Running in: ${process.argv[2] || process.env.NODE_ENV}`);

  // Count the machine's CPUs
  const cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {

    // Replace the dead worker, we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

  });

} else { // Code to run if we're in a worker process

  // Include the compression module
  const compression = require('compression');

  // Include Express
  const express = require('express');

  // Create a new Express application
  var app = express();

  // compress responses
  app.use(compression());

  app.use('/', router);

  app.use(function (err, req, res, next) {
    res.status(500).send({
      status: 500,
      message: 'internal error',
      type: 'internal'
    });
  });

  const port = process.env.PORT || 1337;

  // Bind to a port
  app.listen(port, function () {
    console.log('Worker %d listening on port %d!', cluster.worker.id, port);
  });
}