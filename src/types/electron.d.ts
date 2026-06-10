import type { Note } from "./Note";

export {};

declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      saveNotes: (notes: Note[]) => Promise<void>;
      loadNotes: () => Promise<Note[]>;
      exportNotes: (notes: Note[]) => Promise<void>;
      importNotes: () => Promise<Note[] | null>;
    };
  }
}