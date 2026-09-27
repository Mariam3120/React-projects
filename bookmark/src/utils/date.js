// ფორმატერი მოდულის დონეზე იქმნება და არა ფუნქციის შიგნით:
// მისი შექმნა ძვირია, ჩვენ კი ის ყოველ ბარათზე დაგვჭირდება
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",   // "numeric" → 2025
    month: "short",  // რომელი მნიშვნელობა იძლევა "Nov"-ს და არა "November"-ს?
    day: "numeric",
});

// "2025-11-03T09:12:00.000Z" → "Nov 3, 2025"
export function getFormattedDate(value) {
    // string → Date ობიექტი
    const date = new Date(value);

    // არავალიდურ თარიღზე Date შეცდომას არ აგდებს — ის "Invalid Date" ხდება.
    // getTime() ასეთ შემთხვევაში NaN-ს აბრუნებს
    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    // ფორმატერის მეთოდი, რომელიც Date-ს ტექსტად აქცევს
    return DATE_FORMATTER.format(date);
  
}