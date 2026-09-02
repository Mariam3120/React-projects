import { useState } from "react";
import styles from "./Contact.module.css";
import Button from "../Button/Button.jsx";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({}); //ერორებისთვისაც სთეითს ვქმნით, რათა შევინახოთ ვალიდაციის დროს მიღებული ერორები.

  //საბმითის ფუნქციაში ვაკონსოლებთ ვალიდაციის შემდეგ მიღებულ ერორებს, თუ ერორები არ არის, ვაკონსოლებთ name, email, message-ს.
  //იმიტორო არ ვაგზავნით ჯერ არვაგზავნით სერვერზე, მხოლოდ ვნახულობთ კონსოლში
  //newErrors ცვლადში ვიძახებთ validate ფუნქციას, რომელიც აბრუნებს ერორების ობიექტს. შემდეგ ვაყენებთ ერორებს სთეითში setErrors(newErrors) მეთოდით.
  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log({ name, email, message });
    }
  }

  function validate() {
    const newErrors = {};

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Enter a valid email";
    }

    if (message.trim() === "") {
      newErrors.message = "Message is required";
    }

    return newErrors;
  }

  return (
    <section id="contact" className={styles.contact}>
      <h2>Contact Us</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </label>

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </label>
        <label className={styles.label}>
          Message
          <textarea
            className={styles.textarea}
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <p className={styles.error}>{errors.message}</p>}
        </label>

        <Button>Submit</Button>
      </form>
    </section>
  );
}
export default Contact;
