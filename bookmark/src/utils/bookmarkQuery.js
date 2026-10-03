import { VIEWS } from "../constants/views";
import { SORT_OPTIONS } from "../constants/sortOptions";

// ფუნქცია არ არის export-ული: ის მხოლოდ ამ ფაილში გამოიყენება.
// რაც ნაკლებს export-ავ, მით ნაკლებს ინახავ თავში
function matchesView(bookmark, view) {
    if (view === VIEWS.ARCHIVED) {
        // არქივში მხოლოდ დაარქივებულები
        return bookmark.isArchived;
    }

    if (view === VIEWS.PINNED) {
        // მიმაგრებული, მაგრამ არა დაარქივებული — ორი პირობა
        return bookmark.isPinned && !bookmark.isArchived;
    }

    // "ყველა" სინამდვილეში ნიშნავს "ყველა, გარდა არქივისა"
    return !bookmark.isArchived;
};

// term-ს უკვე დამუშავებულს ვიღებთ (trim + lowercase).
// რატომ? იმიტომ, რომ ეს ფუნქცია 24-ჯერ გამოიძახება და
// ერთსა და იმავე სამუშაოს 24-ჯერ გაიმეორებდა
function matchesSearch(bookmark, term) {
    if (term === "") {
        // ცარიელი ძებნა ყველას ატარებს
        return true;
        // "Is the search box empty? Then yes, this bookmark matches — show it."
    }

    // ერთ დიდ ტექსტად შეაერთე ყველაფერი, რაშიც ძებნა უნდა მოხდეს:
    // სათაური, აღწერა, მისამართი და tag-ები (tags მასივია — spread)
    const haystack = [
        bookmark.title,
        bookmark.description,
        bookmark.url,
        ...bookmark.tags,
    ]
        .join(" ")
        .toLowerCase();  // რეგისტრი მნიშვნელობა არ უნდა ჰქონდეს

    return haystack.includes(term);
}

function matchesTag(bookmark, tag) {
    // tag === null ნიშნავს "ფილტრი არ არის არჩეული"
    return tag === null || bookmark.tags.includes(tag);
    // "No tag is selected OR this bookmark has that tag."
    // თუ არცერთი ტეგი არ გვაქვს არჩეული (tag === null), გატარებს (true).
    // თუ არჩეულია, ამოწმებს, არის თუ არა ეს ტეგი ბუკმარკის tags მასივში.
}


// null და undefined თარიღები: ახალ bookmark-ს lastVisitedAt არა აქვს
function toTime(value) {
    // თუ მნიშვნელობა არ არსებობს, 0 დააბრუნე — ის სიის ბოლოში აღმოჩნდება
    return value ? new Date(value).getTime() : 0;
}


// ობიექტი, სადაც key სორტირების სახელია, value კი კომპარატორი.
// ასე if/else-ის კიბეს ვერიდებით
const COMPARATORS = {
    // ახლები ზემოთ: რომელი უნდა იყოს პირველი, a თუ b?
    [SORT_OPTIONS.NEWEST]: (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
    [SORT_OPTIONS.OLDEST]: (a, b) => toTime(a.createdAt) - toTime(b.createdAt),
    [SORT_OPTIONS.TITLE]: (a, b) => a.title.localeCompare(b.title),
    [SORT_OPTIONS.MOST_VISITED]: (a, b) => b.visitCount - a.visitCount,
    [SORT_OPTIONS.RECENT_VISIT]: (a, b) => toTime(b.lastVisitedAt) - toTime(a.lastVisitedAt),
};

//most visited & recent visit მოდის ჩემი ობიექქტიდან(useBookmarks hook) და იქიდან ვიღებ visitCount და lastVisitedAt. ეს არის ის, რაც სორტირების დროს უნდა გავითვალისწინოთ.

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
    const term = searchTerm.trim().toLowerCase();

    // უცნობი sortOption-ზე აპი არ უნდა ჩავარდეს
    const compare = COMPARATORS[sortOption] ?? COMPARATORS[SORT_OPTIONS.NEWEST];

    return bookmarks
        .filter(
            (bookmark) =>
                matchesView(bookmark, view) &&
                matchesSearch(bookmark, term) &&
                matchesTag(bookmark, selectedTag),
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
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
    }

    return [...counts.entries()]
        // [["CSS", 6], ...] → [{ tag: "CSS", count: 6 }, ...]
        .map(([tag, count]) => ({ tag, count }))
        // ჯერ პოპულარობით, თანაბარზე კი ანბანით
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// sidebar-ის ღილაკებზე რიცხვები: { all: 21, pinned: 4, archived: 3 }
export function countByView(bookmarks) {
    return {
        [VIEWS.ALL]: bookmarks.filter((b) => matchesView(b, VIEWS.ALL)).length,
        [VIEWS.PINNED]: bookmarks.filter((b) => matchesView(b, VIEWS.PINNED)).length,
        [VIEWS.ARCHIVED]: bookmarks.filter((b) => matchesView(b, VIEWS.ARCHIVED)).length,
    };
}