import styles from "./SearchBar.module.css";
export function SearchBar({ value, onChange, placeholder = "Search bookmarks…" }) {
    return (
        <div className={styles.search}>
            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                //1onChange არის ატრიბუტი, მეორე ფროფსი
                placeholder={placeholder}
                // ველს ხილული <label> არ აქვს — სახელი სხვა გზით უნდა მივცეთ
                aria-label="Search bookmarks"
            />

            {/* გასუფთავების ღილაკი მხოლოდ მაშინ, როცა რამე აკრეფილია */}
            {value !== "" && (
                <button
                    type="button"
                    // "გასუფთავება" ნიშნავს: ცარიელი ტექსტი ამცნო მშობელს
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

// export function SearchBar({ value, onSearchChange }) {
//   <input onChange={(event) => onSearchChange(event.target.value)} />
  //       ↑ can't rename            ↑ renamed freely
