import styles from "./Hero.module.css";
import Button from "../Button/Button.jsx";
import badge from "../../assets/images/disc.png";
import promoCard from "../../assets/images/promo-card.png";

function Hero() {
  return(
    <section className={styles.hero}>
      <div className={styles.left}>
        <img src={badge} alt="Up to 50% off" />
      </div>
      <div className={styles.center}>
        <h1>Relive The Taste of Tamil Nadu</h1>
        <p>
          Handmade with heritage and heart,
          <br />
          Our snacks &amp; sweets are a timeless art!
        </p>
      </div>

      <div className={styles.right}>
        <img src={promoCard} alt="Authentic Tamil Nadu Snacks & Sweets" />
        <Button label="Place Order" />
      </div>
    </section>
  );
}

export default Hero;
