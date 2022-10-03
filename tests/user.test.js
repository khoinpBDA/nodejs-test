const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'kHOI',
    email: 'khoinp+08@synodus.com',
    password: 'Khoi@123',
    tokens: [
        {
            token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
        }
    ]
}

beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

// afterEach(()=>{
//     console.log('afterEach')
// })


test('Should sign up new acount', async () => {
    const response = await request(app).post('/users').send(
        {
            name: 'kHOI',
            email: 'khoinp+09@synodus.com',
            password: 'Khoi@123'
        }
    ).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'kHOI',
            email: 'khoinp+09@synodus.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Khoi@123')
})

test('Should login existing acount', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

// test('Should not login non-existing acount', async () => {
//     await request(app).post('/users/login').send({
//         email: userOne.email + 'xxx',
//         password: userOne.password
//     }).expect(400)
// })

// test('Should get user profile', async()=>{
//     await request(app)
//     .get('/users/me')
//     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200)
// })

// test('Should not get user profile', async()=>{
//     await request(app)
//     .get('/users/me')
//     .send()
//     .expect(401)
// })

test('Should delete user', async()=>{
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete user profile', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/a.png')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async()=>{
    await request(app)
    .put('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'changed'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('changed')
})

// test('Should not update invalid user fields', async()=>{
//     await request(app)
//     .put('/users/me')
//     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//     .send({
//         location: 'changed'
//     })
//     .expect(400)
// })