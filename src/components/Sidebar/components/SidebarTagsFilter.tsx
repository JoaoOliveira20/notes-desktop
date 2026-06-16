import type { ptBR } from "../../../locales/pt-BR";
import type { SelectedTagId } from "../../../types/SelectedTagId";
import type { Tag } from "../../../types/Tag";

type Translations = typeof ptBR;

type SidebarTagsFilterProps = {
  tags: Tag[];
  selectedTagId: SelectedTagId;
  onChangeSelectedTag: (tagId: SelectedTagId) => void;
  t: Translations;
};

export function SidebarTagsFilter({
  tags,
  selectedTagId,
  onChangeSelectedTag,
  t,
}: SidebarTagsFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="sidebar-section sidebar-tags-filter">
      <h2 className="sidebar-section-title">{t.filterByTags}</h2>

      <div className="sidebar-tags-list">
        <button
          type="button"
          className={
            selectedTagId === "all"
              ? "sidebar-category-button sidebar-tag-button active"
              : "sidebar-category-button sidebar-tag-button"
          }
          onClick={() => onChangeSelectedTag("all")}
          title={t.allTags}
        >
          {t.allTags}
        </button>

        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className={
              selectedTagId === tag.id
                ? "sidebar-category-button sidebar-tag-button active"
                : "sidebar-category-button sidebar-tag-button"
            }
            onClick={() => onChangeSelectedTag(tag.id)}
            title={`#${tag.name}`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </section>
  );
}
