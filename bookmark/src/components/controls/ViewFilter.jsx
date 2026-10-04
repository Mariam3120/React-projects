import { VIEW_OPTIONS } from "../../constants/views";
import styles from "./ViewFilter.module.css";

export function ViewFilter({ view, onChange, counts }) {
  return (
    <nav>
      <ul className={styles.list}>
        {VIEW_OPTIONS.map((option) => {
          const isActive = option.value === view;
          return (
            <li key={option.value}>
              <button
                type="button"
                // ორი კლასი, როცა აქტიურია, ერთი — როცა არა.
                // .filter(Boolean) აგდებს false-ს, join ერთ string-ად აქცევს
                className={[styles.item, isActive && styles.active]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onChange(option.value)}
                // ნავიგაციისთვის სწორი ატრიბუტია aria-current, ღილაკებისთვის კი aria-pressed.
                // sidebar-ის ხედები ნავიგაციაა
                aria-current={isActive ? "page" : undefined}
              >
                <span className={styles.icon}>{option.icon}</span>
                <span className={styles.label}>{option.label}</span>
                <span className={styles.count}>{counts[option.value]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
