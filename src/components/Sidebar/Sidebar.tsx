import { useState } from "react";
import "./Sidebar.css";
import type { Note } from "../../types/Note";
import { NoteList } from "../NoteList/NoteList";
import { SidebarCategories } from "./components/SidebarCategories";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarSearch } from "./components/SidebarSearch";
import { SidebarTabs } from "./components/SidebarTabs";
import { SidebarTagsFilter } from "./components/SidebarTagsFilter";
import { SidebarTrashActions } from "./components/SidebarTrashActions";
import type { ptBR } from "../../locales/pt-BR";
import type { ViewMode } from "../../types/ViewMode";
import type { Category } from "../../types/Category";
import type { SelectedCategoryId } from "../../types/SelectedCategoryId";
import type { Tag } from "../../types/Tag";
import type { SelectedTagId } from "../../types/SelectedTagId";

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
  tags: Tag[];
  selectedTagId: SelectedTagId;
  onChangeSelectedTag: (tagId: SelectedTagId) => void;
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
  tags,
  selectedTagId,
  onChangeSelectedTag,
}: SidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  function handleCreateCategory() {
    onCreateCategory(newCategoryName);
    setNewCategoryName("");
  }

  return (
    <aside className="sidebar">
      <SidebarHeader appName={t.appName} />

      <button
        type="button"
        className="sidebar-button sidebar-primary-button"
        onClick={onCreateNote}
      >
        {t.newNote}
      </button>

      <SidebarTabs
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        t={t}
      />

      {viewMode === "notes" && (
        <SidebarCategories
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          newCategoryName={newCategoryName}
          onNewCategoryNameChange={setNewCategoryName}
          onChangeSelectedCategory={onChangeSelectedCategory}
          onCreateCategory={handleCreateCategory}
          onRequestDeleteCategory={onRequestDeleteCategory}
          t={t}
        />
      )}

      <SidebarTagsFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onChangeSelectedTag={onChangeSelectedTag}
        t={t}
      />

      {viewMode === "trash" && (
        <SidebarTrashActions
          hasDeletedNotes={hasDeletedNotes}
          selectedTrashNoteIds={selectedTrashNoteIds}
          onEmptyTrash={onEmptyTrash}
          onSelectAllTrashNotes={onSelectAllTrashNotes}
          onClearTrashSelection={onClearTrashSelection}
          onRestoreSelectedNotes={onRestoreSelectedNotes}
          onPermanentlyDeleteSelectedNotes={onPermanentlyDeleteSelectedNotes}
          t={t}
        />
      )}

      <SidebarSearch
        value={search}
        placeholder={t.searchNotes}
        onChange={onSearchChange}
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

      <SidebarFooter settingsLabel={t.settings} onOpenSettings={onOpenSettings} />
    </aside>
  );
}
