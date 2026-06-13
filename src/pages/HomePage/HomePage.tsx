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
    filteredDeletedNotes,
  } = useNotes();

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("notes");
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);

  const visibleSelectedNote =
    selectedNote && selectedNote.deleted === (viewMode === "trash")
      ? selectedNote
      : null;

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
        t={t}
      />

      {visibleSelectedNote ? (
        <NoteEditor
          selectedNote={visibleSelectedNote}
          viewMode={viewMode}
          onUpdateTitle={updateTitle}
          onUpdateContent={updateContent}
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
          setIsEmptyTrashModalOpen(false);
        }}
      />
    </div>
  );
}
