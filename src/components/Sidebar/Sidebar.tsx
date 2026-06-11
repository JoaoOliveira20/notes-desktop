import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";

type SidebarProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onCreateNote: () => void;
  onSelectNote: (id: string) => void;
  onExportNotes: () => void;
  onImportNotes: () => void;
  search: string;
  onSearchChange: (search: string) => void;
};

export function Sidebar({
  notes,
  selectedNoteId,
  onCreateNote,
  onSelectNote,
  onExportNotes,
  onImportNotes,
  search,
  onSearchChange,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Notes Desktop</h1>

      <button className="sidebar-button" onClick={onCreateNote}>
        Nova Nota
      </button>

      <button className="sidebar-button" onClick={onImportNotes}>
        Importar Backup
      </button>

      <button className="sidebar-button" onClick={onExportNotes}>
        Exportar Backup
      </button>

      <input
        className="sidebar-search"
        placeholder="Pesquisar notas..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

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
