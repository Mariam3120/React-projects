import styles from "./Gallery.module.css";
import GalleryImage from "../GalleryImage/GalleryImage.jsx";
import snacksGrid from "../../assets/images/snacks-grid.png";
import snacksTray from "../../assets/images/snacks-tray.png";
import snacksPlatter from "../../assets/images/snacks-platter.png";

function Gallery() {
  return (
    <section className={styles.gallery}>
      <div className={styles.row}>
        <GalleryImage src={snacksGrid} alt="snacks grid" />
        <GalleryImage src={snacksTray} alt="snacks tray" />
        <GalleryImage src={snacksPlatter} alt="snacks platter" />
      </div>
    </section>
  );
}

export default Gallery;
