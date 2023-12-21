import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'

const { useState, useEffect, useRef } = React

export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])
    
    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => console.log('err:', err))
    }

    console.log('users',users)
    // function onRemoveBug(bugId) {
    //     bugService
    //         .remove(bugId)
    //         .then(() => {
    //             console.log('Deleted Succesfully!')
    //             const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
    //             setBugs(bugsToUpdate)
    //             showSuccessMsg('Bug removed')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onRemoveBug ->', err)
    //             showErrorMsg('Cannot remove bug')
    //         })
    // }

    // function onAddBug() {
    //     const bug = {
    //         title: prompt('Bug title?'),
    //         description: prompt('Bug description?'),
    //         severity: +prompt('Bug severity?'),
    //     }
    //     bugService
    //         .save(bug)
    //         .then((savedBug) => {
    //             console.log('Added Bug', savedBug)
    //             // setBugs([...bugs, savedBug])
    //             setBugs((prevBugs) => [...prevBugs, savedBug])
    //             showSuccessMsg('Bug added')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onAddBug ->', err)
    //             showErrorMsg('Cannot add bug')
    //         })
    // }

    // function onEditBug(bug) {
    //     const severity = +prompt('New severity?')
    //     const bugToSave = { ...bug, severity }
    //     bugService
    //         .save(bugToSave)
    //         .then((savedBug) => {
    //             console.log('Updated Bug:', savedBug)
    //             const bugsToUpdate = bugs.map((currBug) =>
    //                 currBug._id === savedBug._id ? savedBug : currBug
    //             )
    //             setBugs(bugsToUpdate)
    //             showSuccessMsg('Bug updated')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onEditBug ->', err)
    //             showErrorMsg('Cannot update bug')
    //         })
    // }

    


    // const { txt, minSeverity, label, pageIdx } = filterBy

    return (
        <main>
            <h3>User Index</h3>
            <main className='user-index'>

                
                {/* <button className="add" onClick={onAddBug}>Add Bug ⛐</button> */}

                {/* <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} userBugIds={userBugIds}/> */}
                <UserList users={users}/>

            </main>
        </main>
    )
}
