import { useState } from "react";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { normalizeUrl } from "../../utils/url";
import {
  formatTags,
  parseTags,
  validateBookmark,
  MAX_TAGS,
} from "../../utils/validation";
import styles from "./BookmarkForm.module.css";

const EMPTY_VALUES = { title: "", url: "", description: "", tags: "" };

// ფორმის ყველა ველი string-ია, მათ შორის tags —
// მასივად ის მხოლოდ გაგზავნის მომენტში იქცევა
function getInitialValues(bookmark) {
  // bookmark არ არის → დამატების რეჟიმი
  if (!bookmark) {
    return EMPTY_VALUES;
  }

  return {
    title: bookmark.title,
    url: bookmark.url,
    // seed-ში description შეიძლება არ იყოს — controlled input-ს
    // undefined არ შეიძლება მიეცეს
    description: bookmark.description ?? "",
    tags: formatTags(bookmark.tags),
  };
}

export function BookmarkForm({ bookmark, onSubmit, onCancel }) {
  // ყურადღება: useState(getInitialValues(bookmark)) ფუნქციას ყოველ
  // render-ზე გამოიძახებდა. ფრჩხილების გარეშე გადაცემული ფუნქცია
  // მხოლოდ პირველ render-ზე შესრულდება
  const [values, setValues] = useState(() => getInitialValues(bookmark));
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(bookmark);

  // ერთი handler ოთხივე ველისთვის — input-ის name ამბობს, რომელია
  function handleChange(event) {
    const { name, value } = event.target;

    // [name] — computed property: ცვლადის მნიშვნელობა ხდება key
    setValues((current) => ({ ...current, [name]: value }));

    // შეცდომა ქრება, როგორც კი ველს შეეხები: გამოსწორება არ უნდა ისჯებოდეს
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  function handleSubmit(event) {
    // ამის გარეშე ბრაუზერი გვერდს გადატვირთავს — ეს HTML-ის
    // ნაგულისხმევი ქცევაა ფორმის გაგზავნისას
    event.preventDefault();

    const nextErrors = validateBookmark(values);
    setErrors(nextErrors);

    // ობიექტი ცარიელია? Object.keys(...).length ამას გეტყვის
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // მშობელს სუფთა მონაცემი გადაეცემა: ზედმეტი ჰარეების გარეშე,
    // სწორი მისამართით და tag-ების მასივით
    onSubmit({
      title: values.title.trim(),
      url: normalizeUrl(values.url),
      description: values.description.trim(),
      tags: parseTags(values.tags),
    });
  }

  return (
    // noValidate ბრაუზერის საკუთარ შეტყობინებებს თიშავს —
    // ჩვენ ჩვენივე ტექსტები გვინდა, ჩვენივე ენაზე და ადგილას
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <FormField id="bookmark-title" label="Title" error={errors.title}>
        <input
          id="bookmark-title"
          // name უნდა ემთხვეოდეს values-ის key-ს!
          name="title"
          value={values.title}
          onChange={handleChange}
          autoFocus
          // პირველი ველი ფოკუსში modal-ის გახსნისთანავე
          // screen reader-ს უნდა ეცნობოს, რომ ველი არასწორია
          aria-invalid={Boolean(errors.title)}
          // და სად წერია, რატომ
          aria-describedby={errors.title ? "bookmark-title-error" : undefined}
        />
      </FormField>
      <FormField id="bookmark-url" label="URL" error={errors.url}>
        <input
          id="bookmark-url"
          // name უნდა ემთხვეოდეს values-ის key-ს!
          name="url"
          value={values.url}
          onChange={handleChange}
          // პირველი ველი ფოკუსში modal-ის გახსნისთანავე
          placeholder="react.dev"
          // screen reader-ს უნდა ეცნობოს, რომ ველი არასწორია
          aria-invalid={Boolean(errors.url)}
          // და სად წერია, რატომ
          aria-describedby={errors.url ? "bookmark-url-error" : undefined}
        />
      </FormField>
      <FormField
        id="bookmark-description"
        label="Description"
        hint="Optional."
        error={errors.description}
      >
        <textarea
          id="bookmark-description"
          name="description"
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "bookmark-description-error" : undefined
          }
        />
      </FormField>
      <FormField
        id="bookmark-tags"
        label="Tags"
        error={errors.tags}
        hint={`Separate with commas, up to ${MAX_TAGS} tags.`}
      >
        <input
          id="bookmark-tags"
          // name უნდა ემთხვეოდეს values-ის key-ს!
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="React, Frontend"
          // პირველი ველი ფოკუსში modal-ის გახსნისთანავე
          // screen reader-ს უნდა ეცნობოს, რომ ველი არასწორია
          aria-invalid={Boolean(errors.tags)}
          // და სად წერია, რატომ
          aria-describedby={errors.tags ? "bookmark-tags-error" : undefined}
        />
      </FormField>

      {/* url, description (textarea), tags — იმავე ნიმუშით.
                tags-ს hint დაუწერე: "Separate with commas, up to N tags." */}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {/* ეს ღილაკი ფორმას აგზავნის — რომელი type სჭირდება? */}
        <Button type="submit" variant="primary">
          {isEditing ? "Save changes" : "Add bookmark"}
        </Button>
      </div>
    </form>
  );
}
