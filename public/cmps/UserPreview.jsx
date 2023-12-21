

export function UserPreview({ user }) {

    return <article>
        <h4>{user.fullname}</h4>
        <p>username: <span>{user.username}</span></p>
        <p>password: <span>{user.password}</span></p>
        <p>Is also admin: <span>{user.isAdmin}</span></p>
        <p>id: <span>{user._id}</span></p>
    </article>
}