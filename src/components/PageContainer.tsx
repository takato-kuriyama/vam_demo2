import { COLORS } from "../constants/constants";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const PageContainer = ({
  title,
  children,
  action,
}: PageContainerProps) => {
  return (
    <div className={`p-3 ${COLORS.bg.primary} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
};
