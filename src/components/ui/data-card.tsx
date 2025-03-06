import { Card, CardContent } from "./card";
import { COLORS } from "../../constants/ui";
import { Button } from "./button";

interface DataCardProps {
  children: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export function DataCard({
  children,
  onAction,
  actionLabel = "詳細",
  actionIcon,
  highlight = false,
  className = "",
}: DataCardProps) {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg hover:scale-102 
      ${COLORS.border.primary} rounded-xl ${
        highlight ? "bg-blue-50" : ""
      } ${className} ${onAction ? "cursor-pointer" : ""}`}
      onClick={onAction}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1">{children}</div>
          {onAction && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 self-end sm:self-auto"
            >
              {actionLabel}
              {actionIcon}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
