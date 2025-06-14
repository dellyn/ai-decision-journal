import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils";

interface InsightsListProps {
  biases: Array<{
    name: string;
    count: number;
  }>;
}

export function InsightsList({ biases }: InsightsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights & Recommendations</CardTitle>
        <CardDescription>Based on your decision patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {biases.slice(0, 3).map((bias, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full",
                index === 0 ? "bg-red-100" : index === 1 ? "bg-yellow-100" : "bg-blue-100"
              )}>
                <AlertCircle className={cn(
                  "h-4 w-4",
                  index === 0 ? "text-red-600" : index === 1 ? "text-yellow-600" : "text-blue-600"
                )} />
              </div>
              <div>
                <h4 className="font-medium">{bias.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Detected in {bias.count} decisions. Consider reviewing these decisions for potential bias.
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 