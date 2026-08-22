function Hello() {
  const name = "Mariam";
  const today = new Date().toLocaleDateString();
  return (
    <div>
      <h1>Greeting</h1>
      <p>Hello, I'm {name}!</p>
      <p>Today is {today}.</p>
    </div>
  );
}

export default Hello;

//**Requirements:**
// - the component name must start with a capital letter (`Hello`);
// - all elements must be wrapped in **one root element**;
// - add `export default` at the end of the file.