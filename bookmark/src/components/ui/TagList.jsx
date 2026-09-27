import { TagItem } from "./TagItem";
export function TagList({ tags }) {
  if (tags.length === 0) {
    return null;
  }
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>
          <TagItem>{tag}</TagItem>
        </li>
      ))}
    </ul>
  );
}

/*
TagItem-ში გამოვიყენე ჩილდრენი, ანუ მასში რაღაც კონკტენტი უნდა ჩაჯდეს
ლისტიდან და ეს აქ გამოისახება გამხსნელი და დამხურავი ტაგით
<TagItem>React</TagItem>
//        └─┬─┘
//     this becomes children

key on the <li> — the element .map() returns directly ✅

*/
