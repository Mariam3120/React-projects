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