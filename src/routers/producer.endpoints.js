const express = require('express')
const router = new express.Router()
const kafkaProducer = require('../kafka/producer')

router.post('/messages', async (req, res) => {
    try {
        const message = req.body.message
        if(!message){
            return res.status(400).send('Value is required')
        }
        await kafkaProducer.sendMessage(JSON.stringify(message))
        res.status(201).send()
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router