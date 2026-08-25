import styles from "./SnackCard.module.css";
import Button from "../Button/Button.jsx";

function SnackCard({image, name, price}) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={image} alt={name}/>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>Rs.{price}</span>
      </div>

      <div className={styles.actions}>
        <Button>Buy Now</Button>
        <span className={styles.star}>★</span>
      </div>
    </article> 
  );
}

export default SnackCard;