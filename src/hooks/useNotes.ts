import { useEffect, useState } from "react";
import type { Note } from "../types/Note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const activeNotes = notes.filter((note) => !note.deleted);
  const deletedNotes = notes.filter((note) => note.deleted);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const filteredNotes = activeNotes
    .filter((note) => {
      const searchText = search.toLowerCase();

      return (
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  useEffect(() => {
    async function loadNotes() {
      const loadedNotes = await window.electronAPI.loadNotes();

      setNotes(loadedNotes);

      if (loadedNotes.length > 0) {
        setSelectedNoteId(loadedNotes[0].id);
      }

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
    const now = new Date().toISOString();

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Nova Nota",
      content: "",
      createdAt: now,
      updatedAt: now,
      pinned: false,
      deleted: false,
    };

    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  }

  function togglePin() {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          pinned: !note.pinned,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  async function exportNotes() {
    await window.electronAPI.exportNotes(notes);
  }

  async function importNotes() {
    const importedNotes = await window.electronAPI.importNotes();

    if (!importedNotes) {
      return;
    }

    setNotes(importedNotes);

    if (importedNotes.length > 0) {
      setSelectedNoteId(importedNotes[0].id);
    } else {
      setSelectedNoteId(null);
    }
  }

  function updateTitle(title: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          title,
          updatedAt: new Date().toISOString(),
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
          updatedAt: new Date().toISOString(),
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function moveNoteToTrash() {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          deleted: true,
          pinned: false,
          updatedAt: new Date().toISOString(),
        };
      }

      return note;
    });

    setNotes(updatedNotes);
    setSelectedNoteId(null);
  }

  function permanentlyDeleteNote() {
    setNotes(notes.filter((note) => note.id !== selectedNoteId));
    setSelectedNoteId(null);
  }

  return {
    notes,
    selectedNote,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    exportNotes,
    importNotes,
    updateTitle,
    updateContent,
    search,
    setSearch,
    filteredNotes,
    togglePin,
    deletedNotes,
    moveNoteToTrash,
    permanentlyDeleteNote,
  };
}
