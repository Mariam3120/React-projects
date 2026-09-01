import styles from "./CartButton.module.css";

function CartButton({count}) {
  return (
    <button className={styles.cart}>
      🛒
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  );
}

export default CartButton;