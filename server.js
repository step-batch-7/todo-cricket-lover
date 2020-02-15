'use strict';
const { app } = require('./lib/app');

const main = function() {
  const port = 9000;

  app.listen(port, () => {
    process.stdout.write('server is listening\n');
  });
};

main();
