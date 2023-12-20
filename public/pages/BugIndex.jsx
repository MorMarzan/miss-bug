import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from "../cmps/BugFilter.jsx"
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState('')
    const [sortDir, setSortDir] = useState(null)
    const [maxPage, setMaxPage] = useState(null)
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))
    // const [dynamicHref, setDynamicHref] = useState('')
    const [user, setUser] = useState(userService.getLoggedinUser())
    const [userBugIds, setUserBugIds] = useState(null)

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy, sortDir])
    
    useEffect(() => {
        loadUserBugs()
    }, [user])

    // useEffect(() => {
    //     setUser(userService.getLoggedinUser())
    // }, [user]) //how to listen to changes in session storage?

    function loadBugs() {
        bugService.query(filterBy, sortBy, sortDir)
            .then(({ bugs, maxPage: newMaxPage }) => {
                // console.log('newMaxPage',newMaxPage)
                setBugs(bugs)
                setMaxPage(newMaxPage)
            })
            // .then(setBugs)
            .catch(err => console.log('err:', err))
    }

    function loadUserBugs() {
        if (!user) {
            setUserBugIds([])
            return
        }
        bugService.query({creatorId: user._id})
            .then(({ bugs }) => {
                const newUserBugIds = bugs.map(bug => bug._id)
                setUserBugIds(newUserBugIds)
            })
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

    function onChangePageIdx(diff) {
        // console.log('maxPage',maxPage)
        if (isUndefined(filterBy.pageIdx)) return
        setFilterBy(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = 0
            if (newPageIdx > maxPage) newPageIdx = maxPage + 1
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => {
            return {
                ...prevFilter,
                pageIdx: isUndefined(prevFilter.pageIdx) ? 0 : undefined
            }
        })
    }

    function isUndefined(value) {
        return value === undefined
    }

    const { txt, minSeverity, label, pageIdx } = filterBy

    return (
        <main>
            <h3>Bugs App</h3>
            <main className='bug-index'>

                <section className="pagination">
                    <button onClick={() => onChangePageIdx(1)}>+</button>
                    {pageIdx + 1 || 'No Pagination'}
                    <button onClick={() => onChangePageIdx(-1)}>-</button>
                    <button onClick={onTogglePagination}>Toggle pagination</button>
                </section>

                <BugFilter filterBy={{ txt, minSeverity, label }} onSetFilter={debounceOnSetFilter.current} onSetSortBy={onSetSortBy} onSetSortDir={onSetSortDir} sortBy={sortBy} sortDir={sortDir} />
                <button className="add" onClick={onAddBug}>Add Bug ⛐</button>
                {/* {<a href="#" onClick={onDowloadPDF} download="BugList.pdf">Download</a>} */}

                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} userBugIds={userBugIds}/>

            </main>
        </main>
    )
}
