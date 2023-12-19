import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from "../cmps/BugFilter.jsx"

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState('')
    const [sortDir, setSortDir] = useState(null)
    // const [dynamicHref, setDynamicHref] = useState('');


    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy, sortDir])

    function loadBugs() {
        // console.log('sortDir',sortDir)
        bugService.query(filterBy, sortBy, sortDir)
            .then(setBugs)
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

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                // setBugs([...bugs, savedBug])
                setBugs((prevBugs) => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
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

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSortBy(sortKey) {
        setSortBy(sortKey)
    }

    function onSetSortDir(dir) {
        setSortDir(dir)
    }

    // function onDowloadPDF() {
    //     console.log('pdf trial')
    //     const filePath = bugService.getBugsPDF()
    //         .then((filePath) => {
    //             console.log('filePath', filePath)
    //             setDynamicHref('../../' + filePath)
    //         })
    //         .catch(err => console.log('err:', err))

    // }

    const { txt, minSeverity, label } = filterBy

    return (
        <main>
            <h3>Bugs App</h3>
            <main className='bug-index'>
                <BugFilter filterBy={{ txt, minSeverity, label }} onSetFilter={onSetFilter} onSetSortBy={onSetSortBy} onSetSortDir={onSetSortDir} sortBy={sortBy} sortDir={sortDir} />
                <button className="add" onClick={onAddBug}>Add Bug ⛐</button>
                {/* {<a href="#" onClick={onDowloadPDF} download="BugList.pdf">Download</a>} */}

                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
