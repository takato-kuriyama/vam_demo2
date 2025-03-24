import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "../ui/sheet";
import { Menu } from "lucide-react";
import { COLORS } from "../../constants/ui";
import { HEADER_MENU_ITEMS, SIDE_MENU_ITEMS } from "../../constants/menu";
import { useAlertData } from "../../hooks/useDataStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, isLoading } = useAlertData();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname.startsWith("/dashboard")) {
      return true;
    }

    if (path === "/master" && location.pathname.startsWith("/master")) {
      return true;
    }

    return location.pathname === path;
  };

  // 未解決のアラートを取得
  const unresolvedAlerts = !isLoading
    ? alerts.filter((alert) => !alert.resolved)
    : [];
  // 最新の未解決アラートを取得
  const latestAlert = unresolvedAlerts.length > 0 ? unresolvedAlerts[0] : null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderMenuItem = (item: (typeof SIDE_MENU_ITEMS)[number]) => {
    if ("subItems" in item) {
      return (
        <div key={item.id} className="flex flex-col">
          <div className="flex items-center space-x-2 p-2 rounded-lg">
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.label}</span>
          </div>
          <div className="pl-10 flex flex-col">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.id}
                to={subItem.path}
                className={`p-1 ${COLORS.hover.primary} rounded-lg`}
                onClick={() => setIsOpen(false)}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        className={`flex items-center space-x-2 p-2 ${COLORS.hover.primary} rounded-lg`}
        onClick={() => setIsOpen(false)}
      >
        {item.icon && <item.icon className="h-5 w-5" />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className={`min-h-screen ${COLORS.bg.primary}`}>
      {/* ヘッダー */}
      <header
        className={`${COLORS.bg.primary} border-b ${COLORS.border.primary} shadow-sm sticky top-0 z-50`}
      >
        <div className="flex items-center justify-between p-2 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <button
                onClick={toggleMenu}
                className={`p-2 ${COLORS.hover.primary} rounded-full transition-colors`}
              >
                <Menu className="h-6 w-6" />
              </button>
              <SheetContent
                side="left"
                className={`w-64 ${COLORS.bg.primary} transform transition-all duration-300 ease-in-out overflow-y-auto`}
              >
                <nav className="flex flex-col pt-3">
                  {SIDE_MENU_ITEMS.map(renderMenuItem)}
                </nav>
              </SheetContent>
            </Sheet>

            {/* 固定メニュー */}
            <div className="flex flex-col space-y-2">
              <div className="hidden md:flex items-center gap-2">
                {HEADER_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex flex-col items-center p-2 ${
                      isActive(item.path) ? "bg-gray-200" : COLORS.hover.primary
                    } rounded-lg transition-colors`}
                  >
                    {item.icon && <item.icon className="h-5 w-5 mb-1" />}
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* アラート通知バー */}
        {/* {latestAlert && (
          <div className="flex justify-center items-center mb-3">
            <div
              className={`w-4/5 ${COLORS.bg.error3} text-lg rounded-xl border ${COLORS.border.primary}`}
            >
              <Link
                className={`font-bold text-yellow-200 flex space-x-5 items-center justify-center hover:text-yellow-500 p-2`}
                to={ROUTES.ALERT_HISTORY}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="md:inline hidden">
                  {new Date(latestAlert.timestamp).toLocaleString()}{" "}
                  {latestAlert.paramName}アラート {latestAlert.lineId}ライン
                  {latestAlert.tankId && `${latestAlert.tankId}`}
                </span>
                <span className="md:hidden inline leading-tight">
                  {new Date(latestAlert.timestamp).toLocaleString()} <br />
                  {latestAlert.paramName}アラート {latestAlert.lineId}ライン
                  {latestAlert.tankId && `${latestAlert.tankId}`}
                </span>
              </Link>
            </div>
          </div>
        )} */}
      </header>
      <main className="p-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
