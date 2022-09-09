const express = require('express')
const path = require('path')
const app = express();


console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const publicDir = path.join(__dirname, '../public')
const helpDir = path.join(__dirname, '../public/help')

app.use(express.static(publicDir))

app.get('', (req, res)=>{
    res.send('<h1>default page</h1>')
})

app.get('/help', (req, res)=>{
    res.send('help', ()=> {
        app.use(express.static(helpDir))
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return  res.send({
            error: 'Thieu param search roi'
        })
    }
    console.log(req.query.search)
    res.send({
        mode: 'test',
        search: req.query.search
    })
})



