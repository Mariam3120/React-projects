export function getFromStorage(key, fallback) {
    try {
        // localStorage-იდან ამ key-ის მნიშვნელობა. ჯერ ის string-ია, ამიტომ ცვლადს raw ჰქვია
        const raw = localStorage.getItem(key);

        // რას აბრუნებს getItem, თუ ასეთი key არ არსებობს? (console-ში შეამოწმე)
        if (raw === null) {
            return fallback;
        }

        // string → ნამდვილი JavaScript მასივი/ობიექტი
        return JSON.parse(raw);
    } catch {
        // JSON.parse ჩავარდა (გაფუჭებული მონაცემი) — აპი არ უნდა გაჩერდეს
        return fallback;
    }
}
// console.log("eeeees",JSON.parse(null))

//- localStorage **მხოლოდ string-ებს** ინახავს. მასივი შენახვამდე string-ად უნდა გადავაქციოთ (`JSON.stringify`), წაკითხვისას კი უკან (`JSON.parse`).
//მას ეკითხები: „ამ სახელით რა ინახება?" თუ ვერაფერს იპოვის ან მონაცემი გაფუჭებულია, აბრუნებს **fallback**-ს, სათადარიგო მნიშვნელობას, 
// რომელსაც გამომძახებელი თავად ირჩევს. ფუნქციამ თავად არ იცის, 
// რა ნიშნავს „ცარიელი" კონკრეტული მონაცემისთვის: theme-ისთვის ეს შეიძლება იყოს `"light"`, bookmark-ებისთვის კი `null`.

// სახელი წამკითხველის წყვილია: saveToStorage
export function saveToStorage(key, value) {
    try {
        // value → string (JSON), შემდეგ localStorage-ში ამ key-ით
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        // შეტყობინებაში ახსენე key, რომ იცოდე, რომელ ჩანაწერზე მოხდა შეცდომა.
        // error ობიექტი მძიმის შემდეგ ცალკე არგუმენტად გადაეცი (არა ${error}-ით),
        // თორემ stack trace დაიკარგება
        console.error(`Error setting storage key: ${key}`, error);
    }
}

//key უკვე არის სტრინგი, ვალიუ კი უნდა მიიღოს და გადაკეთდეს სტრინგად, 
//ვალიუა ბუქმარქის მასივი, შავი ფონი თეთრი ფონი... რასაც იღებს გადააკეთებს სტრინგად

/*
localStorage.setItem(key, JSON.stringify(value));
//                    ↑         ↑
//              already a    needs converting
//               string       (array/object → string)
*/

//getItem-ის დროს გვაქვს შედეგი ამიტო ვინახავთ ცვლადში და 
//You can't check something and parse it without holding it somewhere. If you only used it once, you could skip the variable.
//setItem-ის დროს ერთი გზა აქვს, ვაძლევთ მას მონაცემებს, ინახავს, მორჩა



// Read/write helpers for localStorage.
// localStorage only stores strings, so values are converted with JSON both ways.
// Both functions catch errors — corrupted data or full storage must not crash the app.
// `fallback` is the value the caller wants back when nothing valid was found.
//ანუ ფოლბექი არაა ქოლბექი, ისაა ვალიუ რომელსაც გამომძახებელი მიაწვდის, null ან "light"
// ფოლბექს რა ვალიუ გადაეწოდება წყვეტს caller-ი 