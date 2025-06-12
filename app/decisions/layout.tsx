import { Header } from "@/widgets/header";
import { DecisionsList } from "@/features/decisions-list";
import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";

export default function DecisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <TwoColumnLayout sidebar={<DecisionsList />}>
        {children}
      </TwoColumnLayout>
    </div>
  );
}