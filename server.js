'use strict';
const { Server } = require('http');
const { app } = require('./handler');

const main = function() {
  const port = 9000;
  const server = new Server(app.serve.bind(app));
  server.on('listening', () => process.stdout.write('server is listening'));
  server.listen(port);
};
main();
