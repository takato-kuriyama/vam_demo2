//import { useRef } from "react";
import { useState } from "react";
import { ROUTES } from "../constants/constants";
import { Link } from "react-router-dom";
import { Sheet, SheetContent } from "../components/sheet";
import {
  Bell,
  Menu,
  Home,
  LayoutDashboard,
  Monitor,
  Settings,
  FileText,
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const shouldCloseRef = useRef(false);

    // const handleMouseEnter = () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //     timeoutRef.current = null;
    //   }
    //   shouldCloseRef.current = false;
    //   if (!isOpen) {
    //     setIsOpen(true);
    //   }
    // };

    // const handleMouseLeave = () => {
    //   shouldCloseRef.current = true;
    //   timeoutRef.current = setTimeout(() => {
    //     if (shouldCloseRef.current) {
    //       setIsOpen(false);
    //     }
    //   }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <div>
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
              <SheetContent
                side="left"
                className="w-64 bg-white transform transition-all duration-300 ease-in-out"
              >
                <nav
                  className="flex flex-col pt-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    to={ROUTES.HOME}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Home className="h-5 w-5" />
                    <span>ホーム</span>
                  </Link>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>ダッシュボード</span>
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                      <Monitor className="h-5 w-5" />
                      <span>モニタリング</span>
                    </div>
                    <div className="pl-10 flex flex-col">
                      <a href="#" className="p-1 hover:bg-gray-100 rounded-lg">
                        設備情報一覧
                      </a>
                      <Link
                        to={ROUTES.BREEDING_MANAGEMENT}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        飼育情報一覧
                      </Link>
                      <a href="#" className="p-1 hover:bg-gray-100 rounded-lg">
                        LIVE映像
                      </a>
                      <a href="#" className="p-1 hover:bg-gray-100 rounded-lg">
                        定点観測
                      </a>
                    </div>
                  </div>
                  <Link
                    to={ROUTES.ALERT_HISTORY}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Bell className="h-5 w-5" />
                    <span>アラート履歴</span>
                  </Link>
                  <a
                    href="#"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Settings className="h-5 w-5" />
                    <span>制御</span>
                  </a>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                      <FileText className="h-5 w-5" />
                      <span>マスタ管理</span>
                    </div>
                    <div className="pl-10 flex flex-col space-y-0">
                      <a href="#" className="p-1 hover:bg-gray-100 rounded-lg">
                        ユーザーマスタ
                      </a>
                      <a href="#" className="p-1 hover:bg-gray-100 rounded-lg">
                        アラートマスタ
                      </a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link to={ROUTES.HOME} className="text-x1 font-semibold">
              <span>ホーム</span>
            </Link>
          </div>
          <Bell className="h-6 w-6" />
        </div>
      </header>
      <main className="p-4 max-w-7x1 mx-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
