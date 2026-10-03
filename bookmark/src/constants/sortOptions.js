// constants/sortOptions.js
export const SORT_OPTIONS = Object.freeze({
    NEWEST: "newest",
    OLDEST: "oldest",
    TITLE: "title",
    MOST_VISITED: "most_visited",
    RECENT_VISIT: "recent_visited",
});

// <select>-ის <option>-ები ამ სიიდან დაიხატება .map()-ით
export const SORT_OPTION_LIST = Object.freeze([
    { value: SORT_OPTIONS.NEWEST, label: "Newest first" },
    // დანარჩენი ოთხი
    { value: SORT_OPTIONS.OLDEST, label: "Oldest first" },
    { value: SORT_OPTIONS.TITLE, label: "Title A–Z" },
    { value: SORT_OPTIONS.MOST_VISITED, label: "Most visited" },
    { value: SORT_OPTIONS.RECENT_VISIT, label: "Recently visited" }
]);
