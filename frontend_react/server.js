const express = require('express');
const favicon = require('express-favicon');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const port = process.env.PORT || 9000;
const app = express();
const compression = require('compression');

app.use(compression());

// Body limit is 100Kb to prevent from DOS attacks
app.use(express.json({ limit: '100kb' }));

// Data Sanitization against XSS
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(favicon(__dirname + '/public/favicon.ico'));

// the __dirname is the current directory from where the script is running
app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 at port ${port}`)
});