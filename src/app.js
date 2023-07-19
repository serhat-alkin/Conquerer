const express = require('express');
const app = express();
const pool = require('./db/connection');
const router = require('../src/routes/router');
const { Client } = require('@elastic/elasticsearch');
require("dotenv").config();

app.use(express.json());
app.use('/', router);

const elasticSearchclient = new Client({
  node: process.env.ELASTIC_SEARCH_HOST,
  auth: {
    apiKey: process.env.ELASTIC_SEARCH_API_KEY
  }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    pool.connect()
        .then(() => console.log('Connected to database'))
        .catch(err => console.log('Database connection error: ', err));
});


global.client = elasticSearchclient;