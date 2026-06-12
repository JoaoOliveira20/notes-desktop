import "./HomePage.css";
import { useState } from "react";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { SettingsModal } from "../../components/Modal/SettingsModal/SettingsModal";
import { ConfirmModal } from "../../components/Modal/ConfirmModal/ConfirmModal";
import { EmptyState } from "../../components/EmptyState/EmptyState";

import { useNotes } from "../../hooks/useNotes";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";

export function HomePage() {
  const {
    filteredNotes,
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
    deleteNote,
    togglePin,
  } = useNotes();

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="home-page">
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        search={search}
        onSearchChange={setSearch}
        onCreateNote={createNote}
        onSelectNote={setSelectedNoteId}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
        title={t.confirmDeleteTitle}
        message={t.confirmDeleteMessage}
        confirmLabel={t.confirmDelete}
        cancelLabel={t.cancel}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteNote();
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
