import styles from "./Sidebar.module.css";

export function Sidebar({ children }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>🧽</span>
        <span className={styles.logoText}>Bookmark Manager</span>
      </div>

      <div className={styles.sections}>{children}</div>
    </div>
  );
}
