import styles from "./Sidebar.module.css";
import spongebob from "../../assets/s.jpeg";

export function Sidebar({ children }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>
          <img src={spongebob} alt="" />
        </span>
        <span className={styles.logoText}>Bookmark Manager</span>
      </div>

      <div className={styles.sections}>{children}</div>
    </div>
  );
}

