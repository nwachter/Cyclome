type Props = {
  breadcrumb: string;
  title: string;
  action?: React.ReactNode;
};

export default function AdminHeader({ breadcrumb, title, action }: Props) {
  return (
    <header className="hidden items-center gap-lg border-b border-b-line-strong bg-surface px-xl py-md lg:flex">
      <div className="mr-auto">
        <p className="t-label-sm text-fg-subtle">{breadcrumb}</p>
        <h1 className="t-display-3">{title}</h1>
      </div>
      {action}
    </header>
  );
}
