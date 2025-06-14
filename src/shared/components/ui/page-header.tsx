import { Button } from "@/shared/components/ui/button";
import { Menu} from "lucide-react";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function PageHeader({ 
  title, 
  icon,
  onClick
}: PageHeaderProps) {

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {icon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClick}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
      </div>
    </div>
  );
} 