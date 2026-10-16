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
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className={styles.hint} id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/* 
   და ცალკეა გატანილი კომპონენტი, ის ყველა ფორმის ველისთვის გამოიყენება, რათა თავიდან ავიცილოთ კოდის დუბლირება.
   ის გადაეცემა მშობელს, ამ შემთხვევაში BookmarkForm-ს, რომელიც განსაზღვრავს კონკრეტულ ველს (input, textarea, select) და ამ კომპონენტს გადაეცემა როგორც children.
  📌 შეჯამება: FormField არის "შემფუთავი" (Wrapper) კომპონენტი ფორმის თითოეული ველისთვის.
  
  ის ავტომატურად ამბობს, რომელი ელემენტებს უნდა ჰქონდეთ:
  1. ლაბელს (<label htmlFor>)
  2. თავად ინპუტს ({children})
  3. დინამიკურ ტექსტს — ან შეცდომის წითელ შეტყობინებას (error), ან დამხმარედ ნაცრისფერ მინიშნებას (hint).
  
  ეს გვიცავს კოდის დუბლირებისგან და უზრუნველყოფს UI/UX და Accessibility სტანდარტებს! 🚀
*/
