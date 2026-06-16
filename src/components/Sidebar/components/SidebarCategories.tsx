import type { ptBR } from "../../../locales/pt-BR";
import type { Category } from "../../../types/Category";
import type { SelectedCategoryId } from "../../../types/SelectedCategoryId";

type Translations = typeof ptBR;

type SidebarCategoriesProps = {
  categories: Category[];
  selectedCategoryId: SelectedCategoryId;
  newCategoryName: string;
  onNewCategoryNameChange: (name: string) => void;
  onChangeSelectedCategory: (categoryId: SelectedCategoryId) => void;
  onCreateCategory: () => void;
  onRequestDeleteCategory: (categoryId: string) => void;
  t: Translations;
};

export function SidebarCategories({
  categories,
  selectedCategoryId,
  newCategoryName,
  onNewCategoryNameChange,
  onChangeSelectedCategory,
  onCreateCategory,
  onRequestDeleteCategory,
  t,
}: SidebarCategoriesProps) {
  return (
    <section className="sidebar-section sidebar-categories">
      <h2 className="sidebar-section-title">{t.categories}</h2>

      <div className="sidebar-category-fixed-list">
        <button
          type="button"
          className={
            selectedCategoryId === "all"
              ? "sidebar-category-button active"
              : "sidebar-category-button"
          }
          onClick={() => onChangeSelectedCategory("all")}
          title={t.allNotes}
        >
          {t.allNotes}
        </button>

        <button
          type="button"
          className={
            selectedCategoryId === null
              ? "sidebar-category-button active"
              : "sidebar-category-button"
          }
          onClick={() => onChangeSelectedCategory(null)}
          title={t.uncategorized}
        >
          {t.uncategorized}
        </button>
      </div>

      <div className="sidebar-category-list">
        {categories.map((category) => (
          <div key={category.id} className="sidebar-category-row">
            <button
              type="button"
              className={
                selectedCategoryId === category.id
                  ? "sidebar-category-button active"
                  : "sidebar-category-button"
              }
              onClick={() => onChangeSelectedCategory(category.id)}
              title={category.name}
            >
              {category.name}
            </button>

            <button
              type="button"
              className="sidebar-category-delete-button"
              onClick={() => onRequestDeleteCategory(category.id)}
              title={t.deleteCategory}
              aria-label={t.deleteCategory}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-new-category">
        <input
          className="sidebar-category-input"
          placeholder={t.categoryNamePlaceholder}
          value={newCategoryName}
          onChange={(event) => onNewCategoryNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onCreateCategory();
            }
          }}
        />

        <button
          type="button"
          className="sidebar-small-button"
          onClick={onCreateCategory}
        >
          {t.createCategory}
        </button>
      </div>
    </section>
  );
}
