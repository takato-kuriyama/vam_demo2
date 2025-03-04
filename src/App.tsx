import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ROUTES_CONFIG } from "./constants/routes";

// ページコンポーネント
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import DashboardEquipment from "./pages/DashboardEquipment";
import DashboardBreeding from "./pages/DashboardBreeding";
import BreedingManagement from "./pages/BreedingManagement";
import AlertHistory from "./pages/AlertHistory";
import FixedPointMonitoring from "./pages/FixedPointMonitoring";
import UserMaster from "./pages/UserMaster";
import AlertMaster from "./pages/AlertMaster";
import TankMaster from "./pages/TankMaster";
import LineMaster from "./pages/LineMaster";
import DataListing from "./pages/DataListing";
import LiveMonitoring from "./pages/LiveMonitoring";
import RemoteControll from "./pages/RemoteControll";
import MasterIndex from "./pages/MasterIndex";
import FishStocking from "./pages/FishStocking";
import FishTransfer from "./pages/FishTransfer";

// コンポーネントの対応表（IDとコンポーネントのマッピング）
const PAGE_COMPONENTS = {
  HOME: HomePage,
  DASHBOARD: Dashboard,
  DASHBOARD_EQUIPMENT: DashboardEquipment,
  DASHBOARD_BREEDING: DashboardBreeding,
  DATA_LISTING: DataListing,
  BREEDING_MANAGEMENT: BreedingManagement,
  LIVE_MONITORING: LiveMonitoring,
  FIXED_POINT_MONITORING: FixedPointMonitoring,
  ALERT_HISTORY: AlertHistory,
  MASTER_INDEX: MasterIndex,
  USER_MASTER: UserMaster,
  ALERT_MASTER: AlertMaster,
  TANK_MASTER: TankMaster,
  LINE_MASTER: LineMaster,
  REMOTE_CONTROLL: RemoteControll,
  FISH_STOCKING: FishStocking,
  FISH_TRANSFER: FishTransfer,
};

function App() {
  return (
    <Router>
      <div>
        <span className="bg-blue-500 text-white px-4 py-2 font-bold text-lg rounded-lg shadow-sm">
          VerdeAqua Monitoring System
        </span>
        <MainLayout>
          <Routes>
            {ROUTES_CONFIG.map(({ id, path }) => {
              // IDからコンポーネントを取得
              const Component =
                PAGE_COMPONENTS[id as keyof typeof PAGE_COMPONENTS];

              // コンポーネントが存在する場合のみルートを返す
              return Component ? (
                <Route key={id} path={path} element={<Component />} />
              ) : null;
            })}
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
