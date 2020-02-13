'use strict';
const { Server } = require('http');
const { serveApp } = require('./lib/handler');

const main = function() {
  const port = 9000;
  const server = new Server(serveApp);

  server.listen(port, () => {
    process.stdout.write(`server is listening at ${server.address().port}`);
  });
};
main();
