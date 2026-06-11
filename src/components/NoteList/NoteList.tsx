import "./NoteList.css";
import type { Note } from "../../types/Note";

type NoteListProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
};

export function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
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
              : "note-list-item"
          }
        >
          <h3 className="note-list-title">{note.title}</h3>
          <p className="note-list-content">
            {note.content.slice(0, 60)}
            {note.content.length > 60 ? "..." : ""}
          </p>

          {note.createdAt && (
            <small className="note-list-date">
              Updated {new Date(note.updatedAt).toLocaleDateString()}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
