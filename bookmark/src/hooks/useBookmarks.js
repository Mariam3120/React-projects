import { useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";

const SEED_URL = "/data/bookmarks.json";

// ჩატვირთვის ხელოვნური დაყოვნება მილიწამებში (500–1000)
const LOADING_DELAY = 1000;
//გარეთ გლობალურად, რადგან ისინი არასდროს იცვლებიან და ყოველ რენდერზე არაა საჭირო შეიქმნან

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBookmarks() {
      //async აბრუნებს ფრომისს, ამიტო useEffect-ში არ უნდა იყოს async ფუნქცია პირდაპირ, რადგან useEffect არ ელოდება ფრომისს. ამიტომ ვქმნით შიდა async ფუნქციას.
      try {
        // bookmarks-ის key; fallback — null, რაც ნიშნავს „არასდროს შენახულა"
        // ([] არა! [] ნიშნავს „მომხმარებელმა ყველაფერი წაშალა")
        const stored = getFromStorage(STORAGE_KEYS.BOOKMARKS, null);

        if (stored !== null) {
          // storage-ში რაღაც ვიპოვეთ → state-ში, და გავდივართ
          setBookmarks(stored);
          return;
        }
        // პირველი ვიზიტი → seed
        const response = await fetch(SEED_URL);

        // fetch 404-ზე შეცდომას არ აგდებს — ხელით ვამოწმებთ
        if (!response.ok) {
          // მხოლოდ ტექსტი (სასურველია response.status-ით); setError აქ არა!
          throw new Error("ვერ დაიფეჩაააა" + response.status);
        }
        // პასუხი → JavaScript მასივი (response-ის მეთოდი, await-ით)
        const data = await response.json();
        // return data არა! setTimeout-ს შედეგი არ აინტერესებს
        setBookmarks(data);
      } catch (err) {
        // err და არა error — რომ error state არ „დაიფაროს" (ის მხოლოდ catch ბლოკშია)
        // state-ში ტექსტი: err-ის რომელი property შეიცავს შეტყობინებას?
        setError(err.message);
      } finally {
        // ყოველთვის ეშვება: წარმატებისას, შეცდომისას, return-ის შემდეგაც
        setIsLoading(false);
      }
    }

    // ფუნქციას გადასცემ ფრჩხილების გარეშე — ტაიმერი მოგვიანებით თავად გამოიძახებს
    const timerId = setTimeout(loadBookmarks, LOADING_DELAY);

    // cleanup: ტაიმერის გაუქმება (StrictMode effect-ს ორჯერ უშვებს)
    return () => clearTimeout(timerId);
  }, []); // რამდენჯერ უნდა მოხდეს ჩატვირთვა?

  useEffect(() => {
    // guard: ორი პირობა || ოპერატორით —
    // ჩატვირთვა ჯერ მიმდინარეობს? ან შეცდომა მოხდა?
    if (isLoading || error) {
      return;
    }

    // შემნახველი ფუნქცია: bookmark-ების key და მიმდინარე მასივი
    // setBookmarks აქ არა! ეს effect state-ს მხოლოდ კითხულობს
    saveToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }, [isLoading, error, bookmarks]);

  return { bookmarks, isLoading, error };
  // ობიექტი და არა მასივი — გამომძახებელი სახელებით აიღებს, რაც სჭირდება
}


// setBookmarks-ი არის state, რომელიც შეიცავს ბუკმარკების მასივს, რომელიც json ფაილიდან მოდის.
//ამიტომ მას გადავეცით result, რომელიც არის json ფაილის კონტენტი.
//isLoading არის state, რომელიც გვიჩვენებს არის თუ არა მონაცემები ჩატვირთული. თავდაპირველად trueა, რადგან ჯერ არაფერი ჩატვირთულა. როცა მონაცემები ჩაიტვირთება, ის false ხდება.
//setTimeout არის იმისთვის, რომ დავაგვიანოთ მონაცემების ჩატვირთვა 1 წამით, რათა ვნახოთ loading სტატუსი. ეს არის მხოლოდ დემონსტრაციისთვის, რეალურ აპში არ არის საჭირო.
//timeout-ში ვიძეხებთ loadBookmarks ფუნქციას, რომელიც ასინქრონულად ჩატვირთავს მონაცემებს json ფაილიდან. 1 წმ-ის დაგვიანებით, ეს ფუნქცია გამოიძახება და მონაცემები ჩაიტვირთება. 
// თუ ჩატვირთვა წარმატებით დასრულდა, setBookmarks(data) გამოიძახება და bookmarks state განახლდება. თუ ჩატვირთვა ვერ მოხერხდა,
//  catch ბლოკში შევდივართ და setErr(error.message) გამოიძახება, რათა შეცდომის მესიჯი შევინახოთ error state-ში. 
// ბოლოს, regardless of success or failure, finally ბლოკში setIsLoading(false) გამოიძახება, რათა loading სტატუსი false გახდეს.



/*
so this way it is called custom hook right?
Yes. useBookmarks is a custom hook.

Two requirements, that's it:

Name starts with use — useBookmarks, useTheme, useLocalStorage
It calls other hooks inside — your useState and useEffect
Otherwise it's an ordinary JavaScript function. No special syntax, no import, nothing React-specific about the file itself.
*/