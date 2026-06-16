import type { Note } from "./Note";
import type { Category } from "./Category";
import type { Tag } from "./Tag";

export type NotesData = {
  notes: Note[];
  categories: Category[];
  tags: Tag[];
};