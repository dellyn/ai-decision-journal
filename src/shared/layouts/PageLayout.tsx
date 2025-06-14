export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 w-full flex flex-col gap-20 items-center">{children}</div>;
};