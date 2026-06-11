import "./NoteEditor.css";
import type { Note } from "../../types/Note";

type NoteEditorProps = {
  selectedNote: Note;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onDeleteNote: () => void;
};

export function NoteEditor({
  selectedNote,
  onUpdateTitle,
  onUpdateContent,
  onDeleteNote,
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
        placeholder="Escreva aqui..."
      />

      <button className="note-editor-delete" onClick={onDeleteNote}>
        Apagar Nota
      </button>
    </div>
  );
}
