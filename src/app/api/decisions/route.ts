import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decisionFormSchema } from "@/entities/decision";

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

    const { data, error } = await supabase
      .from("decisions")
      .insert({
        user_id: user.id,
        situation: validatedData.situation,
        decision: validatedData.decision,
        reasoning: validatedData.reasoning,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to create decision" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
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