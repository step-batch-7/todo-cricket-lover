'use strict';
const { app } = require('./lib/handler');

const main = function() {
  const port = 9000;

  app.listen(port, () => {
    process.stdout.write('server is listening\n');
  });
};
main();
