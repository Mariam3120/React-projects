import styles from './GalleryImage.module.css';

function GalleryImage({src, alt}){
  return <img className={styles.image} src={src} alt={alt}/>;

}

export default GalleryImage;