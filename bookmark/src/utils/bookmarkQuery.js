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
}