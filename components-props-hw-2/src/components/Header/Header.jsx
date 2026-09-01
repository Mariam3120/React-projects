import styles from "./Header.module.css";
import NavLink from "../Nav/NavLink.jsx";
import logo from "../../assets/images/logo.png";
import logoText from "../../assets/images/logo-txt.png";
import CartButton from "../CartButton/CartButton.jsx";
//image-ზე src={logo} ამას პოულობს დაიმპორტებული logo-დან
//ასევე logoText-იც იგივეა, ეს არის ლოგოს ტექსტი, რომელიც დაიმპორტებულია logo-txt.png-დან

function Header({cartCount}) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="logo" />
        <img className={styles.brandName} src={logoText} alt="brand name" />
      </div>
      <nav>
        <ul className={styles.navList}>
          <NavLink label="Home" href="#home" />
          <NavLink label="About" href="#about" />
          <NavLink label="Menu" href="#menu" />
          <NavLink label="Contact" href="#contact" />
        </ul>
      </nav>
      <CartButton count ={cartCount} />
    </header>
  );
}

export default Header;


// App        cart.length          = 2
//   ↓        prop "cartCount"
// Header     cartCount            = 2
//   ↓        prop "count"
// CartButton count                = 2
//   ↓
// <span>     displays             🔴 2

//Header receives cartCount from App, then passes it down as count. The name changes, the value doesn't
//  — same thing you spotted with the function hops.


// ── App.jsx ──────────────────────────
{/* <Header cartCount={cart.length} />
//      └── "Header, here's a prop. I'm calling it cartCount. Value: 2"


// ── Header.jsx ───────────────────────
function Header({ cartCount }) {          // unpacks the prop named cartCount
  <CartButton count={cartCount} />
//            └── "CartButton, here's a NEW prop. I'm calling it count. Value: my cartCount, so 2"
}


// ── CartButton.jsx ───────────────────
function CartButton({ count }) {          // unpacks the prop named count */}


// Inside App, "cartCount" is clear — App deals with lots of things, so you say which count.
// Inside CartButton, "count" is enough — it's a cart button, there's only one number it could mean.