"use client";

import { useRouter } from "next/navigation";
import { useDecisionForm } from "../model/useDecisionForm";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { DecisionFormData } from "@/entities/decision/model/types";
import { Routes } from "@/shared/routes";
import { useCreateDecision } from "@/entities/decision";

export function DecisionForm() {
  const router = useRouter();
  const { mutate: createDecision, isPending } = useCreateDecision({
    onSuccess: (decision) => {
      router.push(`${Routes.DECISIONS}/${decision.id}`);
    }
  });

  const form = useDecisionForm();
  const onSubmit = (data: DecisionFormData) => {
    createDecision(data);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">New Decision</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the situation you faced..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decision</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What decision did you make?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reasoning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reasoning (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why did you make this decision?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Decision"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 