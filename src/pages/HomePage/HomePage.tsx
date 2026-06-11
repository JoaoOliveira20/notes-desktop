import "./HomePage.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { useNotes } from "../../hooks/useNotes";

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
  } = useNotes();

  return (
    <div className="home-page">
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        search={search}
        onSearchChange={setSearch}
        onCreateNote={createNote}
        onSelectNote={setSelectedNoteId}
        onExportNotes={exportNotes}
        onImportNotes={importNotes}
      />

      {selectedNote && (
        <NoteEditor
          selectedNote={selectedNote}
          onUpdateTitle={updateTitle}
          onUpdateContent={updateContent}
          onDeleteNote={deleteNote}
        />
      )}
    </div>
  );
}
