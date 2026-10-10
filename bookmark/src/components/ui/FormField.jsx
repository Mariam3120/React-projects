import styles from "./FormField.module.css";

export function FormField({ id, label, hint, error, children }) {
    return (
        <div className={styles.field}>
            {/* რომელი ატრიბუტი აკავშირებს label-ს input-თან? */}
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>

            {/* თავად input-ს მშობელი გადმოსცემს children-ით */}
            {children}

            {/* შეცდომა hint-ს ცვლის და არ ემატება: ორივე ერთად ხმაურია.
                id-ები მშობელს სჭირდება aria-describedby-სთვის */}
            {error ? (
                <p className={styles.error} id={`${id}-error`}>{error}</p>
            ) : (
                hint && <p className={styles.hint} id={`${id}-hint`}>{hint}</p>
            )}
        </div>
    );
}