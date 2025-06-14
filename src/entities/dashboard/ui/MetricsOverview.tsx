import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TrendingUp, Brain, Target } from "lucide-react";
import { DecisionAnalytics } from "@/lib/services/interfaces/dashboardService.interface";

interface MetricsOverviewProps {
  data: DecisionAnalytics;
}

export function MetricsOverview({ data }: MetricsOverviewProps) {
  const totalBiases = data.biases.reduce((acc, bias) => acc + bias.count, 0);
  const averageBiasesPerDecision = totalBiases / data.totalDecisions;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalDecisions}</div>
          <p className="text-xs text-muted-foreground">
            Across {data.categories.length} categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Biases Detected</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBiases}</div>
          <p className="text-xs text-muted-foreground">
            {averageBiasesPerDecision.toFixed(1)} per decision
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.categories[0]?.name || 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.categories[0]?.count || 0} decisions
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 