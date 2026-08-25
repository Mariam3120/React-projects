import styles from "./Menu.module.css";
import SnackCard from "../SnackCard/SnackCard.jsx";
import { snacks } from "../../data/snacks.js";

function Menu() {
  return (
    <section  id="menu" className={styles.menu}>
      <div className={styles.grid}>
        {snacks.map((snack) => (
          <SnackCard
            key={snack.id}
            image={snack.image}
            name={snack.name}
            price={snack.price}
          />
        ))}
      </div>
    </section>
  );
}

export default Menu;
