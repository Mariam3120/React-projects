export default function BookmarkCard({ bookmark}) {
  //object destructuring: bookmark არის ობიექტი, რომელიც მოდის ფროფსად BookmarkList-დან, სადაც ის არის ლუპის ცვლადი. აქ ჩვენ ვიღებთ bookmark ობიექტს და ვუწოდებთ მას bookmark.
  const{title, url, description, tags } = bookmark;
  return (
    <article className="card">
      <div className="card-header">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <h2>{title}</h2>
          <p>{url}</p>
        </a>
        <button type="button">⋮</button>
      </div>
      <div>
        <p>{description}</p>
        <div>
          {
            tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))
          }
        </div>
      </div>

    </article>
  )
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