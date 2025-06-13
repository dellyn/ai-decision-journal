/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateDecision } from "@/lib/repositories/decisionRepository";
import { revalidatePath } from "next/cache";
import { processDecision } from "@/lib/controllers/decisionController";
import { DecisionStatus } from "@/entities/decision";

export async function POST(
  request: Request,
  { params }: any // TODO: fix this
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update status to processing
    const updatedDecision = await updateDecision(id, { status: DecisionStatus.PROCESSING });

    // Start the analysis process
    processDecision(updatedDecision).catch(console.error);

    revalidatePath('/api/decisions');
    revalidatePath(`/api/decisions/${id}`);

    return NextResponse.json(updatedDecision);
  } catch (error: unknown) {
    console.error("Error retrying decision analysis:", error);
    
    if (error instanceof Error && error.message === "Decision not found") {
      return NextResponse.json(
        { message: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 