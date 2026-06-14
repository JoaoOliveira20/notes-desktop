import { useEffect, useState } from "react";
import type { Note } from "../types/Note";
import type { Category } from "../types/Category";
import type { NotesData } from "../types/NotesData";
import type { SelectedCategoryId } from "../types/SelectedCategoryId";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<SelectedCategoryId>("all");
  const activeNotes = notes.filter((note) => !note.deleted);
  const deletedNotes = notes.filter((note) => note.deleted);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  function filterNotesByCategory(notesToFilter: Note[]) {
    if (selectedCategoryId === "all") {
      return notesToFilter;
    }

    return notesToFilter.filter(
      (note) => note.categoryId === selectedCategoryId,
    );
  }

  const filteredNotes = filterNotesByCategory(activeNotes)
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

  const filteredDeletedNotes = deletedNotes
    .filter((note) => {
      const searchText = search.toLowerCase();

      return (
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  function restoreSelectedNotes(noteIds: string[]) {
    const now = new Date().toISOString();

    const updatedNotes = notes.map((note) => {
      if (noteIds.includes(note.id)) {
        return {
          ...note,
          deleted: false,
          updatedAt: now,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
    setSelectedNoteId(null);
  }

  function permanentlyDeleteSelectedNotes(noteIds: string[]) {
    setNotes(notes.filter((note) => !noteIds.includes(note.id)));
    setSelectedNoteId(null);
  }

  useEffect(() => {
    async function loadNotesData() {
      const loadedData = await window.electronAPI.loadNotesData();

      setNotes(loadedData.notes);
      setCategories(loadedData.categories);

      if (loadedData.notes.length > 0) {
        setSelectedNoteId(loadedData.notes[0].id);
      }

      setHasLoadedNotes(true);
    }

    loadNotesData();
  }, []);

  useEffect(() => {
    if (!hasLoadedNotes) {
      return;
    }

    const data: NotesData = {
      notes,
      categories,
    };

    window.electronAPI.saveNotesData(data);
  }, [notes, categories, hasLoadedNotes]);

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
      categoryId: selectedCategoryId === "all" ? null : selectedCategoryId,
    };

    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  }

  function createCategory(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const categoryAlreadyExists = categories.some(
      (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (categoryAlreadyExists) {
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
    };

    setCategories([...categories, newCategory]);
  }

  function deleteCategory(categoryId: string) {
    setCategories(categories.filter((category) => category.id !== categoryId));

    const updatedNotes = notes.map((note) => {
      if (note.categoryId === categoryId) {
        return {
          ...note,
          categoryId: null,
          updatedAt: new Date().toISOString(),
        };
      }

      return note;
    });

    setNotes(updatedNotes);

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId("all");
      setSelectedNoteId(null);
    }
  }

  function updateNoteCategory(categoryId: string | null) {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          categoryId,
          updatedAt: new Date().toISOString(),
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function changeSelectedCategory(categoryId: SelectedCategoryId) {
    setSelectedCategoryId(categoryId);
    setSelectedNoteId(null);
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
    const data: NotesData = {
      notes,
      categories,
    };

    await window.electronAPI.exportNotesData(data);
  }

  async function importNotes() {
    const importedData = await window.electronAPI.importNotesData();

    if (!importedData) {
      return;
    }

    setNotes(importedData.notes);
    setCategories(importedData.categories);

    if (importedData.notes.length > 0) {
      setSelectedNoteId(importedData.notes[0].id);
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

  function restoreNote() {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNoteId) {
        return {
          ...note,
          deleted: false,
          updatedAt: new Date().toISOString(),
          pinned: false,
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function emptyTrash() {
    setNotes(notes.filter((note) => !note.deleted));
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
    filteredDeletedNotes,
    togglePin,
    deletedNotes,
    moveNoteToTrash,
    permanentlyDeleteNote,
    restoreNote,
    emptyTrash,
    restoreSelectedNotes,
    permanentlyDeleteSelectedNotes,
    categories,
    selectedCategoryId,
    changeSelectedCategory,
    createCategory,
    updateNoteCategory,
    deleteCategory,
  };
}
