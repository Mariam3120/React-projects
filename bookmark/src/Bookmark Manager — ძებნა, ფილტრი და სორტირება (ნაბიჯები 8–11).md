# Bookmark Manager — ძებნა, ფილტრი და სორტირება (ნაბიჯები 8–11)

2026-09-26 · @Someone

## სად ვართ და რას ვაშენებთ

ეკრანზე 24 ბარათია, მათი დამატება, რედაქტირება და წაშლა შეგიძლია. მაგრამ სცადე იპოვო ის ერთი ბმული CSS-ზე, რომელიც სამი თვის წინ შეინახე — თვალით ეძებ. სწორედ აქედან იწყება ნამდვილი bookmark მენეჯერი.

გვჭირდება ოთხი რამ: **ძებნა** ტექსტით, **ფილტრი** tag-ით, **ხედები** (ყველა / მიმაგრებული / არქივი) და **სორტირება**.

ამ დოკუმენტის მთავარი იდეა ერთ წესშია:

> **state-ში ნუ შეინახავ იმას, რაც უკვე არსებული state-იდან გამოითვლება.**

ცდუნება ასეთია: „გავაკეთებ `const [filteredBookmarks, setFilteredBookmarks] = useState([])`-ს და ძებნისას განვაახლებ". ეს მალევე იშლება: bookmark-ს შლი — `bookmarks` შეიცვალა, `filteredBookmarks` კი ძველი დარჩა და წაშლილი ბარათი ეკრანზე ისევ ჩანს. ორი სიმართლის წყარო ყოველთვის ერთმანეთს გადაემტერება.

სწორი გზა: state-ში ინახება მხოლოდ **არჩევანი** (რა აკრიფა, რომელი tag აირჩია, როგორ დაალაგა), გაფილტრული სია კი ყოველ render-ზე **გამოითვლება**.

ოთხი ნაბიჯი:

1. **სახელები:** ხედებისა და სორტირების ვარიანტები ერთ ფაილში.
2. **ლოგიკა:** სუფთა ფუნქციები, რომლებსაც React არ სჭირდებათ.
3. **ხელსაწყოები:** controlled კომპონენტები — ძებნის ველი, select, ფილტრები.
4. **შეერთება:** `App`, `useMemo` და derived state.

**მთავარი წესი იგივეა:** მზა კოდი აქ არ არის — template-ებია hint-ებით, ცარიელ ადგილებს შენ ავსებ.

**წინაპირობები:** ნაბიჯები 1–7 დასრულებული; `.filter()`, `.sort()`, `.includes()`; `Map`; controlled inputs (თუ არ იცნობ — ნაბიჯი 10 ახსნის).

**ფაილები:**

```
src/
├── constants/views.js                         (ახალი)
├── constants/sortOptions.js                   (ახალი)
├── utils/bookmarkQuery.js                     (ახალი)
├── components/controls/SearchBar.jsx + .css   (ახალი)
├── components/controls/SortSelect.jsx + .css  (ახალი)
├── components/controls/TagFilter.jsx + .css   (ახალი)
├── components/controls/ViewFilter.jsx + .css  (ახალი)
└── App.jsx                                    (ვაერთებთ)
```

## ნაბიჯი 8: სახელები — `constants/views.js` და `constants/sortOptions.js`

ხედი სამია: ყველა, მიმაგრებული, არქივი. სორტირება ხუთი: ახლები, ძველები, სათაურით, ყველაზე ნახული, ბოლოს ნანახი.

ეს მნიშვნელობები კოდში სამ ადგილას გაჩნდება: state-ის საწყის მნიშვნელობაში, ღილაკის `onClick`-ში და ფილტრის ფუნქციაში. თუ ერთგან `"pinned"` დაწერე, მეორეგან `"Pinned"` — აპი შეცდომას არ გაჩვენებს, უბრალოდ სია ცარიელი დარჩება. ეს იგივე პრობლემაა, რაც ნაბიჯ 1-ზე localStorage-ის key-ებთან გვქონდა, და გადაწყვეტაც იგივეა.

```js
// constants/views.js
export const VIEWS = Object.freeze({
    ALL: "______",
    PINNED: "______",
    ARCHIVED: "______",
});

// sidebar-ის ღილაკებიც და header-ის სათაურიც ერთი და იმავე სიიდან იხატება.
// ასე ახალი ხედის დამატება ერთი ობიექტის დამატებაა და არა ხუთი ფაილის შეცვლა
export const VIEW_OPTIONS = Object.freeze([
    {
        value: VIEWS.______,
        label: "All",              // ღილაკზე — მოკლე
        heading: "All bookmarks",  // header-ში — სრული
        icon: "📋",
    },
    // დანარჩენი ორი იმავე ფორმით
]);

// header-ს სჭირდება: "ამ value-ს რომელი ობიექტი შეესაბამება?"
export function getViewOption(view) {
    // .find() აბრუნებს undefined-ს, თუ ვერაფერს იპოვა —
    // ?? ოპერატორით დააზღვიე, რომ header სათაურის გარეშე არ დარჩეს
    return VIEW_OPTIONS.find((option) => option.______ === view) ?? ______;
}
```

```js
// constants/sortOptions.js
export const SORT_OPTIONS = Object.freeze({
    NEWEST: "newest",
    OLDEST: "______",
    TITLE: "______",
    MOST_VISITED: "______",
    RECENT_VISIT: "______",
});

// <select>-ის <option>-ები ამ სიიდან დაიხატება .map()-ით
export const SORT_OPTION_LIST = Object.freeze([
    { value: SORT_OPTIONS.NEWEST, label: "Newest first" },
    // დანარჩენი ოთხი
]);
```

**რა უნდა შეისწავლო:** რატომ `Object.freeze` მასივზეც; computed property (`[SORT_OPTIONS.NEWEST]: ...`) — მე-9 ნაბიჯზე დაგჭირდება; `.find()` და მისი დაბრუნებული მნიშვნელობა.

**შემოწმება:** ფაილები თავისით არაფერს აკეთებენ. `console.log(VIEW_OPTIONS.length)` → `3`, `getViewOption("არარსებული")` → პირველი ხედის ობიექტი და არა `undefined`.

## ნაბიჯი 9A: ლოგიკა — სამი პატარა ფუნქცია

ახლა ყველაზე მნიშვნელოვანი ფაილი: `utils/bookmarkQuery.js`. აქ React არ არის, hook-ები არ არის — მხოლოდ მასივები შედის და მასივები გამოდის. ასეთ ფუნქციას **სუფთა ფუნქცია** ჰქვია: ერთი და იგივე არგუმენტი ყოველთვის ერთსა და იმავე შედეგს იძლევა და გარე სამყაროს არაფერს უცვლის.

რატომ არის ეს კარგი? იმიტომ, რომ ასეთი კოდის შემოწმება ბრაუზერის გარეშეც შეგიძლია, და როცა ფილტრი გაფუჭდება, ზუსტად იცი, სად ეძებო.

დავიწყოთ სამი პატარა ფუნქციით. თითოეული ერთ კითხვაზე პასუხობს: „ეს კონკრეტული bookmark უნდა ჩანდეს თუ არა?"

```js
import { VIEWS } from "../constants/views";
import { SORT_OPTIONS } from "../constants/sortOptions";

// ფუნქცია არ არის export-ული: ის მხოლოდ ამ ფაილში გამოიყენება.
// რაც ნაკლებს export-ავ, მით ნაკლებს ინახავ თავში
function matchesView(bookmark, view) {
    if (view === VIEWS.ARCHIVED) {
        // არქივში მხოლოდ დაარქივებულები
        return ____________;
    }

    if (view === VIEWS.PINNED) {
        // მიმაგრებული, მაგრამ არა დაარქივებული — ორი პირობა
        return ____________ && ____________;
    }

    // "ყველა" სინამდვილეში ნიშნავს "ყველა, გარდა არქივისა"
    return ____________;
}

// term-ს უკვე დამუშავებულს ვიღებთ (trim + lowercase).
// რატომ? იმიტომ, რომ ეს ფუნქცია 24-ჯერ გამოიძახება და
// ერთსა და იმავე სამუშაოს 24-ჯერ გაიმეორებდა
function matchesSearch(bookmark, term) {
    if (term === "") {
        // ცარიელი ძებნა ყველას ატარებს
        return ______;
    }

    // ერთ დიდ ტექსტად შეაერთე ყველაფერი, რაშიც ძებნა უნდა მოხდეს:
    // სათაური, აღწერა, მისამართი და tag-ები (tags მასივია — spread)
    const haystack = [
        bookmark.title,
        ____________,
        ____________,
        ...____________,
    ]
        .join(" ")
        .____________();  // რეგისტრი მნიშვნელობა არ უნდა ჰქონდეს

    return haystack.____________(term);
}

function matchesTag(bookmark, tag) {
    // tag === null ნიშნავს "ფილტრი არ არის არჩეული"
    return tag === ______ || bookmark.tags.____________(tag);
}
```

## ნაბიჯი 9B: სორტირება და მთავარი ფუნქცია

`.sort()`-ს კომპარატორი სჭირდება: ფუნქცია, რომელიც ორ ელემენტს ადარებს და აბრუნებს უარყოფითს (a ადრე), დადებითს (b ადრე) ან 0-ს.

- **რიცხვებისთვის** — გამოკლება: `a - b` ზრდადობით, `b - a` კლებადობით.
- **თარიღებისთვის** — ჯერ რიცხვად აქციე: `new Date(value).getTime()`.
- **ტექსტისთვის** — `a.localeCompare(b)` და არა `a > b`: `localeCompare`-მა იცის, რომ "ä" და "a" მეზობლები არიან.

```js
// null და undefined თარიღები: ახალ bookmark-ს lastVisitedAt არა აქვს
function toTime(value) {
    // თუ მნიშვნელობა არ არსებობს, 0 დააბრუნე — ის სიის ბოლოში აღმოჩნდება
    return value ? new Date(value).getTime() : ______;
}

// ობიექტი, სადაც key სორტირების სახელია, value კი კომპარატორი.
// ასე if/else-ის კიბეს ვერიდებით
const COMPARATORS = {
    // ახლები ზემოთ: რომელი უნდა იყოს პირველი, a თუ b?
    [SORT_OPTIONS.NEWEST]: (a, b) => toTime(______.createdAt) - toTime(______.createdAt),
    [SORT_OPTIONS.OLDEST]: (a, b) => ____________,
    [SORT_OPTIONS.TITLE]: (a, b) => a.title.____________(b.title),
    [SORT_OPTIONS.MOST_VISITED]: (a, b) => ____________,
    [SORT_OPTIONS.RECENT_VISIT]: (a, b) => ____________,
};
```

ახლა ერთი ფუნქცია, რომელიც ყველაფერს აერთიანებს. ის ობიექტს იღებს არგუმენტად — ასე გამოძახებისას ჩანს, რომელი მნიშვნელობა რას ნიშნავს (`selectBookmarks(list, { view, searchTerm })` და არა `selectBookmarks(list, "all", "css", null, "newest")`).

```js
export function selectBookmarks(
    bookmarks,
    // default მნიშვნელობები: ფუნქცია ნაკლები არგუმენტითაც მუშაობს
    {
        view = VIEWS.ALL,
        searchTerm = "",
        selectedTag = null,
        sortOption = SORT_OPTIONS.NEWEST,
    } = {},
) {
    // მძიმე სამუშაო ერთხელ, მარყუჟის გარეთ
    const term = searchTerm.______().____________();

    // უცნობი sortOption-ზე აპი არ უნდა ჩავარდეს
    const compare = COMPARATORS[sortOption] ?? COMPARATORS[______];

    return bookmarks
        .filter(
            (bookmark) =>
                matchesView(bookmark, view) &&
                ____________ &&
                ____________,
        )
        // ახლა sort უსაფრთხოა: filter-მა ახალი მასივი დააბრუნა და
        // საწყის state-ს აღარ ვეხებით. (მაგრამ უშუალოდ bookmarks.sort(...)
        // state-ს ადგილზე შეცვლიდა — ეს კრიტიკული სხვაობაა)
        .sort(
            (a, b) =>
                // მიმაგრებულები ყოველთვის წინ, მიუხედავად სორტირებისა.
                // Number(true) არის 1, Number(false) — 0.
                // || ნიშნავს: თუ პირველი შედარება 0-ია (ორივე ერთნაირია),
                // გადაწყვეტილება მეორეს გადაეცემა
                Number(b.isPinned) - Number(a.isPinned) || compare(a, b),
        );
}
```

## ნაბიჯი 9C: tag-ების სია და მთვლელები

sidebar-ს სჭირდება tag-ების სია რაოდენობებით: `Documentation 8`, `CSS 6`. ეს სია `bookmarks`-იდან უნდა გამოითვალოს და არა ხელით ეწეროს — თორემ ახალი tag-ის დამატებისას ფილტრში ვერ გამოჩნდება.

```js
export function collectTags(bookmarks, view = VIEWS.ALL) {
    // Map არის key-value საცავი, რომელიც რიგს ინახავს.
    // ჩვეულებრივი ობიექტიც გამოდგებოდა, მაგრამ Map-ს ამისთვის
    // გასაღების ტიპთან პრობლემა არ აქვს
    const counts = new Map();

    for (const bookmark of bookmarks) {
        // არქივის tag-ები "ყველა"-ს ფილტრში არ უნდა ჩანდეს
        if (!matchesView(bookmark, view)) {
            continue;
        }

        for (const tag of bookmark.tags) {
            // ?? 0 — პირველად ნანახ tag-ზე counts.get(tag) undefined-ია
            counts.set(tag, (counts.get(tag) ?? 0) + ______);
        }
    }

    return [...counts.entries()]
        // [["CSS", 6], ...] → [{ tag: "CSS", count: 6 }, ...]
        .map(([tag, count]) => ({ ______, ______ }))
        // ჯერ პოპულარობით, თანაბარზე კი ანბანით
        .sort((a, b) => ____________ || a.tag.localeCompare(b.tag));
}

// sidebar-ის ღილაკებზე რიცხვები: { all: 21, pinned: 4, archived: 3 }
export function countByView(bookmarks) {
    return {
        [VIEWS.ALL]: bookmarks.filter((b) => matchesView(b, VIEWS.ALL)).______,
        // დანარჩენი ორი
    };
}
```

**რა უნდა შეისწავლო:** სუფთა ფუნქციის ცნება; `.sort()`-ის კომპარატორი და ის, რომ `sort` **ორიგინალ მასივს ცვლის**; `localeCompare`; `Map` და `.entries()`; destructuring `.map(([tag, count]) => ...)`-ში; computed property keys.

**შემოწმება:** ეს ფაილი React-ის გარეშე შემოწმდება. დროებით `App.jsx`-ში, კომპონენტის გარეთ:

1. `selectBookmarks(data, { searchTerm: "react" })` — ყველა შედეგში "react" უნდა იყოს სადმე (სათაურში, აღწერაში ან tag-ში).
2. `selectBookmarks(data, { view: "archived" })` — მხოლოდ დაარქივებულები.
3. `selectBookmarks(data, { sortOption: "title" })` — მიმაგრებულები წინ, მერე ანბანი.
4. **კრიტიკული:** გამოძახების შემდეგ თავად `data`-ს რიგი **არ უნდა შეცვლილიყო**. დაბეჭდე `data[0].title` გამოძახებამდე და მერე — თუ განსხვავდება, სადღაც ორიგინალ მასივს ცვლი.
5. `collectTags(data)` — რაოდენობების ჯამი bookmark-ების რაოდენობაზე მეტი იქნება (ერთ ბარათს რამდენიმე tag აქვს). ეს ნორმალურია.

## ნაბიჯი 10: controlled კომპონენტები

ახლა ხელსაწყოები. სამივე ერთსა და იმავე ნიმუშზეა აგებული, ამიტომ ჯერ ნიმუში გავიგოთ.

HTML-ის `<input>`-ს საკუთარი მეხსიერება აქვს: რასაც აკრიფავ, ის ინახავს. React-ში ეს ცუდია — ორი სიმართლის წყარო ჩნდება: ერთი DOM-ში, მეორე state-ში. **Controlled component** ნიშნავს, რომ input-ს საკუთარ მეხსიერებას ვურთავთ: რას აჩვენებს — `value` props-იდან, ხოლო აკრეფაზე ის მხოლოდ **ატყობინებს** მშობელს.

```jsx
<input value={value} onChange={(event) => onChange(event.target.value)} />
```

და კიდევ: **state რატომ არ უნდა იყოს `SearchBar`-ის შიგნით?** იმიტომ, რომ აკრეფილი ტექსტი სიას სჭირდება, სია კი `SearchBar`-ის შვილი არ არის. როცა ორ კომპონენტს ერთი და იგივე მონაცემი სჭირდება, ის მათ **უახლოეს საერთო მშობელში** ინახება. ამას „state-ის აწევა" (lifting state up) ჰქვია. ჩვენთან ეს მშობელი `App`-ია.

### SearchBar

```jsx
export function SearchBar({ value, onChange, placeholder = "Search bookmarks…" }) {
    return (
        <div className={styles.search}>
            <input
                type="text"
                className={styles.input}
                value={______}
                onChange={(event) => ____________(event.target.______)}
                placeholder={placeholder}
                // ველს ხილული <label> არ აქვს — სახელი სხვა გზით უნდა მივცეთ
                aria-label="______"
            />

            {/* გასუფთავების ღილაკი მხოლოდ მაშინ, როცა რამე აკრეფილია */}
            {value !== "" && (
                <button
                    type="button"
                    // "გასუფთავება" ნიშნავს: ცარიელი ტექსტი ამცნო მშობელს
                    onClick={() => ____________}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
```

### SortSelect

```jsx
import { SORT_OPTION_LIST } from "../../constants/sortOptions";

export function SortSelect({ value, onChange }) {
    return (
        <select
            value={______}
            onChange={(event) => ____________}
            aria-label="Sort bookmarks"
        >
            {SORT_OPTION_LIST.map((option) => (
                // key აქაც აუცილებელია
                <option key={______} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
```

### ViewFilter და TagFilter

ორივე ღილაკების სიაა. მთავარი დეტალები:

```jsx
// ViewFilter — აქტიური ხედი ვიზუალურადაც და screen reader-ისთვისაც უნდა ჩანდეს
const isActive = option.value === view;

<button
    type="button"
    // ორი კლასი, როცა აქტიურია, ერთი — როცა არა.
    // .filter(Boolean) აგდებს false-ს, join ერთ string-ად აქცევს
    className={[styles.item, isActive && styles.______].filter(Boolean).join(" ")}
    onClick={() => onChange(option.value)}
    // ნავიგაციისთვის სწორი ატრიბუტია aria-current, ღილაკებისთვის კი aria-pressed.
    // sidebar-ის ხედები ნავიგაციაა
    aria-current={isActive ? "page" : undefined}
>
```

```jsx
// TagFilter — იმავე tag-ზე მეორედ დაჭერა ფილტრს უნდა ხსნიდეს
<button
    type="button"
    onClick={() => onSelect(isActive ? ______ : tag)}
    aria-pressed={isActive}
>
    <span>{tag}</span>
    <span>{count}</span>
</button>
```

`TagFilter`-ს ცარიელი სია რომ გადაეცეს, სათაური „TAGS" მაინც დაიხატებოდა. ამიტომ ფუნქციის დასაწყისში:

```jsx
if (tags.length === 0) {
    return ______;  // React-ში "არაფერი არ დახატო" ერთი კონკრეტული მნიშვნელობაა
}
```

**რა უნდა შეისწავლო:** controlled vs uncontrolled inputs (react.dev); lifting state up; `event.target.value`; `aria-pressed` vs `aria-current`; რატომ არ შეიძლება `className={styles.item + isActive && styles.active}` (ოპერატორების პრიორიტეტი).

**შემოწმება:** ოთხივე კომპონენტი დროებით `App`-ში ჩასვი ადგილობრივი state-ით და დაბეჭდე მნიშვნელობა. აკრეფა, არჩევა და ფილტრის გადართვა უნდა მუშაობდეს — სიაზე ჯერ არაფერი მოქმედებს.

## ნაბიჯი 11: შეერთება — `App`

ახლა ყველაფერი ერთდება. `App`-ში ოთხი ახალი state ჩნდება — და მხოლოდ ოთხი:

```jsx
const [view, setView] = useState(VIEWS.______);
const [searchTerm, setSearchTerm] = useState(______);
const [selectedTag, setSelectedTag] = useState(______);  // "ჯერ არაფერია არჩეული"
const [sortOption, setSortOption] = useState(SORT_OPTIONS.______);
```

გაფილტრულ სიას **საკუთარი state არ აქვს** — ის გამოითვლება:

```jsx
const visibleBookmarks = useMemo(
    () => selectBookmarks(bookmarks, { view, searchTerm, selectedTag, sortOption }),
    // dependency array: ყველაფერი, რასაც ზემოთა ფუნქცია იყენებს
    [____________],
);

const tags = useMemo(() => collectTags(bookmarks, view), [______, ______]);
const counts = useMemo(() => countByView(bookmarks), [______]);
```

**`useMemo` რას აკეთებს?** კომპონენტის სხეული ყოველ render-ზე თავიდან სრულდება — მათ შორის მაშინაც, როცა modal გახსენი ან თემა გადართე. `useMemo` შედეგს იმახსოვრებს და ხელახლა მხოლოდ მაშინ ითვლის, როცა dependency array-ში რამე შეიცვლება. ლოგიკა იგივეა, რაც `useEffect`-ის dependency array-ს აქვს, მხოლოდ effect-ის ნაცვლად მნიშვნელობა ბრუნდება.

**გაითვალისწინე:** `useMemo` ოპტიმიზაციაა და არა ლოგიკის ნაწილი. თუ მას წაშლი, აპი უნდა მუშაობდეს ზუსტად ისევე, უბრალოდ მეტ სამუშაოს შეასრულებს. თუ წაშლაზე ქცევა შეიცვალა — რაღაც არასწორად გაქვს.

დაბოლოს, ერთი დეტალი, რომელსაც ადვილად გამოგრჩება:

```jsx
function handleViewChange(nextView) {
    setView(nextView);
    // tag-ების სია ხედის მიხედვით იკრიბება. "არქივში" გადასვლისას
    // არჩეული tag იქ შეიძლება საერთოდ არ არსებობდეს და
    // მომხმარებელი ცარიელ ეკრანს მიიღებდა უცნობი მიზეზით
    setSelectedTag(______);
}
```

### შემოწმება

1. **ძებნა:** აკრიფე `react` — ბარათები მცირდება. დიდი ასოებითაც (`REACT`) იგივე შედეგი.
2. **ძებნა tag-ში:** აკრიფე tag-ის სახელი, რომელიც არც სათაურშია და არც აღწერაში — ბარათი მაინც უნდა მოიძებნოს.
3. **Tag-ფილტრი:** sidebar-ში tag აირჩიე, მერე იმავეზე მეორედ დააჭირე — ფილტრი უნდა მოიხსნას.
4. **კომბინაცია:** ერთდროულად ძებნა + tag + სორტირება — სამივე ერთად უნდა მუშაობდეს.
5. **ხედები:** „Pinned"-ში მხოლოდ მიმაგრებულები; „Archived"-ში მხოლოდ დაარქივებულები; „All"-ში არქივი **არ** ჩანს.
6. **რიცხვები:** sidebar-ის მთვლელები ემთხვევა ბარათების რაოდენობას.
7. **CRUD + ფილტრი:** ფილტრით გაფილტრულ სიაში ბარათი წაშალე — ის მაშინვე უნდა გაქრეს (ეს ამტკიცებს, რომ ორი სიმართლის წყარო არ გაგიჩნდა).
8. **ცარიელი შედეგი:** აკრიფე `zzzz` — ბარათები არ ჩანს. ჯერჯერობით ეკრანი ცარიელია; ლამაზ შეტყობინებას მომდევნო დოკუმენტში დავწერთ.

## გავრცელებული შეცდომები

| შეცდომა | რა ხდება | გამოსწორება |
| --- | --- | --- |
| `const [filtered, setFiltered] = useState([])` | წაშლილი ბარათი ეკრანზე რჩება | გაფილტრული სია არ ინახება — `useMemo`-თი გამოითვლება |
| `bookmarks.sort(...)` `filter`-ის გარეშე | სია ყოველ render-ზე „ხტება", state ადგილზე იცვლება | ჯერ `.filter()` (ახალი მასივი), მერე `.sort()` |
| `searchTerm.toLowerCase()` `matchesSearch`-ის შიგნით | იგივე სამუშაო 24-ჯერ | ერთხელ, `selectBookmarks`-ის დასაწყისში |
| `bookmark.title.includes(term)` | `React` ≠ `react` | ორივე მხარე ერთ რეგისტრში |
| `selectedTag = ""` ნაცვლად `null` | „ფილტრი არ არის" და „ცარიელი tag" ერთმანეთში ერევა | `null` ნიშნავს „არჩეული არ არის" |
| `useMemo`-ს dependency array აკლია | ძებნა აკრეფაზე არ რეაგირებს | ESLint-ის `react-hooks/exhaustive-deps` გაფრთხილებას ნუ დაფარავ |
| `useMemo(selectBookmarks(...), [...])` | მაშინვე სრულდება, ქეში არ მუშაობს | `useMemo(() => selectBookmarks(...), [...])` — ფუნქცია გადაეცემა |
| `<option>`-ებს `key` აკლია | React-ის warning | `key={option.value}` |
| `onChange={onChange}` input-ზე | მშობელი მთელ event-ს იღებს და არა ტექსტს | `onChange={(e) => onChange(e.target.value)}` |
| `value` props-ის გარეშე `<input>` | uncontrolled input-ის warning | `value` + `onChange` ერთად |
| ხედის ცვლილებაზე tag რჩება არჩეული | „არქივი ცარიელია", თუმცა ბარათები იქ არის | ხედის ცვლილებაზე `setSelectedTag(null)` |

## საბოლოო checklist

- `views.js` და `sortOptions.js`-ის გარეთ არც ერთი `"pinned"`/`"newest"` ტიპის string არ წერია
- `bookmarkQuery.js`-ში არც ერთი `import` React-იდან არ არის
- `selectBookmarks` საწყის მასივს არ ცვლის (მე-4 ტესტი ამას ამოწმებს)
- `App`-ში მხოლოდ ოთხი ახალი state-ია; გაფილტრული სია `useMemo`-თია
- ოთხივე ხელსაწყო controlled-ია: `value` + `onChange`, საკუთარი state-ის გარეშე
- ძებნა, tag, ხედი და სორტირება ერთდროულად მუშაობს
- console სუფთაა, ESLint გაფრთხილებების გარეშე

commit: `Add search, tag filter, views and sorting`

## შემდეგი ნაბიჯი

ახლა bookmark-ის დასამატებლად კოდში დროებითი ღილაკი გაქვს. შემდეგი დოკუმენტი ამას ასწორებს: `Button`, `Modal`, `BookmarkForm` და ვალიდაცია — ანუ ნამდვილი ფორმა, რომელიც არასწორ მონაცემს შიგნით არ უშვებს.
