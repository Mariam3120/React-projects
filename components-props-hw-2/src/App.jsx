import { useState } from "react";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import Menu from "./components/Menu/Menu.jsx";

function App() {

  //ესე იგი რატოა სთეითი აქ 
  //Props only flow downwards. A component can pass data to its children. 
  // Never to its parent, never to a sibling.
  //გვჭირდება სთეითი ჰედერში და მენიუში SnackCardებთან
  //8 ბარათია, ყველა მათგანი ცალკე კალათას მიიღებდა, ვერ დაინახავდა სხვას
  //თან ჰედერი არაა მათ ქვემოთ 
  //მენიუს შეეძლო გადაეცა 8 ბარათისთვის მარა ჰედერი მენიუს სიბლინგია არა მისი შვილი 
  //აპპი კი ზის ყყველაზე ზემოთ, ჰედერზეც და მენიუზეც 
//State belongs in the lowest common ancestor of every component that needs it.
//Not "the top" as a habit — the lowest one that still reaches everybody. 
//If only Menu and its cards needed the cart, Menu would be the right home and App would be too high. 
// It's App here purely because Header is involved.
//That's why your contact form later will keep its state inside the form — nothing outside needs it. Same rule, different answer. 🙂


  const [cart, setCart] = useState([]);


  //პარამეტრი აქ : "whatever snack you hand me, add it to the cart."
  //მისი ქოლერი არის მენიუში onAddToCart, რომელიც გადაეცემა სნექკარდს, რომელიც გადაეცემა ბატონს, რომელიც ქოლს აკეთებს
  function addToCart(snack) {
    setCart([... cart, snack]);
  }
//The ...cart spread means "everything already in there", then snack is tacked on the end. Without the spread you'd write setCart([snack]) and the cart would reset to one item every click.
//So the parameter answers "which snack?", and the spread answers "keep the old ones too". Two different jobs in one line. 

  return (
    <div>
      <Header cartCount={cart.length}/>
      <Hero />
      <Gallery />
      <Menu onAddToCart={addToCart} />
    </div>
  )
}

export default App;

//cartCount is a prop that is passed to the Header component. It is the length of the cart array, which is the number of items in the cart. The Header component uses this prop to display the number of items in the cart in the CartButton component.
//{cart.length } jsია 
// click Buy Now
//   → addToCart(snack)
//   → setCart([...cart, snack])        cart is now a NEW array
//   → React re-renders App
//   → cart.length is recalculated       3
//   → <Header cartCount={3} />          new prop value
//   → Header re-renders
//   → <CartButton count={3} />
//   → badge shows 3



/* <SnackCard onAddToCart={...} />   ← invented name, passed along
<Button onClick={...} />          ← still invented! Button is YOUR component
<button onClick={onClick}>        ← ⚡ THIS one is React's real event */
