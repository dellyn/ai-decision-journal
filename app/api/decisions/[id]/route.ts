import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById } from "@/lib/repositories/decisionRepository";

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    const decision = await getDecisionById(id);

    return NextResponse.json(decision, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error("Error fetching decision:", error);
    
    if (error.message === "Decision not found") {
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