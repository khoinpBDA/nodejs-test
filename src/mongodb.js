
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()

console.log(id)

const myTest = (id, callback) => {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            return console.log('Unable to connect to db')
        }

        const db = client.db(databaseName)
        const updatePromise = db.collection('users').deleteMany(
            { age: 23})

        updatePromise.then((result)=>{
            console.log(result)
            callback(undefined, result)
        }).catch((error)=>{
            console.log(error)
            callback(error)
        })
    })
}

module.exports = myTest