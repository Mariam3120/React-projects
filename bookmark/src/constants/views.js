// constants/views.js
export const VIEWS = Object.freeze({
    ALL: "all",
    PINNED: "pinned",
    ARCHIVED: "archived",
});

// sidebar-ის ღილაკებიც და header-ის სათაურიც ერთი და იმავე სიიდან იხატება.
// ასე ახალი ხედის დამატება ერთი ობიექტის დამატებაა და არა ხუთი ფაილის შეცვლა
export const VIEW_OPTIONS = Object.freeze([
    {
        value: VIEWS.ALL,
        label: "All",              // ღილაკზე — მოკლე
        heading: "All bookmarks",  // header-ში — სრული
        icon: "📋",
    },
    {
        value: VIEWS.PINNED,
        label: "Pinned",           // ღილაკზე — მოკლე
        heading: "Pinned bookmarks", // header-ში — სრული
        icon: "📌",
    },
    {
        value: VIEWS.ARCHIVED,
        label: "Archived",         // ღილაკზე — მოკლე
        heading: "Archived bookmarks", // header-ში — სრული
        icon: "📦",
    }
]);

// header-ს სჭირდება: "ამ value-ს რომელი ობიექტი შეესაბამება?"
export function getViewOption(view) {
    // .find() აბრუნებს undefined-ს, თუ ვერაფერს იპოვა —
    // ?? ოპერატორით დააზღვიე, რომ header სათაურის გარეშე არ დარჩეს
    return VIEW_OPTIONS.find((option) => option.value === view) ?? VIEW_OPTIONS[0];
}


// VIEWS — თითოეული ხედის სახელი ერთხელ იწერება.
// დანარჩენი ფაილები აქედან იღებენ, რომ ერთგან "pinned" და
// მეორეგან "Pinned" არ დაიწეროს — შეცდომას არავინ გვაჩვენებს,
// სია უბრალოდ ცარიელი დარჩება.
// export const VIEWS = Object.freeze({ ... });


// VIEW_OPTIONS — იგივე სამი ხედი, ოღონდ დასახატად.
// VIEWS პასუხობს "როგორ იწერება?", ეს კი — "როგორ გამოჩნდება?".
// sidebar-ის ღილაკებიც და header-ის სათაურიც ამ ერთი სიიდან .map()-ით
// იხატება, ამიტომ ახალი ხედი ერთი ობიექტის დამატებაა.
// export const VIEW_OPTIONS = Object.freeze([ ... ]);


// getViewOption — value-დან პოულობს შესაბამის ობიექტს.
// .find() ვერაფრის პოვნისას undefined-ს აბრუნებს, header კი მასზე
// .heading-ს წაიკითხავდა და ჩავარდებოდა — ამიტომ ?? პირველ ხედს აბრუნებს.
// export function getViewOption(view) { ... }
