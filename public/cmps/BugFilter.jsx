
const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilter }) {

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

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="Bug-filter main-layout full">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSetFilterBy} >
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity || ''} onChange={handleChange} type="number" id="minSeverity" name="minSeverity" />

                <button>Submit</button>
            </form>
        </section>
    )
}