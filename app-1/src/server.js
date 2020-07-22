const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`)
});

const app = require('./app');
const port = 3000;

app.listen(port, () => console.log(`Listening on port :${port}`));
