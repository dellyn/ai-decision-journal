"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DecisionFormData } from "@/entities/decision";
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
import { Routes } from "@/shared/routes";
import { useDecisionForm } from "../model/useDecisionForm";
import { decisionFormApi } from "../api";

export function DecisionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useDecisionForm();

  const onSubmit = async (data: DecisionFormData) => {
    console.log({data})
    try {
      setIsSubmitting(true);
      await decisionFormApi.create(data);
      router.push(Routes.HOME);
      router.refresh();
    } catch (error) {
      console.error("Failed to create decision:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
            <FormField
              control={form.control}
              name="situation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Situation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation you faced..."
                      className="min-h-[100px] resize-none"
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
                  <FormLabel className="text-lg font-semibold">Decision</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What decision did you make?"
                      className="min-h-[100px] resize-none"
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
                  <FormLabel className="text-lg font-semibold">Reasoning (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why did you make this decision?"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Decision"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 