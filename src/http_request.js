const request = require('request')
const provider = require('../utils/provider.js')
const express = require('express')

const app = express();





app.get('/providers', (req, res) => {
    provider(req.query.search, (err, resp) => {
        res.send(resp)
    })
})

// app.listen(3000, () => {
//     console.log('App running on port 3000')
// })