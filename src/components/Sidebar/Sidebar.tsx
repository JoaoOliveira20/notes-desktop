import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";

type SidebarProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onCreateNote: () => void;
  onSelectNote: (id: string) => void;
};

export function Sidebar({
  notes,
  selectedNoteId,
  onCreateNote,
  onSelectNote,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Notes Desktop</h1>

      <button className="sidebar-button" onClick={onCreateNote}>
        Nova Nota
      </button>

      <div className="sidebar-list">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
        />
      </div>
    </aside>
  );
}
