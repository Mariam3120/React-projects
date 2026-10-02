import styles from "./TagItem.module.css";

export function TagItem({children}) {
  return(
    <span className={styles.tag}>{children}</span>
  )
}