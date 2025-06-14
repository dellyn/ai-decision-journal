"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

export function useFormPersistence<T extends object>(
  form: UseFormReturn<T>,
  storageKey: string
) {
  const resetStorage = () => {
    localStorage.removeItem(storageKey);

  };

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [form, storageKey]);

  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  return { resetStorage };
} 