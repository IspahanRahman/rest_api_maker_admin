import { ReactNode } from "react";
import DashboardLayout from "@/components/core-panel/user-panel/layouts/DashboardLayout";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
