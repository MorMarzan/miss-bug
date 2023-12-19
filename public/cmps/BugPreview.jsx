

export function BugPreview({bug}) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Description: <span>{bug.description}</span></p>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}