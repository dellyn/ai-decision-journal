"use client";
import { useState } from "react";
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
import { useDecisionForm } from "../model/useDecisionForm";
import { decisionFormApi } from "../api";

export function DecisionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useDecisionForm();

  const onSubmit = async (data: DecisionFormData) => {
    try {
      setIsSubmitting(true);
      await decisionFormApi.create(data);
      form.reset();
    } catch (error) {
      console.error("Failed to create decision:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">New Decision</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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