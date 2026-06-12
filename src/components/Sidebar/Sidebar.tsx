import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";
import type { ptBR } from "../../locales/pt-BR";

type Translations = typeof ptBR;

type SidebarProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onCreateNote: () => void;
  onSelectNote: (id: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onOpenSettings: () => void;
  t: Translations;
};

export function Sidebar({
  notes,
  selectedNoteId,
  onCreateNote,
  onSelectNote,
  search,
  onSearchChange,
  onOpenSettings,
  t,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">{t.appName}</h1>

      <button className="sidebar-button" onClick={onCreateNote}>
        {t.newNote}
      </button>

      <input
        className="sidebar-search"
        placeholder={t.searchNotes}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div className="sidebar-list">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
          t={t}
        />
      </div>

      <button className="sidebar-button" onClick={onOpenSettings}>
        {t.settings}
      </button>
    </aside>
  );
}
