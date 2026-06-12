import "./NoteList.css";
import type { Note } from "../../types/Note";
import type { ptBR } from "../../locales/pt-BR";

type Translations = typeof ptBR;

type NoteListProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  t: Translations;
};

export function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  t,
}: NoteListProps) {
  return (
    <div>
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={
            note.id === selectedNoteId
              ? "note-list-item note-list-item-active"
              : note.pinned
                ? "note-list-item note-list-item-pinned"
                : "note-list-item"
          }
        >
          <h3 className="note-list-title">
            {note.pinned ? "📌 " : ""}
            {note.title}
          </h3>

          <p className="note-list-content">
            {note.content.slice(0, 60)}
            {note.content.length > 60 ? "..." : ""}
          </p>

          <small className="note-list-date">
            {t.updated} {new Date(note.updatedAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
