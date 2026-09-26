// import { useEffect, useState } from "react";
import BookmarkList from "./components/BookmarkList";
import { useBookmarks } from "./hooks/useBookmarks";

// //tests
// saveToStorage("bookmark-manager:test", [{ id: 1 }, { id: 2 }]);

// // 1. write + read
// const t1 = getFromStorage("bookmark-manager:test", null);
// console.log("T1:", t1, Array.isArray(t1));
// //[] ეს რო გადაგვეცა rray.isArray([]) ეს თრუს ამოაგდებდა ამიტო ნალი ჯობს

// // 2. missing key
// const t2 = getFromStorage("bookmark-manager:does-not-exist", "MY FALLBACK");
// console.log("T2:", t2 === "MY FALLBACK");

// // 3. corrupted — see below
// const t3 = getFromStorage("bookmark-manager:broken", "FALLBACK USED");
// console.log("T3:", t3);

function App() {
  const { bookmarks, isLoading, error } = useBookmarks();
  //custom hook-ები ასე 

  if (isLoading) {
    return <p>...Loading</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}

export default App;
