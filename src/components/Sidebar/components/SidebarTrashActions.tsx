import type { ptBR } from "../../../locales/pt-BR";

type Translations = typeof ptBR;

type SidebarTrashActionsProps = {
  hasDeletedNotes: boolean;
  selectedTrashNoteIds: string[];
  onEmptyTrash: () => void;
  onSelectAllTrashNotes: () => void;
  onClearTrashSelection: () => void;
  onRestoreSelectedNotes: () => void;
  onPermanentlyDeleteSelectedNotes: () => void;
  t: Translations;
};

export function SidebarTrashActions({
  hasDeletedNotes,
  selectedTrashNoteIds,
  onEmptyTrash,
  onSelectAllTrashNotes,
  onClearTrashSelection,
  onRestoreSelectedNotes,
  onPermanentlyDeleteSelectedNotes,
  t,
}: SidebarTrashActionsProps) {
  const hasSelection = selectedTrashNoteIds.length > 0;

  return (
    <section className="sidebar-section sidebar-trash-section">
      <button
        type="button"
        className="sidebar-button sidebar-danger-button"
        onClick={onEmptyTrash}
        disabled={!hasDeletedNotes}
      >
        {t.emptyTrash}
      </button>

      {hasDeletedNotes && (
        <div className="sidebar-trash-actions">
          <div className="sidebar-trash-selection-actions">
            <button
              type="button"
              className="sidebar-small-button"
              onClick={onSelectAllTrashNotes}
            >
              {t.selectAll}
            </button>

            <button
              type="button"
              className="sidebar-small-button"
              onClick={onClearTrashSelection}
              disabled={!hasSelection}
            >
              {t.clearSelection}
            </button>
          </div>

          <button
            type="button"
            className="sidebar-button"
            onClick={onRestoreSelectedNotes}
            disabled={!hasSelection}
          >
            {t.restoreSelected}
          </button>

          <button
            type="button"
            className="sidebar-button sidebar-danger-button"
            onClick={onPermanentlyDeleteSelectedNotes}
            disabled={!hasSelection}
          >
            {t.deleteSelected}
          </button>

          {hasSelection && (
            <small className="sidebar-selected-count">
              {selectedTrashNoteIds.length} {t.selectedNotes}
            </small>
          )}
        </div>
      )}
    </section>
  );
}
