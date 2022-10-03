const kafkaConfig = require('./config')

const consumer = kafkaConfig.kafka.consumer({ groupId: kafkaConfig.defaultGroupName })

const consume = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: kafkaConfig.defaultTopicName, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })

      //handle messages
      const keySet = Object.keys(JSON.parse(message.value.toString()))
      if (keySet.includes('BuySlotUnbox')) {
        console.log('buy slot event handling...')
      }



    },
  })
}

module.exports = {
  consume
}