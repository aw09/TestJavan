const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});