import { NextResponse } from "next/server";
import { DecisionService } from "@/lib/services/decisionService";
import { DecisionRepository } from "@/lib/repositories/decisionRepository";
import { getCurrentUser } from "@/entities/user/api";
import { errorHandler } from "@/shared/middleware/error.middleware";
import { UnauthorizedError } from "@/shared/errors/domain.error";

const decisionService = new DecisionService(new DecisionRepository());

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    await decisionService.resetDecisionProcessing(id);
    return NextResponse.json({ message: "Decision processing reset successfully" });
  } catch (error) {
    return errorHandler(error);
  }
} 