type SidebarHeaderProps = {
  appName: string;
};

export function SidebarHeader({ appName }: SidebarHeaderProps) {
  return (
    <div className="sidebar-header">
      <span className="sidebar-app-mark" aria-hidden="true">
        N
      </span>
      <h1 className="sidebar-title" title={appName}>
        {appName}
      </h1>
    </div>
  );
}
