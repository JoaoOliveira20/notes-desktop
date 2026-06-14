import type { NotesData } from "./NotesData";

export {};

declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;

      saveNotesData: (data: NotesData) => Promise<void>;
      loadNotesData: () => Promise<NotesData>;

      exportNotesData: (data: NotesData) => Promise<void>;
      importNotesData: () => Promise<NotesData | null>;
    };
  }
}