import { NextResponse } from "next/server";
import { DecisionService } from "@/lib/services/decisionService";
import { DecisionRepository } from "@/lib/repositories/decisionRepository";
import { getCurrentUser } from "@/entities/user/api";
import { errorHandler } from "@/shared/middleware/error.middleware";
import { UnauthorizedError, ValidationError } from "@/shared/errors/domain.error";
import { DecisionFormData } from "@/entities/decision";

const decisionService = new DecisionService(new DecisionRepository());

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
      throw new ValidationError("Invalid pagination parameters");
    }

    const decisions = await decisionService.getDecisions(user.id, page, pageSize);
    return NextResponse.json(decisions);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    
    // TODO: use zod to validate the body
    if (!body.situation || !body.decision) {
      throw new ValidationError("Missing required fields");
    }

    const decisionData: DecisionFormData = {
      situation: body.situation,
      decision: body.decision,
      reasoning: body.reasoning
    };

    const decision = await decisionService.createDecision(decisionData, user.id);
    return NextResponse.json(decision);
  } catch (error) {
    return errorHandler(error);
  }
} 