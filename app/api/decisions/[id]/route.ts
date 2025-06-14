import { NextResponse } from "next/server";
import { DecisionService } from "@/lib/services/decisionService";
import { DecisionRepository } from "@/lib/repositories/decisionRepository";
import { DecisionStatus } from "@/entities/decision";
import { getCurrentUser } from "@/entities/user/api";
import { errorHandler } from "@/shared/middleware/error.middleware";
import { UnauthorizedError } from "@/shared/errors/domain.error";

const decisionService = new DecisionService(new DecisionRepository());

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const decision = await decisionService.getDecisionById(id);
    return NextResponse.json(decision);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const updatedDecision = await decisionService.updateDecision(id, body);

    // If the status is set to processing, trigger the analysis
    if (body.status === DecisionStatus.PROCESSING) {
      await decisionService.processDecision(updatedDecision);
    }

    return NextResponse.json(updatedDecision);
  } catch (error) {
    return errorHandler(error);
  }
}