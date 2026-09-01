import styles from "./SnackCard.module.css";
import Button from "../Button/Button.jsx";

function SnackCard({image, name, price, onAddToCart}) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={image} alt={name}/>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>Rs.{price}</span>
      </div>

      <div className={styles.actions}>
        <Button onClick={onAddToCart}>Buy Now</Button>
        <span className={styles.star}>★</span>
      </div>
    </article> 
  );
}

export default SnackCard;

// so I give this function as a parameter here as well right? function SnackCard({image, name, price, onAddToCart}) 
// and this parameter is receiving the button  <Button onClick={onAddToCart}>Buy Now</Button> so when onClick someone clicks this function will start working?
// Show less
// Yes — you've got it. One tiny wording fix on direction:

// "this parameter is receiving the button"

// It's the other way round: SnackCard gives the function to the button. The prop comes in from Menu at the top, and gets handed down to Button below.

// function SnackCard({ image, name, price, onAddToCart }) {   // ← comes IN from Menu
//   ...
//   <Button onClick={onAddToCart}>Buy Now</Button>            // ← goes OUT to Button
// }

// And yes — it runs on click
// But note when: the function is only stored during render, sitting there waiting. Nothing runs until a real click happens.

// // SnackCard
// <Button onClick={onAddToCart}>Buy Now</Button>
// //      ↑ still just a prop name — Button is YOUR component

// // Button.jsx
// function Button({ children, onClick }) {
//   return <button onClick={onClick}>{children}</button>;
// }
// //              ↑ NOW it's the browser's real click event (lowercase tag)


// 🖱️  browser fires click on the real <button>
//  →  React calls whatever function is in onClick
//  →  that's () => onAddToCart(snack)  from Menu
//  →  which calls addToCart(snack) in App
//  →  setCart([...cart, snack])
//  →  re-render → badge updates
