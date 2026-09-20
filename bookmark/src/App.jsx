import { useEffect, useState } from "react";
import BookmarkList from "./components/BookmarkList";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");
  useEffect(() => {
    async function bookmarksData() {
      try {
        const response = await fetch("/data/bookmarks.json");
        if (!response.ok) {
          throw new Error("ვერ დაიფეჩაააა");
        }
        const result = await response.json();
        setBookmarks(result);
      } catch (error) {
        setErr(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    const timerId = setTimeout(() => {
      bookmarksData();
    }, 1000);
    return () => clearTimeout(timerId);
  }, []);

  if (isLoading) {
    return <p>...Loading</p>;
  }

  if (err) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}

export default App;

//აპშია ჰუკები იმიტორო არა მარტო ლისტს დაჭირდება, არამედ მერე სერჩსაც, სორტირებასაც
// setBookmarks-ი არის state, რომელიც შეიცავს ბუკმარკების მასივს, რომელიც json ფაილიდან მოდის.
//ამიტომ მას გადავეცით result, რომელიც არის json ფაილის კონტენტი.
//isLoading არის state, რომელიც გვიჩვენებს არის თუ არა მონაცემები ჩატვირთული. თავდაპირველად trueა, რადგან ჯერ არაფერი ჩატვირთულა. როცა მონაცემები ჩაიტვირთება, ის false ხდება.
//setTimeout არის იმისთვის, რომ დავაგვიანოთ მონაცემების ჩატვირთვა 1 წამით, რათა ვნახოთ loading სტატუსი. ეს არის მხოლოდ დემონსტრაციისთვის, რეალურ აპში არ არის საჭირო.
//timeout-ში ვიძეხებთ bookmarksData ფუნქციას, რომელიც ასინქრონულად ჩატვირთავს მონაცემებს json ფაილიდან. 1 წმ-ის დაგვიანებით, ეს ფუნქცია გამოიძახება და მონაცემები ჩაიტვირთება. 
// თუ ჩატვირთვა წარმატებით დასრულდა, setBookmarks(result) გამოიძახება და bookmarks state განახლდება. თუ ჩატვირთვა ვერ მოხერხდა,
//  catch ბლოკში შევდივართ და setErr(error.message) გამოიძახება, რათა შეცდომის მესიჯი შევინახოთ err state-ში. 
// ბოლოს, regardless of success or failure, finally ბლოკში setIsLoading(false) გამოიძახება, რათა loading სტატუსი false გახდეს.