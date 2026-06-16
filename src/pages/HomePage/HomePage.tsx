import "./HomePage.css";
import { useState } from "react";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { SettingsModal } from "../../components/Modal/SettingsModal/SettingsModal";
import { ConfirmModal } from "../../components/Modal/ConfirmModal/ConfirmModal";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import type { ViewMode } from "../../types/ViewMode";

import { useNotes } from "../../hooks/useNotes";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";

export function HomePage() {
  const {
    filteredNotes,
    filteredDeletedNotes,
    deletedNotes,
    search,
    setSearch,
    selectedNote,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    exportNotes,
    importNotes,
    updateTitle,
    updateContent,
    moveNoteToTrash,
    permanentlyDeleteNote,
    togglePin,
    restoreNote,
    emptyTrash,
    restoreSelectedNotes,
    permanentlyDeleteSelectedNotes,
    categories,
    selectedCategoryId,
    changeSelectedCategory,
    createCategory,
    deleteCategory,
    updateNoteCategory,
    tags,
    createTag,
    deleteTag,
    toggleTagOnSelectedNote,
    selectedTagId,
    changeSelectedTag,
  } = useNotes();

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("notes");
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
  const [tagIdToDelete, setTagIdToDelete] = useState<string | null>(null);
  const [selectedTrashNoteIds, setSelectedTrashNoteIds] = useState<string[]>(
    [],
  );
  const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] =
    useState(false);

  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null,
  );

  const visibleSelectedNote =
    selectedNote && selectedNote.deleted === (viewMode === "trash")
      ? selectedNote
      : null;

  const categoryToDelete = categories.find(
    (category) => category.id === categoryIdToDelete,
  );

  const tagToDelete = tags.find((tag) => tag.id === tagIdToDelete);

  function handleCreateNote() {
    setViewMode("notes");
    createNote();
  }

  function handleRestoreNote() {
    restoreNote();
    setViewMode("notes");
  }

  function handleChangeViewMode(newViewMode: ViewMode) {
    setViewMode(newViewMode);
    setSelectedNoteId(null);
    setSelectedTrashNoteIds([]);
  }

  function handleToggleTrashNoteSelection(noteId: string) {
    setSelectedTrashNoteIds((currentSelectedIds) => {
      if (currentSelectedIds.includes(noteId)) {
        return currentSelectedIds.filter((id) => id !== noteId);
      }

      return [...currentSelectedIds, noteId];
    });
  }

  function handleSelectAllTrashNotes() {
    setSelectedTrashNoteIds(filteredDeletedNotes.map((note) => note.id));
  }

  function handleClearTrashSelection() {
    setSelectedTrashNoteIds([]);
  }

  function handleRestoreSelectedNotes() {
    restoreSelectedNotes(selectedTrashNoteIds);
    setSelectedTrashNoteIds([]);
    setViewMode("notes");
  }

  function handlePermanentlyDeleteSelectedNotes() {
    permanentlyDeleteSelectedNotes(selectedTrashNoteIds);
    setSelectedTrashNoteIds([]);
  }

  return (
    <div className="home-page">
      <Sidebar
        notes={viewMode === "notes" ? filteredNotes : filteredDeletedNotes}
        selectedNoteId={selectedNoteId}
        search={search}
        onSearchChange={setSearch}
        onCreateNote={handleCreateNote}
        onSelectNote={setSelectedNoteId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onChangeViewMode={handleChangeViewMode}
        onEmptyTrash={() => setIsEmptyTrashModalOpen(true)}
        hasDeletedNotes={deletedNotes.length > 0}
        selectedTrashNoteIds={selectedTrashNoteIds}
        onToggleTrashNoteSelection={handleToggleTrashNoteSelection}
        onSelectAllTrashNotes={handleSelectAllTrashNotes}
        onClearTrashSelection={handleClearTrashSelection}
        onRestoreSelectedNotes={handleRestoreSelectedNotes}
        onPermanentlyDeleteSelectedNotes={() => {
          if (selectedTrashNoteIds.length === 0) {
            return;
          }

          setIsDeleteSelectedModalOpen(true);
        }}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onChangeSelectedCategory={changeSelectedCategory}
        onCreateCategory={createCategory}
        onRequestDeleteCategory={setCategoryIdToDelete}
        tags={tags}
        selectedTagId={selectedTagId}
        onChangeSelectedTag={changeSelectedTag}
        t={t}
      />

      {visibleSelectedNote ? (
        <NoteEditor
          selectedNote={visibleSelectedNote}
          viewMode={viewMode}
          categories={categories}
          tags={tags}
          onUpdateTitle={updateTitle}
          onUpdateContent={updateContent}
          onUpdateCategory={updateNoteCategory}
          onCreateTag={createTag}
          onToggleTag={toggleTagOnSelectedNote}
          onRequestDeleteTag={setTagIdToDelete}
          onDeleteNote={() => setIsDeleteModalOpen(true)}
          onTogglePin={togglePin}
          onRestoreNote={handleRestoreNote}
          t={t}
        />
      ) : (
        <EmptyState title={t.emptyStateTitle} message={t.emptyStateMessage} />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
        onImportNotes={importNotes}
        onExportNotes={exportNotes}
        t={t}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={
          viewMode === "trash"
            ? t.confirmPermanentDeleteTitle
            : t.confirmMoveToTrashTitle
        }
        message={
          viewMode === "trash"
            ? t.confirmPermanentDeleteMessage
            : t.confirmMoveToTrashMessage
        }
        confirmLabel={
          viewMode === "trash" ? t.deletePermanently : t.moveToTrash
        }
        cancelLabel={t.cancel}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (viewMode === "trash") {
            permanentlyDeleteNote();
          } else {
            moveNoteToTrash();
          }

          setIsDeleteModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={isEmptyTrashModalOpen}
        title={t.emptyTrashTitle}
        message={t.emptyTrashMessage}
        confirmLabel={t.emptyTrash}
        cancelLabel={t.cancel}
        onCancel={() => setIsEmptyTrashModalOpen(false)}
        onConfirm={() => {
          emptyTrash();
          setSelectedTrashNoteIds([]);
          setIsEmptyTrashModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteSelectedModalOpen}
        title={t.confirmDeleteSelectedTitle}
        message={t.confirmDeleteSelectedMessage}
        confirmLabel={t.deleteSelected}
        cancelLabel={t.cancel}
        onCancel={() => setIsDeleteSelectedModalOpen(false)}
        onConfirm={() => {
          handlePermanentlyDeleteSelectedNotes();
          setIsDeleteSelectedModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={categoryIdToDelete !== null}
        title={t.confirmDeleteCategoryTitle}
        message={
          categoryToDelete
            ? `${t.confirmDeleteCategoryMessage} (${categoryToDelete.name})`
            : t.confirmDeleteCategoryMessage
        }
        confirmLabel={t.deleteCategory}
        cancelLabel={t.cancel}
        onCancel={() => setCategoryIdToDelete(null)}
        onConfirm={() => {
          if (!categoryIdToDelete) {
            return;
          }

          deleteCategory(categoryIdToDelete);
          setCategoryIdToDelete(null);
        }}
      />

      <ConfirmModal
        isOpen={tagIdToDelete !== null}
        title={t.confirmDeleteTagTitle}
        message={
          tagToDelete
            ? `${t.confirmDeleteTagMessage} (${tagToDelete.name})`
            : t.confirmDeleteTagMessage
        }
        confirmLabel={t.deleteTag}
        cancelLabel={t.cancel}
        onCancel={() => setTagIdToDelete(null)}
        onConfirm={() => {
          if (!tagIdToDelete) {
            return;
          }

          deleteTag(tagIdToDelete);
          setTagIdToDelete(null);
        }}
      />
    </div>
  );
}
