"use client";

import { DecisionDetailsSlot } from "@/widgets/decision-slot";
import { use } from "react";

export default function DecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DecisionDetailsSlot id={id} />
} 