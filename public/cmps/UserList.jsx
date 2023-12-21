import { UserPreview } from "./UserPreview.jsx"

const { Link } = ReactRouterDOM



export function UserList({users}) {
// export function UserList({ users, onRemoveUser, onEditUser, userUserIds }) {

console.log('users from list',users)
    if (!users) return <div>Loading...</div>
    return (
        <ul className="user-list">
            {users.map((user) => (
                <li className="user-preview bug-preview" key={user._id}>
                    <UserPreview user={user} />
                        {/* <div>
                            <button onClick={() => onRemoveUser(user._id)}>x</button>
                            <button onClick={() => onEditUser(user)}>Edit</button>
                        </div> */}
                    <Link to={`/user/${user._id}`}>Details</Link>
                </li>
            ))
            }
        </ul >
    )
}
