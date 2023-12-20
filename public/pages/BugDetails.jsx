const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <div>
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <p>Description: {bug.description}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>
            Labels: <span>{bug.labels.length > 0 ? bug.labels.join(', ') : 'None'}</span>
        </p>
        <p>Created at: <span>{utilService.formatDateTime(bug.createdAt)}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

