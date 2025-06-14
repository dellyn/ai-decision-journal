import { NextResponse } from "next/server";
import { getCurrentUser } from "@/entities/user/api";
import { DashboardService } from "@/lib/services/dashboardService";
import { DecisionRepository } from "@/lib/repositories/decisionRepository";
import { errorHandler } from "@/shared/middleware/error.middleware";
import { UnauthorizedError } from "@/shared/errors/domain.error";

const dashboardService = new DashboardService(new DecisionRepository());

export async function GET() {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const analytics = await dashboardService.getAnalytics(user.id);
    return NextResponse.json(analytics);
  } catch (error) {
    return errorHandler(error);
  }
} 