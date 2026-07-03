import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminExists = (await prisma.admin.count()) > 0;

  return <AdminLayout isFirstRun={!adminExists} />;
}
