import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/card";
import { COLORS } from "../constants/ui";
import { PAGE_TITLES } from "../constants/routes";
import { MASTERS } from "../constants/menu";
import { PageContainer } from "../components/PageContainer";

const MasterIndex = () => {
  return (
    <PageContainer title={PAGE_TITLES.MASTER_INDEX}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MASTERS.map((master) => (
          <Link key={master.id} to={master.path}>
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {master.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default MasterIndex;
