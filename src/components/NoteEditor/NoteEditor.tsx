import "./NoteEditor.css";
import type { Note } from "../../types/Note";
import type { ptBR } from "../../locales/pt-BR";

type Translations = typeof ptBR;

type NoteEditorProps = {
  selectedNote: Note;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onDeleteNote: () => void;
  onTogglePin: () => void;
  t: Translations;
};

export function NoteEditor({
  selectedNote,
  onUpdateTitle,
  onUpdateContent,
  onDeleteNote,
  onTogglePin,
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

      <textarea
        className="note-editor-textarea"
        value={selectedNote.content}
        onChange={(event) => {
          onUpdateContent(event.target.value);
        }}
        placeholder={t.emptyNotePlaceholder}
      />

      <button onClick={onTogglePin}>
        {selectedNote.pinned ? t.unpinNote : t.pinNote}
      </button>

      <button className="note-editor-delete" onClick={onDeleteNote}>
        {t.deleteNote}
      </button>
    </div>
  );
}
