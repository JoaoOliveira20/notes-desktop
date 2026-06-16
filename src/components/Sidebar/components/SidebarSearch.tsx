type SidebarSearchProps = {
  value: string;
  placeholder: string;
  onChange: (search: string) => void;
};

export function SidebarSearch({
  value,
  placeholder,
  onChange,
}: SidebarSearchProps) {
  return (
    <input
      className="sidebar-search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type="search"
      aria-label={placeholder}
    />
  );
}
