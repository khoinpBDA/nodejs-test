
const defaultTopicName = process.env.KAFKA_TOPIC || 'dev-cyber8-inventory-game-khoi'
const defaultGroupName = process.env.KAFKA_GROUP || 'dev-cyber8-inventory-game-khoi-1'
const kafkaHost = process.env.KAFKA_HOST || 'kafka-nonprod.defiforyou.uk:9092'

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [kafkaHost]
})

module.exports = {kafka, defaultTopicName, defaultGroupName, kafkaHost}
