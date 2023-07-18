const express = require('express');
const app = express();
const pool = require('./db/connection');
const router = require('../src/routes/router');

app.use(express.json());
app.use('/', router);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    pool.connect()
        .then(() => console.log('Connected to database'))
        .catch(err => console.log('Database connection error: ', err));
});
