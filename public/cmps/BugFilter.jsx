
const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilter, onSetSortDir, onSetSortBy, sortBy, sortDir }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onSetFilterBy(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handleSortBy({ target }) {
        if (!sortDir) onSetSortDir(1)
        onSetSortBy(target.value)
    }

    function handleSortDir({ target }) {
        const DirVal = target.checked ? 1 : -1
        onSetSortDir(DirVal)
    }

    const { txt, minSeverity, label } = filterByToEdit
    return (
        <section className="bug-filter main-layout full">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSetFilterBy} >
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity || ''} onChange={handleChange} type="number" id="minSeverity" name="minSeverity" />

                <label htmlFor="label">Label:</label>
                <select name="label" id="label" onChange={handleChange} defaultValue={label}>
                    <option disabled value="">Choose label</option>
                    <option value="">All</option>
                    <option value="critical">Critical</option>
                    <option value="need-CR">Need CR</option>
                    <option value="dev-branch">Dev branch</option>
                </select>

                <label htmlFor="sortBy">Sort By:</label>
                <select name="sortBy" id="sortBy" onChange={handleSortBy} defaultValue={sortBy}>
                    <option disabled value="">Choose option</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <label htmlFor="SortDir">Ascending </label>
                <input disabled={!sortBy} checked={sortDir === 1} onChange={handleSortDir} type="checkbox" id="SortDir" name="SortDir" />

                <button>Submit</button>
            </form>
        </section>
    )
}