'use strict';
const { app } = require('./lib/app');

const main = function() {
  // eslint-disable-next-line no-process-env
  const port = process.env.PORT || 9000;

  app.listen(port, () => {
    process.stdout.write('server is listening\n');
  });
};

main();
