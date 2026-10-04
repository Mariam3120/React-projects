import { SORT_OPTION_LIST } from "../../constants/sortOptions";

export function SortSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Sort bookmarks"
        >
            {SORT_OPTION_LIST.map((option) => (
                // key აქაც აუცილებელია
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}