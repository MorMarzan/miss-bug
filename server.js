import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
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
    // console.log('received req be query')
    // loggerService.info(`list bugs server.js: req.query ${JSON.stringify(req.query)}`)
    const { txt = '', minSeverity = 0, label = '', pageIdx, sortBy = '', sortDir = 1 } = req.query
    const filterBy = {
        txt,
        minSeverity,
        label,
        pageIdx
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

// Add bug (CREATE)
app.post('/api/bug', (req, res) => {
    const { title, description, severity, labels } = req.body

    const bugToSave = {
        title,
        description,
        severity, //auto parse to num
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug obj', err)
            res.status(400).send('Cannot save bug obj')
        })
})

// Edit bug (UPDATE)
app.put('/api/bug', (req, res) => {
    const { _id, title, description, severity, labels } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity, //auto parse to num
        labels
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get bug (READ)
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    // let visitedBugs = req.cookies.visitedBugs || []
    // if (visitedBugs.length >= 3) res.status(401).send('Wait for a bit')
    // const didUserVisitCurrBug = visitedBugs.some(visitedBug => visitedBug === bugId)
    // if (!didUserVisitCurrBug) visitedBugs.push(bugId)
    // console.log('visitedBugs', visitedBugs)
    // res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

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
app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

