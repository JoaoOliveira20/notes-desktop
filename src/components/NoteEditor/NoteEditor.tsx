import "./NoteEditor.css";
import { useState } from "react";
import type { Note } from "../../types/Note";
import type { ptBR } from "../../locales/pt-BR";
import type { ViewMode } from "../../types/ViewMode";
import type { Category } from "../../types/Category";
import type { Tag } from "../../types/Tag";

type Translations = typeof ptBR;

type NoteEditorProps = {
  selectedNote: Note;
  viewMode: ViewMode;
  categories: Category[];
  tags: Tag[];
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onUpdateCategory: (categoryId: string | null) => void;
  onCreateTag: (name: string) => void;
  onToggleTag: (tagId: string) => void;
  onRequestDeleteTag: (tagId: string) => void;
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
  onCreateTag,
  onToggleTag,
  onRequestDeleteTag,
  onDeleteNote,
  onTogglePin,
  viewMode,
  onRestoreNote,
  categories,
  tags,
  t,
}: NoteEditorProps) {
  const [newTagName, setNewTagName] = useState("");

  function handleCreateTag() {
    onCreateTag(newTagName);
    setNewTagName("");
  }

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

      {viewMode === "notes" && (
        <div className="note-editor-tags">
          <label>{t.tags}</label>

          <div className="note-editor-tags-list">
            {tags.map((tag) => (
              <div key={tag.id} className="note-editor-tag-row">
                <label className="note-editor-tag-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedNote.tagIds.includes(tag.id)}
                    onChange={() => onToggleTag(tag.id)}
                  />

                  <span>{tag.name}</span>
                </label>

                <button
                  className="note-editor-tag-delete-button"
                  onClick={() => onRequestDeleteTag(tag.id)}
                  title={t.deleteTag}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="note-editor-new-tag">
            <input
              value={newTagName}
              placeholder={t.tagNamePlaceholder}
              onChange={(event) => setNewTagName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreateTag();
                }
              }}
            />

            <button onClick={handleCreateTag}>{t.createTag}</button>
          </div>
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
