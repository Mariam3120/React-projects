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

// ჯერ მისამართი. მომხმარებელი დიდი ალბათობით `react.dev`-ს აკრეფს და არა `https://react.dev`-ს — ჩვენ ეს უნდა მივიღოთ და თვითონ შევავსოთ. `utils/url.js`-ს ორი ფუნქცია დაემატება:

// "react.dev" → "https://react.dev"; "http://x.com" უცვლელი რჩება
export function normalizeUrl(value) {
    const trimmed = value.trim();

    if (trimmed === "") {
        return "";
    }

    // რეგულარული გამოსახულება: იწყება თუ არა http:// ან https://-ით?
    // i ნიშნავს, რომ რეგისტრი არ ითვლება
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    return `https://${trimmed}`;
}


export function isValidUrl(value) {
    try {
        // ჯერ ვასწორებთ, მერე ვამოწმებთ — თორემ "react.dev" ვერ გაივლიდა
        const parsed = new URL(normalizeUrl(value));

        return (
            // მხოლოდ ვებმისამართები: javascript: და data: არ გვინდა
            (parsed.protocol === "https:" || parsed.protocol === "http:") &&
            // "https://abc" ტექნიკურად ვალიდურია, მაგრამ საიტი არ არის.
            // რა ამოწმებს, რომ დომენში წერტილია?
            parsed.hostname.includes(".")
        );
    } catch {
        return false;
    }
}

