"use client";

import { DecisionDetailsSlot } from "@/widgets/DecisionSlot";
import { use } from "react";

interface DecisionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DecisionPage({ params }: DecisionPageProps) {
  const { id } = use(params);
  return <DecisionDetailsSlot id={id} />;
} 