import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import { pdfService } from './services/pdf.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())


// Express Routing:
// app.get('/puki', (req, res) => {
//     let visitedBugs = req.cookies.visitedBugs || 0
//     res.cookie('visitedBugs', ++visitedBugs, { maxAge: 1000 * 5 })
//     res.send(`<h1>Hello Puki ${visitedBugs}</h1>`)
// })


// app.get('/nono', (req, res) => res.redirect('/puki'))


app.get('/', (req, res) =>
    res.send('Hello from bug app'))

// Get bugs (READ)
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})


// Get bug (READ)
app.get('/api/bug/save', (req, res) => {
    const { title, description, severity, _id } = req.query
    const bugToSave = {
        title,
        description,
        severity: +severity,
        //the following will be undefined
        _id
    }
    // try here for update, for save with no _id and createAt- http://127.0.0.1:3030/api/bug/save?_id=&title=%22&description=&severity=
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug obj', err)
            res.status(400).send('Cannot save bug obj')
        })
})


//dowload pdf
app.get('/api/bug/download', (req, res) => {
    const fileName = 'BugsList.pdf'
    bugService.query()
        .then(bugs => {
            pdfService.buildBugsPDF(bugs, fileName)
            .then(() => {
                console.log('download finish')
                res.send(fileName)
                return fileName
            })
            
        })
        .catch(err => {
            loggerService.error('Cannot dowload bugs', err)
            res.status(400).send('Cannot dowload bugs')
        })
})


// Get bug (READ)
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) res.status(401).send('Wait for a bit')
    const didUserVisitCurrBug = visitedBugs.some(visitedBug => visitedBug === bugId)
    if (!didUserVisitCurrBug) visitedBugs.push(bugId)
    console.log('visitedBugs', visitedBugs)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove bug (DELETE)
app.get('/api/bug/:id/remove', (req, res) => {
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

