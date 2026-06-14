import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";
import type { ptBR } from "../../locales/pt-BR";
import type { ViewMode } from "../../types/ViewMode";
import type { Category } from "../../types/Category";
import type { SelectedCategoryId } from "../../types/SelectedCategoryId";
import { useState } from "react";

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
  categories: Category[];
  selectedCategoryId: SelectedCategoryId;
  onChangeSelectedCategory: (categoryId: SelectedCategoryId) => void;
  onCreateCategory: (name: string) => void;
  onRequestDeleteCategory: (categoryId: string) => void;
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
  categories,
  selectedCategoryId,
  onChangeSelectedCategory,
  onCreateCategory,
  onRequestDeleteCategory,
}: SidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  function handleCreateCategory() {
    onCreateCategory(newCategoryName);
    setNewCategoryName("");
  }

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

      {viewMode === "notes" && (
        <div className="sidebar-categories">
          <h2 className="sidebar-section-title">{t.categories}</h2>

          <button
            className={
              selectedCategoryId === "all"
                ? "sidebar-category-button active"
                : "sidebar-category-button"
            }
            onClick={() => onChangeSelectedCategory("all")}
          >
            {t.allNotes}
          </button>

          <button
            className={
              selectedCategoryId === null
                ? "sidebar-category-button active"
                : "sidebar-category-button"
            }
            onClick={() => onChangeSelectedCategory(null)}
          >
            {t.uncategorized}
          </button>

          {categories.map((category) => (
            <div key={category.id} className="sidebar-category-row">
              <button
                className={
                  selectedCategoryId === category.id
                    ? "sidebar-category-button active"
                    : "sidebar-category-button"
                }
                onClick={() => onChangeSelectedCategory(category.id)}
              >
                {category.name}
              </button>

              <button
                className="sidebar-category-delete-button"
                onClick={() => onRequestDeleteCategory(category.id)}
                title={t.deleteCategory}
              >
                ×
              </button>
            </div>
          ))}

          <div className="sidebar-new-category">
            <input
              className="sidebar-category-input"
              placeholder={t.categoryNamePlaceholder}
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreateCategory();
                }
              }}
            />

            <button
              className="sidebar-small-button"
              onClick={handleCreateCategory}
            >
              {t.createCategory}
            </button>
          </div>
        </div>
      )}

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
