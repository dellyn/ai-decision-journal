    import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onClose: () => void;
  icon?: React.ReactNode;
}

export function PageHeader({ title, onClose, icon }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
         {icon && <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            {icon}
          </Button>}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
      </div>
    </div>
  );
} 