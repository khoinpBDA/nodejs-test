const express = require('express')
const router = new express.Router()
const User = require('../model/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendFarewellEmail}  = require('../email/account')

const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Image file required'))
        }
        cb(undefined, true)
    }
})



router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


//get profile
router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

//upload avatar
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer
        // req.user.avatar = req.file.buffer
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//signup
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter((item) => {
            return item.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//logoutAll
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/users/me', auth, async (req, res) => {
    // const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update => allowedUpdates.includes(update)))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid' })
    }
    try {
        // const user = await User.findById(_id)
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.delete('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findByIdAndDelete(_id)
//         if (user) {
//             return res.status(200).send(_id)
//         }
//         res.status(400).send('No user is deleted')
//     } catch (e) {
//         console.log(e)
//     }
// })

// self delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        // sendFarewellEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
    }
})

// self delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
    }
})

// public get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Conetent-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        console.log(e)
    }
})


module.exports = router