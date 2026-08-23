import styles from "./NavLink.module.css";
//ობიექტური დესტრუქტურიზაცია, რომ props-იდან გამოვიტანოთ label და href
//გრძელი ვერსია ფროფსებიდან ამოღების
// function NavLink(props) {
//   // props is an object: { label: "Home", href: "#home" }
//   return <a href={props.href}>{props.label}</a>;
// }
// When Header writes this: <NavLink label="Home" href="#home" />
// React collects those attributes into one object — { label: "Home", href: "#home" }
//  — and passes it to your function as props. Props are just a function's arguments, delivered as an object.

function NavLink({ label, href }) {
  return (
    <li>
      <a className={styles.link} href={href}>
        {label}
      </a>
    </li>
  );
}
export default NavLink;
//Makes this component available to other files.

//styles.link არის css მოდულის გამოყენება, რომელიც საშუალებას გვაძლევს დავამატოთ სტილები კონკრეტულ ელემენტზე.
//ის ასევე აგვარებს რომ სტილების კონფლიქტი თავიდან აიცილოს, რადგან css მოდული ავტომატურად ქმნის უნიკალურ კლასის სახელს.
//React runs your one NavLink function four separate times, each with a different props object.
// Each run produces its own <li>. One recipe, four cakes — different ingredients each time.
