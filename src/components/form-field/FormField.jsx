export default function FormField({
    id,
    label,
    error,
    children,
}) {
    return (
        <div className={`field${error ? ' invalid' : ''}`}>
            <label htmlFor={id}>{label}</label>
            {children}
            {error && <p className="error-text" id={`${id}-err`}>{error}</p>}
        </div>
    );
}
