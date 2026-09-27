// "https://www.react.dev/learn" → "react.dev"
export function getDomain(value) {
    try {
        // URL კონსტრუქტორი მისამართს ნაწილებად შლის (MDN: URL)
        const parsed = new URL(value);

        // რომელი property აბრუნებს მხოლოდ დომენს, გზის გარეშე?
        // "www." პრეფიქსი ზედმეტია — replace-ით მოაშორე
        return parsed.hostname.replace(/^www\./, "");
    } catch {
        // არავალიდურ მისამართზე new URL() შეცდომას აგდებს.
        // ბარათი ამის გამო არ უნდა ჩავარდეს — დააბრუნე თავად ტექსტი
        return value;
    }
}

// ბარათის ავატარისთვის: "react.dev" → "R"
export function getAvatarLetter(value) {
    // ზემოთა ფუნქციას იყენებ და არა value-ს პირველ ასოს:
    // "https://react.dev"-ის პირველი ასო "h" იქნებოდა
    const hostname = getDomain(value);

    // ?? — თუ hostname ცარიელია, სიმბოლო მაინც გვჭირდება
    return (hostname[0] ?? "?").toUpperCase();
}

