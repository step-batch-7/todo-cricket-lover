'use strict';
const fs = require('fs');
const { App } = require('./app');

const CONTENT_TYPES = require('./public/lib/mimeTypes');

const serveBadRequestPage = function(req, res) {
  res.statusCode = 404;
  res.end('Page not found');
};

const STATIC_FOLDER = `${__dirname}/public`;

const serveStaticPage = function(req, res, next) {
	const filename = req.url === '/' ? '/index.html' : req.url;
	
  if (!fs.existsSync(`./public${filename}`)) {
		return next();
  }
  let fileContent = fs.readFileSync(`${STATIC_FOLDER}${filename}`);
  const [, extension] = filename.split('.');
  
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(fileContent);
};

const readBody = function(req, res, next) {
  let userDetails = '';
  req.on('data', chunk => {
    userDetails += chunk;
    return userDetails;
  });
  req.on('end', () => {
    req.body = userDetails;
    next();
  });
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end();
};

const app = new App();

app.use(readBody);
app.get('', serveStaticPage);
app.get('', serveBadRequestPage);
app.post('', serveBadRequestPage);
app.use(methodNotAllowed);

module.exports = { app };
