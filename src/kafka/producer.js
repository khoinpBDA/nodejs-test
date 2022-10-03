const kafkaConfig = require('./config')

const producer = kafkaConfig.kafka.producer()

const sendMessage = async (value)=>{
    await producer.connect()
    await producer.send({
      topic: kafkaConfig.defaultTopicName,
      messages: [
        { value: value },
      ],
    })
}

module.exports = {
    sendMessage
}