import "./HomePage.css";
import { useState, useEffect } from "react";
import type { Note } from "../../types/Note";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";

export function HomePage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem("notes");

    if (!storedNotes) {
      return [];
    }

    return JSON.parse(storedNotes);
  });
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

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
          title: title,
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
          content: content,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function deleteNote() {
    setNotes(notes.filter((note) => note.id !== selectedNoteId));

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
