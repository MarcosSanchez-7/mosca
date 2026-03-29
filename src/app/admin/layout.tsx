import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: {
    template: "%s | Admin — PixelImport",
    default: "Dashboard | Admin — PixelImport",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
