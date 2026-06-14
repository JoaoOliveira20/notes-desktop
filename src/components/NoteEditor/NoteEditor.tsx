import "./NoteEditor.css";
import type { Note } from "../../types/Note";
import type { ptBR } from "../../locales/pt-BR";
import type { ViewMode } from "../../types/ViewMode";
import type { Category } from "../../types/Category";

type Translations = typeof ptBR;

type NoteEditorProps = {
  selectedNote: Note;
  viewMode: ViewMode;
  categories: Category[];
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onUpdateCategory: (categoryId: string | null) => void;
  onDeleteNote: () => void;
  onTogglePin: () => void;
  onRestoreNote: () => void;
  t: Translations;
};

export function NoteEditor({
  selectedNote,
  onUpdateTitle,
  onUpdateContent,
  onUpdateCategory,
  onDeleteNote,
  onTogglePin,
  viewMode,
  onRestoreNote,
  categories,
  t,
}: NoteEditorProps) {
  return (
    <div className="note-editor">
      <input
        className="note-editor-input"
        value={selectedNote.title}
        onChange={(event) => {
          onUpdateTitle(event.target.value);
        }}
      />

      {viewMode === "notes" && (
        <div className="note-editor-category">
          <label>{t.category}</label>

          <select
            value={selectedNote.categoryId ?? ""}
            onChange={(event) => {
              const categoryId = event.target.value || null;
              onUpdateCategory(categoryId);
            }}
          >
            <option value="">{t.uncategorized}</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <textarea
        className="note-editor-textarea"
        value={selectedNote.content}
        onChange={(event) => {
          onUpdateContent(event.target.value);
        }}
        placeholder={t.emptyNotePlaceholder}
      />

      {viewMode === "trash" ? (
        <>
          <button onClick={onRestoreNote}>{t.restoreNote}</button>

          <button className="note-editor-delete" onClick={onDeleteNote}>
            {t.deletePermanently}
          </button>
        </>
      ) : (
        <>
          <button onClick={onTogglePin}>
            {selectedNote.pinned ? t.unpinNote : t.pinNote}
          </button>

          <button className="note-editor-delete" onClick={onDeleteNote}>
            {t.moveToTrash}
          </button>
        </>
      )}
    </div>
  );
}
