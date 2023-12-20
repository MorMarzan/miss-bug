const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'


export function BugList({ bugs, onRemoveBug, onEditBug, userBugIds }) {

    if (!bugs) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    {   (userBugIds === true || userBugIds.includes(bug._id)) && 
                        <div>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                        </div>
                    }
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                </li>
            ))
            }
        </ul >
    )
}
