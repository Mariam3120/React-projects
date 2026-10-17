# Bookmark Manager — Modal, ფორმა და ვალიდაცია (ნაბიჯები 12–15)

2026-09-26 · @Someone

## სად ვართ და რას ვაშენებთ

აპი მუშაობს: ბარათები ჩანს, ძებნა და ფილტრი მოქმედებს, CRUD ფუნქციები მზადაა. მაგრამ bookmark-ის დასამატებლად კოდში დროებითი ღილაკი გვიდევს, რომელიც ყოველთვის ერთსა და იმავე „Test bookmark"-ს ამატებს, რედაქტირების ღილაკი კი `console.log`-ს ბეჭდავს.

გვჭირდება ფორმა. და რადგან ფორმა გვერდს არ უნდა გადააადგილოს (მომხმარებელი სიის კონტექსტში რჩება), ის modal-ში გაიხსნება.

ოთხი ნაბიჯი, ქვემოდან ზემოთ:

1. **`Button`:** სამი სხვადასხვა ღილაკი უკვე გვაქვს და ყველა სხვანაირად გამოიყურება. დროა ერთი კომპონენტი გვქონდეს.
2. **`Modal`:** ფანჯარა, რომელსაც Escape ხურავს და ფონზე დაჭერაც.
3. **ვალიდაცია:** სუფთა ფუნქციები, რომლებიც ამბობენ, რა არის არასწორი.
4. **`BookmarkForm`:** controlled ფორმა, რომელიც დამატებასაც აკეთებს და რედაქტირებასაც.

**მთავარი წესი იგივეა:** მზა კოდი აქ არ არის — template-ებია hint-ებით.

**წინაპირობები:** ნაბიჯები 1–11; `useEffect` და cleanup; controlled inputs (ნაბიჯი 10); spread ობიექტებზე.

**ფაილები:**

```
src/
├── components/ui/Button.jsx + .module.css       (ახალი)
├── components/ui/Modal.jsx + .module.css        (ახალი)
├── components/ui/ConfirmModal.jsx + .module.css (ახალი)
├── components/ui/FormField.jsx + .module.css    (ახალი)
├── utils/validation.js                          (ახალი)
├── utils/url.js                                 (ვაფართოებთ)
├── components/bookmarks/BookmarkForm.jsx + .css (ახალი)
└── App.jsx                                      (ვაერთებთ)
```

## ნაბიჯი 12: `Button` — ერთი ღილაკი ყველასთვის

დღეს პროექტში ღილაკები სამ ადგილასაა: ბარათზე, sidebar-ში და ძებნის ველში. თითოეულს საკუთარი CSS აქვს და თითოეული ცოტათი განსხვავდება. მალე ფორმაც დაემატება. თუ ასე გავაგრძელეთ, „წაშლის" ღილაკი ორ ადგილას ორნაირი გამოჩნდება — და ეს არა დიზაინის, არამედ ნდობის პრობლემაა: მომხმარებელი ერთსა და იმავე მოქმედებას ერთნაირად უნდა ცნობდეს.

ამიტომ გვჭირდება ერთი კომპონენტი ორი „ჩამრთველით": **რა როლი აქვს** ღილაკს (`variant`) და **რა ზომისაა** (`size`).

```jsx
import styles from "./Button.module.css";

export function Button({
    children,
    // default მნიშვნელობები: უმეტესობა მეორეხარისხოვანი, საშუალო ზომის ღილაკია
    variant = "______",
    size = "______",
    // <button>-ის default type არის "submit" — ფორმის შიგნით ეს
    // შემთხვევით გაგზავნას იწვევს. ამიტომ ჩვენი default სხვაა
    type = "______",
    className,
    // ყველა დანარჩენი prop: onClick, disabled, aria-label, title...
    // მათ ჩამოთვლას აზრი არ აქვს — ისედაც <button>-ს ეკუთვნის
    ...rest
}) {
    // styles.primary, styles.md — CSS module-ის კლასები ობიექტის key-ებია.
    // filter(Boolean) აგდებს undefined-ებს, join ერთ string-ად აქცევს
    const classNames = [
        styles.button,
        styles[______],
        styles[______],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        // ყურადღება რიგზე: {...rest} className-ის შემდეგ რომ დავწეროთ და
        // გამომძახებელმა className გადმოსცეს, ის ჩვენსას გადააფარებს
        <button type={type} className={classNames} {...______}>
            {children}
        </button>
    );
}
```

CSS-ში თითოეულ variant-ს ცალკე კლასი სჭირდება: `.primary` (აქცენტის ფერი, ერთი ეკრანზე ერთი), `.secondary` (ჩარჩო), `.ghost` (გამჭვირვალე, იკონებისთვის), `.danger` (წაშლა). ზომებისთვის: `.md`, `.sm`, `.icon` (კვადრატი, მხოლოდ იკონით).

ერთი წესი დაიმახსოვრე: **ერთ ეკრანზე ერთი `primary` ღილაკი.** თუ სამი ერთნაირად თვალშისაცემი ღილაკია, მომხმარებელი ვერ ხვდება, რომელია მთავარი.

**რა უნდა შეისწავლო:** rest/spread props; რატომ არის `<button>`-ის default `type="submit"`; CSS Modules-ში `styles[variable]` წვდომა; `children` prop.

**შემოწმება:** ოთხივე variant ერთ რიგში დახატე და შეადარე. მერე ბარათის ღილაკები `Button`-ით ჩაანაცვლე — ვიზუალი უნდა გაერთგვაროვნდეს, ფუნქციონალი კი არ შეიცვალოს.

## ნაბიჯი 13A: `Modal` — ჩარჩო

Modal არის ფენა, რომელიც გვერდს გადაფარავს და მომხმარებლის ყურადღებას ერთ ამოცანაზე კრებს.

**ვინ წყვეტს, ღიაა თუ არა?** არა თავად modal — მშობელი. `Modal` ყოველთვის „ღიაა", როცა ის საერთოდ დახატულია:

```jsx
{isFormOpen && <Modal title="Add bookmark" onClose={closeForm}>...</Modal>}
```

ეს უბრალოდ სტილის საკითხი არ არის. როცა `isFormOpen` ხდება `false`, React კომპონენტს ხსნის ხისგან — და მასთან ერთად ქრება ფორმის state. ანუ მეორედ გახსნისას ფორმა თავისით ცარიელია, ხელით გასუფთავება არ გჭირდება.

```jsx
import { useEffect, useId, useRef } from "react";
import styles from "./Modal.module.css";

export function Modal({ title, onClose, children }) {
    // უნიკალური id — ერთ გვერდზე ორი modal რომ იყოს, id-ები არ უნდა დაემთხვეს
    const titleId = useId();
    const dialogRef = useRef(null);

    return (
        // ფონი: მთელ ეკრანს ფარავს (position: fixed; inset: 0)
        <div className={styles.backdrop} onMouseDown={______}>
            <div
                className={styles.dialog}
                // screen reader-ს უნდა ეცნობოს, რომ ეს დიალოგია
                role="______"
                // ...და რომ მის გარეთ ახლა ვერაფერს მიწვდება
                aria-modal="true"
                // სათაურთან დაკავშირება: რომელი ელემენტი ასახელებს დიალოგს?
                aria-labelledby={______}
                ref={dialogRef}
                // -1 ნიშნავს: Tab-ით ვერ მოხვდები, კოდით ფოკუსირება კი შეიძლება
                tabIndex={-1}
            >
                <header className={styles.header}>
                    <h2 id={______}>{title}</h2>

                    <button type="button" onClick={onClose} aria-label="Close dialog">
                        ✕
                    </button>
                </header>

                <div className={styles.body}>{______}</div>
            </div>
        </div>
    );
}
```

ფონზე დაჭერა უნდა ხურავდეს, მაგრამ **დიალოგის შიგნით** დაჭერა — არა. ამის ტესტი ერთი შედარებაა:

```jsx
function handleBackdropMouseDown(event) {
    // event.target — სად დაიწყო დაჭერა
    // event.currentTarget — ელემენტი, რომელზეც listener ჰკიდია (ფონი)
    // ტოლია → ნიშნავს, რომ თავად ფონზე დააჭირეს და არა მის შვილზე
    if (event.______ === event.______) {
        onClose();
    }
}
```

**რატომ `onMouseDown` და არა `onClick`?** თუ მომხმარებელი ტექსტს დიალოგში მონიშნავს და თაგუნას ფონზე უშვებს, `click` ფონზე გაისვრება და ფორმა დაიხურება — აკრეფილთან ერთად. `mousedown` იქ ისვრება, სადაც დაჭერა **დაიწყო**.

## ნაბიჯი 13B: `Modal` — კლავიატურა და ფონის scroll

სამი effect. თითოეულს ერთი დანიშნულება აქვს — და თითოეულს cleanup სჭირდება.

```jsx
// 1. Escape ხურავს
useEffect(() => {
    function handleKeyDown(event) {
        // რომელი property შეიცავს კლავიშის სახელს? (console-ში შეამოწმე)
        if (event.______ === "Escape") {
            onClose();
        }
    }

    // listener document-ზეა და არა დიალოგზე: ფოკუსი შეიძლება
    // ჯერ არსად იყოს, Escape კი მაინც უნდა მუშაობდეს
    document.addEventListener("keydown", handleKeyDown);

    // cleanup-ის გარეშე ყოველი გახსნა ახალ listener-ს დაამატებდა
    return () => document.____________("keydown", handleKeyDown);
    // onClose dependency-შია: თუ მშობელმა ახალი ფუნქცია გადმოსცა,
    // listener-იც უნდა განახლდეს
}, [______]);

// 2. ფონის scroll იკეტება — თორემ modal-ის მიღმა გვერდი ცოცავს
useEffect(() => {
    // ძველი მნიშვნელობა უნდა დავიმახსოვროთ და cleanup-ში დავაბრუნოთ:
    // "" პირდაპირ ჩაწერა სხვისი სტილის წაშლა იქნებოდა
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "______";

    return () => {
        document.body.style.overflow = ____________;
    };
    // ცარიელი array: ერთხელ გახსნისას, ერთხელ დახურვისას
}, [______]);

// 3. ფოკუსი modal-ში გადადის, რომ Tab ფონის ღილაკებზე არ დაიწყოს
useEffect(() => {
    // ?. — ref შეიძლება ჯერ null იყოს
    dialogRef.current?.______();
}, []);
```

**რა უნდა შეისწავლო:** `useEffect`-ის cleanup და რატომ ეშვება ის StrictMode-ში ორჯერ; `event.key`; `useRef` და `ref.current`; `useId`; `role="dialog"` და `aria-modal` (MDN: ARIA dialog pattern).

**შემოწმება:**

1. Escape ხურავს; მეორედ Escape არაფერს აკეთებს (listener აღარ არსებობს).
2. ფონზე დაჭერა ხურავს; დიალოგის შიგნით — არა.
3. დიალოგში ტექსტი მონიშნე და თაგუნა ფონზე გაუშვი — **არ უნდა დაიხუროს**.
4. გახსნისას გვერდის scroll ქრება, დახურვისას ბრუნდება.
5. Tab-ით ფოკუსი დიალოგის შიგნით იწყება.

## ნაბიჯი 13C: `ConfirmModal` — კომპოზიცია

წაშლა შეუქცევადია, ამიტომ დადასტურება სჭირდება. მაგრამ ახალ modal-ს **არ** ვწერთ: ჩარჩო უკვე გვაქვს, ამიტომ მას ვიყენებთ შიგნიდან.

```jsx
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) {
    return (
        // დახურვა და გაუქმება ერთი და იგივეა
        <______ title={title} onClose={______}>
            <p>{message}</p>

            <div className={styles.actions}>
                {/* რიგი მნიშვნელოვანია: საშიში მოქმედება მარჯვნივ,
                    უსაფრთხო გასასვლელი — მარცხნივ */}
                <Button variant="______" onClick={onCancel}>{cancelLabel}</Button>
                <Button variant="______" onClick={onConfirm} autoFocus>{confirmLabel}</Button>
            </div>
        </______>
    );
}
```

ეს არის **კომპოზიცია**: ახალი ქცევა ძველი კომპონენტების შეერთებით მიიღება და არა კოპირებით. თუ ხვალ modal-ს ანიმაცია დაემატება, `ConfirmModal`-ს ის უფასოდ ხვდება.

## ნაბიჯი 14: ვალიდაცია — `utils/validation.js`

სანამ ფორმას დავწერთ, უნდა ვიცოდეთ, რა არის „სწორი" მონაცემი. ეს ცოდნა კომპონენტში არ უნდა იყოს: ვალიდაცია სუფთა ლოგიკაა, ზუსტად როგორც ფილტრი იყო.

ჯერ მისამართი. მომხმარებელი დიდი ალბათობით `react.dev`-ს აკრეფს და არა `https://react.dev`-ს — ჩვენ ეს უნდა მივიღოთ და თვითონ შევავსოთ. `utils/url.js`-ს ორი ფუნქცია დაემატება:

```js
// "react.dev" → "https://react.dev"; "http://x.com" უცვლელი რჩება
export function normalizeUrl(value) {
    const trimmed = value.trim();

    if (trimmed === "") {
        return "";
    }

    // რეგულარული გამოსახულება: იწყება თუ არა http:// ან https://-ით?
    // i ნიშნავს, რომ რეგისტრი არ ითვლება
    if (/^https?:\/\//i.test(trimmed)) {
        return ______;
    }

    return `https://${______}`;
}

export function isValidUrl(value) {
    try {
        // ჯერ ვასწორებთ, მერე ვამოწმებთ — თორემ "react.dev" ვერ გაივლიდა
        const parsed = new URL(____________(value));

        return (
            // მხოლოდ ვებმისამართები: javascript: და data: არ გვინდა
            (parsed.protocol === "______" || parsed.protocol === "______") &&
            // "https://abc" ტექნიკურად ვალიდურია, მაგრამ საიტი არ არის.
            // რა ამოწმებს, რომ დომენში წერტილია?
            parsed.hostname.____________(".")
        );
    } catch {
        return ______;
    }
}
```

ახლა tag-ები. ფორმაში ისინი ერთ ველშია, მძიმეებით: `React, Hooks, react`. მასივად გადაქცევისას ცარიელები უნდა გადავაგდოთ და გამეორება მოვაშოროთ — ისე, რომ მომხმარებლის დაწერილი რეგისტრი შევინარჩუნოთ.

```js
export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 240;
export const MAX_TAGS = 6;

export function parseTags(value) {
    // Map გვჭირდება და არა Set: შედარება რეგისტრის გარეშე გვინდა
    // ("react" და "React" ერთია), მაგრამ შენახვა — ისე, როგორც დაწერეს
    const unique = new Map();

    for (const part of value.______(",")) {
        const tag = part.______();

        if (tag === "") {
            continue;
        }

        const key = tag.toLowerCase();

        // პირველი ვარიანტი იმარჯვებს
        if (!unique.____________(key)) {
            unique.set(key, tag);
        }
    }

    return [...unique.____________()];
}

// parseTags-ის საპირისპირო: რედაქტირებისას მასივი ისევ ტექსტად გვინდა
export function formatTags(tags) {
    return tags.______(", ");
}
```

დაბოლოს, მთავარი ფუნქცია. ის **ობიექტს** აბრუნებს, სადაც key ველის სახელია და value — შეცდომის ტექსტი. ცარიელი ობიექტი ნიშნავს „ყველაფერი წესრიგშია".

```js
export function validateBookmark(values) {
    const errors = {};

    const title = values.title.trim();

    if (title === "") {
        errors.______ = "Title is required.";
    } else if (title.length > MAX_TITLE_LENGTH) {
        errors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
    }

    // URL: ჯერ ცარიელობა, მერე ვალიდურობა.
    // შეტყობინებაში მაგალითი მიეცი — "Invalid URL" არაფერს ეუბნება
    // ...

    return errors;
}
```

**რა უნდა შეისწავლო:** `String.prototype.split` / `trim` / `join`; `Map` vs `Set`; `try...catch` `new URL()`-თან; რატომ არ შეიძლება ვალიდაციის ნდობა მხოლოდ კლიენტზე (სერვერი ყოველთვის თავიდან ამოწმებს).

**შემოწმება (console-ში):**

1. `normalizeUrl("react.dev")` → `"https://react.dev"`
2. `isValidUrl("not a url")` → `false`; `isValidUrl("react.dev")` → `true`
3. `parseTags("React, Hooks, react, , CSS")` → სამი ელემენტი: `React`, `Hooks`, `CSS`
4. `validateBookmark({ title: "", url: "x", description: "", tags: "" })` → ობიექტი ორი key-ით
5. `validateBookmark({ title: "A", url: "react.dev", description: "", tags: "" })` → `{}`

## ნაბიჯი 15A: `FormField` — ველის გარსი

ყოველ ველს ერთი და იგივე სამი ნაწილი აქვს: label, input და შეცდომის ტექსტი. ოთხჯერ რომ დავწეროთ, ოთხივეგან განსხვავებულად გამოგვივა.

აქ ერთი წესი ისწავლება: **label და input `id`-ით უნდა იყოს დაკავშირებული.** ეს არ არის დეკორაცია — სწორედ ამიტომ ხდება, რომ label-ზე დაჭერა ველში ფოკუსს აგდებს და screen reader ველის წაკითხვისას მის სახელს ამბობს.

```jsx
export function FormField({ id, label, hint, error, children }) {
    return (
        <div className={styles.field}>
            {/* რომელი ატრიბუტი აკავშირებს label-ს input-თან? */}
            <label className={styles.label} ____________={id}>
                {label}
            </label>

            {/* თავად input-ს მშობელი გადმოსცემს children-ით */}
            {______}

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
```

## ნაბიჯი 15B: `BookmarkForm`

ახლა თავად ფორმა. ოთხი ველი: სათაური, მისამართი, აღწერა, tag-ები.

**ოთხი `useState` თუ ერთი?** ერთი. ოთხივე ველი ერთად იბადება, ერთად იგზავნება და ერთად სუფთავდება — ეს ერთი მდგომარეობაა, უბრალოდ ოთხი ველით. ერთი ობიექტი `handleChange`-საც ერთს ტოვებს ოთხის ნაცვლად.

```jsx
import { useState } from "react";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { normalizeUrl } from "../../utils/url";
import { formatTags, parseTags, validateBookmark, MAX_TAGS } from "../../utils/validation";

const EMPTY_VALUES = { title: "", url: "", description: "", tags: "" };

// ფორმის ყველა ველი string-ია, მათ შორის tags —
// მასივად ის მხოლოდ გაგზავნის მომენტში იქცევა
function getInitialValues(bookmark) {
    // bookmark არ არის → დამატების რეჟიმი
    if (!bookmark) {
        return ____________;
    }

    return {
        title: bookmark.title,
        url: bookmark.url,
        // seed-ში description შეიძლება არ იყოს — controlled input-ს
        // undefined არ შეიძლება მიეცეს
        description: bookmark.description ?? "",
        tags: ____________(bookmark.tags),
    };
}

export function BookmarkForm({ bookmark, onSubmit, onCancel }) {
    // ყურადღება: useState(getInitialValues(bookmark)) ფუნქციას ყოველ
    // render-ზე გამოიძახებდა. ფრჩხილების გარეშე გადაცემული ფუნქცია
    // მხოლოდ პირველ render-ზე შესრულდება
    const [values, setValues] = useState(() => ____________(bookmark));
    const [errors, setErrors] = useState({});

    const isEditing = Boolean(bookmark);

    // ერთი handler ოთხივე ველისთვის — input-ის name ამბობს, რომელია
    function handleChange(event) {
        const { name, value } = event.target;

        // [name] — computed property: ცვლადის მნიშვნელობა ხდება key
        setValues((current) => ({ ...current, [______]: ______ }));

        // შეცდომა ქრება, როგორც კი ველს შეეხები: გამოსწორება არ უნდა ისჯებოდეს
        if (errors[name]) {
            setErrors((current) => ({ ...current, [name]: undefined }));
        }
    }

    function handleSubmit(event) {
        // ამის გარეშე ბრაუზერი გვერდს გადატვირთავს — ეს HTML-ის
        // ნაგულისხმევი ქცევაა ფორმის გაგზავნისას
        event.____________();

        const nextErrors = ____________(values);
        setErrors(nextErrors);

        // ობიექტი ცარიელია? Object.keys(...).length ამას გეტყვის
        if (____________ > 0) {
            return;
        }

        // მშობელს სუფთა მონაცემი გადაეცემა: ზედმეტი ჰარეების გარეშე,
        // სწორი მისამართით და tag-ების მასივით
        onSubmit({
            title: values.title.trim(),
            url: ____________(values.url),
            description: values.description.trim(),
            tags: ____________(values.tags),
        });
    }

    return (
        // noValidate ბრაუზერის საკუთარ შეტყობინებებს თიშავს —
        // ჩვენ ჩვენივე ტექსტები გვინდა, ჩვენივე ენაზე და ადგილას
        <form onSubmit={______} noValidate>
            <FormField id="bookmark-title" label="Title" error={errors.title}>
                <input
                    id="bookmark-title"
                    // name უნდა ემთხვეოდეს values-ის key-ს!
                    name="______"
                    value={values.______}
                    onChange={______}
                    // პირველი ველი ფოკუსში modal-ის გახსნისთანავე
                    autoFocus
                    // screen reader-ს უნდა ეცნობოს, რომ ველი არასწორია
                    aria-invalid={Boolean(errors.title)}
                    // და სად წერია, რატომ
                    aria-describedby={errors.title ? "bookmark-title-error" : undefined}
                />
            </FormField>

            {/* url, description (textarea), tags — იმავე ნიმუშით.
                tags-ს hint დაუწერე: "Separate with commas, up to N tags." */}

            <div className={styles.actions}>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                {/* ეს ღილაკი ფორმას აგზავნის — რომელი type სჭირდება? */}
                <Button type="______" variant="primary">
                    {isEditing ? "Save changes" : "Add bookmark"}
                </Button>
            </div>
        </form>
    );
}
```

## ნაბიჯი 15C: `App` — შეერთება

`App`-ს სამი ახალი state სჭირდება: ღიაა თუ არა ფორმა, რომელს არედაქტირებ და რომლის წაშლას აპირებ.

**აქ ერთი გადაწყვეტილებაა მნიშვნელოვანი: state-ში ინახება `id` და არა ობიექტი.**

```jsx
const [isFormOpen, setIsFormOpen] = useState(false);
const [editedId, setEditedId] = useState(null);
const [deletedId, setDeletedId] = useState(null);

// ობიექტი სიიდან გამოითვლება — ზუსტად ისე, როგორც გაფილტრული სია
const editedBookmark = bookmarks.find((bookmark) => bookmark.id === editedId) ?? null;
```

რატომ? თუ state-ში მთელ ობიექტს ჩადებ, ის **სურათია გადაღებული იმ წამში**. სია შეიცვლება (თუნდაც სხვა ჩანართიდან, თუნდაც რედაქტირების შემდეგ), state-ში კი ძველი ასლი დარჩება — ანუ ისევ ორი სიმართლის წყარო, იგივე პრობლემა, რაც მე-11 ნაბიჯზე გაფილტრულ სიასთან გვქონდა. `id` პატარა და სტაბილურია: ის არასდროს „ძველდება".

დანარჩენი მარტივია:

```jsx
function handleFormSubmit(values) {
    // ერთი ფუნქცია ორივე რეჟიმს ემსახურება
    if (editedId === null) {
        ____________(values);
    } else {
        ____________(editedId, values);
    }

    closeForm();
}
```

და render-ის ბოლოს:

```jsx
{isFormOpen && (
    <Modal title={editedId === null ? "Add bookmark" : "Edit bookmark"} onClose={closeForm}>
        <BookmarkForm
            bookmark={______}
            onSubmit={______}
            onCancel={closeForm}
        />
    </Modal>
)}

{deletedId !== null && (
    <ConfirmModal
        title="Delete bookmark"
        message={`“${deletedTitle}” will be removed for good.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletedId(______)}
    />
)}
```

ბარათის `onDelete` ახლა აღარ შლის პირდაპირ — ის მხოლოდ `setDeletedId`-ს იძახებს. წაშლა დადასტურების შემდეგ ხდება.

### შემოწმება

1. **დამატება:** „Add bookmark" → ფორმა იხსნება, ფოკუსი პირველ ველშია. შეავსე და გაგზავნე — ბარათი სიის თავში ჩნდება, modal იხურება.
2. **ვალიდაცია:** ცარიელი ფორმა გააგზავნე — ორი შეცდომა ჩანს, modal **არ** იხურება. ველში ასოს აკრეფაზე შეცდომა ქრება.
3. **მისამართი:** ჩაწერე `react.dev` — ბარათზე ლინკი `https://react.dev`-ზე უნდა მიდიოდეს.
4. **Tag-ები:** ჩაწერე `React, react, Hooks` — ბარათზე ორი tag ჩანს.
5. **რედაქტირება:** ბარათზე ✏️ → ფორმა შევსებულია არსებული მონაცემით. შეცვალე სათაური → ბარათი განახლდა, **ახალი ბარათი არ დამატებულა**.
6. **ფორმის გასუფთავება:** დაამატე რამე, დახურე, თავიდან გახსენი — ველები ცარიელია.
7. **წაშლა:** 🗑 → დადასტურების ფანჯარა სათაურით. „Cancel" არაფერს შლის, „Delete" — შლის.
8. **Enter:** ფორმაში Enter-ის დაჭერა აგზავნის ფორმას (და არა უბრალოდ ახალ ხაზს).
9. **Refresh:** ყველა ცვლილება ადგილზეა.

## გავრცელებული შეცდომები

| შეცდომა | რა ხდება | გამოსწორება |
| --- | --- | --- |
| `event.preventDefault()` არ წერია | გვერდი გადაიტვირთება, მონაცემი იკარგება | submit handler-ის პირველი ხაზი |
| ღილაკს `type` არ აქვს ფორმაში | „Cancel"-ზე დაჭერა ფორმას აგზავნის | `type="button"` ყველგან, გარდა submit-ისა |
| `useState(getInitialValues(bookmark))` | ფუნქცია ყოველ render-ზე ეშვება | `useState(() => getInitialValues(bookmark))` |
| `value={bookmark.description}` როცა ველი `undefined`-ია | "A component is changing an uncontrolled input to be controlled" | `?? ""` |
| `input`-ის `name` არ ემთხვევა `values`-ის key-ს | ველი აკრეფაზე არ რეაგირებს | ერთი და იგივე სახელი ორივეგან |
| `setValues({ [name]: value })` | დანარჩენი სამი ველი ქრება | `{ ...current, [name]: value }` |
| `onClose` effect-ის dependency-ში არ წერია | Escape ძველ ფუნქციას იძახებს | `[onClose]` და ESLint-ის გაფრთხილების დაცვა |
| cleanup-ის გარეშე `addEventListener` | ყოველი გახსნა ახალ listener-ს ამატებს | `return () => removeEventListener(...)` |
| `document.body.style.overflow = ""` cleanup-ში | სხვისი სტილი იშლება | ძველი მნიშვნელობა დაიმახსოვრე |
| `onClick={onClose}` backdrop-ზე target-ის შემოწმების გარეშე | დიალოგში დაჭერა ხურავს ფორმას | `event.target === event.currentTarget` |
| modal-ის state-ში მთელი ობიექტი | რედაქტირების შემდეგ ძველი მონაცემი ჩანს | `id` ინახება, ობიექტი გამოითვლება |
| ვალიდაცია `onChange`-ზე | ჯერ არაფერი აკრეფილი გაქვს და ეკრანი უკვე წითელია | ვალიდაცია submit-ზე, გასუფთავება — აკრეფაზე |

## საბოლოო checklist

- `Button`-ს variant/size აქვს და დანარჩენ props-ებს `{...rest}`-ით გადასცემს
- `Modal`-ს Escape, ფონზე დაჭერა და ✕ ხურავს; სამივე effect-ს cleanup აქვს
- `ConfirmModal` `Modal`-ზეა აგებული და არა კოპირებული
- ვალიდაციის ლოგიკა `utils/validation.js`-შია და React-ს არ იცნობს
- ფორმა controlled-ია, ერთი `values` ობიექტით
- ყველა input-ს `id` + `<label htmlFor>` და შეცდომისას `aria-invalid` აქვს
- `App`-ის state-ში `id`-ებია და არა ობიექტები
- წაშლა დადასტურების გარეშე არ ხდება
- დროებითი „Add test" ღილაკი წაშლილია

commit: `Add modal, bookmark form and validation`

## შემდეგი ნაბიჯი

აპი ფუნქციურად სრულია. რჩება ის, რაც მას დასრულებულ პროდუქტად აქცევს: ლამაზი ჩატვირთვა, გასაგები ცარიელი მდგომარეობები და dark theme. ესაა ბოლო დოკუმენტი.
