import { Sidebar } from "@/components/layout/Sidebar";
import { Container } from "@/components/layout/Container";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardLayout({ title, description, children }: DashboardLayoutProps) {
  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <Sidebar />
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </Container>
  );
}
