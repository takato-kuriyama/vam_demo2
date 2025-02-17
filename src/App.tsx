import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ROUTES_CONFIG } from "./constants/constants";

function App() {
  return (
    <Router>
      <div>
        <span className="bg-blue-500 text-white px-4 py-2 font-bold text-lg rounded-lg shadow-sm">
          VerdeAqua Monitoring System
        </span>
        <MainLayout>
          <Routes>
            {ROUTES_CONFIG.map(({ id, path, element: Element }) => (
              <Route key={id} path={path} element={<Element />} />
            ))}
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
