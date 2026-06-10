import "./HomePage.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { useNotes } from "../../hooks/useNotes";

export function HomePage() {
  const {
    notes,
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
        notes={notes}
        selectedNoteId={selectedNoteId}
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