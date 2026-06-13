import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";
import type { ptBR } from "../../locales/pt-BR";
import type { ViewMode } from "../../types/ViewMode";

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
  viewMode: ViewMode;
  onChangeViewMode: (viewMode: ViewMode) => void;
  onEmptyTrash: () => void;
  hasDeletedNotes: boolean;
  selectedTrashNoteIds: string[];
  onToggleTrashNoteSelection: (noteId: string) => void;
  onSelectAllTrashNotes: () => void;
  onClearTrashSelection: () => void;
  onRestoreSelectedNotes: () => void;
  onPermanentlyDeleteSelectedNotes: () => void;
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
  viewMode,
  onChangeViewMode,
  onEmptyTrash,
  hasDeletedNotes,
  selectedTrashNoteIds,
  onToggleTrashNoteSelection,
  onSelectAllTrashNotes,
  onClearTrashSelection,
  onRestoreSelectedNotes,
  onPermanentlyDeleteSelectedNotes,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">{t.appName}</h1>

      <button className="sidebar-button" onClick={onCreateNote}>
        {t.newNote}
      </button>

      <div className="sidebar-tabs">
        <button
          className={
            viewMode === "notes" ? "sidebar-tab active" : "sidebar-tab"
          }
          onClick={() => onChangeViewMode("notes")}
        >
          {t.notes}
        </button>

        <button
          className={
            viewMode === "trash" ? "sidebar-tab active" : "sidebar-tab"
          }
          onClick={() => onChangeViewMode("trash")}
        >
          {t.trash}
        </button>
      </div>

      {viewMode === "trash" && (
        <button
          className="sidebar-button sidebar-danger-button"
          onClick={onEmptyTrash}
          disabled={!hasDeletedNotes}
        >
          {t.emptyTrash}
        </button>
      )}

      {viewMode === "trash" && hasDeletedNotes && (
        <div className="sidebar-trash-actions">
          <div className="sidebar-trash-selection-actions">
            <button
              className="sidebar-small-button"
              onClick={onSelectAllTrashNotes}
            >
              {t.selectAll}
            </button>

            <button
              className="sidebar-small-button"
              onClick={onClearTrashSelection}
              disabled={selectedTrashNoteIds.length === 0}
            >
              {t.clearSelection}
            </button>
          </div>

          <button
            className="sidebar-button"
            onClick={onRestoreSelectedNotes}
            disabled={selectedTrashNoteIds.length === 0}
          >
            {t.restoreSelected}
          </button>

          <button
            className="sidebar-button sidebar-danger-button"
            onClick={onPermanentlyDeleteSelectedNotes}
            disabled={selectedTrashNoteIds.length === 0}
          >
            {t.deleteSelected}
          </button>

          {selectedTrashNoteIds.length > 0 && (
            <small className="sidebar-selected-count">
              {selectedTrashNoteIds.length} {t.selectedNotes}
            </small>
          )}
        </div>
      )}

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
          viewMode={viewMode}
          selectedTrashNoteIds={selectedTrashNoteIds}
          onToggleTrashNoteSelection={onToggleTrashNoteSelection}
          t={t}
        />
      </div>

      <button className="sidebar-button" onClick={onOpenSettings}>
        {t.settings}
      </button>
    </aside>
  );
}
