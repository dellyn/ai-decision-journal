import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decisionFormSchema } from "@/entities/decision";
import { createDecisionWithProcessing } from "@/lib/services/decisionService";
import { getDecisions } from "@/lib/repositories/decisionRepository";
import { revalidatePath } from "next/cache";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const decisions = await getDecisions(user.id, page, pageSize);

    return NextResponse.json(decisions, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error("Error fetching decisions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = decisionFormSchema.parse(body);

    const decision = await createDecisionWithProcessing(validatedData, user.id);

    // Revalidate the decisions list cache
    revalidatePath('/api/decisions');

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Error creating decision:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 