import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DASHBOARDS } from "../constants/constants";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">ダッシュボード</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {DASHBOARDS.map((dashboard) => (
              <Link
                key={dashboard.id}
                to={dashboard.path}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                onClick={onClose}
              >
                {dashboard.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
