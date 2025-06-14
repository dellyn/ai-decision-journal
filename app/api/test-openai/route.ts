import { NextResponse } from "next/server";
import { getCurrentUser } from "@/entities/user/api";
import { errorHandler } from "@/shared/middleware/error.middleware";
import { UnauthorizedError, ValidationError } from "@/shared/errors/domain.error";

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    
    if (!body.prompt) {
      throw new ValidationError("Prompt is required");
    }

    // TODO: Implement OpenAI test logic here
    return NextResponse.json({ 
      message: "Test successful",
      prompt: body.prompt
    });
  } catch (error) {
    return errorHandler(error);
  }
} 