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
  } = useNotes();

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("notes");

  return (
    <div className="home-page">
      <Sidebar
        notes={viewMode === "notes" ? filteredNotes : deletedNotes}
        selectedNoteId={selectedNoteId}
        search={search}
        onSearchChange={setSearch}
        onCreateNote={createNote}
        onSelectNote={setSelectedNoteId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        t={t}
      />

      {selectedNote ? (
        <NoteEditor
          selectedNote={selectedNote}
          onUpdateTitle={updateTitle}
          onUpdateContent={updateContent}
          onDeleteNote={() => setIsDeleteModalOpen(true)}
          onTogglePin={togglePin}
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
    </div>
  );
}
