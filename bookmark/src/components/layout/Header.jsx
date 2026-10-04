import styles from "./Header.module.css";

export function Header({ children }) {
  return <header className={styles.header}>{children}</header>;
}
