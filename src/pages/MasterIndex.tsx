import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/card";
import { BarChart3, User, Bell, Database } from "lucide-react";
import { MASTERS, COLORS, PAGE_TITLES } from "../constants/constants";
import { PageContainer } from "../components/PageContainer";

const getIconByName = (name: string) => {
  if (name.includes("ろ過")) return Database;
  if (name.includes("飼育")) return Database;
  if (name.includes("ユーザー")) return User;
  if (name.includes("アラート")) return Bell;
  return BarChart3;
};

const MasterIndex = () => {
  return (
    <PageContainer title={PAGE_TITLES.MASTER_INDEX}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MASTERS.map((master) => (
          <Link key={master.id} to={master.path}>
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    {React.createElement(getIconByName(master.name), {
                      className: "w-5 h-5 text-blue-600",
                    })}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {master.name}
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

export default MasterIndex;
