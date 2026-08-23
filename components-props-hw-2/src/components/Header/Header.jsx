import styles from "./Header.module.css";
import NavLink from "../Nav/NavLink.jsx";
import logo from "../../assets/images/logo.png";
import logoText from "../../assets/images/logo-txt.png";
//image-ზე src={logo} ამას პოულობს დაიმპორტებული logo-დან
//ასევე logoText-იც იგივეა, ეს არის ლოგოს ტექსტი, რომელიც დაიმპორტებულია logo-txt.png-დან

function Header() {
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
    </header>
  );
}

export default Header;
