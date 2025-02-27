import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/card";
import { BarChart3, Activity, Settings, Database } from "lucide-react";
import { COLORS } from "../constants/ui";
import { PAGE_TITLES } from "../constants/routes";
import { DASHBOARDS } from "../constants/menu";
import { PageContainer } from "../components/PageContainer";

const getIconByName = (name: string) => {
  if (name.includes("ろ過")) return Database;
  if (name.includes("飼育")) return Activity;
  if (name.includes("TEST")) return Settings;
  return BarChart3;
};

const Dashboard = () => {
  return (
    <PageContainer title={PAGE_TITLES.DASHBOARD}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DASHBOARDS.map((dashboard) => (
          <Link key={dashboard.id} to={dashboard.path}>
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    {React.createElement(getIconByName(dashboard.name), {
                      className: "w-4 h-4 text-blue-600",
                    })}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {dashboard.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
