import { useState, useMemo } from "react";
import { BookmarkList } from "./components/bookmarks/BookmarkList.jsx";
import { useBookmarks } from "./hooks/useBookmarks";
import { VIEWS, getViewOption } from "./constants/views";
import { SORT_OPTIONS } from "./constants/sortOptions";
import { selectBookmarks, collectTags, countByView } from "./utils/bookmarkQuery";
import { SearchBar } from "./components/controls/SearchBar";
import { SortSelect } from "./components/controls/SortSelect";
import { ViewFilter } from "./components/controls/ViewFilter";
import { TagFilter } from "./components/controls/TagFilter";
import { Layout } from "./components/layout/Layout";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import headerStyles from "./components/layout/Header.module.css";



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
//TEST2
// console.log(getDomain("https://www.react.dev/learn"))
// console.log(getDomain("not a url"))
// console.log(getFormattedDate("2025-11-03T09:12:00.000Z")	)
// console.log(getFormattedDate("გამარჯობა"))

function App() {
  const {
    bookmarks,
    isLoading,
    error,
    deleteBookmark,
    togglePinned,
    toggleArchived,
    registerVisit,
    addBookmark,
    updateBookmark,
  } = useBookmarks();
  //custom hook-ებს ასე ვიძახებთ, როგორც ჩვეულებრივ ფუნქციებს. useBookmarks-ი არის custom hook, რომელიც encapsulate-ს
  // აკეთებს state-ს და side effect-ს bookmark-ების ჩატვირთვისთვის და შენახვისთვის localStorage-ში.
  const [view, setView] = useState(VIEWS.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NEWEST);

  const visibleBookmarks = useMemo(
    () => selectBookmarks(bookmarks, { view, searchTerm, selectedTag, sortOption }),
    // dependency array: ყველაფერი, რასაც ზემოთა ფუნქცია იყენებს
    [bookmarks, view, searchTerm, selectedTag, sortOption],
);

const tags = useMemo(() => collectTags(bookmarks, view), [bookmarks, view]);
const counts = useMemo(() => countByView(bookmarks), [bookmarks]);

  function handleViewChange(nextView) {
    setView(nextView);
    setSelectedTag(null);
  }


  if (isLoading) {
    return <p>...Loading</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

    return (
    <Layout
      sidebar={
        <Sidebar>
          <ViewFilter view={view} onChange={handleViewChange} counts={counts} />
          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            onSelect={setSelectedTag}
          />
        </Sidebar>
      }
      header={
        <Header>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <button
            type="button"
            className={headerStyles.addButton}
            onClick={() =>
              addBookmark({
                title: "Test bookmark",
                url: "https://example.com",
                description: "Temporary",
                tags: ["Test"],
              })
            }
          >
            + Add Bookmark
          </button>
        </Header>
      }
      heading={getViewOption(view).heading}
      toolbar={<SortSelect value={sortOption} onChange={setSortOption} />}
    >
      <BookmarkList
        bookmarks={visibleBookmarks}
        onDelete={deleteBookmark}
        onTogglePinned={togglePinned}
        onToggleArchived={toggleArchived}
        onVisit={registerVisit}
        onEdit={(id) => updateBookmark(id, { title: "EDITED!" })}
      />
    </Layout>
  );

}

export default App;

//THE WHOLE FLOW (როგორ გადაცემს აპი ლისტს bookmarks-ებს)
/*
// 1. useBookmarks.js — the fetch
const data = await response.json();
setBookmarks(data);                          // → into state

// 2. useBookmarks.js — the hook hands it out
return { bookmarks, isLoading, error };

// 3. App.jsx — App takes it
const { bookmarks, isLoading, error } = useBookmarks();

// 4. App.jsx — App passes it down
<BookmarkList bookmarks={bookmarks} />

// 5. BookmarkList.jsx — List receives it
export default function BookmarkList({ bookmarks })

bookmarks.json
      ↓ fetch
useBookmarks   → returns { bookmarks, isLoading, error }
      ↓ App calls the hook
App            → const { bookmarks } = useBookmarks()
      ↓ prop
BookmarkList   → ({ bookmarks })
      ↓ map → one object each
BookmarkCard   → ({ bookmark })


The thing to notice
The word bookmarks appears at every step — but it's a different variable each time, just named consistently on purpose:

Where	What it is
useBookmarks	the state
App	a local variable from destructuring the hook's return
App's JSX	a prop being set
List	a prop being received
Same name, four separate things, connected by hand-offs. That's why it feels like one thing flowing — and naming it the same everywhere is deliberate, so you can follow the path

*/
