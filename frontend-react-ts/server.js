const express = require('express');
const path = require('path');
const port = process.env.PORT || 9000;
const app = express();

// Body limit is 100Kb to prevent from DOS attacks
app.use(express.json({limit: '100kb'}));

// the __dirname is the current directory from where the script is running
app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 at port ${port}`)
});
