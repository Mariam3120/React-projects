import styles from "./TagFilter.module.css";
export function TagFilter({ tags, selectedTag, onSelect }) {
  if (tags.length === 0) {
    return null; // React-ში "არაფერი არ დახატო" ერთი კონკრეტული მნიშვნელობაა
  }
  return (
    <div>
      <h3>Tags</h3>
      <ul>
      {tags.map(({ tag, count }) => {
        const isActive = tag === selectedTag;
        return (
          <li
            key={tag}
            className={[styles.item, isActive && styles.active]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              type="button"
              onClick={() => onSelect(isActive ? null : tag)}
              aria-pressed={isActive}
            >
              <span>{tag}</span>
              <span>{count}</span>
            </button>
          </li>
        );
      })}
      </ul>
    </div>
  );
}
