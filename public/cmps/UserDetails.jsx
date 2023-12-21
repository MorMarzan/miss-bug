const { useState, useEffect, } = React
const { Link, useParams } = ReactRouterDOM


import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'
import { flushPages } from 'pdfkit'
import { bugService } from '../services/bug.service.js'
import { BugList } from './BugList.jsx'


export function UserDetails() {

    // const { userId } = useParams()

    const [user, setUser] = useState(userService.getLoggedinUser())
    const [bugs, setBugs] = useState(null)
    // const intialFiterBy = (!user.isAdmin) ? {creatorId: user._id} : {}
    const [filterBy, setFilterBy] = useState({ creatorId: user._id })
    // const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())


    // console.log('filterBy',filterBy)
    // { txt: '', minSeverity: '', label: '', pageIdx: null, creatorId = user._id }
    // { txt: '', minSeverity: '', label: '', pageIdx: null, creatorId = user._id }
    // useEffect(() => {
    //     userService.getLoggedinUser()
    //         .then(user => {
    //             setUser(user)
    //         })
    //         .catch(err => {
    //             showErrorMsg('Cannot load user')
    //         })
    // }, [])

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(({ bugs }) => setBugs(bugs))
            .catch(err => console.log('err:', err))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }


    if (!user) return <h1>loadings....</h1>

    const { fullname, isAdmin, _id } = user

    return (
        <section className='user-details'>
            <h3>User Details</h3>
            <h4>{'Hey ' + fullname}</h4>
            {isAdmin && <p>You are Admin!</p>}
            <p>id: {_id}</p>
            <Link to="/bug">Back to List</Link>
            {!user.isAdmin && <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} userBugIds={true} />}
        </section>
    )

}

