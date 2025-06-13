import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { DecisionAnalysis as DecisionAnalysisType } from "../model/types";

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
        <div>
          <h3 className="font-medium mb-2 mt-8">Category</h3>
          <Badge variant="secondary">{analysis.category}</Badge>
        </div>
        <div>
          <h3 className="font-medium mb-2 mt-8">Cognitive Biases</h3>
          {analysis.biases.length > 0 ? (
            <div className="space-y-3">
              {analysis.biases.map((bias) => (
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
          ) : (
            <p className="text-sm text-muted-foreground">No cognitive biases detected in this decision.</p>
          )}
        </div>
        <div>
          <h3 className="font-medium mt-2 mt-8">Alternative Decisions</h3>
          {analysis.alternatives.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {analysis.alternatives.map((alternative) => (
                <li key={alternative} className="text-muted-foreground">
                  {alternative}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No alternative decisions suggested.</p>
          )}
        </div>
      </div>
    </Card>
  );
} 