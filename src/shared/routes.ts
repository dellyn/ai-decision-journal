export const Routes = {
  HOME: "/",
  DECISIONS: "/decisions",
  NEW_DECISION: "/decisions/new",
  DECISION_DETAILS: (id: string) => `/decisions/${id}`,
} as const; 