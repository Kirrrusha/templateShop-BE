const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({message: 'ok'})
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));
