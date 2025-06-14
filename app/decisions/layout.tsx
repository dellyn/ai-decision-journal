import { AuthGuard } from "@/widgets/AuthGuard";
import { Header } from "@/widgets/Header";
import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";
import { SideBar } from "@/widgets/Sidebar/ui/SideBar";

export default function DecisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen mx-auto">
        <Header />
        <TwoColumnLayout sidebar={<SideBar />}>
          {children}
        </TwoColumnLayout>
      </div>
    </AuthGuard>
  );
}