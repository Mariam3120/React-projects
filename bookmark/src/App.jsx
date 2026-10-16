import { useState, useMemo } from "react";
import { BookmarkList } from "./components/bookmarks/BookmarkList.jsx";
import { useBookmarks } from "./hooks/useBookmarks";
import { VIEWS, getViewOption } from "./constants/views";
import { SORT_OPTIONS } from "./constants/sortOptions";
import {
  selectBookmarks,
  collectTags,
  countByView,
} from "./utils/bookmarkQuery";
import { SearchBar } from "./components/controls/SearchBar";
import { SortSelect } from "./components/controls/SortSelect";
import { ViewFilter } from "./components/controls/ViewFilter";
import { TagFilter } from "./components/controls/TagFilter";
import { Layout } from "./components/layout/Layout";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Button } from "./components/ui/Button";
import { Modal } from "./components/ui/Modal";
import { ConfirmModal } from "./components/ui/ConfirmModal";
import { BookmarkForm } from "./components/bookmarks/BookmarkForm";



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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const [deletedId, setDeletedId] = useState(null);

  // ობიექტი სიიდან გამოითვლება — ზუსტად ისე, როგორც გაფილტრული სია
  const editedBookmark =
    bookmarks.find((bookmark) => bookmark.id === editedId) ?? null;
  const deletedBookmark =
    bookmarks.find((bookmark) => bookmark.id === deletedId) ?? null;

  const visibleBookmarks = useMemo(
    () =>
      selectBookmarks(bookmarks, { view, searchTerm, selectedTag, sortOption }),
    // dependency array: ყველაფერი, რასაც ზემოთა ფუნქცია იყენებს
    [bookmarks, view, searchTerm, selectedTag, sortOption],
  );

  const tags = useMemo(() => collectTags(bookmarks, view), [bookmarks, view]);
  const counts = useMemo(() => countByView(bookmarks), [bookmarks]);

  function handleViewChange(nextView) {
    setView(nextView);
    setSelectedTag(null);
  }

  function handleFormSubmit(values) {
    // ერთი ფუნქცია ორივე რეჟიმს ემსახურება
    if (editedId === null) {
      addBookmark(values);
    } else {
      updateBookmark(editedId, values);
    }

    closeForm();
  }
  function openAddForm() {
    setEditedId(null);
    setIsFormOpen(true);
  }
  function openEditForm(id) {
    setEditedId(id);
    setIsFormOpen(true);
  }
  function closeForm() {
    setIsFormOpen(false);
    setEditedId(null);
  }
  function handleDeleteConfirm() {
    deleteBookmark(deletedId);
    setDeletedId(null);
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
          <Button variant="primary" onClick={openAddForm}>
            + Add Bookmark
          </Button>
        </Header>
      }
      heading={getViewOption(view).heading}
      toolbar={<SortSelect value={sortOption} onChange={setSortOption} />}
    >
      <BookmarkList
        bookmarks={visibleBookmarks}
        onDelete={setDeletedId}
        onTogglePinned={togglePinned}
        onToggleArchived={toggleArchived}
        onVisit={registerVisit}
        onEdit={openEditForm}
      />
      {isFormOpen && (
        <Modal
          title={editedId === null ? "Add bookmark" : "Edit bookmark"}
          onClose={closeForm}
        >
          <BookmarkForm
            bookmark={editedBookmark}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deletedId !== null && (
        <ConfirmModal
          title="Delete bookmark"
          message={`“${deletedBookmark?.title}” will be removed for good.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletedId(null)}
        />
      )}
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
