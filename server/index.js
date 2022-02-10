const express = require('express');
const app = express();
const cors = require('cors');

const router = require('./router.js');

const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});