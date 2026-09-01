import styles from "./Menu.module.css";
import SnackCard from "../SnackCard/SnackCard.jsx";
import { snacks } from "../../data/snacks.js";

function Menu({onAddToCart}) {
  return (
    <section  id="menu" className={styles.menu}>
      <div className={styles.grid}>
        {snacks.map((snack) => (
          <SnackCard
            key={snack.id}
            image={snack.image}
            name={snack.name}
            price={snack.price}
            onAddToCart={() => onAddToCart(snack)}
          />
        ))}
      </div>
    </section>
  );
}

export default Menu;

//Menu({ onAddToCart }) is a prop holding a function — yes. Often called a callback: "call me back when something happens."
//() => onAddToCart(snack) is there to pass the snack — yes, exactly.
//It ends up on the button so it can add that snack object — yes.
//onAddToCart={() => onAddToCart(snack)} Left side = a label you're attaching to SnackCard. Right side = using the function Menu was handed.
//The arrow creates a new little function that hasn't run yet. Think of it as a sticky note: "when someone clicks me, add Murukku." 

// App        function addToCart(snack)
//   ↓        passed as prop  onAddToCart
// Menu       wraps it:  () => onAddToCart(snack)
//   ↓        passed as prop  onAddToCart
// SnackCard  passed as prop  onClick
//   ↓
// Button     put on the real <button onClick={...}>
//   ↓
// 🖱️ click → runs back up → setCart → re-render → badge updates


// They are the same function
// There aren't two functions. There's one function, defined in App, that arrives in Menu under a different name:


// App:   function addToCart(snack) { setCart([...cart, snack]) }
//          │
//          │  passed down as the prop "onAddToCart"
//          ▼
// Menu:   onAddToCart   ← this variable HOLDS that exact same function
// So when Menu writes onAddToCart(snack), it is literally calling addToCart in App. Just reaching it through the prop name.


// The two snacks are different things
// This is the part that's tripping you up. One is a placeholder, the other is a real value.


// // APP — defining. "snack" is an empty slot, a name for whatever arrives.
// function addToCart(snack) {
//   setCart([...cart, snack]);
// }

// // MENU — calling. "snack" here is the actual object from .map()
// onAddToCart(snack)
// It's the same as any function you've ever written:


// function greet(name) {        // "name" is a placeholder
//   console.log("Hi " + name);
// }

// greet("Mariam");              // "Mariam" is the real value
// name doesn't mean anything until someone calls greet. Same with snack in addToCart.

// 1. Menu's map is on snack = {id:1, name:"Murukku", price:50, ...}
// 2. That card's arrow function runs:   onAddToCart(  {id:1, name:"Murukku"...}  )
// 3. onAddToCart IS App's addToCart, so App's function starts running
// 4. Inside App, its parameter "snack" now equals {id:1, name:"Murukku"...}
// 5. setCart([...cart, {id:1, name:"Murukku"...}])
// 6. cart = [Murukku]  →  badge shows 1


// Menu has the data (which snack), but no power to change the cart — the cart isn't its state. App has the power, but doesn't know which card you clicked.

// So App sends down the ability to act, and Menu sends back up the information about what happened.
//Data flows down. Events flow up.

//The on prefix is there purely so a human reading onAddToCart thinks "ah, this fires when something happens" rather than "this is a piece of data."