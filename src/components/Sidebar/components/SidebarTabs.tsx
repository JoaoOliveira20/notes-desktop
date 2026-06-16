import type { ptBR } from "../../../locales/pt-BR";
import type { ViewMode } from "../../../types/ViewMode";

type Translations = typeof ptBR;

type SidebarTabsProps = {
  viewMode: ViewMode;
  onChangeViewMode: (viewMode: ViewMode) => void;
  t: Translations;
};

export function SidebarTabs({
  viewMode,
  onChangeViewMode,
  t,
}: SidebarTabsProps) {
  return (
    <div className="sidebar-tabs" role="tablist" aria-label={t.appName}>
      <button
        type="button"
        className={viewMode === "notes" ? "sidebar-tab active" : "sidebar-tab"}
        onClick={() => onChangeViewMode("notes")}
        aria-selected={viewMode === "notes"}
        role="tab"
      >
        {t.notes}
      </button>

      <button
        type="button"
        className={viewMode === "trash" ? "sidebar-tab active" : "sidebar-tab"}
        onClick={() => onChangeViewMode("trash")}
        aria-selected={viewMode === "trash"}
        role="tab"
      >
        {t.trash}
      </button>
    </div>
  );
}
