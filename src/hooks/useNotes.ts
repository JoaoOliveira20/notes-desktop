import { useEffect, useState } from "react";
import type { Note } from "../types/Note";
import type { Category } from "../types/Category";
import type { NotesData } from "../types/NotesData";
import type { SelectedCategoryId } from "../types/SelectedCategoryId";
import type { Tag } from "../types/Tag";
import type { SelectedTagId } from "../types/SelectedTagId";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<SelectedCategoryId>("all");
  const activeNotes = notes.filter((note) => !note.deleted);
  const deletedNotes = notes.filter((note) => note.deleted);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const [selectedTagId, setSelectedTagId] = useState<SelectedTagId>("all");

  function filterNotesByCategory(notesToFilter: Note[]) {
    if (selectedCategoryId === "all") {
      return notesToFilter;
    }

    return notesToFilter.filter(
      (note) => note.categoryId === selectedCategoryId,
    );
  }

  const filteredNotes = filterNotesByTag(filterNotesByCategory(activeNotes))
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

  function changeSelectedTag(tagId: SelectedTagId) {
    setSelectedTagId(tagId);
    setSelectedNoteId(null);
  }

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
      setTags(loadedData.tags);

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
      tags,
    };

    window.electronAPI.saveNotesData(data);
  }, [notes, categories, tags, hasLoadedNotes]);

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
      tagIds: [],
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
      tags,
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
    setTags(importedData.tags);

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

  function createTag(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const tagAlreadyExists = tags.some(
      (tag) => tag.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (tagAlreadyExists) {
      return;
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
    };

    setTags([...tags, newTag]);
  }

  function deleteTag(tagId: string) {
    setTags(tags.filter((tag) => tag.id !== tagId));

    const updatedNotes = notes.map((note) => {
      if (!note.tagIds.includes(tagId)) {
        return note;
      }

      return {
        ...note,
        tagIds: note.tagIds.filter((currentTagId) => currentTagId !== tagId),
        updatedAt: new Date().toISOString(),
      };
    });

    setNotes(updatedNotes);

    if (selectedTagId === tagId) {
      setSelectedTagId("all");
      setSelectedNoteId(null);
    }
  }

  function addTagToSelectedNote(tagId: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id !== selectedNoteId) {
        return note;
      }

      if (note.tagIds.includes(tagId)) {
        return note;
      }

      return {
        ...note,
        tagIds: [...note.tagIds, tagId],
        updatedAt: new Date().toISOString(),
      };
    });

    setNotes(updatedNotes);
  }

  function removeTagFromSelectedNote(tagId: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id !== selectedNoteId) {
        return note;
      }

      return {
        ...note,
        tagIds: note.tagIds.filter((currentTagId) => currentTagId !== tagId),
        updatedAt: new Date().toISOString(),
      };
    });

    setNotes(updatedNotes);
  }

  function toggleTagOnSelectedNote(tagId: string) {
    const selectedNote = notes.find((note) => note.id === selectedNoteId);

    if (!selectedNote) {
      return;
    }

    if (selectedNote.tagIds.includes(tagId)) {
      removeTagFromSelectedNote(tagId);
      return;
    }

    addTagToSelectedNote(tagId);
  }

  function filterNotesByTag(notesToFilter: Note[]) {
    if (selectedTagId === "all") {
      return notesToFilter;
    }

    return notesToFilter.filter((note) => note.tagIds.includes(selectedTagId));
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
    tags,
    createTag,
    deleteTag,
    addTagToSelectedNote,
    removeTagFromSelectedNote,
    toggleTagOnSelectedNote,
    selectedTagId,
    changeSelectedTag,
  };
}
