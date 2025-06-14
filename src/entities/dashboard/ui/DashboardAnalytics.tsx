'use client';

import Link from "next/link";
import { useDashboard } from "../model/useDashboard";
import { Card, CardContent } from "@/shared/components/ui/card";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Routes } from "@/shared/routes";
import { Button } from "@/shared/components/ui/button";
import { MetricsOverview } from "./MetricsOverview";
import { CategoriesChart } from "./CategoriesChart";
import { BiasesChart } from "./BiasesChart";
import { InsightsList } from "./InsightsList";

// TODO: Decouple to widgets and page
export function DashboardAnalytics() {
  const { data, isLoading, error } = useDashboard(); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load dashboard data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link href={Routes.DECISIONS}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Decisions
          </Button>
        </Link>
      </div>
      <div className="space-y-6">
        <MetricsOverview data={data} />
        <div className="grid gap-4 md:grid-cols-2">
          <CategoriesChart categories={data.categories} />
          <BiasesChart biases={data.biases} />
        </div>
        <InsightsList biases={data.biases} />
      </div>
    </div>
  );
}
export default DashboardAnalytics;