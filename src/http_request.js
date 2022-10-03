const request = require('request')
const provider = require('../utils/provider.js')
const myTest = require('./mongodb.js')
const express = require('express')

const app = express();

const port = process.env.PORT || 3000



app.get('/providers', (req, res) => {
    provider(req.query.search, (err, resp) => {
        res.send(resp)
    })
})

app.get('/test/:id', (req, res) => {
    console.log(req.params.id)
    myTest(req.params.id, (err, resp) => {
        console.log(resp)
        res.send(resp)
    })
})

app.listen(3001, () => {
    console.log('App running on port 3001')
})