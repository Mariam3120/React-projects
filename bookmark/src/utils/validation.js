import { isValidUrl } from "./url";

export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 240;
export const MAX_TAGS = 6;

export function parseTags(value) {
  // Map გვჭირდება და არა Set: შედარება რეგისტრის გარეშე გვინდა
  // ("react" და "React" ერთია), მაგრამ შენახვა — ისე, როგორც დაწერეს
  const unique = new Map();

  for (const part of value.split(",")) {
    const tag = part.trim();

    if (tag === "") {
      continue;
    }

    const key = tag.toLowerCase();

    // პირველი ვარიანტი იმარჯვებს
    if (!unique.has(key)) {
      unique.set(key, tag);
    }
  }

  return [...unique.values()];
}
// parseTags-ის საპირისპირო: რედაქტირებისას მასივი ისევ ტექსტად გვინდა
export function formatTags(tags) {
  return tags.join(", ");
}

export function validateBookmark(values) {
  const errors = {};

  const title = values.title.trim();

  if (title === "") {
    errors.title = "Title is required.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
  }

  // URL: ჯერ ცარიელობა, მერე ვალიდურობა.
  // შეტყობინებაში მაგალითი მიეცი — "Invalid URL" არაფერს ეუბნება
  // ...
  const url = values.url.trim();
  if (url === "") {
    errors.url = "URL is required.";
  } else if (!isValidUrl(url)) {
    errors.url = "Enter a valid URL, for example react.dev";
  }

  const description = values.description.trim();
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  const tags = parseTags(values.tags);
  if (tags.length === 0) {
    errors.tags = "Add at least one tag.";
  } else if (tags.length > MAX_TAGS) {
    errors.tags = `Use at most ${MAX_TAGS} tags.`;
  }

  return errors;
}
