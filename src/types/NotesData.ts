import type { Note } from "./Note";
import type { Category } from "./Category";

export type NotesData = {
  notes: Note[];
  categories: Category[];
};