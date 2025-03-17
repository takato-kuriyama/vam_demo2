import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../src/components/layouts/MainLayout";
import { ROUTES_CONFIG } from "./constants/routes";

// ページコンポーネント
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/dashboards/Dashboard";
import DashboardEquipment from "./pages/dashboards/DashboardEquipment";
import DashboardBreeding from "./pages/dashboards/DashboardBreeding";
import BreedingManagement from "./pages/entries/BreedingManagement";
import AlertHistory from "./pages/AlertHistory";
import FixedPointMonitoring from "./pages/monitoring/FixedPointMonitoring";
import UserMaster from "./pages/masters/UserMaster";
import AlertMaster from "./pages/masters/AlertMaster";
import TankMaster from "./pages/masters/TankMaster";
import LineMaster from "./pages/masters/LineMaster";
import DataListing from "./pages/DataTables/DataListing";
import LiveMonitoring from "./pages/monitoring/LiveMonitoring";
import RemoteControll from "./pages/RemoteControll";
import MasterIndex from "./pages/masters/MasterIndex";
import FishStocking from "./pages/entries/FishStocking";
import FishTransfer from "./pages/entries/FishTransfer";
import SeedMaster from "./pages/masters/SeedMaster";
import FeedMaster from "./pages/masters/FeedMaster";
import DashboardTest from "./pages/dashboards/DashboardTest";

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
  SEED_MASTER: SeedMaster,
  FEED_MASTER: FeedMaster,
  DASHBOARD_TEST: DashboardTest,
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
