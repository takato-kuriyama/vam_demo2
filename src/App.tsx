import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import DashboardEquipment from "./pages/DashboardEquipment";
import DashboardBreeding from "./pages/DashboardBreeding";
import BreedingManagement from "./pages/BreedingManagement";

function App() {
  return (
    <Router>
      <div>
        <span className="bg-blue-500 text-white px-4 py-2 font-bold text-lg rounded-lg shadow-sm">
          VerdeAqua Monitoring System
        </span>
        <MainLayout>
          <Routes>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboardequipment"
              element={<DashboardEquipment />}
            />
            <Route path="/dashboardbreeding" element={<DashboardBreeding />} />
            <Route
              path="/breedingmanagement"
              element={<BreedingManagement />}
            />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
