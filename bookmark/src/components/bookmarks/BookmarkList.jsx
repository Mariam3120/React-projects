import { BookmarkCard } from "./BookmarkCard";
import styles from "./BookmarkList.module.css";


export function BookmarkList({bookmarks, onEdit, onDelete, onToggleArchived, onTogglePinned, onVisit }) {
  /* დავსვათ კითხვა არის თუ არა ეს მასივი ცარიელი? */
  if (bookmarks.length === 0) {
    return <p className={styles.empty}>No Bookmarks found.</p>
  }
  return (
    <ul className={styles.list}>
      {
        bookmarks.map((bookmark)=>(
          <li key={bookmark.id} className={styles.item}>
            <BookmarkCard bookmark={bookmark} onEdit={onEdit} onDelete={onDelete} onToggleArchived={onToggleArchived} onTogglePinned={onTogglePinned} onVisit={onVisit}/>
          </li>
        ))
      }

    </ul>
  );
}



/*
(tag) => ( <span/> )              // ✅ returns automatically
(tag) => { return <span/> }       // ✅ also fine — you said "return"
(tag) => { <span/> }              // ❌ runs, returns nothing

ამ კომპონენტში შემოდის მთლიანი ობიექტის სია, ფროფსად მრავლობითში იმიტორო
ბევრია და ქარდში კი ერთ ცალზე ვმუშაობთ. ჯერ ცარიელი თუ წამოვა რა მოხდეს
და მერე დავუვლით მეპით და ქარდს დავხატავთ! 
BookmarkList in plain words:

It takes a list of bookmarks and turns it into cards on the screen.

That's it. Three things happen:

Receives the array from App (as a prop)
Checks if it's empty — if yes, shows "No Bookmarks found" and stops
Loops through it with .map() — one BookmarkCard per bookmark, each with its id as the key
It stores nothing and decides nothing. No state, no fetch, no filtering. It just displays whatever array it's given.

Think of it as a delivery guy: App gives him a box of bookmarks, he hands one to each card. He doesn't own the box, doesn't open it, doesn't change what's inside.

That's why the same component can later show your All view, your Archived view, and your search results — it never knows the difference. It just renders the array it's handed.
*/

