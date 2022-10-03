const express = require('express')
const app = express()
require('./db/mongoose')

// const kafkaConsumer = require('./kafka/consumer')
// kafkaConsumer.consume()


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const producerEndpointRouter = require('./routers/producer.endpoints')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(producerEndpointRouter)

// require('./cron-jobs/cronjobs')

// const myWeb3 = require('./web3/web3')
// myWeb3.run()

const crypto = require('crypto');

const query_string = 'coin=BNB&network=BSC&recvWindow=50000&timestamp=1664359404000'
const apiSecret = 'OSPfcCJIhdV6xkDG9lBOqyMWmL4EuZq5g0b28tb2Q9sZMBAOXpmN7XkBrZAWNLBl'

const signature = crypto
.createHmac('sha256', apiSecret)
.update(query_string)
.digest('hex')

console.log(signature)



module.exports = app

