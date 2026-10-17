# Bookmark Manager — ცარიელი მდგომარეობები და თემა (ნაბიჯები 16–18)

2026-09-26 · @Someone

## სად ვართ და რას ვაშენებთ

აპი ფუნქციურად სრულია: ინახავს, აჩვენებს, ცვლის, ეძებს, ფილტრავს. ეს არის ის ეტაპი, სადაც პროექტების უმეტესობა ჩერდება — და სწორედ ამიტომ ჩანს მაშინვე, რომელი გააგრძელეს.

სამი რამ გვაკლია და სამივე იმ მომენტებს ეხება, როცა ეკრანზე **არაფერია**:

1. **ჩატვირთვა.** ახლა 800 მილიწამს წერია `Loading...`. ეს ტექსტი გვეუბნება, რომ რაღაც ხდება, მაგრამ არ გვეუბნება, რომ მოსვლას ღირს ლოდინი.
2. **ცარიელი სია.** `zzzz` რომ აკრიფო, თეთრი ეკრანი რჩება. მომხმარებელი ვერ ხვდება: ბმულები წაიშალა, აპი გაფუჭდა, თუ უბრალოდ ვერაფერი მოიძებნა?
3. **თემა.** `STORAGE_KEYS.THEME` ნაბიჯ 1-ზე დავწერეთ და მას შემდეგ არ გამოგვიყენებია. დროა.

**მთავარი წესი იგივეა:** მზა კოდი აქ არ არის.

**წინაპირობები:** ნაბიჯები 1–15; CSS ცვლადები; `useState`-ის lazy ინიციალიზაცია (ნაბიჯი 15B).

**ფაილები:**

```
src/
├── components/ui/Loader.jsx + .module.css        (ახალი)
├── components/ui/EmptyState.jsx + .module.css    (ახალი)
├── components/controls/ThemeToggle.jsx + .css    (ახალი)
├── hooks/useTheme.js                             (ახალი)
├── styles/theme.css                              (ვაფართოებთ)
├── styles/global.css                             (ვაფართოებთ)
└── App.jsx                                       (ვაერთებთ)
```

## ნაბიჯი 16A: `Loader`

ჩატვირთვის ინდიკატორს ორი ამოცანა აქვს: თვალს აჩვენოს, რომ პროცესი მიმდინარეობს, და **screen reader-საც** ამცნოს იგივე. მეორე ადვილად ავიწყდებათ: მბრუნავი წრე ხმოვან ინტერფეისში უბრალოდ არ არსებობს.

```jsx
export function Loader({ label = "Loading bookmarks…" }) {
    return (
        <div
            className={styles.loader}
            // "ეს ელემენტი მდგომარეობას აღწერს"
            role="______"
            // "როცა შიგთავსი შეიცვლება, წაიკითხე — მაგრამ ზრდილობიანად,
            // მომხმარებლის შეწყვეტის გარეშე"
            aria-live="polite"
        >
            {/* წრე დეკორაციაა: მისი "წაკითხვა" აზრს მოკლებულია */}
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.label}>{label}</p>
        </div>
    );
}
```

```css
.spinner {
    width: 2rem;
    height: 2rem;
    /* ჩარჩო ყველა მხარეს ერთნაირი, გარდა ერთისა — სწორედ ეს ქმნის მოძრაობის შეგრძნებას */
    border: 2px solid var(--color-border);
    border-top-color: var(--color-______);
    border-radius: ______;
    animation: spin ______ linear infinite;
}

@keyframes spin {
    to {
        transform: ____________;
    }
}

/* ზოგ ადამიანს მოძრაობა თავბრუს ახვევს — ოპერაციული სისტემა ამას იუწყება.
   ეს არა "nice to have", არამედ ხელმისაწვდომობის მოთხოვნაა */
@media (prefers-reduced-motion: ______) {
    .spinner {
        animation: ______;
        border-top-color: var(--color-border);
    }
}
```

ანიმაციის სიჩქარე: 800–1000ms ერთ ბრუნზე. უფრო სწრაფი „განგაშად" აღიქმება, უფრო ნელი — გაჭედილად.

## ნაბიჯი 16B: `EmptyState` — სამი განსხვავებული სიცარიელე

„ცარიელი ეკრანი" ერთი მდგომარეობა არ არის. ჩვენს აპში ის სამია და სამივეს სხვა პასუხი სჭირდება:

| როდის | რას ფიქრობს მომხმარებელი | რა უნდა ვუთხრათ |
| --- | --- | --- |
| ჯერ არც ერთი bookmark არ აქვს | „საიდან დავიწყო?" | რა არის ეს აპი + ღილაკი „დაამატე პირველი" |
| ფილტრმა ვერაფერი იპოვა | „გატყდა?" | „ვერაფერი მოიძებნა" + ღილაკი „ფილტრის გასუფთავება" |
| ხედი ცარიელია (არქივი, მიმაგრებულები) | „აქ რა უნდა იყოს?" | ახსნა, რისთვისაა ეს ხედი |

ერთი კომპონენტი სამივეს ემსახურება, თუ განსხვავებას props-ით გადმოვცემთ:

```jsx
export function EmptyState({ icon = "🔖", title, description, action }) {
    return (
        <div className={styles.empty}>
            <span className={styles.badge} aria-hidden="true">{icon}</span>

            {/* h1 Header-შია, ამიტომ აქ... რომელი დონე? */}
            <__ className={styles.title}>{title}</__>

            {/* აღწერა არჩევითია */}
            {description && <p className={styles.description}>{______}</p>}

            {/* action არის prop, რომელშიც მზა React ელემენტი მოდის:
                action={<Button onClick={openAddForm}>Add bookmark</Button>}
                ასე EmptyState-მა არ იცის, რა ღილაკია — და არც უნდა იცოდეს */}
            {action && <div className={styles.action}>{______}</div>}
        </div>
    );
}
```

**ეს ისევ კომპოზიციაა.** ალტერნატივა იქნებოდა `buttonLabel` და `onButtonClick` props-ები — და მერე მეორე ღილაკის დამატებისას კიდევ ორი. ელემენტის props-ად გადაცემა ამ პრობლემას ერთხელ და სამუდამოდ ხსნის.

ტექსტზე ორი წესი:

- **სათაური 2–4 სიტყვა**, წერტილის გარეშე: „No bookmarks yet".
- **აღწერა ერთი წინადადება**, რომელიც შემდეგ ნაბიჯს ამბობს და არა პრობლემას იმეორებს. „Save your first link and it will show up here" — და არა „The list is empty".

## ნაბიჯი 16C: არჩევანი `App`-ში

ახლა `App`-მა უნდა გადაწყვიტოს, რომელი სიცარიელეა. ეს სამსართულიანი ternary გამოვიდოდა, ამიტომ პატარა კომპონენტად გამოვყოთ — იმავე ფაილში, `App`-ის ქვემოთ:

```jsx
function EmptyContent({ view, hasActiveFilters, onClearFilters, onAdd }) {
    // რიგი მნიშვნელოვანია: ფილტრი ყველაზე კონკრეტული შემთხვევაა,
    // ამიტომ ის პირველი უნდა შემოწმდეს
    if (______) {
        return (
            <EmptyState
                icon="🔍"
                title="No bookmarks match"
                description="Try a different search term or clear the tag filter."
                action={<Button variant="secondary" onClick={______}>Clear filters</Button>}
            />
        );
    }

    if (view === VIEWS.PINNED) {
        return <EmptyState icon="📌" title="______" description="______" />;
    }

    // არქივი
    // ...

    // ყველაზე ზოგადი შემთხვევა ბოლოს
    return (
        <EmptyState
            icon="🔖"
            title="No bookmarks yet"
            description="Save your first link and it will show up here."
            action={<Button variant="primary" onClick={______}>Add bookmark</Button>}
        />
    );
}
```

და `App`-ში:

```jsx
const hasActiveFilters = searchTerm.trim() !== "" || selectedTag !== ______;

// ...

{visibleBookmarks.length > 0 ? (
    <BookmarkList ... />
) : (
    <EmptyContent ... />
)}
```

ჩატვირთვისა და შეცდომის early return-ებიც განაახლე: `<p>Loading...</p>` → `<Loader />`, ხოლო შეცდომა → `EmptyState` „Try again" ღილაკით (`window.location.reload()`).

**შემოწმება:**

1. DevTools → Local Storage-ში key წაშალე, `SEED_URL`-ში ტიპო ჩაწერე → შეცდომის ეკრანი ღილაკით.
2. ტიპო გაასწორე, key-ის მნიშვნელობა ხელით `[]`-ად შეცვალე → „No bookmarks yet" + ღილაკი, რომელიც ფორმას ხსნის.
3. აკრიფე `zzzz` → „No bookmarks match" + „Clear filters", რომელიც მართლა ასუფთავებს.
4. „Pinned" ხედი, სადაც არაფერია მიმაგრებული → თავისი ტექსტი.
5. ჩატვირთვისას spinner ბრუნავს; სისტემაში „reduce motion" ჩართე → წრე ჩერდება, მაგრამ ჩანს.

## ნაბიჯი 17A: `theme.css` — ორი პალიტრა

dark theme არ ნიშნავს ფერების ინვერსიას. თუ თეთრ ფონს შავად შეცვლი და ტექსტს თეთრად დატოვებ, კონტრასტი ზედმეტად მკვეთრი გახდება და ტექსტი „იფშვნება".

წესები:

- ფონი **სუფთა შავი არ არის** — `#0f1114`-ის ტიპის მუქი ნაცრისფერი.
- ტექსტი **სუფთა თეთრი არ არის** — `#e8eaed`.
- ბარათი ფონზე **ღიაა** და არა მუქი: მუქ თემაში სიმაღლე სინათლით გამოიხატება და არა ჩრდილით.
- აქცენტის ფერი მუქ ფონზე უნდა **გაანათო**: `#14504b` ბნელ ფონზე არ იკითხება.

ტექნიკა მარტივია — ცვლადები უკვე გვაქვს, უბრალოდ მეორე ნაკრებს ვწერთ:

```css
:root {
    /* ბრაუზერს ეუბნება, რა ტიპის თემაა: ამაზეა დამოკიდებული
       scrollbar-ების, checkbox-ებისა და select-ის ნაგულისხმევი ფერები */
    color-scheme: ______;

    --color-bg: #f5f6f7;
    /* ... არსებული ცვლადები ... */
}

/* ატრიბუტი <html>-ზე. კლასიც გამოდგებოდა, მაგრამ data-ატრიბუტი
   მაშინვე ამბობს, რომ ეს მდგომარეობაა და არა სტილი */
:root[data-theme="dark"] {
    color-scheme: ______;

    --color-bg: #0f1114;
    --color-surface: #181b20;
    --color-border: ____________;
    --color-text: #e8eaed;
    --color-text-muted: ____________;
    --color-accent: ____________;
    /* ... ყველა ცვლადს თავისი მუქი ვარიანტი ... */
}
```

**შეამოწმე კონტრასტი.** DevTools → ელემენტის არჩევა → ფერის კვადრატზე დაჭერა გაჩვენებს კონტრასტის კოეფიციენტს. მინიმუმი: **4.5:1** ჩვეულებრივი ტექსტისთვის, **3:1** დიდისთვის. `--color-text-muted` ყველაზე ხშირად სწორედ აქ ვარდება.

თუ ამ ეტაპზე კომპონენტში სადმე `#fff` ან `#111` დაგხვდა — სწორედ ახლა გამოჩნდა, რატომ იყო ცვლადების წესი მნიშვნელოვანი. გაასწორე.

## ნაბიჯი 17B: `useTheme`

ახლა ლოგიკა: ვინ ირჩევს თემას და სად ინახება.

სამი წყარო, პრიორიტეტის მიხედვით:

1. **მომხმარებლის არჩევანი** localStorage-იდან — თუ ერთხელ აირჩია, ყოველთვის ის მოქმედებს.
2. **სისტემის პარამეტრი** — ოპერაციულ სისტემაში მუქი თემა აქვს? მაშინ ჩვენც.
3. ნაგულისხმევი — ღია.

```jsx
import { useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const THEMES = Object.freeze({ LIGHT: "light", DARK: "dark" });

function getInitialTheme() {
    // ნაბიჯ 1-ზე დაწერილი key ბოლოს და ბოლოს გამოდგა
    const stored = getFromStorage(STORAGE_KEYS.______, null);

    // storage-ში ხელით შეიძლება სისულელე ეწეროს — ვამოწმებთ
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
        return ______;
    }

    // ბრაუზერს ვეკითხებით სისტემის პარამეტრს
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").______;

    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
}

export function useTheme() {
    // ფუნქცია და არა გამოძახება: localStorage ერთხელ უნდა წაიკითხოს
    // და არა ყოველ render-ზე
    const [theme, setTheme] = useState(____________);

    useEffect(() => {
        // <html data-theme="dark"> — ზუსტად ის, რასაც theme.css ელოდება.
        // dataset.theme იგივეა, რაც setAttribute("data-theme", ...)
        document.documentElement.dataset.______ = theme;

        // არჩევანი მაშინვე ინახება — ცალკე "შენახვის" ღილაკი არ გვინდა
        ____________(STORAGE_KEYS.THEME, theme);
    }, [______]);

    function toggleTheme() {
        setTheme((current) => (current === THEMES.DARK ? ______ : ______));
    }

    return { theme, toggleTheme };
}
```

**რატომ effect და არა პირდაპირ `toggleTheme`-ში ჩაწერა?** იმიტომ, რომ თემა მხოლოდ ღილაკით არ იცვლება — ის პირველ render-ზეც უნდა დაისვას, სანამ ვინმე რამეს დააჭერს. effect ორივე შემთხვევას ფარავს: ის ყოველ ცვლილებაზე ეშვება, მათ შორის პირველზე. ეს ზუსტად იგივე ნიმუშია, რაც bookmark-ების ავტომატურ შენახვაში (ნაბიჯი 3B).

## ნაბიჯი 17C: `ThemeToggle`

```jsx
import { THEMES } from "../../hooks/useTheme";

export function ThemeToggle({ theme, onToggle }) {
    const isDark = theme === THEMES.DARK;

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={onToggle}
            // ღილაკი ჩამრთველია — მისი მდგომარეობა ხმოვან ინტერფეისშიც უნდა ჩანდეს
            aria-pressed={______}
        >
            {/* ღილაკი იმას აჩვენებს, რაც მოხდება და არა იმას, რაც ახლაა:
                მუქ თემაში ვართ → ღილაკზე მზეა */}
            <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "______" : "______"}</span>
        </button>
    );
}
```

`App`-ში: `const { theme, toggleTheme } = useTheme();` და ღილაკი sidebar-ის ბოლოში.

**შემოწმება:**

1. გადართვა მუშაობს, ყველა ეკრანი (ბარათები, modal, sidebar, ფორმა) სწორად გამოიყურება.
2. Refresh — არჩევანი რჩება. DevTools-ში `bookmark-manager:theme` key ჩანს.
3. localStorage-იდან theme-ის key წაშალე, სისტემაში მუქი თემა ჩართე, refresh — აპი მუქი იხსნება.
4. `storage`-ში ხელით ჩაწერე `"blue"` → აპი ღიას აბრუნებს და არ ვარდება.
5. Modal გახსენი მუქ თემაზე — ფონი, ველები და შეცდომის ტექსტი იკითხება.
6. DevTools-ით შეამოწმე `--color-text-muted`-ის კონტრასტი ბარათზე — 4.5:1 ან მეტი.

## ნაბიჯი 18: გაპრიალება

ბოლო ნაბიჯი მცირე ცვლილებებია, რომლებიც ერთად დიდ სხვაობას ქმნიან. ყველა `global.css`-ში ან layout-ის CSS-ში.

### კლავიატურა

```css
/* :focus და არა :focus-visible რომ დავწეროთ, თაგუნათი დაჭერილ
   ღილაკებსაც ჩარჩო დარჩებათ. :focus-visible მხოლოდ მაშინ ეშვება,
   როცა ბრაუზერი ხვდება, რომ კლავიატურით მოხვდი */
:focus-visible {
    outline: 2px solid var(--color-______);
    outline-offset: 2px;
}
```

არასდროს დაწერო `outline: none` მისი ჩანაცვლების გარეშე — კლავიატურით მომუშავე ადამიანისთვის ეს ნიშნავს, რომ კურსორი უჩინარი გახდა.

### მოძრაობა

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### ვიწრო ეკრანი

Layout-ის grid ორსვეტიანია. 60rem-ზე ვიწრო ეკრანზე ის ერთ სვეტად უნდა ჩამოიშალოს:

```css
@media (max-width: 60rem) {
    .layout {
        /* minmax(0, 1fr) და არა 1fr: grid-ის სვეტის ნაგულისხმევი
           მინიმუმი min-content-ია, ანუ გრძელი შიგთავსი სვეტს
           ეკრანზე ფართოს ხდის და გვერდი ჰორიზონტალურად ცოცავს */
        grid-template-columns: ____________;
        grid-template-areas:
            "brand"
            "header"
            "sidebar"
            "main";
    }
}
```

თითის სამიზნე მობილურზე მინიმუმ **44×44px** უნდა იყოს. ბარათის იკონ-ღილაკები ალბათ 36–40px გაქვს — ვიწრო ეკრანზე გაზარდე.

### საბოლოო შემოწმება

1. **მხოლოდ კლავიატურით** გაიარე მთელი აპი: Tab-ით ღილაკებზე, Enter-ით გახსნა, Escape-ით დახურვა. ფოკუსი ყოველთვის ჩანს და დიალოგიდან არ „გარბის".
2. DevTools → responsive რეჟიმი, სიგანე **390px**: ჰორიზონტალური scroll არ უნდა იყოს. შეამოწმე 320px-იც.
3. **ორივე თემა** ყველა ეკრანზე.
4. Console სუფთაა; `npm run lint` შეცდომების გარეშე; `npm run build` გადის.
5. localStorage წაშალე და აპი თავიდან გახსენი — seed იტვირთება, თითქოს პირველი ვიზიტია.

## გავრცელებული შეცდომები

| შეცდომა | რა ხდება | გამოსწორება |
| --- | --- | --- |
| ერთი ცარიელი შეტყობინება ყველა შემთხვევისთვის | „No bookmarks yet" ფილტრის შედეგზეც წერია | სამი შემთხვევა — სამი ტექსტი |
| `outline: none` ჩანაცვლების გარეშე | კლავიატურით ნავიგაცია შეუძლებელი ხდება | `:focus-visible` საკუთარი სტილით |
| dark theme კომპონენტების CSS-ში | ერთი ბარათი თეთრი რჩება | მხოლოდ ცვლადები იცვლება, კომპონენტები არა |
| `useState(getInitialTheme())` | localStorage ყოველ render-ზე იკითხება | `useState(getInitialTheme)` — ფრჩხილების გარეშე |
| `color-scheme` არ წერია | scrollbar და select ღია თემიდან რჩება | `color-scheme: dark` მუქ ბლოკში |
| მუქ თემაში სუფთა შავი და თეთრი | ტექსტი „იფშვნება", თვალი იღლება | `#0f1114` / `#e8eaed` ტიპის ფერები |
| `grid-template-columns: 1fr` ვიწრო ეკრანზე | გვერდი ჰორიზონტალურად ცოცავს | `minmax(0, 1fr)` |
| spinner `prefers-reduced-motion`-ის გარეშე | ზოგი მომხმარებლისთვის დისკომფორტი | media query-ში ანიმაციის გამორთვა |
| `aria-hidden` დეკორაციულ emoji-ზე არ წერია | screen reader ამბობს „bookmark tabbed emoji" | `aria-hidden="true"` |

## პროექტის საბოლოო checklist

- **მონაცემები:** seed პირველ ვიზიტზე, localStorage შემდეგ; გაფუჭებული მონაცემი აპს არ აჩერებს
- **მდგომარეობები:** loading, error, სამი სახის ცარიელი და სრული სია — ხუთივე დახატულია
- **state:** მხოლოდ ის ინახება, რაც არ გამოითვლება; გაფილტრული სია `useMemo`-შია; modal-ების state-ში `id`-ებია
- **იმუტაბელურობა:** არსად `push`, `splice` ან პირდაპირი მინიჭება state-ზე
- **კომპონენტები:** `Button`, `Modal`, `Tag`, `EmptyState` თავიდან გამოიყენება; კოპირებული ვარიანტები არ არსებობს
- **ხელმისაწვდომობა:** ყველა input-ს label, ყველა იკონ-ღილაკს `aria-label`, ფოკუსი ჩანს, Escape ხურავს
- **სტილი:** ყველა ფერი და ზომა ცვლადებიდან; ორივე თემა მუშაობს; 390px-ზე scroll არ არის
- **სისუფთავე:** დროებითი `console.log`, ტესტის ღილაკები და გამოუყენებელი ფაილები წაშლილია
- `npm run lint` და `npm run build` სუფთაა

commit: `Add loading, empty states and dark theme`

## რა ისწავლე

თუ აქამდე მოხვედი, შენ გაქვს არა „React-ის ტუტორიალი", არამედ აპლიკაცია, რომელშიც ყველა ძირითადი ნიმუშია:

- **მონაცემების ფენა:** fetch, ქეში, სერიალიზაცია, შეცდომების დამუშავება
- **state-ის დიზაინი:** სად ცხოვრობს, როდის უნდა აიწიოს, რა არ უნდა შეინახო
- **კომპონენტების დიზაინი:** presentational vs container, კომპოზიცია, props-ის API
- **ხელმისაწვდომობა და UX:** ფოკუსი, ARIA, ყველა მდგომარეობის დახატვა

## შემდეგი ნაბიჯი (არჩევითი)

თუ პროექტის გაგრძელება გინდა:

1. **ბარათის სიმაღლე და ანიმაციები** — სიაში ბარათების გამოჩენა, მოხსნის ანიმაცია.
2. **კლავიატურის მალსახმობები** — `/` ძებნაზე ფოკუსისთვის, `n` ახალი bookmark-ისთვის.
3. **Export / import** — JSON ფაილად ჩამოტვირთვა და უკან ატვირთვა (`Blob`, `<input type="file">`).
4. **ტესტები** — `bookmarkQuery.js` და `validation.js` სუფთა ფუნქციებია, ანუ ტესტისთვის იდეალური. Vitest.
5. **ნამდვილი ბექენდი** — `useBookmarks`-ის შიგნით `fetch`-ს მისამართი შეუცვალე. თუ ფენა სწორად დაწერე, `App` და კომპონენტები ხელუხლებელი დარჩება. სწორედ ეს არის ამ სტრუქტურის მთავარი აზრი.
