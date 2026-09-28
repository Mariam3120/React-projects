import { TagList } from "../ui/TagList";
import { getDomain, getAvatarLetter } from "../../utils/url.js";
import { getFormattedDate } from "../../utils/date.js";

export function BookmarkCard({ bookmark, onEdit, onDelete, onToggleArchived, onTogglePinned, onVisit }) {
  //object destructuring: bookmark არის ობიექტი, რომელიც მოდის ფროფსად BookmarkList-დან, სადაც ის არის ლუპის ცვლადი. აქ ჩვენ ვიღებთ bookmark ობიექტს და ვუწოდებთ მას bookmark.
  const { title, url, description, tags, isPinned, visitCount, createdAt, id } =
    bookmark;
  return (
    <article className="card">
      <span className="avatar" aria-hidden="true">
        {getAvatarLetter(url)}
      </span>
      <div className="card-header">
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onVisit(id)}>
          <h2>{title}</h2>
          <p>{getDomain(url)}</p>
        </a>
        <div className="actions">
          <button
            type="button"
            onClick={() => onTogglePinned(id)}
            // ღილაკში მხოლოდ იკონია, ტექსტი არ წერია.
            // screen reader-ისთვის სახელი მაინც საჭიროა
            aria-label={isPinned ? "Unpin bookmark" : "Pin bookmark"}
            // მდგომარეობა მხოლოდ ფერით არ უნდა გადმოვცეთ
            aria-pressed={isPinned}
          >
            📌
          </button>
          <button
            type="button"
            onClick={() => onEdit(id)}
            // ღილაკში მხოლოდ იკონია, ტექსტი არ წერია.
            // screen reader-ისთვის სახელი მაინც საჭიროა
            aria-label="Edit bookmark"
            // მდგომარეობა მხოლოდ ფერით არ უნდა გადმოვცეთ
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            // ღილაკში მხოლოდ იკონია, ტექსტი არ წერია.
            // screen reader-ისთვის სახელი მაინც საჭიროა
            aria-label="Delete bookmark"
            // მდგომარეობა მხოლოდ ფერით არ უნდა გადმოვცეთ
          >
            🗑️
          </button>
          <button
            type="button"
            onClick={() => onToggleArchived(id)}
            // ღილაკში მხოლოდ იკონია, ტექსტი არ წერია.
            // screen reader-ისთვის სახელი მაინც საჭიროა
            aria-label="Archive bookmark"
            // მდგომარეობა მხოლოდ ფერით არ უნდა გადმოვცეთ
          >
            🗄️
          </button>
        </div>
      </div>
      <div>
        {/* description შეიძლება ცარიელი იყოს — მაშინ <p> საერთოდ არ გვინდა */}
        {description && <p className="card-description">{description}</p>}

        {/* ეს დავარენდერე პირდაპირ ტაგლისტი და ფროფსად გადავეცი მასივი */}
        <TagList tags={tags} />
        {/* <div>  ეს სანამ კომპონენტად გავიტანდი ტაგებს
          {
            tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))
            //აი აქ key={tag} იმიტომაა რო სტრინგი სულ უნიკალურია აქ არ გვჭირდება აიდი
            //როგორც bookmarkList-ში, სადაც bookmark.id არის უნიკალური, აქ კი tag არის სტრინგი და ის უნიკალურია, ამიტომ შეგვიძლია გამოვიყენოთ key={tag}
          }
        </div> */}
      </div>
      <footer>
        <span>Visits: {visitCount}</span>
        <span>Created: {getFormattedDate(createdAt)}</span>
        {isPinned && <span>Pinned</span>}
      </footer>
    </article>
  );
}

//map-ში{ after => means "here comes a block of code to run", not "here's a value to return". The block runs, nothing is returned, so the function returns undefined:
//(tag) => <span>{tag}</span>        // short enough for one line
//(tag) => ( <span>{tag}</span> )    // parens = "returning this value"
//(tag) => { return <span>{tag}</span> }  // braces = code block, so say "return"
//Memory hook: ( returns, { runs.

//KEY
//React's job on every re-render is to compare the new UI to the old UI
// and change only what differs. For a list, it has to answer: "is this the same item as before, or a different one?"

//ეს არის ეერთი ქარდი რომელიც დარენდერდება, თავისი სტრუქტურით
//ისაა ლისტის შვილი
/*
App                        owns the array in state       bookmarks = [ {...}, {...}, {...} ]
 │                                                                ↓ passes whole array
 └── BookmarkList          receives the array, .map()s it
      │                                                           ↓ passes ONE object per card
      └── BookmarkCard     receives one bookmark, displays it

      */

//აქ bookmark ფროფსი მოდის ლისტის დამეპილიდან, რომელიც ელემენტების მასივს აბრუნებს მთელი სიიდან
//ლისტში მას შეილება დავარქვათ item როგორც ცვლადს მთავარია ფროფსი იყოს იგივე

/*
Same word, two places. List is the one producing it; Card is the one receiving it.

You could rename it in List and nothing breaks:


{bookmarks.map((item) => (
  <BookmarkCard key={item.id} bookmark={item} />
))}
Still works perfectly. Card only cares that the prop is named bookmark — it doesn't care what List called its loop variable.
*/

/*
bookmark={item} so here bookmark on the left is props and item is variable right? and this props should be exactly same as we named it in card ({bookmark})?
YES!
bookmark={item}
//  ↑        ↑
//  prop     the value
//  NAME     you're sending
Left = the label you're attaching it to. Right = the actual data.

// List sends:
<BookmarkCard bookmark={item} />

// Card receives:
function BookmarkCard({ bookmark }) {
//                       ↑ must be the same word

What a mismatch looks like????
// List sends it as "data"
<BookmarkCard data={item} />

// Card asks for "bookmark"
function BookmarkCard({ bookmark }) {
  const { title } = bookmark;  // 💥 bookmark is undefined
You'd get: Cannot destructure property 'title' of 'bookmark' as it is undefined.

React didn't complain about the name — it just built props = { data: {...} }, and Card asked for a bookmark key that isn't there. Got undefined. Then tried to read .title off nothing.

<BookmarkCard key={bookmark.id} bookmark={bookmark}/>
//                      ↑          ↑        ↑
//              loop variable    PROP     loop variable
//                              NAME
//                            must match
//                              Card

*/

// PROP STYLE — object vs separate props:!!!!!!!!!!!!!!!!!!!
// Object prop ({ bookmark }) when the component is ABOUT one entity.
//   It reads bookmark.title, .tags, .isPinned — only a bookmark has those.
//   Keeps the signature short as callbacks get added (onEdit, onDelete...).
//
// Separate props ({ label }) when the component is a GENERIC widget.
//   A <Tag> just shows text — it must not know bookmarks exist, or it
//   can't be reused for anything else.
//
// Ask: "could this render something completely different????????"
//   yes → separate props   |   no → the object

/*
FruitItem only needs a string → so any string works → reusable anywhere
BookmarkCard needs a whole bookmark's shape (title, url, description, tags, isPinned…) → so only a bookmark works
Yes, bookmark can't be something else — because the component reads bookmark.title, bookmark.tags etc. Those only exist on a bookmark.
*/

// PROP STYLE — object თუ ცალკეული props:
//
// Object prop ({ bookmark }) — როცა კომპონენტი ერთ კონკრეტულ entity-ს აღწერს.
//   ის კითხულობს bookmark.title, .tags, .isPinned — ეს properties მხოლოდ
//   bookmark-ს აქვს. ასევე signature მოკლე რჩება, როცა callback-ები
//   დაემატება (onEdit, onDelete, onArchive...).
//
// ცალკეული props ({ label }) — როცა კომპონენტი generic widget-ია.
//   <Tag> უბრალოდ ტექსტს აჩვენებს — მან არ უნდა იცოდეს, რომ bookmark
//   არსებობს, თორემ სხვა რამისთვის ვერ გამოვიყენებთ.
//
// მთავარი კითხვა: "შეუძლია ამ კომპონენტს სრულიად სხვა რამე აჩვენოს?"
//   კი → ცალკეული props   |   არა → object prop
