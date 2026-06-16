type SidebarFooterProps = {
  settingsLabel: string;
  onOpenSettings: () => void;
};

export function SidebarFooter({
  settingsLabel,
  onOpenSettings,
}: SidebarFooterProps) {
  return (
    <div className="sidebar-footer">
      <button
        type="button"
        className="sidebar-button sidebar-settings-button"
        onClick={onOpenSettings}
      >
        {settingsLabel}
      </button>
    </div>
  );
}
