# Bookmark Manager — ბარათი, სია და CRUD (ნაბიჯები 4–7)

2026-09-26 · @Someone

## სად ვართ და რას ვაშენებთ

მონაცემების ფენა მზადაა: `storageKeys.js` სახელებს ინახავს, `storage.js` კითხულობს და წერს, `useBookmarks` კი წყვეტს, როდის მოვითხოვოთ seed და როდის შევინახოთ. მზადაა `Tag`, `TagList` და `Layout` / `Header` / `Sidebar`.

მაგრამ ეკრანზე ჯერ კიდევ ერთი ხაზი წერია: `Bookmarks: 24`. მონაცემი გვაქვს, ჩვენება კი — არა. და რაც მთავარია, მომხმარებელი ვერაფერს ცვლის: ვერც ამატებს, ვერც შლის.

ამ დოკუმენტში ორ რამეს ვაკეთებთ: **მონაცემს ვაჩვენებთ** და **მონაცემს ვცვლით**. ოთხი ნაბიჯი, თითოეული წინაზეა დამოკიდებული:

1. **დამხმარე ფუნქციები:** ბარათს სჭირდება, რომ `https://www.react.dev/learn` გახდეს `react.dev`, ხოლო `2025-11-03T09:12:00.000Z` — `Nov 3, 2025`.
2. **ბარათი:** ერთი bookmark-ის ვიზუალი. სულ ერთია, რამდენი მათგანია — ჯერ ერთს ვაშენებთ.
3. **სია:** `.map()`, რომელიც ბარათებს ამრავლებს.
4. **CRUD:** ფუნქციები `useBookmarks`-ში, რომლებიც მასივს ცვლიან.

რატომ ამ თანმიმდევრობით? იმიტომ, რომ წაშლის ღილაკი ბარათზეა, ბარათი კი ჯერ არ არსებობს. ქვემოდან ზემოთ აშენება ნიშნავს, რომ ყოველ ნაბიჯზე გაქვს რაღაც, რისი ნახვაც ეკრანზე შეგიძლია.

**მთავარი წესი იგივეა:** აქ მზა კოდი არ არის. ყოველი ნაბიჯი ხსნის, რატომ გვჭირდება ფაილი, და გაძლევს template-ს hint-ებით. ცარიელ ადგილებს შენ ავსებ. თუ პასუხს კოპირებით მიიღებ, ლოგიკას ვერ ისწავლი.

**წინაპირობები:** ნაბიჯები 1–3 დასრულებული; React-ის props და `children`; `.map()`, `.filter()`, spread (`...`) და destructuring; CSS Modules.

**ფაილები:**

```
src/
├── utils/url.js                                 (ახალი)
├── utils/date.js                                (ახალი)
├── components/bookmarks/BookmarkCard.jsx        (ახალი)
├── components/bookmarks/BookmarkCard.module.css (ახალი)
├── components/bookmarks/BookmarkList.jsx        (ახალი)
├── components/bookmarks/BookmarkList.module.css (ახალი)
├── hooks/useBookmarks.js                        (ვაფართოებთ)
└── App.jsx                                      (ვაერთებთ)
```

ყოველი ნაბიჯის ბოლოს შემოწმებაა. სანამ ერთი ნაბიჯი არ იმუშავებს, შემდეგზე ნუ გადახვალ.

## ნაბიჯი 4: დამხმარე ფუნქციები — `utils/url.js` და `utils/date.js`

ბარათზე სრული მისამართი — `https://developer.mozilla.org/en-US/docs/Web/JavaScript` — არ გამოდგება: ის ორ ხაზს იკავებს და დიზაინს ანგრევს. მომხმარებელს ერთი რამ აინტერესებს: „ეს რომელი საიტია?" ანუ `developer.mozilla.org`.

იგივე თარიღზე. seed-ში წერია `"2025-11-03T09:12:00.000Z"` — ეს კომპიუტერის ფორმატია. ადამიანს `Nov 3, 2025` სჭირდება.

რატომ ცალკე ფაილში და არა პირდაპირ კომპონენტში? იმიტომ, რომ ამ ფუნქციებს React-თან არაფერი აქვთ საერთო: შედის string, გამოდის string. ასეთი კოდი კომპონენტის გარეთ ცხოვრობს — ერთხელ იწერება, ბევრგან გამოიყენება და მისი შემოწმება console-ში ერთი ხაზით შეიძლება.

### მისამართი

```js
// "https://www.react.dev/learn" → "react.dev"
export function ____________(value) {
    try {
        // URL კონსტრუქტორი მისამართს ნაწილებად შლის (MDN: URL)
        const parsed = new ______(value);

        // რომელი property აბრუნებს მხოლოდ დომენს, გზის გარეშე?
        // "www." პრეფიქსი ზედმეტია — replace-ით მოაშორე
        return parsed.____________.replace(/^www\./, "");
    } catch {
        // არავალიდურ მისამართზე new URL() შეცდომას აგდებს.
        // ბარათი ამის გამო არ უნდა ჩავარდეს — დააბრუნე თავად ტექსტი
        return ______;
    }
}

// ბარათის ავატარისთვის: "react.dev" → "R"
export function ____________(value) {
    // ზემოთა ფუნქციას იყენებ და არა value-ს პირველ ასოს:
    // "https://react.dev"-ის პირველი ასო "h" იქნებოდა
    const hostname = ____________(value);

    // ?? — თუ hostname ცარიელია, სიმბოლო მაინც გვჭირდება
    return (hostname[0] ?? "?").toUpperCase();
}
```

### თარიღი

```js
// ფორმატერი მოდულის დონეზე იქმნება და არა ფუნქციის შიგნით:
// მისი შექმნა ძვირია, ჩვენ კი ის ყოველ ბარათზე დაგვჭირდება
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "______",   // "numeric" → 2025
    month: "______",  // რომელი მნიშვნელობა იძლევა "Nov"-ს და არა "November"-ს?
    day: "______",
});

// "2025-11-03T09:12:00.000Z" → "Nov 3, 2025"
export function ____________(value) {
    // string → Date ობიექტი
    const date = new ______(value);

    // არავალიდურ თარიღზე Date შეცდომას არ აგდებს — ის "Invalid Date" ხდება.
    // getTime() ასეთ შემთხვევაში NaN-ს აბრუნებს
    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    // ფორმატერის მეთოდი, რომელიც Date-ს ტექსტად აქცევს
    return DATE_FORMATTER.______(date);
}
```

**რა უნდა შეისწავლო:** `new URL()` და მისი property-ები — `hostname`, `pathname`, `protocol` (MDN); `Intl.DateTimeFormat`; რატომ `Number.isNaN` და არა გლობალური `isNaN`; `??` ოპერატორი; რეგულარული გამოსახულება `/^www\./` — რას ნიშნავს `^` და `\.`.

**შემოწმება:** ორივე ფუნქცია დროებით `App.jsx`-ში შემოიტანე და **კომპონენტის გარეთ** დაბეჭდე:

1. `getHostname("https://www.react.dev/learn")` → `"react.dev"`
2. `getHostname("not a url")` → `"not a url"` (და არა თეთრი ეკრანი)
3. `formatDate("2025-11-03T09:12:00.000Z")` → `"Nov 3, 2025"`
4. `formatDate("გამარჯობა")` → `"—"`

შემოწმების შემდეგ დროებითი კოდი წაშალე.

## ნაბიჯი 5A: ბარათი — `BookmarkCard`, ჩვენება

ახლა ყველაფერი გვაქვს ერთი bookmark-ის დასახატად. ამ ნაწილს კომპონენტი სჭირდება, რადგან 24-ჯერ ერთი და იმავე markup-ის დაწერა შეუძლებელია.

**ყველაზე მნიშვნელოვანი წესი ამ ნაბიჯზე: ბარათს საკუთარი state არ აქვს და არც localStorage-ს ეხება.** მას props-ით შემოდის მონაცემი და props-ითვე შემოდის ფუნქციები, რომლებსაც მოვლენებზე იძახებს. ასეთ კომპონენტს „presentational" ან „dumb" ჰქვია: ის მხოლოდ ხატავს. სანამ ის არაფერს წყვეტს, მისი გატესტვა და თავიდან გამოყენება ადვილია.

```jsx
import { TagList } from "../ui/TagList";
import { ____________, ____________ } from "../../utils/url";
import { ____________ } from "../../utils/date";
import styles from "./BookmarkCard.module.css";

export function BookmarkCard({ ____________ }) {
    // destructuring ერთხელ, რომ ქვემოთ bookmark.title, bookmark.url... არ გაიმეორო
    const { title, url, description, tags, isPinned, visitCount, createdAt } =
        ____________;

    return (
        // <div> არა: ბარათი დამოუკიდებელი, თვითკმარი შიგთავსია.
        // HTML-ს ამისთვის საკუთარი ტეგი აქვს — რომელი?
        <________ className={styles.card}>
            <span className={styles.avatar} aria-hidden="true">
                {____________(url)}
            </span>

            {/* ბარათის სათაური. <h1> ზემოთ Header-შია, ამიტომ აქ h1 არ შეიძლება:
                სათაურების დონეები თანმიმდევრულად უნდა ჩამოდიოდეს */}
            <__ className={styles.title}>
                <a
                    href={______}
                    // ბმული ახალ ჩანართში
                    target="______"
                    // target="_blank"-ს წყვილი აქვს, რომლის გარეშე ახალ გვერდს
                    // window.opener-ზე წვდომა რჩება (MDN: rel)
                    rel="______"
                >
                    {______}
                </a>
            </__>

            <p className={styles.host}>{____________(url)}</p>

            {/* description შეიძლება ცარიელი იყოს — მაშინ <p> საერთოდ არ გვინდა */}
            {description && <p className={styles.description}>{______}</p>}

            {/* მზა კომპონენტი, თავიდან ნუ დაწერ */}
            <________ tags={______} />

            <footer className={styles.footer}>
                {/* ყურადღება: {visitCount && ...} აქ არ გამოდგება.
                    რატომ? სცადე ბარათზე, სადაც visitCount არის 0 */}
                <span>{______} visits</span>
                <span>Added {____________(createdAt)}</span>

                {/* isPinned არის true/false, ამიტომ && აქ უსაფრთხოა */}
                {isPinned && <span className={styles.pinBadge}>Pinned</span>}
            </footer>
        </________>
    );
}
```

**სტილები — `BookmarkCard.module.css`.** მზა CSS აქ არ მოგცემ, მაგრამ ორი წესი დაიცავი:

- **ფერები და ზომები `theme.css`-ის ცვლადებიდან აიღე** (`var(--color-surface)`, `var(--space-4)`, `var(--radius-lg)`, `var(--font-sm)`). ახალი ჰექს-კოდი ფაილში არ უნდა გაჩნდეს — თორემ მე-8 ნაბიჯზე, როცა dark theme დაემატება, ბარათი თეთრი დარჩება.
- **ბარათის სიმაღლე `height: 100%`** — სიაში გვერდიგვერდ მდგარი ბარათები ერთ დონეზე უნდა მთავრდებოდეს.

**რა უნდა შეისწავლო:** props და destructuring; conditional rendering `&&`-ით და მისი ხაფანგი რიცხვებთან; სემანტიკური ტეგები (`article`, `footer`, სათაურების იერარქია); `target="_blank"` და `rel="noreferrer"`; `aria-hidden`.

**შემოწმება:** `App.jsx`-ში დროებით დახატე ერთი ბარათი:

```jsx
<BookmarkCard bookmark={bookmarks[0]} />
```

- ბარათზე ჩანს სათაური, დომენი, აღწერა, tag-ები, ვიზიტები და თარიღი.
- სათაურზე დაჭერა ახალ ჩანართში ხსნის საიტს.
- შეამოწმე ბარათი, სადაც `visitCount` არის 0 (`bookmarks[15]`) — ეკრანზე მარტოხელა `0` არ უნდა ჩანდეს.
- console სუფთაა.

## ნაბიჯი 5B: ბარათი — მოქმედებების ღილაკები

ბარათი ჩანს, მაგრამ მასზე ვერაფერს აკეთებ. გვჭირდება ოთხი ღილაკი: მიმაგრება, არქივი, რედაქტირება, წაშლა.

აქ მთავარი კითხვაა: **ვინ შლის bookmark-ს?** ბარათი ვერ წაშლის — მასივი მასთან არ არის, ის `useBookmarks`-შია. ამიტომ ბარათი მხოლოდ **ატყობინებს**: „ამ id-ზე წაშლა დააჭირეს". ვინც სიას ფლობს, ის წყვეტს, რა მოხდეს.

ამ შეტყობინების გზა props-ია. ისეთ props-ს, რომელიც ფუნქციაა და მოვლენაზე გამოიძახება, `on`-ით იწყებენ: `onDelete`, `onEdit`. მონაცემი ქვევით მიდის, მოვლენა — ზევით.

```jsx
export function BookmarkCard({
    bookmark,
    // ოთხი ფუნქცია, რომელსაც ბარათი იძახებს, მაგრამ არ წერს
    ____________,
    ____________,
    ____________,
    ____________,
}) {
    const { id, title /* ... */ } = bookmark;

    // ...

    <div className={styles.actions}>
        {/* ყურადღება: onClick={onTogglePinned(id)} ფუნქციას მაშინვე გამოიძახებს
            render-ის დროს. ჩვენ ღილაკს ფუნქცია უნდა გადავცეთ და არა შედეგი */}
        <button
            type="button"
            onClick={() => ____________(id)}
            // ღილაკში მხოლოდ იკონია, ტექსტი არ წერია.
            // screen reader-ისთვის სახელი მაინც საჭიროა
            aria-label={isPinned ? "Unpin bookmark" : "Pin bookmark"}
            // მდგომარეობა მხოლოდ ფერით არ უნდა გადმოვცეთ
            aria-pressed={______}
        >
            📌
        </button>

        {/* დანარჩენი სამი იმავე პრინციპით: archive, edit, delete */}
    </div>
```

იკონებად ჯერ emoji-ც გამოდგება (📌 🗄 ✏️ 🗑) — SVG იკონები მოგვიანებით შეგიძლია ჩაანაცვლო.

**რატომ გადავცემთ `id`-ს და არა მთელ ობიექტს?** იმიტომ, რომ მიმღებს მეტი არაფერი სჭირდება: `id` საკმარისია, რომ მასივში სწორი ჩანაწერი იპოვოს. რაც ნაკლებს გადასცემ, მით ნაკლებია შანსი, რომ „ძველი" ობიექტი გადასცე.

**რა უნდა შეისწავლო:** callback props და კონვენცია `onSomething`; სხვაობა `onClick={fn}`, `onClick={fn()}` და `onClick={() => fn(id)}` შორის; `aria-label` და `aria-pressed`; რატომ სჭირდება `<button>`-ს `type="button"` ფორმის შიგნით.

**შემოწმება:** ოთხივე ღილაკს დროებით `console.log`-იანი ფუნქცია გადაეცი:

```jsx
<BookmarkCard
    bookmark={bookmarks[0]}
    onDelete={(id) => console.log("delete", id)}
    /* ... */
/>
```

- გვერდის ჩატვირთვისას console ცარიელია. **თუ იქ უკვე წერია "delete" — `onClick`-ში ფრჩხილები გაქვს და ფუნქცია მაშინვე გამოიძახე.**
- დაჭერაზე იბეჭდება სწორი id.
- Tab-ით ღილაკებზე გადაადგილება მუშაობს და ფოკუსი თვალით ჩანს.

## ნაბიჯი 6: სია — `BookmarkList`

ერთი ბარათი გვაქვს. ახლა 24 გვჭირდება.

`.map()` პირდაპირ `App`-შიც დაიწერებოდა, მაგრამ `App`-ს უკვე სამი მდგომარეობა აქვს, მალე კი ფილტრები და modal-ებიც დაემატება. სიას საკუთარი ფაილი სჭირდება, რომ ერთ ადგილას იყოს ორი რამ: **მარყუჟი** და **სიის განლაგება (grid)**.

```jsx
import { BookmarkCard } from "./BookmarkCard";
import styles from "./BookmarkList.module.css";

export function BookmarkList({ bookmarks, onEdit, onDelete, /* ... */ }) {
    return (
        // სია სიაა — <ul>, შიგნით <li>
        <__ className={styles.list}>
            {bookmarks.______((bookmark) => (
                // key <li>-ზეა და არა BookmarkCard-ზე:
                // key ყოველთვის იმ ელემენტზეა, რომელსაც map პირდაპირ აბრუნებს
                <__ key={____________}>
                    <BookmarkCard
                        bookmark={____________}
                        // ფუნქციები უცვლელად მიდის ქვევით
                        onEdit={______}
                        onDelete={______}
                        /* ... */
                    />
                </__>
            ))}
        </__>
    );
}
```

**`key` — რატომ არა `index`.** წარმოიდგინე, რომ პირველ ბარათს შლი. `index`-ით: მეორე ბარათი ახლა 0 ინდექსზეა, ანუ React-ისთვის „ელემენტი 0" არსებობს, უბრალოდ შიგთავსი შეეცვალა. ამიტომ ის ძველ DOM კვანძს ხელახლა იყენებს: ანიმაცია არასწორ ბარათზე დარჩება, ფოკუსი სხვა ღილაკზე გადახტება, ფორმაში აკრეფილი ტექსტი მეზობელ ბარათს გადაჰყვება. `id`-ით React-მა ზუსტად იცის, რომელი ჩანაწერი გაქრა.

**სტილები.** სია grid-ია. ერთი ხაზი, რომელიც ბარათების რაოდენობას ავტომატურად არგებს ეკრანს:

```css
.list {
    display: grid;
    grid-template-columns: repeat(______, minmax(19rem, 1fr));
    gap: var(--space-4);
}
```

`auto-fill` თუ `auto-fit`? ორივე სცადე ვიწრო ეკრანზე და ნახე, რით განსხვავდებიან.

**რა უნდა შეისწავლო:** `.map()` JSX-ში; `key` და რეკონსილიაცია (react.dev — „Rendering Lists"); CSS Grid და `minmax()`; `repeat(auto-fill, ...)` vs `auto-fit`.

**შემოწმება:** `App.jsx`-ში ერთი ბარათი სიით ჩაანაცვლე.

- ეკრანზე 24 ბარათია.
- console-ში **არ** წერია `Each child in a list should have a unique "key" prop`.
- ფანჯრის დავიწროებაზე სვეტები 3 → 2 → 1 ხდება.

## ნაბიჯი 7A: CRUD — ჯერ ერთი წესი

სია ჩანს. ახლა მისი შეცვლა გვინდა. სანამ პირველ ფუნქციას დავწერთ, ერთი წესი უნდა გვესმოდეს, თორემ ოთხივე ფუნქცია ერთი და იმავე მიზეზით არ იმუშავებს.

**React მასივებს არ „ათვალიერებს" — ის reference-ს ადარებს.** `setBookmarks`-ს რომ იგივე მასივი გადასცე, უბრალოდ სხვა შიგთავსით, React იტყვის „იგივეა" და ეკრანს არ გადახატავს. იგივე ეხება ჩვენს შენახვის effect-საც: `[bookmarks]` dependency-ში ცვლილებას ვერ დაინახავს და localStorage ძველი დარჩება.

ამიტომ **ყოველი ცვლილება ახალ მასივს ქმნის**:

| ნაცვლად | დაწერე |
| --- | --- |
| `bookmarks.push(item)` | `[...current, item]` ან `[item, ...current]` |
| `bookmarks.splice(i, 1)` | `current.filter(...)` |
| `bookmark.isPinned = true` | `{ ...bookmark, isPinned: true }` |
| `bookmarks.sort(...)` | `[...current].sort(...)` — `sort` ორიგინალს ცვლის! |

და კიდევ ერთი: setter-ს **ფუნქციას** გადავცემთ და არა მზა მნიშვნელობას.

```js
setBookmarks(bookmarks.filter(...));        // ❌ bookmarks შეიძლება ძველი იყოს
setBookmarks((current) => current.filter(...));  // ✅ current ყოველთვის უახლესია
```

სხვაობა ჩანს მაშინ, როცა ორი ცვლილება ერთმანეთის მიყოლებით ხდება: პირველი ვარიანტი მეორე ცვლილებას „გადააწერს".

## ნაბიჯი 7B: დამატება

ახალ bookmark-ს იგივე ფორმა უნდა ჰქონდეს, რაც seed-ის ჩანაწერებს. თუ `tags`-ს დაავიწყდები, პირველივე `TagList` ჩავარდება `Cannot read properties of undefined (reading 'map')`-ით — და ეს შეცდომა ბარათში ამოხტება, არა იქ, სადაც შეცდომა დაუშვი.

ობიექტის შექმნა ცალკე ფუნქციაშია, კომპონენტის გარეთ: მას state არ სჭირდება.

```js
// hook-ის ზემოთ, ფაილის დონეზე
function createBookmark({ title, url, description, tags }) {
    return {
        // უნიკალური id ბრაუზერის API-დან.
        // შეამოწმე, რა ტიპისაა seed-ის id შენს bookmarks.json-ში
        // და დარწმუნდი, რომ ახალიც იგივე ტიპისაა — თორემ === ვეღარ იმუშავებს
        id: ,

        title,
        url,
        description,
        tags,

        // ახალი ჩანაწერი არც მიმაგრებულია და არც დაარქივებული
        isPinned: ,
        isArchived: ,

        // ახლანდელი დრო ISO ფორმატში — იგივე ფორმატი, რაც seed-შია
        createdAt: new Date().--------,

        visitCount: ,
        // ჯერ არასდროს გახსნილა. "არასდროს"-ს რა მნიშვნელობა გამოხატავს?
        lastVisitedAt: ,
    };
}
```

```js
// useBookmarks-ის შიგნით, effect-ების ქვემოთ, return-ის ზემოთ
function addBookmark(values) {
    // ახალი სიის თავში — მომხმარებელს ახლადდამატებული მაშინვე უნდა დაინახოს
    setBookmarks((current) => [____________, ...current]);
}
```

**აქ `saveToStorage` არ დაგჭირდება.** ნაბიჯ 3B-ის effect `bookmarks`-ის ყოველ ცვლილებაზე ეშვება და შენახვას თავად აიტანს. ეს სწორედ ის მოგებაა, რისთვისაც ის effect დავწერეთ: CRUD ფუნქციები მხოლოდ სიას ცვლიან, შენახვაზე არ ფიქრობენ.

## ნაბიჯი 7C: რედაქტირება და წაშლა

```js
// changes არის ობიექტი მხოლოდ იმ ველებით, რომლებიც იცვლება:
// { title: "ახალი სათაური" }
function updateBookmark(id, changes) {
    setBookmarks((current) =>
        current.______((bookmark) =>
            // რომელი ჩანაწერია საჭირო?
            bookmark.id === ______
                // spread-ის რიგი მნიშვნელოვანია: რომელი უნდა იყოს მეორე,
                // რომ ახალმა მნიშვნელობებმა ძველი გადაფაროს?
                ? { ...______, ...______ }
                // დანარჩენები უცვლელად ბრუნდება
                : bookmark,
        ),
    );
}

function deleteBookmark(id) {
    // filter აბრუნებს მათ, ვისზეც პირობა true-ა.
    // ჩვენ გვინდა ყველა, გარდა ერთისა
    setBookmarks((current) => current.______((bookmark) => ______));
}
```

`map` აქ ყოველთვის 24-ვე ელემენტს აბრუნებს — უბრალოდ ერთი მათგანი ახალი ობიექტია, დანარჩენები კი იგივე ობიექტებია. ესეც კარგია: React-ისთვის ცვლილება მხოლოდ ერთ ბარათზე მოხდა.

## ნაბიჯი 7D: მიმაგრება, არქივი, ვიზიტი

სამივე იგივე `map`-ის ნიმუშია, უბრალოდ სხვა ველი იცვლება.

```js
function togglePinned(id) {
    setBookmarks((current) =>
        current.map((bookmark) =>
            bookmark.id === id
                // "გადართვა" ნიშნავს: ახლანდელის საპირისპირო
                ? { ...bookmark, isPinned: ______ }
                : bookmark,
        ),
    );
}

function toggleArchived(id) {
    setBookmarks((current) =>
        current.map((bookmark) =>
            bookmark.id === id
                ? {
                      ...bookmark,
                      isArchived: ______,
                      // არქივში გადატანისას მიმაგრება უნდა მოიხსნას:
                      // არქივი სიის თავში არ უნდა ჩანდეს
                      isPinned: ______,
                  }
                : bookmark,
        ),
    );
}

// ეს ფუნქცია მაშინ გამოიძახება, როცა მომხმარებელი ბმულს გახსნის
function registerVisit(id) {
    setBookmarks((current) =>
        current.map((bookmark) =>
            bookmark.id === id
                ? {
                      ...bookmark,
                      visitCount: ____________,
                      lastVisitedAt: ____________,
                  }
                : bookmark,
        ),
    );
}
```

`registerVisit`-ის გამოსაძახებლად ბარათს კიდევ ერთი callback prop სჭირდება — `onVisit` — რომელსაც `<a>`-ს `onClick` იძახებს. `event.preventDefault()` აქ **არ** გვინდა: ბმულმა ჩვეულებრივად უნდა იმუშაოს, ჩვენ მხოლოდ მთვლელს ვზრდით.

## ნაბიჯი 7E: return და `App`-თან მიერთება

hook-ის `return` უნდა გაიზარდოს:

```js
return {
    bookmarks,
    isLoading,
    error,
    // ექვსივე ფუნქცია
    ____________,
    ____________,
    ____________,
    ____________,
    ____________,
    ____________,
};
```

`App`-ში ისინი destructuring-ით ამოგაქვს და `BookmarkList`-ს გადასცემ. `App` თავად არაფერს ცვლის — ის შუამავალია.

**როგორ გავტესტოთ `addBookmark`, როცა ფორმა ჯერ არ გვაქვს?** დროებითი ღილაკით:

```jsx
{/* TEMP — ფორმის გაკეთების შემდეგ წაიშლება */}
<button
    onClick={() =>
        addBookmark({
            title: "Test bookmark",
            url: "https://example.com",
            description: "Temporary",
            tags: ["Test"],
        })
    }
>
    Add test
</button>
```

### შემოწმება

1. **წაშლა:** ბარათი ქრება. DevTools → Application → Local Storage-ში ჩანაწერიც ქრება.
2. **Refresh:** წაშლილი ბარათი აღარ ბრუნდება (ანუ შენახვა მუშაობს).
3. **მიმაგრება:** „Pinned" badge ჩნდება და ქრება; refresh-ის შემდეგ მდგომარეობა რჩება.
4. **დამატება:** ახალი ბარათი სიის თავშია, `0 visits`-ით და დღევანდელი თარიღით. storage-ში მისი `id` uuid-ია.
5. **არქივი:** მიმაგრებული ბარათის დაარქივებაზე „Pinned" badge ქრება.
6. **ვიზიტი:** ბმულზე დაჭერის შემდეგ (დაბრუნდი ჩანართში) მთვლელი ერთით გაიზარდა.
7. **console სუფთაა** — არც key-ის warning, არც შეცდომა.

## გავრცელებული შეცდომები

| შეცდომა | რა ხდება | გამოსწორება |
| --- | --- | --- |
| `onClick={onDelete(id)}` | ბარათები გვერდის ჩატვირთვისთანავე იშლება ან უსასრულო render იწყება | `onClick={() => onDelete(id)}` |
| `key={index}` | წაშლის შემდეგ არასწორი ბარათი „ცოცხლდება" | `key={bookmark.id}` |
| `key` `BookmarkCard`-ზე, `<li>`-ის ნაცვლად | React-ის warning რჩება | key იმ ელემენტზეა, რომელსაც `map` აბრუნებს |
| `bookmarks.push(newItem)` | ეკრანი არ იცვლება | `setBookmarks((current) => [newItem, ...current])` |
| `bookmark.isPinned = !bookmark.isPinned` | state იცვლება, render არა | `{ ...bookmark, isPinned: !bookmark.isPinned }` |
| `setBookmarks(bookmarks.filter(...))` | ორი სწრაფი ცვლილებიდან ერთი იკარგება | functional setter: `(current) => ...` |
| `saveToStorage` ყოველ CRUD ფუნქციაში | გამეორება, ზოგჯერ ორმაგი ჩაწერა | 3B-ის effect უკვე ინახავს |
| `{visitCount && <span>...</span>}` | ბარათზე მარტოხელა `0` ჩნდება | `{visitCount > 0 && ...}` — `&&` ცრუ მნიშვნელობას ბეჭდავს |
| `{ ...changes, ...bookmark }` | რედაქტირება არაფერს ცვლის | ბოლო spread იმარჯვებს — `changes` მეორე უნდა იყოს |
| ახალ ობიექტში `tags` აკლია | `Cannot read properties of undefined (reading 'map')` | ახალ ჩანაწერს seed-ის იდენტური ფორმა უნდა ჰქონდეს |
| `id: Date.now()` | ორი სწრაფი დამატება ერთსა და იმავე id-ს იღებს | `crypto.randomUUID()` |
| `target="_blank"` `rel`-ის გარეშე | უსაფრთხოების გაფრთხილება | `rel="noreferrer"` |
| icon-only ღილაკი ტექსტის გარეშე | screen reader ამბობს უბრალოდ „button" | `aria-label="Delete bookmark"` |

## საბოლოო checklist

ოთხივე ნაბიჯი დასრულებულად ჩაითვლება, თუ:

- `BookmarkCard`-ს არც `useState` აქვს, არც `localStorage`-ს ეხება — მხოლოდ props
- ყველა callback prop `on`-ით იწყება და `onClick`-ში ფუნქცია გადაეცემა, შედეგი არა
- `key={bookmark.id}` და არა `key={index}`
- არსად წერია `push`, `splice`, `sort` პირდაპირ state-ზე; ყველა ცვლილება ახალ მასივს ქმნის
- ყველა setter functional ფორმაშია
- CRUD ფუნქციებში `saveToStorage` არ წერია — შენახვას effect აიტანს
- ახალ bookmark-ს seed-ის იდენტური ფორმა და იმავე ტიპის `id` აქვს
- ფერები და ზომები `theme.css`-ის ცვლადებიდან მოდის
- ყველა დროებითი `console.log` და ტესტის ღილაკი წაშლილია

ამ ეტაპზე git commit გააკეთე. commit message-ში დაწერე, რა გააკეთა ცვლილებამ და არა რომელი ფაილი შეიცვალა, მაგალითად: `Add bookmark card, list and CRUD operations`.

## შემდეგი ნაბიჯი

ახლა 24 ბარათია ეკრანზე და მათში ვერაფერს პოულობ. შემდეგი დოკუმენტი ძებნაზე, ფილტრსა და სორტირებაზეა:

1. `utils/bookmarkQuery.js` — სუფთა ფუნქციები: ფილტრი და სორტირება
2. `SearchBar`, `SortSelect`, `TagFilter` — controlled კომპონენტები
3. `useMemo` — და მთავარი წესი: **state-ში ნუ შეინახავ იმას, რაც უკვე არსებული state-იდან გამოითვლება.** გაფილტრული სია `bookmarks` + `searchTerm` + `selectedTag`-იდან render-ის დროს გამოითვლება, ცალკე `useState` მას არ სჭირდება.
