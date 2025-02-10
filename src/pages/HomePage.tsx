import { Link } from "react-router-dom";
import { DASHBOARDS } from "../constants/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* メインコンテンツ */}
      <main className="p-4 max-w-7xl mx-auto space-y-4">
        {/* 本日の情報とアラート */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>本日の情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-8">
                <div>
                  <span className="font-semibold">出荷</span>
                  <span className="ml-4">20匹</span>
                </div>
                <div>
                  <span className="font-semibold">へい死</span>
                  <span className="ml-4">0匹</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>アラート通知</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">
                現在アラートはありません
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ダッシュボードと定点観測 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ダッシュボード</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DASHBOARDS.map((dashboard) => (
                <Link
                  key={dashboard.id}
                  to={dashboard.path}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer block"
                >
                  {dashboard.name}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>定点観測通知</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">
                定点観測の通知が簡易的に
                <br />
                ここに表示されます
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
