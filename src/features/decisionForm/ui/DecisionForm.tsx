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
import { PageHeader } from "@/shared/components/ui/page-header";

export function DecisionForm() {
  const router = useRouter();
  const { mutate: createDecision, isPending } = useCreateDecision({
    onSuccess: (decision) => {
      router.push(`${Routes.DECISIONS}/${decision.id}`);
    }
  });

  const { form, reset } = useDecisionForm();
  const onSubmit = (data: DecisionFormData) => {
    createDecision(data);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <PageHeader title="New Decision"  />
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Situation</FormLabel>
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="Describe the situation you faced..."
                        className="h-full resize-none"
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
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Decision</FormLabel>
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="What decision did you make?"
                        className="h-full resize-none"
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
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Reasoning (Optional)</FormLabel>
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="Why did you make this decision?"
                        className="h-full resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-4">

        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full shadow-md font-bold p-6 text-md"
          onClick={form.handleSubmit(onSubmit)}
        >
          {isPending ? "Saving..." : "Save Decision"}
        </Button>
        <Button 
          type="button" 
          className="font-bold p-6 text-md"
          onClick={reset}
        >
          Reset Form
        </Button>
      </div>
    </div>
  );
} 