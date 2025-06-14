import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { DecisionAnalysis as DecisionAnalysisType } from "../model/types";

// TODO: move to separatecomponents
interface AnalysisSectionProps {
  title: string;
  children: React.ReactNode;
}

function AnalysisSection({ title, children }: AnalysisSectionProps) {
  return (
    <div>
      <h3 className="font-medium mb-2 mt-8">{title}</h3>
      {children}
    </div>
  );
}

interface CategorySectionProps {
  category: string;
}

function CategorySection({ category }: CategorySectionProps) {
  return (
    <AnalysisSection title="Category">
      <Badge variant="secondary">{category}</Badge>
    </AnalysisSection>
  );
}

interface BiasesSectionProps {
  biases: DecisionAnalysisType["biases"];
}

function BiasesSection({ biases }: BiasesSectionProps) {
  if (biases.length === 0) {
    return (
      <AnalysisSection title="Cognitive Biases">
        <p className="text-sm text-muted-foreground">No cognitive biases detected in this decision.</p>
      </AnalysisSection>
    );
  }

  return (
    <AnalysisSection title="Cognitive Biases">
      <div className="space-y-3">
        {biases.map((bias) => (
          <div key={bias.name} className="space-y-1 mb-4">
            <Badge variant="outline" className="mb-2">{bias.name}</Badge>
            <p className="text-sm text-muted-foreground pt-2">{bias.description}</p>
            {bias.evidence && (
              <blockquote className="text-sm italic border-l-2 border-muted pl-4">
                &ldquo;{bias.evidence}&rdquo;
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </AnalysisSection>
  );
}

interface AlternativesSectionProps {
  alternatives: string[];
}

function AlternativesSection({ alternatives }: AlternativesSectionProps) {
  if (alternatives.length === 0) {
    return (
      <AnalysisSection title="Alternative Decisions">
        <p className="text-sm text-muted-foreground">No alternative decisions suggested.</p>
      </AnalysisSection>
    );
  }

  return (
    <AnalysisSection title="Alternative Decisions">
      <ul className="list-disc list-inside space-y-1">
        {alternatives.map((alternative) => (
          <li key={alternative} className="text-muted-foreground">
            {alternative}
          </li>
        ))}
      </ul>
    </AnalysisSection>
  );
}

interface DecisionAnalysisProps {
  analysis: DecisionAnalysisType;
}

export function DecisionAnalysis({ analysis }: DecisionAnalysisProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg shadow-md w-fit">
        AI Analysis
      </h3>
      <div className="space-y-4">
        <CategorySection category={analysis.category} />
        <BiasesSection biases={analysis.biases} />
        <AlternativesSection alternatives={analysis.alternatives} />
      </div>
    </Card>
  );
} 