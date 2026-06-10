import "./HomePage.css";
import { useState, useEffect } from "react";
import type { Note } from "../../types/Note";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";

export function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

  useEffect(() => {
    async function loadNotes() {
      const loadedNotes = await window.electronAPI.loadNotes();

      setNotes(loadedNotes);
      setHasLoadedNotes(true);
    }

    loadNotes();
  }, []);

  useEffect(() => {
    if (!hasLoadedNotes) {
      return;
    }

    window.electronAPI.saveNotes(notes);
  }, [notes, hasLoadedNotes]);

  function createNote() {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Nova Nota",
      content: "Escreva aqui...",
    };

    setNotes([...notes, newNote]);
  }

  function updateTitle(title: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          title,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function updateContent(content: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          content,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function deleteNote() {
    setNotes(
      notes.filter(
        (note) => note.id !== selectedNoteId
      )
    );

    setSelectedNoteId(null);
  }

  return (
    <div className="home-page">
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onCreateNote={createNote}
        onSelectNote={setSelectedNoteId}
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