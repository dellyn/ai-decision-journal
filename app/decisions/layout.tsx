import { AuthGuard } from "@/widgets/auth-guard";
import { Header } from "@/widgets/header";
import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";
import { SideBar } from "@/widgets/sidebar/ui/SideBar";

export default function DecisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Header />
        <TwoColumnLayout sidebar={<SideBar />}>
          {children}
        </TwoColumnLayout>
      </div>
    </AuthGuard>
  );
}