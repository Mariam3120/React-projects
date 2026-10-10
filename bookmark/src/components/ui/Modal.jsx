import { useEffect, useId, useRef } from "react";
import styles from "./Modal.module.css";

export function Modal({ title, onClose, children }) {
  // უნიკალური id — ერთ გვერდზე ორი modal რომ იყოს, id-ები არ უნდა დაემთხვეს
  const titleId = useId();
  const dialogRef = useRef(null);

  // 1. Escape ხურავს
useEffect(() => {
    function handleKeyDown(event) {
        // რომელი property შეიცავს კლავიშის სახელს? (console-ში შეამოწმე)
        if (event.key === "Escape") {
            onClose();
        }
    }

    // listener document-ზეა და არა დიალოგზე: ფოკუსი შეიძლება
    // ჯერ არსად იყოს, Escape კი მაინც უნდა მუშაობდეს
    document.addEventListener("keydown", handleKeyDown);

    // cleanup-ის გარეშე ყოველი გახსნა ახალ listener-ს დაამატებდა
    return () => document.removeEventListener("keydown", handleKeyDown);
    // onClose dependency-შია: თუ მშობელმა ახალი ფუნქცია გადმოსცა,
    // listener-იც უნდა განახლდეს
    /*
    რატომ document-ზე და არა თავად მოდალზე? იმისათვის, რომ მომხმარებელმა კლავიატურიდან Escape დააჭიროს მაშინაც კი, როცა ფოკუსი მოდალის შიგნით რომელიღაც ღილაკზე ან ინპუტზეა.

რატომ სჭირდება return () => ... (Cleanup)?
თუ ამას არ გავაკეთებდით, ყოველ ჯერზე, როცა მოდარს გავხსნიდით და დავხურავდით, მახსოვრობაში ახალი და ახალი keydown listener-ი დაგროვდებოდა (მეხსიერების გაჟონვა / Memory Leak). Cleanup ფუნქცია მოდალის დახურვისთანავე შლის ამ listener-ს.
*/
}, [onClose]);

// 2. ფონის scroll იკეტება — თორემ modal-ის მიღმა გვერდი ცოცავს
useEffect(() => {
    // ძველი მნიშვნელობა უნდა დავიმახსოვროთ და cleanup-ში დავაბრუნოთ:
    // "" პირდაპირ ჩაწერა სხვისი სტილის წაშლა იქნებოდა
    // 1. ვიმახსოვრებთ რა ედო წეღან body-ს overflow-ს
    const previousOverflow = document.body.style.overflow;
    // 2. ვკეტავთ სქროლს
    document.body.style.overflow = "hidden";
    
    // CLEANUP: მოდალის დახურვისას ვუბრუნებთ ძველ მნიშვნელობას
    return () => {
        document.body.style.overflow = previousOverflow;
    };

    /*
    როცა მოდალი იხსნება, გვერდი რომ უკან არ აცოცდეს და ფონზე სქროლი არ გაირთოს, document.body.style.overflow = "hidden"-ით ვბლოკავთ მთლიან სხეულს.

რატომ ვიმახსოვრებთ previousOverflow? რომ მოდალი როცა დაიხურება, საიტი დაუბრუნდეს ზუსტად იმ მდგომარეობას, რაც მანამდე ჰქონდა (იქნებ იმ მომენტში სქროლი უკვე ჩაკეტილი ჰქონდა სხვა რამეს?).
*/
    // ცარიელი array: ერთხელ გახსნისას, ერთხელ დახურვისას
}, []);

// 3. ფოკუსი modal-ში გადადის, რომ Tab ფონის ღილაკებზე არ დაიწყოს
useEffect(() => {
    // ?. — ref შეიძლება ჯერ null იყოს
    // ?. — ოპერატორი იცავს კოდს შეცდომისგან, თუ ელემენტი ჯერ არ არსებობს
    dialogRef.current?.focus();
}, []);


  return (
    // ფონი: მთელ ეკრანს ფარავს (position: fixed; inset: 0)
    <div className={styles.backdrop} onMouseDown={handleBackdropMouseDown}>
      <div
        className={styles.dialog}
        // screen reader-ს უნდა ეცნობოს, რომ ეს დიალოგია
        role="dialog"
        // ...და რომ მის გარეთ ახლა ვერაფერს მიწვდება
        aria-modal="true"
        // სათაურთან დაკავშირება: რომელი ელემენტი ასახელებს დიალოგს?
        aria-labelledby={titleId}
        ref={dialogRef}
        // -1 ნიშნავს: Tab-ით ვერ მოხვდები, კოდით ფოკუსირება კი შეიძლება
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId}>{title}</h2>

          <button type="button" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  function handleBackdropMouseDown(event) {
    // event.target — სად დაიწყო დაჭერა
    // event.currentTarget — ელემენტი, რომელზეც listener ჰკიდია (ფონი)
    // ტოლია → ნიშნავს, რომ თავად ფონზე დააჭირეს და არა მის შვილზე
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
}
