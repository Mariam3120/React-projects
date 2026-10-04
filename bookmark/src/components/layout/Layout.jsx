import styles from "./Layout.module.css";

export function Layout({ sidebar, header, heading, toolbar, children }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebarSlot}>{sidebar}</aside>

      <main className={styles.main}>
        {header}

        <div className={styles.toolbar}>
          <h2 className={styles.heading}>{heading}</h2>
          {toolbar}
        </div>

        {children}
      </main>
    </div>
  );
}
