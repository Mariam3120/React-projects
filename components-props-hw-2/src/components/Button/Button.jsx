import styles from "./Button.module.css";

function Button({children, onClick}){
  return(
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

// function Button({ children, onClick }) {
// //                          ↑ 1. ACCEPT it from the parent
//   return (
//     <button onClick={onClick}>
// //          ↑ 2. ATTACH it to the real element
//       {children}
//     </button>
//   );
// }

// Step 1 unpacks the prop so it exists as a variable. Step 2 puts it on the lowercase <button> — where React does recognise onClick and wires it to a genuine browser click.

// Miss step 1 → the variable doesn't exist (crash). Miss step 2 → it exists but is never used (silent nothing).

// onClick={onClick} — same word, two roles again

// onClick = {onClick}
//    ↑         ↑
//    │         └── the PROP Button received
//    └── the real DOM event, on a lowercase tag



// so wait, I gave this onClick which calls what? the funciton addToCart?
// Yes — ultimately addToCart in App. 🎯

// The clearest way to see it is to substitute each variable with what it actually holds, level by level:


// // App — passes its own function
// <Menu onAddToCart={addToCart} />

// // Menu — so onAddToCart IS addToCart. Menu wraps it:
// <SnackCard onAddToCart={() => addToCart(snack)} />

// // SnackCard — so its onAddToCart IS () => addToCart(snack)
// <Button onClick={() => addToCart(snack)}>

// // Button — so its onClick IS () => addToCart(snack)
// <button onClick={() => addToCart(snack)}>
// By the time it reaches the real <button>, the thing sitting in onClick is literally:


// () => addToCart(snack)
// The prop names changed at every level — onAddToCart, onAddToCart, onClick, onClick — but the function inside never did. Renaming a variable doesn't change what's in it.