import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:
app.get('/', (req, res) =>
    res.send('Hello from bug app'))


//dowload pdf - backend only
app.get('/api/bug/download', (req, res) => {
    const fileName = 'BugsList.pdf'
    bugService.query()
        .then(({ bugs }) => {
            pdfService.buildBugsPDF(bugs, fileName)
                .then(() => {
                    console.log('download finish')
                    res.send(fileName)
                })

        })
        .catch(err => {
            loggerService.error('Cannot dowload bugs', err)
            res.status(400).send('Cannot dowload bugs')
        })
})

// Get bugs (READ)
app.get('/api/bug', (req, res) => {
    // loggerService.info(`list bugs server.js: req.query ${JSON.stringify(req.query)}`)
    const { txt = '', minSeverity = 0, label = '', pageIdx, sortBy = '', sortDir = 1, creatorId = '' } = req.query
    const filterBy = {
        txt,
        minSeverity,
        label,
        pageIdx,
        creatorId
    }

    bugService.query(filterBy, sortBy, sortDir)
        .then(({ bugs, maxPage }) => {
            // console.log('maxPage', maxPage)
            res.send({ bugs, maxPage })
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Add bug (CREATE), logged users only/admins
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug, sign in pls')

    const { title, description, severity, labels } = req.body

    //useless- needs only label add
    const bugToSave = {
        title,
        description,
        severity, //auto parse to num
        labels: labels || []
    }

    bugService.save(bugToSave, loggedinUser)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug obj', err)
            res.status(400).send('Cannot save bug obj')
        })
})

// Edit bug (UPDATE), logged&&creator users only/admins
app.put('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug, sign in pls')

    const { _id, title, description, severity, labels } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity, //auto parse to num
        labels
    }

    bugService.save(bugToSave, loggedinUser)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const { visitCountMap = [] } = req.cookies
    if (visitCountMap.length >= 3) return res.status(401).send('Wait for a bit')
    if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)
    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 999 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove bug (DELETE)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug, sign in pls')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// AUTH API*****************************************

// Get users (READ)
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

// Remove user (DELETE)
app.delete('/api/user/:userId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser || !loggedinUser.isAdmin) return res.status(401).send('Cannot remove user, admin only')
    console.log('loggedinUser',loggedinUser)

    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send(userId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// check login, send cookie + mini user
app.post('/api/auth/login', (req, res) => {
    //needs fullname, username, password check will be implement later
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch((err) => {
            console.log('user or pass are incorrect', err)
            res.status(400).send('user or pass are incorrect')
        })
})

// Add user (CREATE), send cookie + mini user
app.post('/api/auth/signup', (req, res) => {
    //needs fullname, username, password implement later
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

// delete cookie in logout
app.post('/api/auth/logout', (req, res) => {
    console.log('logout')
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

